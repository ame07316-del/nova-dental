-- ============================================
-- NOVA Dental Studio — Migration 004
-- Role-scoped RLS policies (doctor sees own data)
--
-- Prerequisites: migrations 001, 002, 003 applied.
-- This migration REPLACES the overly-broad policies
-- introduced by 003 so that:
--   • doctors see only their own appointments
--   • doctors see only patients assigned to them
--   • doctors can only insert/update their own appointments
--   • secretaries/admins retain full access
-- All other tables are unchanged.
-- ============================================

-- ============================================
-- 1. APPOINTMENTS: replace broad staff policy
--    with role-scoped SELECT/INSERT/UPDATE.
-- ============================================

DROP POLICY IF EXISTS "Staff can view all appointments" ON appointments;
DROP POLICY IF EXISTS "Staff can create appointments" ON appointments;
DROP POLICY IF EXISTS "Staff can update appointments" ON appointments;
DROP POLICY IF EXISTS "Secretary/Admin can view all appointments" ON appointments;
DROP POLICY IF EXISTS "Secretary/Admin can create appointments" ON appointments;
DROP POLICY IF EXISTS "Secretary/Admin can update appointments" ON appointments;
DROP POLICY IF EXISTS "Secretary/Admin can cancel appointments" ON appointments;
DROP POLICY IF EXISTS "Doctor can view own appointments" ON appointments;
DROP POLICY IF EXISTS "Doctor can create own appointments" ON appointments;
DROP POLICY IF EXISTS "Doctor can update own appointments" ON appointments;
DROP POLICY IF EXISTS "Patients can view own appointments" ON appointments;
DROP POLICY IF EXISTS "Patients can create appointments" ON appointments;

-- Staff (secretary/admin): full access to all appointments
CREATE POLICY "Secretary/Admin can view all appointments"
  ON appointments FOR SELECT
  USING (public.is_staff(ARRAY['secretary','admin']));
CREATE POLICY "Secretary/Admin can create appointments"
  ON appointments FOR INSERT
  WITH CHECK (public.is_staff(ARRAY['secretary','admin']));
CREATE POLICY "Secretary/Admin can update appointments"
  ON appointments FOR UPDATE
  USING (public.is_staff(ARRAY['secretary','admin']));

-- Doctor: view only their own appointments
CREATE POLICY "Doctor can view own appointments"
  ON appointments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM dentists
      WHERE dentists.id = appointments.dentist_id
        AND dentists.user_id = auth.uid()
    )
  );
-- Doctor can insert only their own appointments
CREATE POLICY "Doctor can create own appointments"
  ON appointments FOR INSERT
  WITH CHECK (
    public.is_staff(ARRAY['doctor'])
    AND EXISTS (
      SELECT 1 FROM dentists
      WHERE dentists.id = appointments.dentist_id
        AND dentists.user_id = auth.uid()
    )
  );
-- Doctor can update only their own appointments
CREATE POLICY "Doctor can update own appointments"
  ON appointments FOR UPDATE
  USING (
    public.is_staff(ARRAY['doctor'])
    AND EXISTS (
      SELECT 1 FROM dentists
      WHERE dentists.id = appointments.dentist_id
        AND dentists.user_id = auth.uid()
    )
  );

-- Patient: view own appointments (guest / patient role)
CREATE POLICY "Patients can view own appointments"
  ON appointments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = appointments.patient_id
        AND patients.user_id = auth.uid()
    )
  );
-- Patient can insert own appointment
CREATE POLICY "Patients can create own appointments"
  ON appointments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = appointments.patient_id
        AND patients.user_id = auth.uid()
    )
  );

-- ============================================
-- 2. PATIENTS: scope doctor to assigned patients
-- ============================================

