# Supabase Database Setup Guide

This app uses Supabase PostgreSQL for all database operations.

## Prerequisites

- A Supabase account and project
- Node.js and npm installed
- `DATABASE_URL` environment variable set

## Setup Steps

### 1. Create Supabase Project and Get Connection String

1. Go to [supabase.com](https://supabase.com) and sign in
2. Create a new project (choose a strong password)
3. Wait for the project to be provisioned
4. Go to **Project Settings** > **Database**
5. Under "Connection string", select **Transaction pooler** mode
6. Copy the connection string (it should look like):
   - `postgresql://postgres.YOUR-REF:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`
7. Go to **Project Settings** > **API** 
8. Copy your `Project URL` (VITE_SUPABASE_URL)
9. Copy your `anon public` key (VITE_SUPABASE_ANON_KEY)

### 2. Initialize Database Schema

Run the SQL migration to create the `pages` table with seed data:

\`\`\`bash
# Option A: Using Supabase SQL Editor (Recommended)
# 1. Go to your Supabase Dashboard > SQL Editor
# 2. Copy the contents of server/init-db.sql
# 3. Paste and run in the SQL Editor

# Option B: Using psql (if installed)
psql $DATABASE_URL < server/init-db.sql

# Option C: Using the migration script
npm run migrate
\`\`\`

### 3. Set Environment Variables

Create a `.env` file in the project root:

\`\`\`bash
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
VITE_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
VITE_SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
\`\`\`

### 4. Install Dependencies and Run

\`\`\`bash
npm install
npm run migrate  # Initialize database schema
npm run dev:all  # Start both frontend and backend
\`\`\`

## Supabase Features

- **Real-time subscriptions**: Enable real-time updates for your tables
- **Row Level Security (RLS)**: Add security policies to your tables
- **Storage**: Use Supabase Storage for file uploads
- **Edge Functions**: Already configured in `supabase/functions/`

## Connection Pooling

Supabase provides connection pooling through PgBouncer. The connection string format is:

**Transaction pooler (Recommended):**
\`\`\`
postgresql://postgres.YOUR-REF:[YOUR-PASSWORD]@aws-0-region.pooler.supabase.com:6543/postgres
\`\`\`

**Direct connection (for migrations only):**
\`\`\`
postgresql://postgres:[YOUR-PASSWORD]@db.YOUR-REF.supabase.co:5432/postgres
\`\`\`

Note: Use port `6543` for pooled connections and `5432` for direct connections.
