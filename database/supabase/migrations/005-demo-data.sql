-- ============================================
-- NOVA Dental Studio — Migration 005
-- Realistic portfolio demo data
--
-- Prerequisites: migrations 001–004 applied.
-- This migration is idempotent and additive.
--
-- NOTE: The 3 seeded dentists (Sarah, Ahmed, Mohamed) from migration 003
-- are catalog entries without linked auth.users rows. To log in as a
-- doctor, create an auth.users row in the Supabase Auth dashboard and
-- ensure profiles.role = 'doctor' and dentists.user_id matches that
-- auth user's id. The demo accounts below are for patients/staff
-- who can be created via the login page signup.
-- ============================================

-- ============================================
-- 1. SAMPLE PATIENTS
-- ============================================
INSERT INTO patients (id, user_id, first_name, last_name, email, phone, status)
VALUES
  (gen_random_uuid(), NULL, 'Fatima', 'Al-Rashid', 'fatima.rashid@email.com', '+966 50 111 2222', 'active'),
  (gen_random_uuid(), NULL, 'Khalid', 'Hassan', 'khalid.hassan@email.com', '+966 50 222 3333', 'active'),
  (gen_random_uuid(), NULL, 'Layla', 'Mohamed', 'layla.mohamed@email.com', '+966 50 333 4444', 'active'),
  (gen_random_uuid(), NULL, 'Omar', 'Al-Saud', 'omar.alsaud@email.com', '+966 50 444 5555', 'active'),
  (gen_random_uuid(), NULL, 'Nour', 'Ahmed', 'nour.ahmed@email.com', '+966 50 555 6666', 'active'),
  (gen_random_uuid(), NULL, 'Youssef', 'Ali', 'youssef.ali@email.com', '+966 50 666 7777', 'active'),
  (gen_random_uuid(), NULL, 'Amina', 'Khan', 'amina.khan@email.com', '+966 50 777 8888', 'active'),
  (gen_random_uuid(), NULL, 'Mohammed', 'Tariq', 'mohammed.tariq@email.com', '+966 50 888 9999', 'active')
ON CONFLICT DO NOTHING;

-- ============================================
-- 2. SAMPLE APPOINTMENTS (current week)
-- ============================================
-- Helper: get the 3 dentist IDs
DO $$
DECLARE
  v_sarah UUID;
  v_ahmed UUID;
  v_mohamed UUID;
  v_patient_ids UUID[];
  v_i INT;
  v_date DATE;
  v_start TIME;
