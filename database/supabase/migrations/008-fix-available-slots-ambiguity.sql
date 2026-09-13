-- ============================================
-- 008-fix-available-slots-ambiguity.sql
-- Fixes get_available_slots failing on EVERY call with:
--   42702 column reference "start_time" is ambiguous
-- Cause: the function's OUT params (start_time, end_time from
-- RETURNS TABLE) collide with the schedules.start_time /
-- schedules.end_time columns in the inner SELECT. Fix: qualify
-- all column references with a table alias.
-- Idempotent: safe to run more than once.
-- Apply in Supabase Dashboard -> SQL Editor.
-- ============================================

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
    SELECT sc.start_time, sc.end_time, sc.break_start, sc.break_end, sc.max_appointments
    FROM schedules sc
    WHERE sc.dentist_id = p_dentist_id AND sc.date = p_date AND sc.is_available = true
  LOOP
    s := v_sched.start_time;
    WHILE (s + make_interval(mins => v_slot_step)) <= v_sched.end_time
      AND (s + make_interval(mins => v_duration))   <= v_sched.end_time
    LOOP
      e := s + make_interval(mins => v_duration);
      v_skip := false;

      -- TIME overlap (tsrange only works on timestamp, not time)
      IF NOT (v_sched.break_start IS NOT NULL AND v_sched.break_end IS NOT NULL
              AND s < v_sched.break_end AND e > v_sched.break_start) THEN
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
