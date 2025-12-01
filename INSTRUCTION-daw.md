# Pano App - Complete Instructions

A full-featured interactive panorama viewer and admin dashboard with Neon PostgreSQL backend.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Running the App](#running-the-app)
6. [Features](#features)
7. [Admin Dashboard](#admin-dashboard)
8. [API Reference](#api-reference)
9. [Database Schema](#database-schema)
10. [Troubleshooting](#troubleshooting)
11. [Deployment](#deployment)

---

## Quick Start

For experienced developers:

\`\`\`bash
# 1. Clone and install
git clone <repo-url>
cd pano
npm install

# 2. Set environment variables (copy from .env.example or use existing .env)
export NEON_DATABASE_URL="your-neon-connection-string"

# 3. Initialize database
npm run migrate

# 4. Run app (both server and frontend)
npm run dev:all
\`\`\`

Then open http://localhost:5174

---

## Prerequisites

### Required
- **Node.js** 18+ ([download](https://nodejs.org/))
- **npm** 9+ (comes with Node.js)
- **Neon Account** ([sign up free](https://console.neon.tech))

### Optional
- Git for version control
- Docker for containerization
- Postman or curl for API testing

---

## Installation

### Step 1: Clone the Repository

\`\`\`bash
git clone https://github.com/monpalapas/pano.git
cd pano
\`\`\`

### Step 2: Install Dependencies

\`\`\`bash
npm install
\`\`\`

This installs all required packages including:
- React 18 & React DOM
- Express.js (backend server)
- PostgreSQL client (pg)
- Leaflet (mapping library)
- Tailwind CSS (styling)
- Vite (build tool)

### Step 3: Verify Installation

\`\`\`bash
npm run typecheck  # Check TypeScript
npm run lint       # Check code quality
\`\`\`

---

## Configuration

### Step 1: Get Neon Connection String

1. Go to [console.neon.tech](https://console.neon.tech)
2. Sign in or create account
3. Create a new project
4. Copy the connection string (format: `postgresql://user:password@host/db?sslmode=require`)

### Step 2: Set Environment Variables

Create or update `.env` file in project root:

\`\`\`bash
# Neon Database Connection
NEON_DATABASE_URL=postgresql://neondb_owner:your_password@ep-xxxxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# Supabase (for other features)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Google Drive (for image loading)
GOOGLE_DRIVE_API_KEY=your-api-key

# Optional: Custom ports
PORT=9999  # Backend server (default)
VITE_PORT=5174  # Frontend (default)
\`\`\`

### Step 3: Initialize Database

Run the migration script to create tables and seed data:

\`\`\`bash
npm run migrate
\`\`\`

Expected output:
\`\`\`
Connecting to Neon...
✓ Connected
Running migration...
✓ Migration complete
✓ Table "pages" contains 2 rows:
  - login: "Login Page"
  - admin: "Admin Panel"
\`\`\`

---

## Running the App

### Development Mode (Recommended)

Run both server and frontend together:

\`\`\`bash
npm run dev:all
\`\`\`

This opens:
- Frontend: http://localhost:5174
- Backend: http://localhost:9999

### Individual Services

Run frontend only:
\`\`\`bash
npm run dev
\`\`\`

Run backend only:
\`\`\`bash
npm run server
\`\`\`

Run backend with auto-reload on file changes:
\`\`\`bash
npm run server:dev
\`\`\`

### Build for Production

\`\`\`bash
npm run build
\`\`\`

Creates `dist/` folder with optimized frontend build.

### Production Deployment

\`\`\`bash
npm run start
\`\`\`

Builds and runs the production server (backend + frontend).

---

## Features

### 🎨 Panorama Viewer
- Interactive 360° panorama visualization
- **Drag to Pan**: Click and drag to explore the image
- **Scroll to Zoom**: Mouse wheel or trackpad for zoom
- **Touch Support**: Swipe on mobile devices
- **Location Selection**: Dropdown to switch between locations
- Three sample locations:
  - Site A - Main Plaza
  - Site B - Emergency Center
  - Site C - Evacuation Point

### 🗺️ Maps
- **Base Map**: Street, satellite, and terrain views
- **Elevation Map**: Topographic visualization
- **Evacuation Routes**: Pre-planned evacuation paths
- **Hazard Zones**: Risk area mapping
- **Boundary Maps**: Purok, Barangay, Municipal levels
- **Interactive Features**: Layer toggling, zoom controls

### 📊 Dashboard
- **Image Gallery**: Browse photos from locations
- **Real-time Data**: Fetches from Google Drive
- **Responsive Design**: Works on desktop, tablet, mobile

### 🔐 Authentication
- **Login System**: Password-protected admin access
- **Session Management**: Browser localStorage
- **Logout**: Clear session and return to home

### ⚙️ Admin Dashboard
- **Pages Management**: Edit login/admin content
- **Database Info**: Monitor database structure
- **App Settings**: View configuration
- **Gradient Header**: Professional UI
- **Tab Navigation**: Organized interface

---

## Admin Dashboard

### Accessing Admin Panel

1. Open http://localhost:5174
2. Click **LOGIN** in sidebar
3. Enter any password (demo mode)
4. Click **ADMIN** in sidebar

### Pages Tab

Edit page content directly in the database:

\`\`\`
1. Select page from list
2. Click "Edit"
3. Modify Title and Content
4. Click "Save"
5. Changes appear immediately app-wide
\`\`\`

### Database Tab

Monitor your Neon database:

- **PostgreSQL Version**: View current version
- **Table Count**: Number of tables in database
- **Table List**: All tables with public schema
- **Status**: Connection health indicator

### Settings Tab

View current application configuration:

- **App Name**: Pano Dashboard
- **Server Port**: 9999
- **Environment**: development/production
- **Backend URL**: http://localhost:9999
- **Status**: Running status

### Logout

Click the **Logout** button in the top-right corner to:
- Clear session
- Return to home view
- Remove admin access

---

## API Reference

All endpoints are at `http://localhost:9999`

### Health Check

\`\`\`bash
GET /api/health
\`\`\`

Response:
\`\`\`json
{ "ok": true }
\`\`\`

### Get Single Page

\`\`\`bash
GET /api/page?type=login
GET /api/page?type=admin
\`\`\`

Response:
\`\`\`json
{
  "success": true,
  "page": {
    "id": 1,
    "type": "login",
    "title": "Login Page",
    "content": "Welcome to Pano Dashboard..."
  }
}
\`\`\`

### List All Pages

\`\`\`bash
GET /api/pages
\`\`\`

Response:
\`\`\`json
{
  "success": true,
  "pages": [
    {
      "id": 1,
      "type": "login",
      "title": "Login Page",
      "created_at": "2025-12-01T00:00:00Z",
      "updated_at": "2025-12-01T00:00:00Z"
    }
  ]
}
\`\`\`

### Update Page

\`\`\`bash
PUT /api/page/:type
Content-Type: application/json

{
  "title": "New Title",
  "content": "New content here"
}
\`\`\`

Response:
\`\`\`json
{
  "success": true,
  "page": { /* updated page */ }
}
\`\`\`

### Get Database Info

\`\`\`bash
GET /api/db-info
\`\`\`

Response:
\`\`\`json
{
  "success": true,
  "version": "PostgreSQL 15.2",
  "tableCount": 3,
  "tables": ["pages", "users", "settings"]
}
\`\`\`

### Execute SQL Query (Dev Only)

\`\`\`bash
POST /api/query
Content-Type: application/json

{
  "sql": "SELECT * FROM pages",
  "params": []
}
\`\`\`

Response:
\`\`\`json
{
  "rows": [ /* query results */ ],
  "rowCount": 2
}
\`\`\`

---

## Database Schema

### Pages Table

\`\`\`sql
CREATE TABLE pages (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50) UNIQUE NOT NULL,  -- 'login', 'admin'
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### Sample Data

\`\`\`sql
INSERT INTO pages VALUES
  (1, 'login', 'Login Page', 'Welcome to Pano...', now(), now()),
  (2, 'admin', 'Admin Panel', 'Admin Dashboard...', now(), now());
\`\`\`

### Adding Custom Tables

Connect to Neon and run:

\`\`\`sql
CREATE TABLE my_table (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

---

## Troubleshooting

### Issue: "NEON_DATABASE_URL not set"

**Solution:**
\`\`\`bash
# Check if .env file exists
ls -la .env

# Set environment variable
export NEON_DATABASE_URL="postgresql://..."

# Or add to .env and restart
echo "NEON_DATABASE_URL=postgresql://..." >> .env
\`\`\`

### Issue: "Port 9999 already in use"

**Solution:**
\`\`\`bash
# Kill process on port 9999
lsof -ti:9999 | xargs kill -9

# Or use different port
PORT=9998 npm run server
\`\`\`

### Issue: "Connection refused to localhost:9999"

**Solution:**
\`\`\`bash
# Make sure server is running
npm run server

# Check if server is listening
netstat -an | grep 9999

# View server logs for errors
npm run server:dev
\`\`\`

### Issue: "Failed to load page from database"

**Solution:**
\`\`\`bash
# Run migration to create tables
npm run migrate

# Check database connection
node -e "
import('pg').then(m => {
  const { Client } = m;
  const client = new Client({ 
    connectionString: process.env.NEON_DATABASE_URL 
  });
  client.connect().then(() => {
    console.log('✓ Connected to Neon');
    return client.end();
  }).catch(err => {
    console.error('✗ Connection failed:', err.message);
  });
});
"
\`\`\`

### Issue: App falls back to public files instead of database

**Reasons:**
- Server is offline
- Database query failed
- Incorrect API endpoint

**Solution:**
- Verify server is running: `npm run server`
- Check network tab in browser DevTools
- View server logs for errors

---

## Deployment

### Deploy to Vercel (Frontend Only)

1. Push code to GitHub
2. Connect at [vercel.com](https://vercel.com)
3. Set `VITE_` environment variables
4. Deploy

### Deploy to Railway (Full Stack)

1. Connect GitHub repo at [railway.app](https://railway.app)
2. Add Neon PostgreSQL plugin
3. Set `NEON_DATABASE_URL` environment
4. Deploy

Railway automatically:
- Detects Node.js project
- Installs dependencies
- Runs migrations
- Starts server

### Deploy to Docker

Create `Dockerfile`:

\`\`\`dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 9999

CMD ["npm", "run", "start"]
\`\`\`

Build and run:

\`\`\`bash
docker build -t pano-app .
docker run -p 9999:9999 \
  -e NEON_DATABASE_URL="postgresql://..." \
  pano-app
\`\`\`

### Environment Variables for Production

\`\`\`env
# Required
NEON_DATABASE_URL=postgresql://user:pass@host/db?sslmode=require

# Optional
NODE_ENV=production
PORT=9999

# Vite
VITE_API_URL=https://api.yourdomain.com
\`\`\`

### Pre-deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Build succeeds: `npm run build`
- [ ] Tests pass: `npm run lint`
- [ ] No console errors in DevTools
- [ ] Tested on multiple browsers
- [ ] Images load correctly
- [ ] Admin panel accessible
- [ ] Database connection verified
- [ ] CORS configured if needed

---

## Project Structure

\`\`\`
pano/
├── src/
│   ├── components/
│   │   ├── AdminPanel.tsx          # Admin dashboard
│   │   ├── LoginPage.tsx           # Login form
│   │   ├── PanoramaViewer.tsx      # 360° viewer
│   │   ├── ImageGallery.tsx        # Photo gallery
│   │   ├── InteractiveMap.tsx      # Map component
│   │   ├── Sidebar.tsx             # Navigation
│   │   └── TopBar.tsx              # Header
│   ├── config/
│   │   └── driveFolders.ts         # Google Drive config
│   ├── utils/
│   │   └── driveImageLoader.ts     # Image fetching
│   ├── App.tsx                      # Main app
│   ├── main.tsx                     # Entry point
│   └── index.css                    # Global styles
├── server/
│   ├── index.js                     # Express server
│   ├── migrate.js                   # Database migration
│   └── init-db.sql                  # SQL schema
├── public/
│   ├── login.txt                    # Fallback login content
│   └── admin.txt                    # Fallback admin content
├── package.json                     # Dependencies
├── .env                             # Environment variables
├── vite.config.ts                   # Vite config
├── tsconfig.json                    # TypeScript config
└── tailwind.config.js               # Tailwind config
\`\`\`

---

## Available Scripts

\`\`\`bash
# Development
npm run dev              # Frontend dev server (5174)
npm run server          # Backend server (9999)
npm run server:dev      # Backend with auto-reload
npm run dev:all         # Both server + frontend together

# Database
npm run migrate         # Initialize database schema

# Production
npm run build           # Build for production
npm run start           # Build + run server
npm run preview         # Preview production build

# Code Quality
npm run lint            # Run ESLint
npm run typecheck       # Check TypeScript

# Utilities
npm audit fix           # Fix security vulnerabilities
\`\`\`

---

## Support & Resources

### Documentation Files
- `README.md` - Project overview
- `NEON_SETUP.md` - Neon database setup
- `ADMIN_FEATURES.md` - Admin panel features
- `MIGRATION_STATUS.md` - Migration info
- `server/README.md` - Server documentation

### External Resources
- [Neon Documentation](https://neon.tech/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Leaflet Maps](https://leafletjs.com)
- [Express.js](https://expressjs.com)
- [PostgreSQL Docs](https://www.postgresql.org/docs)

### Community
- GitHub Issues: Report bugs or request features
- Email: contact@example.com

---

## License

This project is licensed under the MIT License.

---

## Quick Reference

| Task | Command |
|------|---------|
| Start everything | `npm run dev:all` |
| Just frontend | `npm run dev` |
| Just backend | `npm run server` |
| Setup database | `npm run migrate` |
| Build for prod | `npm run build` |
| Run in prod | `npm run start` |
| Check code | `npm run lint` |
| Check types | `npm run typecheck` |
| Fix security | `npm audit fix` |

---

**Last Updated:** December 1, 2025  
**Version:** 1.0.0
