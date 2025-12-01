-- ==========================================
-- SUPABASE SQL QUERIES FOR PANO DASHBOARD
-- ==========================================
-- Run these queries in Supabase SQL Editor
-- Dashboard > SQL Editor > New Query

-- ==========================================
-- 1. VIEW ALL PAGES
-- ==========================================
SELECT id, type, title, 
       LEFT(content, 50) as content_preview,
       created_at, updated_at 
FROM pages 
ORDER BY type;

-- ==========================================
-- 2. UPDATE PAGE CONTENT
-- ==========================================
-- Update login page
UPDATE pages 
SET content = 'Welcome to MDRRMO Pio Duran Dashboard

Please enter your credentials to access the admin panel.

This system provides real-time disaster response management and mapping tools.',
    title = 'Login Portal',
    updated_at = NOW()
WHERE type = 'login';

-- Update admin page
UPDATE pages 
SET content = 'MDRRMO Dashboard - Admin Panel

Manage your disaster response system:
- View and update evacuation centers
- Monitor hazard zones and flood areas
- Access real-time mapping data
- Configure system settings',
    updated_at = NOW()
WHERE type = 'admin';

-- ==========================================
-- 3. VIEW ALL MAP PAGES
-- ==========================================
SELECT id, slug, title, description, 
       is_published, 
       array_length(layers, 1) as layer_count,
       center_lat, center_lng, zoom_level,
       created_at, updated_at
FROM map_pages
ORDER BY created_at DESC;

-- ==========================================
-- 4. CREATE NEW MAP PAGE
-- ==========================================
INSERT INTO map_pages (slug, title, description, is_published, layers, center_lat, center_lng, zoom_level)
VALUES (
  'flood-risk-map',
  'Flood Risk Assessment',
  'Interactive map showing flood-prone areas across all barangays',
  true,
  ARRAY['hazards', 'elevation', 'barangay_boundaries'],
  13.05,
  123.46,
  13
);

-- ==========================================
-- 5. VIEW ALL SPATIAL FILES
-- ==========================================
SELECT id, filename, original_name, file_type, category,
       description,
       ROUND(file_size / 1024.0, 2) as size_kb,
       is_active,
       created_at
FROM spatial_files
ORDER BY created_at DESC;

-- ==========================================
-- 6. ADD EVACUATION CENTER DATA
-- ==========================================
-- Insert evacuation center as GeoJSON
INSERT INTO spatial_files (
  filename, 
  original_name, 
  file_type, 
  category, 
  description, 
  file_size,
  geojson_data
)
VALUES (
  'evac-centers-2024.geojson',
  'Evacuation Centers 2024',
  'geojson',
  'evacuation',
  'All active evacuation centers in Pio Duran',
  2048,
  '{
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {
          "name": "SLTCFPDI",
          "capacity": 190,
          "category": "SCHOOL"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [123.446605, 13.03076]
        }
      }
    ]
  }'::jsonb
);

-- ==========================================
-- 7. GET USER SETTINGS
-- ==========================================
SELECT setting_key, 
       setting_value,
       updated_at
FROM user_settings
ORDER BY setting_key;

-- ==========================================
-- 8. UPDATE THEME SETTINGS
-- ==========================================
INSERT INTO user_settings (setting_key, setting_value)
VALUES (
  'theme',
  '{"mode": "light", "primaryColor": "#3b82f6", "accentColor": "#8b5cf6"}'::jsonb
)
ON CONFLICT (setting_key) 
DO UPDATE SET 
  setting_value = EXCLUDED.setting_value,
  updated_at = NOW();

-- ==========================================
-- 9. DATABASE STATISTICS
-- ==========================================
SELECT 
  'pages' as table_name,
  COUNT(*) as row_count
FROM pages
UNION ALL
SELECT 
  'map_pages' as table_name,
  COUNT(*) as row_count
FROM map_pages
UNION ALL
SELECT 
  'spatial_files' as table_name,
  COUNT(*) as row_count
FROM spatial_files
UNION ALL
SELECT 
  'user_settings' as table_name,
  COUNT(*) as row_count
FROM user_settings;

-- ==========================================
-- 10. SEARCH SPATIAL FILES BY CATEGORY
-- ==========================================
SELECT id, filename, original_name, category, description
FROM spatial_files
WHERE category = 'evacuation'
  AND is_active = true
ORDER BY created_at DESC;

-- ==========================================
-- 11. GET PUBLISHED MAP PAGES WITH LAYERS
-- ==========================================
SELECT slug, title, description, layers
FROM map_pages
WHERE is_published = true
ORDER BY title;

-- ==========================================
-- 12. DELETE OLD INACTIVE SPATIAL FILES
-- ==========================================
-- Be careful with this query!
DELETE FROM spatial_files
WHERE is_active = false
  AND created_at < NOW() - INTERVAL '90 days';

-- ==========================================
-- 13. ENABLE ROW LEVEL SECURITY (RLS)
-- ==========================================
-- Enable RLS on all tables for security
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE map_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE spatial_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Create policies to allow authenticated access
CREATE POLICY "Allow authenticated read access" ON pages
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated read access" ON map_pages
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated read access" ON spatial_files
  FOR SELECT USING (auth.role() = 'authenticated');

-- ==========================================
-- 14. CREATE INDEXES FOR PERFORMANCE
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_pages_type ON pages(type);
CREATE INDEX IF NOT EXISTS idx_map_pages_slug ON map_pages(slug);
CREATE INDEX IF NOT EXISTS idx_map_pages_published ON map_pages(is_published);
CREATE INDEX IF NOT EXISTS idx_spatial_files_category ON spatial_files(category);
CREATE INDEX IF NOT EXISTS idx_spatial_files_active ON spatial_files(is_active);
CREATE INDEX IF NOT EXISTS idx_user_settings_key ON user_settings(setting_key);

-- ==========================================
-- 15. BACKUP QUERY - EXPORT DATA
-- ==========================================
-- Export all pages as JSON
SELECT json_agg(row_to_json(pages.*)) 
FROM pages;

-- Export all map pages as JSON
SELECT json_agg(row_to_json(map_pages.*)) 
FROM map_pages;
