-- NOVA Dental Studio Database Migrations
-- Supabase SQL Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- SERVICES TABLE (must exist before appointments)
-- ============================================

CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('Preventive', 'Restorative', 'Cosmetic', 'Orthodontics', 'Oral Surgery', 'Emergency')),
  price DECIMAL(10,2) NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- PATIENTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  address TEXT,
  insurance_provider TEXT,
  insurance_number TEXT,
  medical_history TEXT,
  allergies TEXT,
  notes TEXT,
  status TEXT CHECK (status IN ('active', 'inactive', 'archived')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- DENTISTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS dentists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  specialty TEXT,
  license_number TEXT,
  rating DECIMAL(2,1) DEFAULT 0.0,
  bio TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- APPOINTMENTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  dentist_id UUID REFERENCES dentists(id) ON DELETE SET NULL,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT CHECK (status IN ('confirmed', 'pending', 'in-progress', 'completed', 'cancelled', 'no-show', 'rescheduled')) DEFAULT 'pending',
  notes TEXT,
  treatment_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- GALLERY TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT CHECK (category IN ('cosmetic', 'restorative', 'orthodontics', 'preventive')),
  status TEXT CHECK (status IN ('featured', 'completed', 'in-progress', 'pending')) DEFAULT 'completed',
  patient_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('info', 'success', 'warning', 'error')),
  title TEXT NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- BILLING TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS billing (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  discount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT CHECK (payment_method IN ('cash', 'card', 'insurance', 'online')),
  status TEXT CHECK (status IN ('pending', 'paid', 'partial', 'overdue', 'refunded')) DEFAULT 'pending',
  due_date DATE,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- SCHEDULE TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dentist_id UUID REFERENCES dentists(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  break_start TIME,
  break_end TIME,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_dentist ON appointments(dentist_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_patients_email ON patients(email);
CREATE INDEX IF NOT EXISTS idx_patients_status ON patients(status);
CREATE INDEX IF NOT EXISTS idx_dentists_specialty ON dentists(specialty);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery_images(category);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_billing_appointment ON billing(appointment_id);
CREATE INDEX IF NOT EXISTS idx_billing_patient ON billing(patient_id);
CREATE INDEX IF NOT EXISTS idx_schedules_dentist ON schedules(dentist_id);
CREATE INDEX IF NOT EXISTS idx_schedules_date ON schedules(date);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE dentists ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

-- Patient policies
CREATE POLICY "Patients can view own data" ON patients FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Patients can update own data" ON patients FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all patients" ON patients FOR SELECT USING (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'));

-- Dentist policies
CREATE POLICY "Dentists can view own data" ON dentists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Dentists can update own data" ON dentists FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all dentists" ON dentists FOR SELECT USING (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'));

-- Appointments policies
CREATE POLICY "Patients can view own appointments" ON appointments FOR SELECT USING (EXISTS (SELECT 1 FROM patients WHERE id = appointments.patient_id AND user_id = auth.uid()));
CREATE POLICY "Patients can create appointments" ON appointments FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM patients WHERE id = appointments.patient_id AND user_id = auth.uid()));
CREATE POLICY "Admins and dentists can view all appointments" ON appointments FOR SELECT USING (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND (raw_user_meta_data->>'role' IN ('admin', 'dentist'))));

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (user_id = auth.uid());

-- Billing policies
CREATE POLICY "Patients can view own billing" ON billing FOR SELECT USING (EXISTS (SELECT 1 FROM patients WHERE id = billing.patient_id AND user_id = auth.uid()));

-- Services policies
CREATE POLICY "Everyone can view services" ON services FOR SELECT USING (true);
CREATE POLICY "Admins can manage services" ON services FOR ALL USING (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'));

-- Gallery policies
CREATE POLICY "Everyone can view gallery" ON gallery_images FOR SELECT USING (true);
CREATE POLICY "Admins can manage gallery" ON gallery_images FOR ALL USING (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'));

-- Schedules policies
CREATE POLICY "Dentists can view own schedules" ON schedules FOR SELECT USING (dentist_id IN (SELECT id FROM dentists WHERE user_id = auth.uid()));
CREATE POLICY "Admins can manage all schedules" ON schedules FOR ALL USING (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'));

-- ============================================
-- TRIGGERS
-- ============================================

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_patients_updated_at
  BEFORE UPDATE ON patients FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_dentists_updated_at
  BEFORE UPDATE ON dentists FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_appointments_updated_at
  BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_services_updated_at
  BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create patient record on signup
CREATE OR REPLACE FUNCTION handle_new_patient()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO patients (user_id, first_name, last_name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'first_name', NEW.raw_user_meta_data->>'last_name', NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_new_patient
  AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_patient();

-- ============================================
-- SEED DATA
-- ============================================

INSERT INTO services (name, description, category, price, duration_minutes) VALUES
  ('General Check-up', 'Complete dental examination and cleaning', 'Preventive', 50, 30),
  ('Deep Cleaning', 'Deep scaling and root planing', 'Preventive', 80, 45),
  ('Teeth Whitening', 'Professional teeth whitening treatment', 'Cosmetic', 200, 60),
  ('Dental Implant', 'Surgical placement of dental implant', 'Restorative', 800, 120),
  ('Root Canal', 'Endodontic root canal treatment', 'Restorative', 400, 90),
  ('Dental Filling', 'Composite or amalgam filling', 'Restorative', 150, 45),
  ('Braces/Invisalign', 'Orthodontic treatment', 'Orthodontics', 1500, 90),
  ('Wisdom Tooth Extraction', 'Surgical extraction of wisdom teeth', 'Oral Surgery', 300, 60),
  ('Emergency Consultation', 'Urgent dental consultation', 'Emergency', 75, 30);
