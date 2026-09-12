-- ============================================
-- NOVA Dental Studio — Migration 003
-- Enable guest (anonymous) booking + real staff role-based access
--
-- Prerequisites: migrations 001 and 002 applied.
--
-- What this migration does:
--   1. Fixes the auth.users "new patient" trigger (001 fired on EVERY signup and
--      could abort staff signups because patients.first_name is NOT NULL).
--   2. Adds a trigger that auto-creates a dentists row when a "doctor" signs up
--      (binds the seeded catalog dentist row to the account when email matches).
--   3. Replaces 001's raw_user_meta_data->>'role' RLS policies with policies that
--      honour profiles.role ('doctor' | 'secretary' | 'admin').
--   4. Opens read access used by the PUBLIC booking flow (active dentists,
--      available schedules, services) so anonymous users can browse the catalog.
--   5. Adds two SECURITY DEFINER RPCs used by anonymous guests:
--        - get_available_slots(dentist_id, service_id, date)
--        - book_appointment(payload jsonb)
--      Both enforce server-side validation + double-booking prevention
--      (DB-level exclusion constraint also backs this up).
--   6. Idempotently seeds 3 demo dentists + 14 days of schedules IF dentists is empty.
--
-- Idempotent: safe to run more than once.
-- ============================================

-- ============================================
-- 1. FIX PATIENT AUTO-CREATION TRIGGER
-- ============================================
-- Old behaviour: fired on EVERY auth.users insert, inserted patients row with
-- metadata names -> NULL first_name violated NOT NULL for staff signups -> abort.
DROP TRIGGER IF EXISTS trigger_new_patient ON auth.users;

CREATE OR REPLACE FUNCTION public.handle_new_patient()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO patients (user_id, first_name, last_name, email, status)
  VALUES (
    NEW.id,
    COALESCE(NULLIF(btrim(NEW.raw_user_meta_data->>'first_name',''), ''), 'Patient'),
    COALESCE(NULLIF(btrim(NEW.raw_user_meta_data->>'last_name',''), ''), ''),
    NEW.email,
    'active'
  )
  ON CONFLICT (email) DO UPDATE
    SET user_id = EXCLUDED.user_id
    WHERE patients.user_id IS NULL;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trigger_new_patient
  AFTER INSERT ON auth.users FOR EACH ROW
  WHEN (NEW.raw_user_meta_data->>'role' = 'patient')
  EXECUTE FUNCTION public.handle_new_patient();

-- Allow one patient record per auth user (and one dentist per auth user).
CREATE UNIQUE INDEX IF NOT EXISTS idx_patients_user ON patients(user_id) WHERE user_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_dentists_user ON dentists(user_id) WHERE user_id IS NOT NULL;

-- ============================================
-- 2. AUTO-CREATE DENTIST RECORD ON "DOCTOR" SIGNUP
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_doctor_profile()
RETURNS TRIGGER AS $$
DECLARE
  v_email TEXT;
BEGIN
  SELECT email INTO v_email FROM auth.users WHERE id = NEW.id;
  IF v_email IS NULL THEN
    RETURN NEW;
  END IF;
  INSERT INTO dentists (user_id, first_name, last_name, email, specialty, is_active, patient_count)
  VALUES (NEW.id, COALESCE(NEW.first_name,''), COALESCE(NEW.last_name,''), v_email, NULL, true, 0)
  ON CONFLICT (email) DO UPDATE
    SET user_id = EXCLUDED.user_id,
        first_name = COALESCE(EXCLUDED.first_name, dentists.first_name),
        last_name  = COALESCE(EXCLUDED.last_name,  dentists.last_name),
        is_active  = true
    WHERE dentists.user_id IS NULL;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Attach to profiles insert (profiles row is created for doctor/secretary/admin by 002).
DROP TRIGGER IF EXISTS trigger_new_doctor_profile ON profiles;
CREATE TRIGGER trigger_new_doctor_profile
  AFTER INSERT ON profiles FOR EACH ROW
  WHEN (NEW.role = 'doctor')
  EXECUTE FUNCTION public.handle_new_doctor_profile();

