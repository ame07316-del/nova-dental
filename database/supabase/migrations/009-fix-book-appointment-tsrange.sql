-- ============================================
-- 009-fix-book-appointment-tsrange.sql
-- Fixes book_appointment failing on EVERY call with:
--   42883 function tsrange(time, time) does not exist
-- Root cause: tsrange only works on timestamp/timestamptz, not on time.
-- Also fixes blocked_times check to use tstzrange (timestamptz).
-- Idempotent — run once in Supabase SQL Editor.
-- ============================================

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
  IF p_payload IS NULL OR p_payload->>'service_id' IS NULL OR p_payload->>'dentist_id' IS NULL
     OR p_payload->>'date' IS NULL OR p_payload->>'start_time' IS NULL
     OR p_payload->'patient'->>'email' IS NULL THEN
    RAISE EXCEPTION 'Missing required booking fields' USING ERRCODE = '22023';
  END IF;

  v_service_id := (p_payload->>'service_id')::uuid;
  v_dentist_id := (p_payload->>'dentist_id')::uuid;
  v_date       := (p_payload->>'date')::date;
  v_start      := (p_payload->>'start_time')::time;
  v_patient_first := left(regexp_replace(COALESCE(NULLIF(btrim(p_payload->'patient'->>'first_name',''), ''), 'Guest'), '[<>]', '', 'g'), 60);
  v_patient_last  := left(regexp_replace(COALESCE(p_payload->'patient'->>'last_name', ''), '[<>]', '', 'g'), 60);
  v_patient_email := lower(btrim(p_payload->'patient'->>'email',''));
  v_patient_phone := left(btrim(COALESCE(p_payload->'patient'->>'phone',''),''), 30);
  v_treatment  := left(regexp_replace(COALESCE(p_payload->>'treatment_type', 'General Consultation'), '[<>]', '', 'g'), 120);
  v_notes      := left(regexp_replace(NULLIF(p_payload->>'notes', ''), '[<>]', '', 'g'), 1000);

  SELECT duration_minutes, price, currency INTO v_duration, v_price, v_currency
    FROM services WHERE id = v_service_id AND is_active = true;
  IF v_duration IS NULL THEN
    RAISE EXCEPTION 'Invalid or inactive service' USING ERRCODE = '22023';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM dentists WHERE id = v_dentist_id AND is_active = true) THEN
    RAISE EXCEPTION 'This dentist is not available at the moment' USING ERRCODE = '22023';
  END IF;

  SELECT * INTO v_schedule FROM schedules
    WHERE dentist_id = v_dentist_id AND date = v_date AND is_available = true;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'This date is not available for the selected dentist' USING ERRCODE = '22023';
  END IF;

  v_end := v_start + make_interval(mins => v_duration);
  IF v_start < v_schedule.start_time OR v_end > v_schedule.end_time THEN
    RAISE EXCEPTION 'Selected time is outside the dentist working hours' USING ERRCODE = '22023';
  END IF;
  -- TIME overlap — never tsrange(time,time)
  IF v_schedule.break_start IS NOT NULL AND v_schedule.break_end IS NOT NULL
     AND v_start < v_schedule.break_end AND v_end > v_schedule.break_start THEN
    RAISE EXCEPTION 'Selected time falls within a break period' USING ERRCODE = '22023';
  END IF;

  IF v_date = CURRENT_DATE AND ((v_date + v_start) AT TIME ZONE 'UTC') <= now() THEN
    RAISE EXCEPTION 'Cannot book an appointment in the past' USING ERRCODE = '22023';
  END IF;

  -- blocked_times are timestamptz → tstzrange
  IF EXISTS (
    SELECT 1 FROM blocked_times bt
    WHERE bt.doctor_id = v_dentist_id
      AND tstzrange(((v_date + v_start) AT TIME ZONE 'UTC'), ((v_date + v_end) AT TIME ZONE 'UTC'), '[)')
          && tstzrange(bt.start_time, bt.end_time, '[)')
  ) THEN
    RAISE EXCEPTION 'The doctor is unavailable during the selected time' USING ERRCODE = '22023';
  END IF;

  IF v_patient_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN
    RAISE EXCEPTION 'Please provide a valid email address' USING ERRCODE = '22023';
  END IF;

  INSERT INTO patients (first_name, last_name, email, phone, status)
  VALUES (v_patient_first, v_patient_last, v_patient_email, NULLIF(v_patient_phone,''), 'active')
  ON CONFLICT (email) DO UPDATE
    SET phone = CASE WHEN patients.phone IS NULL OR patients.phone = '' THEN COALESCE(EXCLUDED.phone, patients.phone) ELSE patients.phone END,
        first_name = CASE WHEN patients.first_name IS NULL OR patients.first_name = '' OR patients.first_name = 'Guest' THEN COALESCE(NULLIF(EXCLUDED.first_name,'Guest'), patients.first_name) ELSE patients.first_name END,
        last_name  = CASE WHEN patients.last_name IS NULL OR patients.last_name = '' THEN COALESCE(NULLIF(EXCLUDED.last_name,''), patients.last_name) ELSE patients.last_name END
  RETURNING id INTO v_patient_id;

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

  INSERT INTO appointment_history (appointment_id, old_status, new_status, notes)
  VALUES (v_appointment, NULL, 'pending', 'Appointment created via online booking');

  INSERT INTO notifications (user_id, type, title, message, is_read, related_id)
  VALUES (
    NULL, 'appointment', 'New Appointment Request',
    'New booking: ' || v_patient_first || ' ' || v_patient_last
      || ' (' || to_char(v_date, 'YYYY-MM-DD') || ' ' || to_char(v_start, 'HH24:MI') || ')',
    false, v_appointment
  );

  RETURN v_appointment;
END;
$$;
