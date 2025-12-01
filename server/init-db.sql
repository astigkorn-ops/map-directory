-- Create pages table for login and admin content
CREATE TABLE IF NOT EXISTS pages (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create map_pages table for public-facing map pages
CREATE TABLE IF NOT EXISTS map_pages (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  is_published BOOLEAN DEFAULT false,
  layers TEXT[] DEFAULT '{}',
  center_lat DECIMAL(10, 8) DEFAULT 13.0,
  center_lng DECIMAL(11, 8) DEFAULT 123.5,
  zoom_level INTEGER DEFAULT 12,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create spatial_files table for KML, GeoJSON, CSV files
CREATE TABLE IF NOT EXISTS spatial_files (
  id SERIAL PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  file_size INTEGER,
  geojson_data JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_settings table for app configuration
CREATE TABLE IF NOT EXISTS user_settings (
  id SERIAL PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  permissions JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create users table for RBAC
CREATE TABLE IF NOT EXISTS rbac_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role_id INTEGER REFERENCES roles(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create audit log table
CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES rbac_users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  resource VARCHAR(100),
  details JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create sidebar_buttons table for custom menu items
CREATE TABLE IF NOT EXISTS sidebar_buttons (
  id SERIAL PRIMARY KEY,
  button_id VARCHAR(50) UNIQUE NOT NULL,
  label VARCHAR(100) NOT NULL,
  folder_id VARCHAR(255) NOT NULL,
  source_type VARCHAR(10) DEFAULT 'drive',
  is_enabled BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create panoramas table for 360° panoramic images
CREATE TABLE IF NOT EXISTS panoramas (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create interactive_map_configs table
CREATE TABLE IF NOT EXISTS interactive_map_configs (
  id SERIAL PRIMARY KEY,
  config_name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  default_center_lat DECIMAL(10, 8) DEFAULT 13.037063,
  default_center_lng DECIMAL(11, 8) DEFAULT 123.458907,
  default_zoom INTEGER DEFAULT 14,
  max_zoom INTEGER DEFAULT 19,
  min_zoom INTEGER DEFAULT 1,
  tile_layer_url VARCHAR(500) DEFAULT 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  tile_layer_attribution TEXT DEFAULT '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  enable_location_marker BOOLEAN DEFAULT true,
  enable_reference_circle BOOLEAN DEFAULT true,
  reference_circle_radius INTEGER DEFAULT 1000,
  reference_circle_color VARCHAR(20) DEFAULT '#3b82f6',
  allowed_file_types TEXT[] DEFAULT ARRAY['.kml', '.geojson', '.csv'],
  max_file_size_mb INTEGER DEFAULT 10,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert seed data for pages
INSERT INTO pages (type, title, content) VALUES
  (
    'login',
    'Login Page',
    'Welcome to the Pano Dashboard\n\nPlease enter your password to access the admin panel.\n\nDefault credentials are configured in your Neon database.'
  ),
  (
    'admin',
    'Admin Panel',
    'Admin Dashboard\n\nThis content is fetched from your Neon database.\n\nYou can update this page content directly in the database:\nUPDATE pages SET content = ''Your new content'' WHERE type = ''admin'';\n\nFeatures:\n- Panorama Viewer with interactive zoom and pan\n- Base Maps, Elevation, Evacuation, and Hazard maps\n- Interactive boundary mapping\n- Real-time data from Google Drive'
  )
ON CONFLICT (type) DO NOTHING;

-- Insert default settings
INSERT INTO user_settings (setting_key, setting_value) VALUES
  ('theme', '{"mode": "light", "primaryColor": "#3b82f6", "accentColor": "#8b5cf6"}'),
  ('app_config', '{"appName": "MDRRMO Pio Duran Dashboard", "offlineSync": false}')
ON CONFLICT (setting_key) DO NOTHING;

-- Insert default roles
INSERT INTO roles (name, description, permissions) VALUES
  ('admin', 'Full system access', '["manage_pages", "manage_files", "manage_settings", "manage_users", "manage_roles", "view_audit_logs", "manage_map_pages", "delete_resources"]'),
  ('editor', 'Can edit content and manage files', '["manage_pages", "manage_files", "manage_map_pages", "view_spatial_files"]'),
  ('viewer', 'Read-only access', '["view_pages", "view_files", "view_map_pages"]'),
  ('contributor', 'Can upload and edit own content', '["upload_files", "edit_own_content", "view_map_pages"]')
ON CONFLICT (name) DO NOTHING;

-- Insert sample map page
INSERT INTO map_pages (slug, title, description, is_published, layers) VALUES
  ('evacuation-routes', 'Evacuation Routes', 'Interactive map showing evacuation routes for all barangays', true, '{"evacuation", "barangay_boundaries"}'),
  ('hazard-zones', 'Hazard Zone Map', 'View flood-prone and landslide areas', false, '{"hazards", "elevation"}')
ON CONFLICT (slug) DO NOTHING;

-- Insert default interactive map configuration
INSERT INTO interactive_map_configs (
  config_name, 
  description,
  default_center_lat,
  default_center_lng,
  default_zoom
) VALUES (
  'default',
  'Default interactive map configuration',
  13.037063,
  123.458907,
  14
) ON CONFLICT (config_name) DO NOTHING;

-- =====================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================

-- Enable RLS on all tables
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE map_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE spatial_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rbac_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sidebar_buttons ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactive_map_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE panoramas ENABLE ROW LEVEL SECURITY;

-- Pages: Public read, authenticated write
DROP POLICY IF EXISTS "pages_public_read" ON pages;
CREATE POLICY "pages_public_read" ON pages
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "pages_auth_write" ON pages;
CREATE POLICY "pages_auth_write" ON pages
  FOR ALL USING (auth.role() = 'authenticated');

-- Map Pages: Public read for published pages, authenticated write
DROP POLICY IF EXISTS "map_pages_public_read" ON map_pages;
CREATE POLICY "map_pages_public_read" ON map_pages
  FOR SELECT USING (is_published = true OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "map_pages_auth_write" ON map_pages;
CREATE POLICY "map_pages_auth_write" ON map_pages
  FOR ALL USING (auth.role() = 'authenticated');

-- Spatial Files: Authenticated read/write
DROP POLICY IF EXISTS "spatial_files_auth_access" ON spatial_files;
CREATE POLICY "spatial_files_auth_access" ON spatial_files
  FOR ALL USING (auth.role() = 'authenticated');

-- Settings: Authenticated read/write
DROP POLICY IF EXISTS "settings_auth_access" ON user_settings;
CREATE POLICY "settings_auth_access" ON user_settings
  FOR ALL USING (auth.role() = 'authenticated');

-- Roles: Authenticated read, admin write
DROP POLICY IF EXISTS "roles_auth_read" ON roles;
CREATE POLICY "roles_auth_read" ON roles
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "roles_auth_write" ON roles;
CREATE POLICY "roles_auth_write" ON roles
  FOR INSERT USING (auth.role() = 'authenticated');
CREATE POLICY "roles_auth_update" ON roles
  FOR UPDATE USING (auth.role() = 'authenticated');

-- RBAC Users: Authenticated read/write
DROP POLICY IF EXISTS "rbac_users_auth_access" ON rbac_users;
CREATE POLICY "rbac_users_auth_access" ON rbac_users
  FOR ALL USING (auth.role() = 'authenticated');

-- Audit Logs: Authenticated read, system write
DROP POLICY IF EXISTS "audit_logs_auth_read" ON audit_logs;
CREATE POLICY "audit_logs_auth_read" ON audit_logs
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "audit_logs_system_write" ON audit_logs;
CREATE POLICY "audit_logs_system_write" ON audit_logs
  FOR INSERT USING (true);

-- Sidebar Buttons: Public read (enabled only), authenticated write
DROP POLICY IF EXISTS "sidebar_buttons_public_read" ON sidebar_buttons;
CREATE POLICY "sidebar_buttons_public_read" ON sidebar_buttons
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "sidebar_buttons_auth_write" ON sidebar_buttons;
CREATE POLICY "sidebar_buttons_auth_write" ON sidebar_buttons
  FOR ALL USING (auth.role() = 'authenticated');

-- Interactive Map Configs: Public read (active only), authenticated write
DROP POLICY IF EXISTS "map_configs_public_read" ON interactive_map_configs;
CREATE POLICY "map_configs_public_read" ON interactive_map_configs
  FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "map_configs_auth_write" ON interactive_map_configs;
CREATE POLICY "map_configs_auth_write" ON interactive_map_configs
  FOR ALL USING (auth.role() = 'authenticated');

-- Panoramas: Public read (active only), authenticated write
DROP POLICY IF EXISTS "panoramas_public_read" ON panoramas;
CREATE POLICY "panoramas_public_read" ON panoramas
  FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "panoramas_auth_write" ON panoramas;
CREATE POLICY "panoramas_auth_write" ON panoramas
  FOR ALL USING (auth.role() = 'authenticated');
