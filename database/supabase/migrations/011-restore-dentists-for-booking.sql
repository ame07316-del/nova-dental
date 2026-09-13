-- ============================================
-- 011-restore-dentists-for-booking.sql
-- Hotfix: 010 broke public catalog ( anon could not SELECT
-- even allowed columns → "permission denied for table dentists"
-- with 42501, so Booking step 3 shows no dates).
-- Root cause: column-level GRANT alone is not enough for
-- PostgREST anon to query the table.
-- Fix: restore full anon SELECT on dentists so booking works.
-- PII via direct REST will be exposed again until a proper
-- public view is created — acceptable for now to keep booking
-- functional. Follow-up: create view dentists_public.
-- Idempotent — run once in SQL Editor.
-- ============================================

GRANT SELECT ON TABLE dentists TO anon;
GRANT SELECT ON TABLE dentists TO authenticated;

-- Keep patients/profiles locked (do not restore those)
-- REVOKE already done in 010, keep it
