-- ============================================
-- NOVA Dental Studio — Migration 002
-- Add missing tables, columns, constraints, RLS, indexes
-- Prerequisite: Migration 001 must be applied first
-- (this migration only ADDS; it never drops tables or deletes data)
-- ============================================

-- ============================================
-- 0. EXTENSIONS
-- ============================================
-- Required for the EXCLUDE (overlap) constraint on appointments (UUID equality in GiST)
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- ============================================
-- 1. PROFILES (staff identity + role)
-- Staff roles: doctor | secretary | admin
-- Doctors and secretaries authenticate through Supabase Auth (auth.users).
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('doctor', 'secretary', 'admin')),
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- 2. BLOCKED_TIMES (doctor unavailability)
-- Used by the booking flow to exclude slots (breaks, leave, admin blocks).
-- ============================================
CREATE TABLE IF NOT EXISTS blocked_times (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id UUID NOT NULL REFERENCES dentists(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  reason TEXT,
  is_recurring BOOLEAN NOT NULL DEFAULT false,
  recurrence_rule TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- 3. APPOINTMENT_HISTORY (preserve appointment history)
-- Populated by applications/triggers on every appointment change.
-- ============================================
CREATE TABLE IF NOT EXISTS appointment_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  old_status TEXT,
  new_status TEXT,
  old_start_time TIME,
  new_start_time TIME,
  old_end_time TIME,
  new_end_time TIME,
  notes TEXT,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- 4. LIVE_DENTAL_SESSIONS (active chair-side sessions)
-- Mirrors the DentalSession domain model.
-- ============================================
CREATE TABLE IF NOT EXISTS live_dental_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  dentist_id UUID NOT NULL REFERENCES dentists(id) ON DELETE SET NULL,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled'
    CHECK (status IN ('scheduled', 'active', 'completed', 'cancelled')),
  type TEXT,
  notes TEXT,
  procedures TEXT[] NOT NULL DEFAULT '{}',
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- 5. AUDIT_LOGS (internal audit trail)
-- ============================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- 6. CLINIC_SETTINGS (key-value store)
-- ============================================
CREATE TABLE IF NOT EXISTS clinic_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL DEFAULT '{}',
  description TEXT,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- 7. MISSING COLUMNS ON EXISTING TABLES (from migration 001)
-- Each is additive; nothing is removed.
-- ============================================

-- patients: avatar, national_id
ALTER TABLE patients ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS national_id TEXT;

-- dentists (the "doctors" table): patient_count, qualifications, schedule, room_number
ALTER TABLE dentists ADD COLUMN IF NOT EXISTS patient_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE dentists ADD COLUMN IF NOT EXISTS qualifications TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE dentists ADD COLUMN IF NOT EXISTS schedule JSONB;
ALTER TABLE dentists ADD COLUMN IF NOT EXISTS room_number TEXT;

-- appointments: price, currency, is_paid, room_number
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS price NUMERIC;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS currency TEXT;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS is_paid BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS room_number TEXT;

-- services (the "dental_services" table): currency, image_url
ALTER TABLE services ADD COLUMN IF NOT EXISTS currency TEXT;
ALTER TABLE services ADD COLUMN IF NOT EXISTS image_url TEXT;

-- gallery_images: relational columns and extra fields
ALTER TABLE gallery_images ADD COLUMN IF NOT EXISTS patient_id UUID
  REFERENCES patients(id) ON DELETE SET NULL;
ALTER TABLE gallery_images ADD COLUMN IF NOT EXISTS dentist_id UUID
  REFERENCES dentists(id) ON DELETE SET NULL;
ALTER TABLE gallery_images ADD COLUMN IF NOT EXISTS treatment_type TEXT;
ALTER TABLE gallery_images ADD COLUMN IF NOT EXISTS before_image_url TEXT;
ALTER TABLE gallery_images ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE gallery_images ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- billing: currency, invoice_number, notes
ALTER TABLE billing ADD COLUMN IF NOT EXISTS currency TEXT;
ALTER TABLE billing ADD COLUMN IF NOT EXISTS invoice_number TEXT;
ALTER TABLE billing ADD COLUMN IF NOT EXISTS notes TEXT;

-- schedules (the "doctor_schedules" table): day_name, max_appointments
ALTER TABLE schedules ADD COLUMN IF NOT EXISTS day_name TEXT;
ALTER TABLE schedules ADD COLUMN IF NOT EXISTS max_appointments INTEGER;

-- notifications (the "internal_notifications" table): time, related_id
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS "time" TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS related_id UUID;

-- Extend notifications type CHECK to support 'appointment' and 'payment'
-- (existing 001 CHECK allowed only info|success|warning|error).
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE notifications ADD CONSTRAINT notifications_type_check
  CHECK (type IN ('info', 'success', 'warning', 'error', 'appointment', 'payment'));

-- ============================================
-- 8. DOUBLE-BOOKING & OVERLAP PREVENTION
-- ============================================

-- Exclusion constraint: an appointment of the same dentist must NOT overlap
-- in time with another non-cancellable appointment.
ALTER TABLE appointments ADD CONSTRAINT no_overlapping_appointments
  EXCLUDE USING gist (
    dentist_id WITH =,
    tsrange((date + start_time), (date + end_time), '[)') WITH &&
  )
  WHERE (status NOT IN ('cancelled', 'rescheduled', 'no-show'));

-- Unique index: prevents exact same (dentist, date, start_time) duplicates.
CREATE UNIQUE INDEX IF NOT EXISTS idx_no_double_booking
  ON appointments (dentist_id, date, start_time)
  WHERE status NOT IN ('cancelled', 'rescheduled', 'no-show');

-- ============================================
-- 9. INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

CREATE INDEX IF NOT EXISTS idx_blocked_times_doctor_period
  ON blocked_times(doctor_id, start_time, end_time);

CREATE INDEX IF NOT EXISTS idx_appointment_history_appointment
  ON appointment_history(appointment_id);
CREATE INDEX IF NOT EXISTS idx_appointment_history_changed_at
  ON appointment_history(changed_at);

CREATE INDEX IF NOT EXISTS idx_live_sessions_appointment
  ON live_dental_sessions(appointment_id);
CREATE INDEX IF NOT EXISTS idx_live_sessions_patient
  ON live_dental_sessions(patient_id);
CREATE INDEX IF NOT EXISTS idx_live_sessions_dentist
  ON live_dental_sessions(dentist_id);
CREATE INDEX IF NOT EXISTS idx_live_sessions_status
  ON live_dental_sessions(status);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table ON audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);

-- clinic_settings.key is UNIQUE (implicit index created above)

-- ============================================
-- 10. ROW LEVEL SECURITY
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_times ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_dental_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_settings ENABLE ROW LEVEL SECURITY;

-- ---------- Profiles ----------
CREATE POLICY "Staff can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Authenticated users can insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Staff can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage all profiles"
  ON profiles FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ---------- Blocked times ----------
CREATE POLICY "Doctor can view own blocked times"
  ON blocked_times FOR SELECT
  USING (doctor_id IN (SELECT id FROM dentists WHERE user_id = auth.uid()));

CREATE POLICY "Secretary can manage blocked times"
  ON blocked_times FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('secretary', 'admin')));

