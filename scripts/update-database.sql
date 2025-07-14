-- Update database schema for enhanced functionality

-- Add indexes for better performance
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_date ON bookings(date);
CREATE INDEX idx_designs_status ON designs(status);
CREATE INDEX idx_designs_category ON designs(category);

-- Add sample social media data
INSERT INTO settings (key, value) VALUES
('social_linkedin', 'https://linkedin.com/in/alexjohnson'),
('social_behance', 'https://behance.net/alexjohnson'),
('social_dribbble', 'https://dribbble.com/alexjohnson'),
('designer_name', 'Alex Johnson'),
('designer_email', 'alex@designstudio.com'),
('designer_phone', '+1 (555) 123-4567');

-- Update existing designs with better sample data
UPDATE designs SET 
  description = 'A comprehensive e-commerce platform featuring modern design principles, intuitive user experience, and seamless checkout process.',
  views = views + FLOOR(RANDOM() * 1000),
  likes = likes + FLOOR(RANDOM() * 50)
WHERE title = 'Modern E-commerce Platform';

UPDATE designs SET 
  description = 'Innovative mobile banking application with focus on security, accessibility, and user-friendly interface design.',
  views = views + FLOOR(RANDOM() * 800),
  likes = likes + FLOOR(RANDOM() * 40)
WHERE title = 'Mobile Banking App';

-- Add more sample bookings for testing
INSERT INTO bookings (name, email, phone, service, date, time, message, status, createdAt, updatedAt) VALUES
('David Kim', 'david@startup.io', '+1-555-0104', 'UI/UX Design', '2024-01-18', '15:00', 'Need help with user experience optimization for our SaaS platform', 'pending', NOW(), NOW()),
('Lisa Wang', 'lisa@creative.agency', '+1-555-0105', 'Branding', '2024-01-19', '09:00', 'Looking for complete brand identity redesign including logo and guidelines', 'confirmed', NOW(), NOW()),
('James Miller', 'james@techcorp.com', '+1-555-0106', 'Web Design', '2024-01-20', '11:00', 'Corporate website redesign with focus on modern aesthetics and performance', 'pending', NOW(), NOW());
