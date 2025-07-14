-- Create uploads directory structure for image storage
-- This script documents the required directory structure

-- Directory structure needed:
-- public/
--   uploads/
--     (uploaded images will be stored here)

-- File naming convention:
-- {timestamp}_{sanitized_original_name}
-- Example: 1704067200000_modern_ecommerce_design.jpg

-- Supported image formats:
-- - JPEG (.jpg, .jpeg)
-- - PNG (.png)
-- - GIF (.gif)
-- - WebP (.webp)

-- File size limit: 5MB

-- Update designs table to include description field
ALTER TABLE designs ADD COLUMN IF NOT EXISTS description TEXT;

-- Add sample designs with descriptions
UPDATE designs SET description = 'A comprehensive e-commerce platform featuring modern design principles, intuitive user experience, and seamless checkout process.' WHERE title = 'Modern E-commerce Platform';

UPDATE designs SET description = 'Innovative mobile banking application with focus on security, accessibility, and user-friendly interface design.' WHERE title = 'Mobile Banking App';

UPDATE designs SET description = 'Complete brand identity package including logo design, color palette, typography, and brand guidelines for a tech startup.' WHERE title = 'Brand Identity Design';