BEGIN
  SELECT id INTO v_sarah FROM dentists WHERE email = 'sarah.smith@novadental.com' LIMIT 1;
  SELECT id INTO v_ahmed FROM dentists WHERE email = 'ahmed.hassan@novadental.com' LIMIT 1;
  SELECT id INTO v_mohamed FROM dentists WHERE email = 'mohamed.ali@novadental.com' LIMIT 1;

  SELECT ARRAY_AGG(id) INTO v_patient_ids FROM patients;

  -- Today + next 14 days of sample appointments
  FOR v_i IN 0..13 LOOP
    v_date := CURRENT_DATE + v_i;
    -- Skip Fridays for schedule consistency
    IF extract(isodow FROM v_date) = 5 THEN CONTINUE; END IF;

    -- Sarah: morning slots (Orthodontics)
    IF v_i < 7 THEN
      INSERT INTO appointments (id, patient_id, dentist_id, service_id, date, start_time, end_time, status, treatment_type, notes, price, currency)
      SELECT
        gen_random_uuid(),
        v_patient_ids[1 + (v_i % array_length(v_patient_ids, 1))],
        v_sarah,
        (SELECT id FROM services WHERE name = 'Braces/Invisalign' LIMIT 1),
        v_date,
        (CASE v_i % 3
          WHEN 0 THEN '09:00'::time
          WHEN 1 THEN '10:30'::time
          WHEN 2 THEN '11:30'::time
        END),
        (CASE v_i % 3
          WHEN 0 THEN '10:00'::time
          WHEN 1 THEN '11:30'::time
          WHEN 2 THEN '12:30'::time
        END),
        CASE (v_i % 4)
          WHEN 0 THEN 'confirmed'
          WHEN 1 THEN 'pending'
          WHEN 2 THEN 'confirmed'
          ELSE 'in-progress'
        END,
        'Orthodontics consultation',
        'Routine orthodontic check-up',
        1500,
        'SAR'
      ON CONFLICT DO NOTHING;
    END IF;

    -- Ahmed: afternoon slots (Oral Surgery)
    IF v_i >= 2 AND v_i < 9 THEN
      INSERT INTO appointments (id, patient_id, dentist_id, service_id, date, start_time, end_time, status, treatment_type, notes, price, currency)
      SELECT
        gen_random_uuid(),
        v_patient_ids[1 + (v_i % array_length(v_patient_ids, 1))],
        v_ahmed,
        (SELECT id FROM services WHERE name = 'Wisdom Tooth Extraction' LIMIT 1),
        v_date,
        (CASE v_i % 3
          WHEN 0 THEN '14:00'::time
          WHEN 1 THEN '15:30'::time
          WHEN 2 THEN '16:00'::time
        END),
        (CASE v_i % 3
          WHEN 0 THEN '15:00'::time
          WHEN 1 THEN '16:30'::time
          WHEN 2 THEN '17:00'::time
        END),
        CASE (v_i % 4)
          WHEN 0 THEN 'confirmed'
          WHEN 1 THEN 'pending'
          WHEN 2 THEN 'completed'
          ELSE 'confirmed'
        END,
        'Oral surgery',
        'Wisdom tooth evaluation',
        300,
        'SAR'
      ON CONFLICT DO NOTHING;
    END IF;

    -- Mohamed: mixed slots (Cosmetic)
    IF v_i >= 4 AND v_i < 12 THEN
      INSERT INTO appointments (id, patient_id, dentist_id, service_id, date, start_time, end_time, status, treatment_type, notes, price, currency)
      SELECT
        gen_random_uuid(),
        v_patient_ids[1 + (v_i % array_length(v_patient_ids, 1))],
        v_mohamed,
        (SELECT id FROM services WHERE name = 'Teeth Whitening' LIMIT 1),
        v_date,
        (CASE v_i % 4
          WHEN 0 THEN '10:00'::time
          WHEN 1 THEN '11:00'::time
          WHEN 2 THEN '15:00'::time
          WHEN 3 THEN '16:30'::time
        END),
        (CASE v_i % 4
          WHEN 0 THEN '11:00'::time
          WHEN 1 THEN '12:00'::time
          WHEN 2 THEN '16:00'::time
          WHEN 3 THEN '17:30'::time
        END),
        CASE (v_i % 3)
          WHEN 0 THEN 'confirmed'
          WHEN 1 THEN 'pending'
          ELSE 'confirmed'
        END,
        'Cosmetic dentistry',
        'Professional teeth whitening',
        200,
        'SAR'
      ON CONFLICT DO NOTHING;
    END IF;
  END LOOP;
END;
$$;

-- ============================================
-- 3. SAMPLE NOTIFICATIONS (internal simulations)
-- ============================================
INSERT INTO notifications (id, user_id, type, title, message, is_read, related_id, created_at)
VALUES
  (gen_random_uuid(), NULL, 'appointment', 'New Appointment Request', 'New booking: Fatima Al-Rashid (2025-09-15 09:00) — General Check-up', false, (SELECT id FROM appointments ORDER BY created_at LIMIT 1), NOW() - INTERVAL '2 hours'),
  (gen_random_uuid(), NULL, 'appointment', 'New Appointment Request', 'New booking: Khalid Hassan (2025-09-15 14:00) — Wisdom Tooth Extraction', false, (SELECT id FROM appointments ORDER BY created_at LIMIT 1 OFFSET 1), NOW() - INTERVAL '1 hour'),
  (gen_random_uuid(), NULL, 'info', 'Schedule Reminder', 'Dr. Sarah Smith has 3 confirmed appointments today', false, NULL, NOW() - INTERVAL '30 minutes'),
  (gen_random_uuid(), NULL, 'success', 'Appointment Confirmed', 'Layla Mohamed confirmed her Teeth Whitening appointment', true, NULL, NOW() - INTERVAL '45 minutes'),
  (gen_random_uuid(), NULL, 'warning', 'Rescheduling', 'Omar Al-Saud requested to reschedule his appointment', false, NULL, NOW() - INTERVAL '2 hours'),
  (gen_random_uuid(), NULL, 'appointment', 'New Appointment Request', 'New booking: Nour Ahmed (2025-09-16 10:00) — Dental Implant', false, (SELECT id FROM appointments ORDER BY created_at LIMIT 1 OFFSET 2), NOW() - INTERVAL '5 hours'),
  (gen_random_uuid(), NULL, 'error', 'Cancellation', 'Youssef Ali cancelled his appointment', false, NULL, NOW() - INTERVAL '6 hours'),
  (gen_random_uuid(), NULL, 'info', 'Clinic Settings Updated', 'Working hours updated to Mon-Sat 09:00–18:00', true, NULL, NOW() - INTERVAL '1 day')
