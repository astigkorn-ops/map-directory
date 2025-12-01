-- Seed data for panoramas table
INSERT INTO panoramas (name, description, image_url, thumbnail_url, is_active, order_index)
VALUES 
  ('Sample 360° View', 'Default panorama view - replace with your own images', 'https://placehold.co/2000x1000/1e40af/white?text=360°+Panorama+View', 'https://placehold.co/600x300/1e40af/white?text=360°+Thumbnail', true, 0)
ON CONFLICT DO NOTHING;
