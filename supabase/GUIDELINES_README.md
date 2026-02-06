# Guidelines Database Setup

## Running the SQL Migration

To enable the guidelines feature with database persistence, you need to run the guidelines SQL migration in your Supabase database.

### Option 1: Supabase Dashboard (Recommended)

1. Open your Supabase project dashboard
2. Go to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of `guidelines.sql`
5. Click **Run** to execute the migration

### Option 2: Supabase CLI

If you have the Supabase CLI installed:

```bash
supabase db push
```

### What This Creates

The SQL migration creates:

- **`guidelines` table** with columns:
  - `id`: Auto-incrementing primary key
  - `content`: The guideline text
  - `display_order`: Order of display (for sorting)
  - `is_active`: Toggle to show/hide guidelines
  - `created_at`, `updated_at`: Timestamps

- **8 default guidelines** pre-populated for the AI Videography competition

- **Row Level Security (RLS)** policies:
  - Public read access (for main page display)
  - Authenticated write access (for admin panel)

### Next Steps

After running the SQL, you'll need to:

1. Create API routes to fetch/save guidelines
2. Update `GuidelinesForm.tsx` to connect to the API
3. Update `Guidelines.tsx` to load from the database

For now, the guidelines are hardcoded in the components and work without the database.
