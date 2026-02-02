-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  theme TEXT NOT NULL DEFAULT 'Post AGI',
  description TEXT NOT NULL DEFAULT 'A space where artificial intelligence and Nepali culture come together!',
  target_date TIMESTAMPTZ NOT NULL DEFAULT '2026-03-01 00:00:00+00',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert default row if not exists
INSERT INTO settings (id, theme, description, target_date)
VALUES (1, 'Post AGI', 'A space where artificial intelligence and Nepali culture come together! The AI Photography Challenge Leaderboard celebrates the most creative takes on Imagine उखान टुक्का, blending tradition with the magic of technology.', '2026-03-01 00:00:00+00')
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Public can view settings"
  ON settings FOR SELECT
  TO public
  USING (true);

-- Allow authenticated (admin) update
CREATE POLICY "Admins can update settings"
  ON settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
