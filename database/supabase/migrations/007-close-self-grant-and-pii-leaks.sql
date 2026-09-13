-- ============================================
-- 007-close-self-grant-and-pii-leaks.sql
-- Closes findings from the second full-project review:
--   1. profiles self-INSERT ("Authenticated users can insert own profile")
--      let any user mint a profiles row with an arbitrary role, including
--      admin. Dropped: profiles are now created only by the
--      handle_new_staff_profile trigger (SECURITY DEFINER, bypasses RLS),
--      the patient trigger, or an admin/service_role.
--   2. profiles self-UPDATE allowed changing one's own role to admin
--      (USING without WITH CHECK). Column privileges now forbid the
--      authenticated role from touching profiles.role; admins change
--      roles via service_role (dashboard/SQL).
--   3. Public dentists RLS policy exposed staff PII columns
--      (email, phone, license_number) to anonymous direct PostgREST
--      selects. Column privileges now hide them from anon; the public
--      catalog keeps working for display columns.
-- Idempotent: safe to run more than once.
-- ============================================

-- --------------------------------------------
-- 1. No self-inserted profiles
-- --------------------------------------------
DROP POLICY IF EXISTS "Authenticated users can insert own profile" ON profiles;

-- --------------------------------------------
-- 2. Role column is admin/service_role only
-- --------------------------------------------
REVOKE UPDATE (role) ON profiles FROM authenticated;
REVOKE UPDATE (role) ON profiles FROM anon;

-- --------------------------------------------
-- 3. Staff PII columns hidden from anonymous API users
-- --------------------------------------------
REVOKE SELECT (email, phone, license_number) ON dentists FROM anon;