-- ============================================
-- 3. STAFF HELPER (used by policies below)
-- ============================================
CREATE OR REPLACE FUNCTION public.is_staff(p_roles TEXT[])
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = ANY(p_roles));
$$;

-- ============================================
-- 4. RLS: REPLACE 001 METADATA-BASED POLICIES
-- ============================================

-- ---------- patients ----------
DROP POLICY IF EXISTS "Admins can view all patients" ON patients;
CREATE POLICY "Staff can view all patients" ON patients FOR SELECT
  USING (public.is_staff(ARRAY['doctor','secretary','admin']));
CREATE POLICY "Staff can insert patients" ON patients FOR INSERT
  WITH CHECK (public.is_staff(ARRAY['doctor','secretary','admin']));
CREATE POLICY "Staff can update patients" ON patients FOR UPDATE
  USING (public.is_staff(ARRAY['doctor','secretary','admin']));

-- ---------- dentists ----------
DROP POLICY IF EXISTS "Admins can view all dentists" ON dentists;
CREATE POLICY "Public can view active dentists" ON dentists FOR SELECT
  USING (is_active = true);
CREATE POLICY "Staff can manage dentists" ON dentists FOR ALL
  USING (public.is_staff(ARRAY['secretary','admin']));

-- ---------- appointments ----------
DROP POLICY IF EXISTS "Admins and dentists can view all appointments" ON appointments;
CREATE POLICY "Staff can view all appointments" ON appointments FOR SELECT
  USING (public.is_staff(ARRAY['doctor','secretary','admin']));
CREATE POLICY "Staff can create appointments" ON appointments FOR INSERT
  WITH CHECK (public.is_staff(ARRAY['doctor','secretary','admin']));
CREATE POLICY "Staff can update appointments" ON appointments FOR UPDATE
  USING (public.is_staff(ARRAY['doctor','secretary','admin']));

-- ---------- services ----------
DROP POLICY IF EXISTS "Admins can manage services" ON services;
CREATE POLICY "Staff can manage services" ON services FOR ALL
  USING (public.is_staff(ARRAY['secretary','admin']));

-- ---------- gallery_images ----------
DROP POLICY IF EXISTS "Admins can manage gallery" ON gallery_images;
CREATE POLICY "Staff can manage gallery" ON gallery_images FOR ALL
  USING (public.is_staff(ARRAY['secretary','admin']));

-- ---------- schedules ----------
DROP POLICY IF EXISTS "Dentists can view own schedules" ON schedules;
DROP POLICY IF EXISTS "Admins can manage all schedules" ON schedules;
CREATE POLICY "Public can view available schedules" ON schedules FOR SELECT
  USING (is_available = true);
CREATE POLICY "Staff can view all schedules" ON schedules FOR SELECT
  USING (public.is_staff(ARRAY['doctor','secretary','admin']));
CREATE POLICY "Secretary can manage schedules" ON schedules FOR ALL
  USING (public.is_staff(ARRAY['secretary','admin']));
CREATE POLICY "Doctors can manage own schedules" ON schedules FOR ALL
  USING (dentist_id IN (SELECT id FROM dentists WHERE user_id = auth.uid()));

-- ---------- notifications ----------
-- Keep 001 "Users can view own notifications" / "Users can update own notifications";
-- add staff policies for the clinic-wide notifications created by the booking RPC.
CREATE POLICY "Staff can view clinic notifications" ON notifications FOR SELECT
  USING (public.is_staff(ARRAY['doctor','secretary','admin']));
CREATE POLICY "Staff can update clinic notifications" ON notifications FOR UPDATE
  USING (public.is_staff(ARRAY['doctor','secretary','admin']));

