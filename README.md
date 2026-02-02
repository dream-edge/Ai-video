# AI Videography Challenge Leaderboard

A real-time leaderboard application for an AI Videography competition, built with Next.js 14, Supabase, and GSAP.

## Features

-   **Live Leaderboard**: Real-time ranking of participants based on Instagram likes.
-   **Admin Dashboard**: Secure interface to add, edit, and delete participants.
-   **Animations**: Smooth staggered animations and interactions using GSAP.
-   **Security**: Authentication via Supabase and protected API routes/pages.

## Tech Stack

-   **Framework**: Next.js 14 (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **Database/Auth**: Supabase
-   **Animations**: GSAP (GreenSock Animation Platform)

## Setup Instructions

1.  **Clone the repository** and install dependencies:
    ```bash
    npm install
    ```

2.  **Environment Variables**:
    Create a `.env.local` file in the root directory with the following keys (see `.env.example` if available, or ask the admin):
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
    NEXT_PUBLIC_SITE_URL=http://localhost:3000
    ```

3.  **Supabase Setup**:
    -   Create a new project in Supabase.
    -   Go to the SQL Editor and run the contents of `supabase/schema.sql`.
    -   This will create the `participants` table and set up Row Level Security (RLS).
    -   Go to Authentication -> Settings and ensure Email auth is enabled.
    -   Create a user in Supabase Authentication to act as the Admin.

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to see the leaderboard.
    Open [http://localhost:3000/admin/login](http://localhost:3000/admin/login) to access the admin panel.

## Deployment

This project is optimized for deployment on **Vercel**.

1.  Push code to GitHub.
2.  Import project into Vercel.
3.  Add the Environment Variables in the Vercel dashboard.
4.  Deploy!

## Animations

-   **Hero Section**: Staggered fade-in on load.
-   **Cards**: Staggered entry using ScrollTrigger.
-   **Interactions**: Hover lift effects and heart animation.
