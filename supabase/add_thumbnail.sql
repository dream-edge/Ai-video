-- Add thumbnail_url column to participants table
ALTER TABLE participants ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
