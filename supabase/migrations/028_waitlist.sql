-- 028: Create waitlist table for pre-launch email capture

CREATE TABLE IF NOT EXISTS waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Allow service role full access, anon can insert only
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON waitlist
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Anon can insert" ON waitlist
  FOR INSERT WITH CHECK (true);