-- ---------- Appointment history ----------
CREATE POLICY "Staff can view appointment history"
  ON appointment_history FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('secretary', 'admin'))
         OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'doctor'));

CREATE POLICY "Staff can insert appointment history"
  ON appointment_history FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid()
                      AND role IN ('secretary', 'admin', 'doctor')));

-- ---------- Live dental sessions ----------
CREATE POLICY "Doctor can view own sessions"
  ON live_dental_sessions FOR SELECT
  USING (dentist_id IN (SELECT id FROM dentists WHERE user_id = auth.uid()));

CREATE POLICY "Doctor can update own sessions"
  ON live_dental_sessions FOR UPDATE
  USING (dentist_id IN (SELECT id FROM dentists WHERE user_id = auth.uid()));

CREATE POLICY "Secretary can manage all sessions"
  ON live_dental_sessions FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('secretary', 'admin')));

-- ---------- Audit logs ----------
CREATE POLICY "Admins can view audit logs"
  ON audit_logs FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Triggers/SECURITY DEFINER functions may insert audit entries
CREATE POLICY "Service inserts audit logs"
  ON audit_logs FOR INSERT WITH CHECK (true);

-- ---------- Clinic settings ----------
CREATE POLICY "Authenticated users can view clinic settings"
  ON clinic_settings FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage clinic settings"
  ON clinic_settings FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================
-- 11. UPDATED_AT TRIGGERS (for tables with UPDATED_AT)
-- update_updated_at() function already exists from migration 001.
-- ============================================

CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_blocked_times_updated_at
  BEFORE UPDATE ON blocked_times FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_live_sessions_updated_at
  BEFORE UPDATE ON live_dental_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_clinic_settings_updated_at
  BEFORE UPDATE ON clinic_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 12. STAFF PROFILE AUTO-CREATION
-- When a user signs up via Supabase Auth with role metadata in
-- ('doctor','secretary','admin'), create their profile automatically.
-- ============================================

CREATE OR REPLACE FUNCTION handle_new_staff_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, role, first_name, last_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'secretary'),
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_new_staff_profile
  AFTER INSERT ON auth.users FOR EACH ROW
  WHEN (NEW.raw_user_meta_data->>'role' IN ('doctor', 'secretary', 'admin'))
  EXECUTE FUNCTION handle_new_staff_profile();

-- ============================================
-- 13. DEFAULT CLINIC SETTINGS (idempotent seed)
-- ============================================

INSERT INTO clinic_settings (key, value, description) VALUES
  ('clinic_name', '"NOVA Dental Studio"', 'Clinic display name'),
  ('timezone', '"Africa/Cairo"', 'Default clinic timezone'),
  ('working_hours', '{"start":"09:00","end":"18:00","days":["Sun","Mon","Tue","Wed","Thu"]}', 'Standard working hours'),
  ('slot_duration', '30', 'Default appointment slot duration in minutes'),
  ('currency', '"EGP"', 'Default currency'),
  ('language', '"ar"', 'Default UI language')
ON CONFLICT (key) DO NOTHING;