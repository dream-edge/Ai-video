-- Create participants table
CREATE TABLE IF NOT EXISTS participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  video_title TEXT NOT NULL,
  instagram_post_id TEXT NOT NULL UNIQUE,
  instagram_post_url TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Public can view participants"
  ON participants
  FOR SELECT
  TO public
  USING (true);

-- Create policy to allow authenticated users (admins) to insert
CREATE POLICY "Admins can insert participants"
  ON participants
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policy to allow authenticated users (admins) to update
CREATE POLICY "Admins can update participants"
  ON participants
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policy to allow authenticated users (admins) to delete
CREATE POLICY "Admins can delete participants"
  ON participants
  FOR DELETE
  TO authenticated
  USING (true);
