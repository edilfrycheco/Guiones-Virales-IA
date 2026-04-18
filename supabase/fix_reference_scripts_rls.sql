-- Run this in Supabase → SQL Editor → New query → Run
-- Fixes RLS policy to allow inserts from unauthenticated users (user_id = null)

DROP POLICY IF EXISTS "Users manage own reference scripts" ON reference_scripts;

-- Read: authenticated users see their own; anonymous can't see any
CREATE POLICY "reference_scripts_select"
  ON reference_scripts FOR SELECT
  USING (auth.uid() = user_id);

-- Insert: authenticated users set their own user_id; anonymous insert with null user_id
CREATE POLICY "reference_scripts_insert"
  ON reference_scripts FOR INSERT
  WITH CHECK (user_id IS NULL OR auth.uid() = user_id);

-- Update/Delete: only the owner
CREATE POLICY "reference_scripts_update"
  ON reference_scripts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "reference_scripts_delete"
  ON reference_scripts FOR DELETE
  USING (auth.uid() = user_id);
