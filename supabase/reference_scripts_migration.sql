-- Run this SQL in your Supabase SQL Editor
-- Dashboard → SQL Editor → New query → paste this → Run

CREATE TABLE IF NOT EXISTS reference_scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  creator_name TEXT,
  platform TEXT NOT NULL DEFAULT 'instagram',
  topic TEXT NOT NULL,
  niche TEXT,
  estimated_views INT,
  script_content TEXT NOT NULL,
  hook_type TEXT,
  framework TEXT,
  style_analysis JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE reference_scripts ENABLE ROW LEVEL SECURITY;

-- Policy: each user manages only their own scripts
CREATE POLICY "Users manage own reference scripts"
  ON reference_scripts
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Index for fast user lookups
CREATE INDEX IF NOT EXISTS idx_reference_scripts_user_id
  ON reference_scripts (user_id, created_at DESC);