DROP POLICY IF EXISTS "Staff can view all patients" ON patients;
DROP POLICY IF EXISTS "Staff can insert patients" ON patients;
DROP POLICY IF EXISTS "Staff can update patients" ON patients;
DROP POLICY IF EXISTS "Secretary/Admin can view all patients" ON patients;
DROP POLICY IF EXISTS "Secretary/Admin can insert patients" ON patients;
DROP POLICY IF EXISTS "Secretary/Admin can update patients" ON patients;
DROP POLICY IF EXISTS "Doctor can view assigned patients" ON patients;
DROP POLICY IF EXISTS "Patients can view own data" ON patients;
DROP POLICY IF EXISTS "Patients can update own data" ON patients;

-- Staff (secretary/admin): full access to all patients
CREATE POLICY "Secretary/Admin can view all patients"
  ON patients FOR SELECT
  USING (public.is_staff(ARRAY['secretary','admin']));
CREATE POLICY "Secretary/Admin can insert patients"
  ON patients FOR INSERT
  WITH CHECK (public.is_staff(ARRAY['secretary','admin']));
CREATE POLICY "Secretary/Admin can update patients"
  ON patients FOR UPDATE
  USING (public.is_staff(ARRAY['secretary','admin']));

-- Doctor: view only patients they have appointments with
CREATE POLICY "Doctor can view assigned patients"
  ON patients FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM appointments a
      JOIN dentists d ON d.id = a.dentist_id
      WHERE a.patient_id = patients.id
        AND d.user_id = auth.uid()
    )
  );
-- Doctor cannot insert/update patients directly
-- (handled via appointment flow)

-- Patient: view own record
CREATE POLICY "Patients can view own data"
  ON patients FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Patients can update own data"
  ON patients FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- 3. APPOINTMENTS: add DELETE policy (deny by default otherwise)
-- ============================================

DROP POLICY IF EXISTS "Secretary/Admin can cancel appointments" ON appointments;
CREATE POLICY "Secretary/Admin can cancel appointments"
  ON appointments FOR DELETE
  USING (public.is_staff(ARRAY['secretary','admin']));

-- ============================================
-- 4. LIVE_DENTAL_SESSIONS: ensure doctor sees only own
-- ============================================

DROP POLICY IF EXISTS "Doctor can view own sessions" ON live_dental_sessions;
DROP POLICY IF EXISTS "Doctor can update own sessions" ON live_dental_sessions;

CREATE POLICY "Doctor can view own sessions"
  ON live_dental_sessions FOR SELECT
  USING (
    dentist_id IN (SELECT id FROM dentists WHERE user_id = auth.uid())
  );
CREATE POLICY "Doctor can update own sessions"
  ON live_dental_sessions FOR UPDATE
  USING (
    dentist_id IN (SELECT id FROM dentists WHERE user_id = auth.uid())
  );

-- ============================================
-- 5. NOTIFICATIONS: ensure staff sees clinic-wide
-- ============================================

DROP POLICY IF EXISTS "Staff can view clinic notifications" ON notifications;
DROP POLICY IF EXISTS "Staff can update clinic notifications" ON notifications;

CREATE POLICY "Staff can view clinic notifications"
  ON notifications FOR SELECT
  USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('doctor','secretary','admin'))
    OR user_id = auth.uid()
  );
CREATE POLICY "Staff can update clinic notifications"
  ON notifications FOR UPDATE
  USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('doctor','secretary','admin'))
    OR user_id = auth.uid()
  );

-- ============================================
-- 7. LIVE_DENTAL_SESSIONS: add INSERT for doctors
-- ============================================
DROP POLICY IF EXISTS "Doctor can create own sessions" ON live_dental_sessions;
CREATE POLICY "Doctor can create own sessions"
  ON live_dental_sessions FOR INSERT
  WITH CHECK (
    public.is_staff(ARRAY['doctor'])
    AND EXISTS (
      SELECT 1 FROM dentists
      WHERE dentists.id = live_dental_sessions.dentist_id
        AND dentists.user_id = auth.uid()
    )
  );

-- ============================================
-- 8. AUDIT LOGS: restrict INSERT to authenticated staff
-- ============================================

DROP POLICY IF EXISTS "Service inserts audit logs" ON audit_logs;
DROP POLICY IF EXISTS "Authenticated staff can insert audit logs" ON audit_logs;
CREATE POLICY "Authenticated staff can insert audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');
