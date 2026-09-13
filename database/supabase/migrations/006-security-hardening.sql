-- ============================================
-- 006-security-hardening.sql
-- Closes the critical findings from the full-project review:
--   1. Staff self-registration can never mint an admin profile.
--      The signup trigger ignores role='admin' from user metadata
--      (admin is granted manually by an existing admin via service_role).
--      App layer additionally signs public users up as patient only.
--   2. Guest booking can no longer overwrite existing patient PII.
--      The email upsert only fills NULL/empty columns, strips HTML
--      angle brackets, and enforces length caps.
--   3. audit_logs becomes append-only for service_role.
--      The permissive "any authenticated user can INSERT" policy is
--      dropped so clients cannot forge or flood the audit trail.
-- Idempotent: safe to run more than once.
-- ============================================

-- --------------------------------------------
-- 1. Staff profile trigger: never trust admin from metadata
-- --------------------------------------------
CREATE OR REPLACE FUNCTION handle_new_staff_profile()
RETURNS TRIGGER AS $$
DECLARE
  v_role text;
BEGIN
  v_role := COALESCE(NULLIF(btrim(NEW.raw_user_meta_data->>'role', ''), ''), 'secretary');
  -- Defense in depth: public signup must never mint an admin.
  IF v_role = 'admin' THEN
    v_role := 'secretary';
  END IF;
  IF v_role NOT IN ('doctor', 'secretary') THEN
    RETURN NEW;
  END IF;
  INSERT INTO profiles (id, role, first_name, last_name, avatar_url)
  VALUES (
    NEW.id,
    v_role,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

DROP TRIGGER IF EXISTS trigger_new_staff_profile ON auth.users;
CREATE TRIGGER trigger_new_staff_profile
  AFTER INSERT ON auth.users FOR EACH ROW
  WHEN (NEW.raw_user_meta_data->>'role' IN ('doctor', 'secretary'))
  EXECUTE FUNCTION handle_new_staff_profile();

-- --------------------------------------------
-- 2. Guest booking: fill NULLs only + sanitize + caps
-- --------------------------------------------
CREATE OR REPLACE FUNCTION public.book_appointment(p_payload jsonb)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_service_id    uuid;
  v_dentist_id    uuid;
  v_date          date;
  v_start         time;
  v_duration      int    := 30;
  v_end           time;
  v_price         numeric;
  v_currency      text;
  v_patient_id    uuid;
  v_appointment   uuid;
  v_schedule      record;
  v_patient_first text;
  v_patient_last  text;
  v_patient_email text;
  v_patient_phone text;
  v_treatment     text;
  v_notes         text;
BEGIN
  -- ---- validate payload shape ----
  IF p_payload IS NULL OR p_payload->>'service_id' IS NULL OR p_payload->>'dentist_id' IS NULL
     OR p_payload->>'date' IS NULL OR p_payload->>'start_time' IS NULL
     OR p_payload->'patient'->>'email' IS NULL THEN
    RAISE EXCEPTION 'Missing required booking fields' USING ERRCODE = '22023';
  END IF;

  v_service_id := (p_payload->>'service_id')::uuid;
  v_dentist_id := (p_payload->>'dentist_id')::uuid;
  v_date       := (p_payload->>'date')::date;
  v_start      := (p_payload->>'start_time')::time;
  -- Strip HTML angle brackets (stored-XSS defense) + length caps.
  v_patient_first := left(regexp_replace(COALESCE(NULLIF(btrim(p_payload->'patient'->>'first_name',''), ''), 'Guest'), '[<>]', '', 'g'), 60);
  v_patient_last  := left(regexp_replace(COALESCE(p_payload->'patient'->>'last_name', ''), '[<>]', '', 'g'), 60);
  v_patient_email := lower(btrim(p_payload->'patient'->>'email',''));
  v_patient_phone := left(btrim(COALESCE(p_payload->'patient'->>'phone',''),''), 30);
  v_treatment  := left(regexp_replace(COALESCE(p_payload->>'treatment_type', 'General Consultation'), '[<>]', '', 'g'), 120);
  v_notes      := left(regexp_replace(NULLIF(p_payload->>'notes', ''), '[<>]', '', 'g'), 1000);

  -- ---- service ----
  SELECT duration_minutes, price, currency INTO v_duration, v_price, v_currency
    FROM services WHERE id = v_service_id AND is_active = true;
  IF v_duration IS NULL THEN
    RAISE EXCEPTION 'Invalid or inactive service' USING ERRCODE = '22023';
  END IF;

  -- ---- dentist ----
  IF NOT EXISTS (SELECT 1 FROM dentists WHERE id = v_dentist_id AND is_active = true) THEN
    RAISE EXCEPTION 'This dentist is not available at the moment' USING ERRCODE = '22023';
  END IF;

  -- ---- schedule ----
  SELECT * INTO v_schedule FROM schedules
    WHERE dentist_id = v_dentist_id AND date = v_date AND is_available = true;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'This date is not available for the selected dentist' USING ERRCODE = '22023';
  END IF;

  -- ---- slot within working hours + break ----
  v_end := v_start + make_interval(mins => v_duration);
  IF v_start < v_schedule.start_time OR v_end > v_schedule.end_time THEN
    RAISE EXCEPTION 'Selected time is outside the dentist working hours' USING ERRCODE = '22023';
  END IF;
  IF v_schedule.break_start IS NOT NULL AND v_schedule.break_end IS NOT NULL
     AND tsrange(v_start, v_end, '[)') && tsrange(v_schedule.break_start, v_schedule.break_end, '[)') THEN
    RAISE EXCEPTION 'Selected time falls within a break period' USING ERRCODE = '22023';
  END IF;

  -- ---- cannot book a slot that already started ----
  IF v_date = CURRENT_DATE AND ((v_date + v_start) AT TIME ZONE 'UTC') <= now() THEN
    RAISE EXCEPTION 'Cannot book an appointment in the past' USING ERRCODE = '22023';
  END IF;

  -- ---- blocked time ----
  IF EXISTS (
    SELECT 1 FROM blocked_times bt
    WHERE bt.doctor_id = v_dentist_id
      AND tsrange(((v_date + v_start) AT TIME ZONE 'UTC'), ((v_date + v_end) AT TIME ZONE 'UTC'), '[)')
          && tsrange(bt.start_time, bt.end_time, '[)')
  ) THEN
    RAISE EXCEPTION 'The doctor is unavailable during the selected time' USING ERRCODE = '22023';
  END IF;

  -- ---- validate email format (basic) ----
  IF v_patient_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN
    RAISE EXCEPTION 'Please provide a valid email address' USING ERRCODE = '22023';
  END IF;

  -- ---- upsert patient by email: NEVER overwrite existing PII from anon input.
  -- Only fills NULL/empty columns so an attacker cannot hijack a victim's record.
  INSERT INTO patients (first_name, last_name, email, phone, status)
  VALUES (v_patient_first, v_patient_last, v_patient_email, NULLIF(v_patient_phone,''), 'active')
  ON CONFLICT (email) DO UPDATE
    SET phone = CASE WHEN patients.phone IS NULL OR patients.phone = '' THEN COALESCE(EXCLUDED.phone, patients.phone) ELSE patients.phone END,
        first_name = CASE WHEN patients.first_name IS NULL OR patients.first_name = '' OR patients.first_name = 'Guest' THEN COALESCE(NULLIF(EXCLUDED.first_name,'Guest'), patients.first_name) ELSE patients.first_name END,
        last_name  = CASE WHEN patients.last_name IS NULL OR patients.last_name = '' THEN COALESCE(NULLIF(EXCLUDED.last_name,''), patients.last_name) ELSE patients.last_name END
  RETURNING id INTO v_patient_id;

  -- ---- insert appointment (double-booking guards below) ----
  BEGIN
    INSERT INTO appointments (
      patient_id, dentist_id, service_id, date, start_time, end_time,
      status, treatment_type, notes, price, currency
    )
    VALUES (
      v_patient_id, v_dentist_id, v_service_id, v_date, v_start, v_end,
      'pending', v_treatment, v_notes, v_price, v_currency
    )
    RETURNING id INTO v_appointment;
  EXCEPTION
    WHEN unique_violation OR exclusion_violation THEN
      RAISE EXCEPTION 'This time slot has just been booked. Please choose another time.'
        USING ERRCODE = '23505';
  END;

  -- ---- appointment history ----
  INSERT INTO appointment_history (appointment_id, old_status, new_status, notes)
  VALUES (v_appointment, NULL, 'pending', 'Appointment created via online booking');

  -- ---- internal notification for staff ----
  INSERT INTO notifications (user_id, type, title, message, is_read, related_id)
  VALUES (
    NULL,
    'appointment',
    'New Appointment Request',
    'New booking: ' || v_patient_first || ' ' || v_patient_last
      || ' (' || to_char(v_date, 'YYYY-MM-DD') || ' ' || to_char(v_start, 'HH24:MI') || ')',
    false,
    v_appointment
  );

  RETURN v_appointment;
END;
$$;

-- --------------------------------------------
-- 3. audit_logs: service_role only (drop permissive policy)
-- --------------------------------------------
DROP POLICY IF EXISTS "Service inserts audit logs" ON audit_logs;
DROP POLICY IF EXISTS "Authenticated staff can insert audit logs" ON audit_logs;
-- No INSERT policy for anon/authenticated: only service_role (bypasses RLS)
-- and SECURITY DEFINER functions can write. Reads remain governed by
-- existing SELECT policies.
REVOKE INSERT ON audit_logs FROM anon, authenticated;
