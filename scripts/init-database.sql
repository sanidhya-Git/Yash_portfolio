-- Create database and collections for the designer portfolio

-- Bookings collection structure
-- {
--   _id: ObjectId,
--   name: String,
--   email: String,
--   phone: String,
--   service: String,
--   date: String,
--   time: String,
--   message: String,
--   status: String (pending, confirmed, cancelled),
--   createdAt: Date,
--   updatedAt: Date
-- }

-- Designs collection structure
-- {
--   _id: ObjectId,
--   title: String,
--   category: String,
--   image: String,
--   description: String,
--   likes: Number,
--   views: Number,
--   status: String (published, draft),
--   createdAt: Date,
--   updatedAt: Date
-- }

-- Sample data for testing
INSERT INTO bookings (name, email, phone, service, date, time, message, status, createdAt, updatedAt) VALUES
('Sarah Chen', 'sarah@techstart.com', '+1-555-0101', 'Web Design', '2024-01-15', '10:00', 'Need a complete website redesign for our startup', 'confirmed', NOW(), NOW()),
('Michael Rodriguez', 'mike@innovate.com', '+1-555-0102', 'Mobile App Design', '2024-01-16', '14:00', 'Looking for UI/UX design for our mobile app', 'pending', NOW(), NOW()),
('Emily Johnson', 'emily@growthco.com', '+1-555-0103', 'Brand Identity', '2024-01-17', '11:00', 'Complete brand identity package needed', 'confirmed', NOW(), NOW());

INSERT INTO designs (title, category, image, description, likes, views, status, createdAt, updatedAt) VALUES
('Modern E-commerce Platform', 'Web Design', '/placeholder.svg?height=400&width=600', 'A sleek and modern e-commerce platform design', 124, 2340, 'published', NOW(), NOW()),
('Mobile Banking App', 'UI/UX Design', '/placeholder.svg?height=400&width=600', 'Intuitive mobile banking application interface', 89, 1890, 'published', NOW(), NOW()),
('Brand Identity Design', 'Branding', '/placeholder.svg?height=400&width=600', 'Complete brand identity package for tech startup', 156, 3200, 'published', NOW(), NOW()),
('Dashboard Analytics', 'Web Design', '/placeholder.svg?height=400&width=600', 'Clean and informative analytics dashboard', 203, 4100, 'published', NOW(), NOW()),
('Food Delivery App', 'Mobile Design', '/placeholder.svg?height=400&width=600', 'User-friendly food delivery mobile application', 178, 2890, 'published', NOW(), NOW()),
('Creative Portfolio', 'Web Design', '/placeholder.svg?height=400&width=600', 'Personal portfolio website for creative professionals', 134, 2100, 'draft', NOW(), NOW());