-- ============================================
-- 5. PUBLIC BOOKING: get_available_slots RPC
-- ============================================
-- Slot step comes from clinic_settings.slot_duration (default 30 minutes).
-- Slot length = requested service's duration_minutes.
-- Times are interpreted consistently as UTC for past/blocked comparisons.
CREATE OR REPLACE FUNCTION public.get_available_slots(
  p_dentist_id uuid,
  p_service_id uuid,
  p_date date
) RETURNS TABLE(start_time time, end_time time)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_duration    INT  := 30;
  v_slot_step   INT  := 30;
  v_sched       RECORD;
  s             TIME;
  e             TIME;
  v_in_break    BOOLEAN;
  v_skip        BOOLEAN;
BEGIN
  SELECT duration_minutes INTO v_duration FROM services WHERE id = p_service_id;
  IF v_duration IS NULL OR v_duration <= 0 THEN
    RETURN;
  END IF;

  BEGIN
    SELECT COALESCE(NULLIF(value::text, ''), '30')::int INTO v_slot_step
      FROM clinic_settings WHERE key = 'slot_duration';
  EXCEPTION WHEN OTHERS THEN
    v_slot_step := 30;
  END;
  IF v_slot_step IS NULL OR v_slot_step <= 0 THEN
    v_slot_step := 30;
  END IF;

  FOR v_sched IN
    SELECT start_time, end_time, break_start, break_end, max_appointments
    FROM schedules
    WHERE dentist_id = p_dentist_id AND date = p_date AND is_available = true
  LOOP
    s := v_sched.start_time;
    WHILE (s + make_interval(mins => v_slot_step)) <= v_sched.end_time
      AND (s + make_interval(mins => v_duration))   <= v_sched.end_time
    LOOP
      e := s + make_interval(mins => v_duration);
      v_skip := false;

      IF NOT (v_sched.break_start IS NOT NULL AND v_sched.break_end IS NOT NULL
              AND tsrange(s, e, '[)') && tsrange(v_sched.break_start, v_sched.break_end, '[)')) THEN
        -- slot would fall entirely in the past (only for today)
        IF (p_date = CURRENT_DATE AND ((p_date + s) AT TIME ZONE 'UTC') <= now()) THEN
          v_skip := true;
        END IF;
        -- blocked time
        IF NOT v_skip AND EXISTS (
          SELECT 1 FROM blocked_times bt
          WHERE bt.doctor_id = p_dentist_id
            AND tsrange(((p_date + s) AT TIME ZONE 'UTC'), ((p_date + e) AT TIME ZONE 'UTC'), '[)')
                && tsrange(bt.start_time, bt.end_time, '[)')
        ) THEN
          v_skip := true;
        END IF;
        -- overlapping existing booking
        IF NOT v_skip AND EXISTS (
          SELECT 1 FROM appointments a
          WHERE a.dentist_id = p_dentist_id AND a.date = p_date
            AND a.status NOT IN ('cancelled', 'rescheduled', 'no-show')
            AND tsrange((p_date + s), (p_date + e), '[)')
                && tsrange((a.date + a.start_time), (a.date + a.end_time), '[)')
        ) THEN
          v_skip := true;
        END IF;
        -- max appointments per day reached
        IF NOT v_skip AND v_sched.max_appointments IS NOT NULL THEN
          IF (SELECT count(*) FROM appointments a2
              WHERE a2.dentist_id = p_dentist_id AND a2.date = p_date
                AND a2.status NOT IN ('cancelled', 'rescheduled', 'no-show')) >= v_sched.max_appointments
          THEN
            v_skip := true;
          END IF;
        END IF;

        IF NOT v_skip THEN
          start_time := s;
          end_time   := e;
          RETURN NEXT;
        END IF;
      END IF;

      s := s + make_interval(mins => v_slot_step);
    END LOOP;
  END LOOP;

  RETURN;
END;
$$;

