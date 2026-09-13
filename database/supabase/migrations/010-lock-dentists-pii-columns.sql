-- ============================================
-- 010-lock-dentists-pii-columns.sql
-- Closes PII leak: anonymous PostgREST could still SELECT
-- dentists.email / phone / license_number despite 007.
-- Root cause: 007 used REVOKE SELECT (col) but anon still
-- had table-level SELECT; column REVOKE alone doesn't hide
-- when USING policies pass. Fix: revoke table SELECT from anon
-- then grant ONLY display columns.
-- Also ensures direct anon INSERT to appointments is blocked
-- (RLS already does, but re-affirm by revoking).
-- Idempotent — run once in SQL Editor.
-- ============================================

-- 1) Dentists: anonymous may only read display columns
REVOKE ALL ON TABLE dentists FROM anon;
GRANT SELECT (id, first_name, last_name, specialty, bio, avatar_url, rating, patient_count, is_active, created_at, updated_at, qualifications, schedule, room_number) ON TABLE dentists TO anon;
GRANT SELECT ON TABLE dentists TO authenticated;

-- 2) Appointments: no direct anon insert (must go via book_appointment RPC)
REVOKE INSERT ON TABLE appointments FROM anon;
-- keep authenticated RLS-gated insert (policies remain)

-- 3) Patients PII: anon has no business reading patients at all
REVOKE ALL ON TABLE patients FROM anon;

-- 4) Profiles: anon has no read (already, but re-affirm)
REVOKE ALL ON TABLE profiles FROM anon;

-- Verify: anon should now get 401/empty on email column
-- SELECT email FROM dentists should return: permission denied for column email
