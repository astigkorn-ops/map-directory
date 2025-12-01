# Pano - Interactive Panorama Dashboard

## Overview

Pano is a full-featured interactive panorama viewer and disaster risk reduction management dashboard for MDRRMO Pio Duran. The application provides 360° panorama visualization, multi-layer interactive mapping with evacuation routes and hazard zones, Supabase-based panorama management with manual upload capability, and a comprehensive admin control panel. Built with React + TypeScript frontend, Express.js backend, and Supabase PostgreSQL database for content management.

## Recent Changes (December 2025)

- **Bug Fix**: Fixed critical toFixed() error when editing map configs, map pages, and panoramas by adding proper Number() conversion for database values (PostgreSQL returns numeric types as strings)
- **Admin Panel Modular Architecture**: Created reusable tab components in `src/components/admin/`:
  - `types.ts`: Shared TypeScript interfaces (Page, MapPage, Panorama, MapConfig, SidebarButton, etc.)
  - `PagesTab.tsx`: System pages and map pages management
  - `DatabaseTab.tsx`: File upload and spatial data management
  - `SidebarTab.tsx`: Sidebar button configuration
  - `PanoramasTab.tsx`: 360 panorama management
  - `MapConfigTab.tsx`: Interactive map settings
  - `SettingsTab.tsx`: Theme and app configuration
  - `index.ts`: Barrel exports for clean imports
- **Panorama Management System**: Replaced Google Drive-based panorama fetching with Supabase-based manual upload system
- **Admin Panel Panoramas Tab**: Added dedicated tab for CRUD operations on panorama images
- **Panorama API Endpoints**: Full REST API for panorama management (GET, POST, PUT, DELETE)
- **Database Schema**: Added `panoramas` table to store panorama metadata (name, description, image_url, thumbnail_url, is_active, order_index)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18.3.1 with TypeScript and Vite 7.2.6 as the build tool

The frontend uses a component-based architecture with the following structure:

- **Main Application Shell** (`App.tsx`): Orchestrates navigation between views (panorama, maps, galleries, admin panel, login)
- **View Components**: Separate components for each major feature:
  - `PanoramaGallery`: 360° image viewer using Pannellum library
  - `InteractiveMap`: Multi-layer mapping with Leaflet.js for evacuation routes, hazard zones, and boundary maps
  - `ImageGallery`: Grid-based image display from Google Drive
  - `AdminPanel`: Tabbed admin dashboard for content and database management
  - `LoginPage`: Authentication interface
- **Layout Components**: `Sidebar` for navigation, `TopBar` for branding
- **Styling**: Tailwind CSS with custom gradient backgrounds and glassmorphism effects

**State Management**: Local component state with React hooks (useState, useEffect, useRef). No global state library used - navigation and authentication state passed via props.

**Client-Side Routing**: View switching managed through state in App.tsx rather than a routing library. Views include: panorama, basemap, elevation, evacuation, hazards, purok, barangay, municipal, interactive, login, and admin.

### Backend Architecture

**Server Framework**: Express.js running on port 9999 (configurable)

**API Endpoints**:
- `GET /api/health` - Health check endpoint
- `GET /api/page?type={login|admin}` - Fetch page content from database by type
- `PUT /api/page/:type` - Update page content (admin feature)
- `POST /api/query` - Execute arbitrary SQL queries (development/admin tool)
- `GET /api/pages` - List all pages with metadata
- `GET /api/db-info` - Database information and table listing
- `GET /api/panoramas` - Fetch all active panoramas for public gallery
- `GET /api/panoramas/admin` - Fetch all panoramas for admin management (includes inactive)
- `POST /api/panoramas` - Create a new panorama with metadata
- `PUT /api/panoramas/:id` - Update panorama metadata and visibility
- `DELETE /api/panoramas/:id` - Remove a panorama from the database

**Database Client**: `pg` (node-postgres) for direct PostgreSQL connections

**Environment Configuration**: dotenv for environment variable management. Primary variable: `NEON_DATABASE_URL` for database connection string.

**Proxy Setup**: Vite dev server proxies `/api/*` requests to Express backend running on port 3001 (configurable in vite.config.ts)

### Data Storage

**Primary Database**: Supabase PostgreSQL (with real-time and auth features)

**Database Schema**:
- `pages` table: Stores dynamic content for login and admin pages
  - Fields: id (SERIAL PRIMARY KEY), type (VARCHAR UNIQUE), title (VARCHAR), content (TEXT), created_at, updated_at
  - Current page types: 'login', 'admin'
- `panoramas` table: Stores panorama image metadata for the 360° gallery
  - Fields: id (SERIAL PRIMARY KEY), name (VARCHAR), description (TEXT), image_url (VARCHAR), thumbnail_url (VARCHAR), is_active (BOOLEAN), order_index (INTEGER), created_at, updated_at

**Migration System**: Custom migration script (`server/migrate.js`) reads `server/init-db.sql` and initializes database schema with seed data

**Fallback Strategy**: If database connection fails, frontend falls back to static files in `public/` directory (admin.txt, login.txt)

**Session Storage**: localStorage used for authentication state (simple password-based auth, no JWT/session tokens)

### Authentication & Authorization

**Authentication Model**: Simple password-based authentication without user database

- Login flow: User enters password → Frontend validates → Sets logged-in state in localStorage → Navigates to admin view
- No server-side session validation
- Logout: Clears localStorage and returns to home view

**Security Considerations**: Current implementation is minimal - suitable for internal tools or development. Production use would require proper authentication (JWT, OAuth, or similar).

### External Dependencies

**Google Drive Integration**:
- Supabase Edge Functions serve as proxy for Google Drive API
- Function: `fetch-drive-images` retrieves image lists from specific Drive folders
- API Key stored in Supabase environment: `GOOGLE_DRIVE_API_KEY`
- Drive folder IDs configured in `src/config/driveFolders.ts`
- Image rendering: Uses Google Drive thumbnail URLs (`drive.google.com/thumbnail?id={fileId}&sz=w{size}`)

**Mapping Libraries**:
- **Leaflet.js 1.9.4**: Core mapping functionality with tile layers
- **leaflet-easybutton**: Custom map controls
- **leaflet-omnivore**: KML/CSV file parsing for spatial data
- Base map tiles from OpenStreetMap and other tile providers
- Custom markers fixed via CDN (Cloudflare) due to Leaflet webpack issues

**Panorama Viewer**:
- **Pannellum 2.5.6**: Standalone JavaScript panorama viewer
- Supports equirectangular panoramic images
- Features: Mouse drag, scroll zoom, touch gestures
- Loaded via global window object (not bundled)

**UI Components**:
- **lucide-react**: Icon library for modern UI icons
- Custom styled components with Tailwind utility classes
- No component library (Material-UI, Chakra, etc.) - all custom components

**Development Tools**:
- **Concurrently**: Runs Vite dev server and Express backend simultaneously (`npm run dev`)
- **ESLint + TypeScript ESLint**: Code linting with React hooks rules
- **PostCSS + Autoprefixer**: CSS processing for Tailwind

**Deployment Considerations**:
- Supabase edge functions require deployment to Supabase project
- Neon database requires connection string configuration
- Environment variables needed: `DATABASE_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- Build command: `npm run build` (outputs to `dist/`)
- Production server: Serves static files + Express API