ON CONFLICT DO NOTHING;

-- ============================================
-- 4. SAMPLE GALLERY IMAGES
-- ============================================
INSERT INTO gallery_images (id, title, description, image_url, thumbnail_url, category, status, is_featured, created_at)
VALUES
  (gen_random_uuid(), 'Smile Transformation', 'Before and after cosmetic dentistry case', 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800', 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400', 'cosmetic', 'featured', true, NOW() - INTERVAL '2 days'),
  (gen_random_uuid(), 'Orthodontic Results', 'Clear aligner treatment completion', 'https://images.unsplash.com/photo-1607486924038-2b913d3bfa1a?w=800', 'https://images.unsplash.com/photo-1607486924038-2b913d3bfa1a?w=400', 'orthodontics', 'completed', true, NOW() - INTERVAL '3 days'),
  (gen_random_uuid(), 'Dental Implant', 'Single tooth implant restoration', 'https://images.unsplash.com/photo-1581614634862-2a1ea6e740b6?w=800', 'https://images.unsplash.com/photo-1581614634862-2a1ea6e740b6?w=400', 'restorative', 'featured', true, NOW() - INTERVAL '5 days'),
  (gen_random_uuid(), 'Deep Cleaning', 'Periodontal therapy session', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400', 'preventive', 'completed', false, NOW() - INTERVAL '7 days'),
  (gen_random_uuid(), 'Emergency Consultation', 'Urgent tooth pain treatment', 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800', 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400', 'restorative', 'completed', false, NOW() - INTERVAL '1 week')
ON CONFLICT DO NOTHING;

-- ============================================
-- 5. SAMPLE BLOCKED TIMES
-- ============================================
INSERT INTO blocked_times (id, doctor_id, start_time, end_time, reason, is_recurring, recurrence_rule)
SELECT
  gen_random_uuid(),
  id,
  '2025-09-20 13:00:00+03'::timestamptz,
  '2025-09-20 14:00:00+03'::timestamptz,
  'Lunch break',
  true,
  'weekly'
FROM dentists
WHERE email IN ('sarah.smith@novadental.com', 'ahmed.hassan@novadental.com', 'mohamed.ali@novadental.com')
ON CONFLICT DO NOTHING;

-- ============================================
-- 6. CLINIC SETTINGS UPDATE
-- ============================================
INSERT INTO clinic_settings (key, value, description)
VALUES ('slot_duration', '30', 'Default appointment slot duration in minutes')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- ============================================
-- 7. ADMIN DEMO INSTRUCTIONS
-- ============================================
-- To create a demo doctor account for login:
-- 1. In the Supabase Auth dashboard, create a new user with email
--    (e.g., doctor.demo@novadental.com) and a password.
-- 2. Set the user's raw_user_metadata to: {"role": "doctor", "first_name": "Demo", "last_name": "Doctor"}
-- 3. The trigger in migration 002 will create a profiles row with role 'doctor'.
--    If the trigger doesn't fire, manually insert into profiles:
--      INSERT INTO profiles (id, role, first_name, last_name)
--      VALUES ('<user-id>', 'doctor', 'Demo', 'Doctor');
-- 4. Update the dentists table to link this user:
--      UPDATE dentists SET user_id = '<user-id>'
--      WHERE email = 'sarah.smith@novadental.com';  -- or create a new dentist row
--
-- For a demo secretary account, follow the same steps with:
--   {"role": "secretary", "first_name": "Demo", "last_name": "Secretary"}
--
-- NOTE: All notifications in this app are internal simulations.
-- Payment is made at the clinic cashier.
-- WhatsApp, SMS, email, and external messaging are NOT connected.