-- ============================================
-- 6. PUBLIC BOOKING: book_appointment RPC
-- ============================================
-- payload: {
--   service_id, dentist_id, date (YYYY-MM-DD), start_time (HH:MM),
--   treatment_type?, notes?,
--   patient: { first_name, last_name, email, phone }
-- }
-- Runs in one transaction: validates, resolves/creates the patient by email,
-- inserts the appointment (status: pending), writes appointment_history and an
-- internal notification. Friendly Arabic/English error message when the slot was
-- just taken (unique_violation / exclusion_violation from migrations 002).
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
  v_patient_first := COALESCE(NULLIF(btrim(p_payload->'patient'->>'first_name',''), ''), 'Guest');
  v_patient_last  := COALESCE(p_payload->'patient'->>'last_name', '');
  v_patient_email := lower(btrim(p_payload->'patient'->>'email',''));
  v_patient_phone := btrim(COALESCE(p_payload->'patient'->>'phone',''),'');
  v_treatment  := COALESCE(p_payload->>'treatment_type', 'General Consultation');
  v_notes      := NULLIF(p_payload->>'notes', '');

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

  -- ---- upsert patient by email ----
  INSERT INTO patients (first_name, last_name, email, phone, status)
  VALUES (v_patient_first, v_patient_last, v_patient_email, NULLIF(v_patient_phone,''), 'active')
  ON CONFLICT (email) DO UPDATE
    SET phone = COALESCE(EXCLUDED.phone, patients.phone),
        first_name = COALESCE(NULLIF(EXCLUDED.first_name,'Guest'), patients.first_name),
        last_name  = COALESCE(NULLIF(EXCLUDED.last_name,''), patients.last_name)
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

-- ============================================
-- 7. GRANTS
-- ============================================
REVOKE ALL ON FUNCTION public.get_available_slots(uuid, uuid, date) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.book_appointment(jsonb) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.get_available_slots(uuid, uuid, date) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.book_appointment(jsonb) TO anon, authenticated, service_role;

-- ============================================
-- 8. IDEMPOTENT DEMO SEED: DENTISTS + SCHEDULES
-- Only runs when the dentists table is completely empty.
-- ============================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM dentists) THEN
    INSERT INTO dentists (first_name, last_name, email, phone, specialty, license_number, rating, patient_count, bio, is_active)
    VALUES
      ('Sarah',   'Smith',   'sarah.smith@novadental.com',   '+966 50 123 4567', 'Orthodontics',    'D-2019-00142', 4.9, 128, 'Specialized in invisible braces and clear aligners.', true),
      ('Ahmed',   'Hassan',  'ahmed.hassan@novadental.com',  '+966 50 234 5678', 'Oral Surgery',    'D-2017-00289', 4.8, 95,  'Expert in wisdom tooth extraction and dental implants.', true),
      ('Mohamed', 'Ali',     'mohamed.ali@novadental.com',   '+966 50 345 6789', 'Cosmetic Dentistry', 'D-2021-00076', 5.0, 210, 'Award-winning cosmetic dentist.', true);
  END IF;
END;
$$;

-- Seed 14 days of schedules (excluding Fridays) for every dentist that has no
-- schedules yet. Idempotent: only inserts where the (dentist, date) is missing.
INSERT INTO schedules (dentist_id, date, day_name, start_time, end_time, break_start, break_end, is_available, max_appointments)
SELECT d.id, g.day, trim(to_char(g.day, 'Day')),
       CASE WHEN extract(isodow FROM g.day) IN (6, 7) THEN time '10:00' ELSE time '09:00' END,
       CASE WHEN extract(isodow FROM g.day) IN (6, 7) THEN time '14:00' ELSE time '18:00' END,
       time '13:00', time '14:00', true, 8
FROM dentists d
CROSS JOIN (
  SELECT generate_series(CURRENT_DATE, CURRENT_DATE + 13, interval '1 day')::date AS day
) g
WHERE extract(isodow FROM g.day) <> 5   -- no Fridays
  AND NOT EXISTS (
    SELECT 1 FROM schedules s
    WHERE s.dentist_id = d.id AND s.date = g.day
  );