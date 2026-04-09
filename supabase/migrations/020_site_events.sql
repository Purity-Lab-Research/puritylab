-- Site events table for tracking user activity (mirrors GA4 events locally)
CREATE TABLE IF NOT EXISTS site_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name text NOT NULL,
  properties jsonb DEFAULT '{}',
  page_path text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_site_events_name ON site_events(event_name);
CREATE INDEX idx_site_events_created ON site_events(created_at DESC);
CREATE INDEX idx_site_events_name_created ON site_events(event_name, created_at DESC);

-- Enable RLS but allow inserts from anon (public tracking) and reads from service role
ALTER TABLE site_events ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert events (public tracking endpoint)
CREATE POLICY "Allow public insert" ON site_events
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Only service role can read (admin dashboard)
CREATE POLICY "Allow service role read" ON site_events
  FOR SELECT TO service_role
  USING (true);

-- Auto-cleanup: remove events older than 90 days (run periodically)
-- For now we'll handle this in the API if needed
