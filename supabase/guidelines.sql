-- Create guidelines table
CREATE TABLE IF NOT EXISTS public.guidelines (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert default guidelines for AI Videography
INSERT INTO public.guidelines (content, display_order, is_active) VALUES
('Each participant can submit only one video aligned with the theme.', 1, true),
('Public Voting: Likes and shares contribute to scoring. (1 reaction = 2 points, 1 share = 5 points).', 2, true),
('Participants must like and follow the official KEC LITE 2082 Facebook page.', 3, true),
('Prompt Length: Must not exceed 55–65 words.', 4, true),
('Videos with nudity, vulgarity, explicit contents or hatred will be disqualified.', 5, true),
('The organizing committee may ask for verification of the generated video.', 6, true),
('Participants must share their video publicly from the official page with the hashtags: #keclite #keclite2082 #aivideography.', 7, true),
('Generated videos and prompts must align with the theme: Imagine उखान टुक्का!', 8, true);

-- Enable Row Level Security
ALTER TABLE public.guidelines ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access" ON public.guidelines
    FOR SELECT USING (is_active = true);

-- Create policy for authenticated insert/update/delete
CREATE POLICY "Allow authenticated insert" ON public.guidelines
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON public.guidelines
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated delete" ON public.guidelines
    FOR DELETE TO authenticated USING (true);
