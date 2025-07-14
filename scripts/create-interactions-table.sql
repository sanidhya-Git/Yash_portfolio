-- Create interactions collection for tracking user engagement
-- This collection will store all user interactions (likes, views, etc.)

-- Interactions collection structure:
-- {
--   _id: ObjectId,
--   designId: ObjectId (reference to designs collection),
--   type: String (like, unlike, view),
--   timestamp: Date,
--   userAgent: String (browser info),
--   ip: String (user IP for analytics),
--   sessionId: String (optional - for session tracking)
-- }

-- Sample interactions data for testing
INSERT INTO interactions (designId, type, timestamp, userAgent, ip) VALUES
-- Views for design 1
(ObjectId('design_1_id'), 'view', NOW() - INTERVAL 1 DAY, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '192.168.1.1'),
(ObjectId('design_1_id'), 'view', NOW() - INTERVAL 2 HOURS, 'Mozilla/5.0 (Macintosh; Intel Mac OS X)', '192.168.1.2'),
(ObjectId('design_1_id'), 'view', NOW() - INTERVAL 30 MINUTES, 'Mozilla/5.0 (iPhone; CPU iPhone OS)', '192.168.1.3'),

-- Likes for design 1
(ObjectId('design_1_id'), 'like', NOW() - INTERVAL 3 HOURS, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '192.168.1.1'),
(ObjectId('design_1_id'), 'like', NOW() - INTERVAL 1 HOUR, 'Mozilla/5.0 (Macintosh; Intel Mac OS X)', '192.168.1.4'),

-- Views for design 2
(ObjectId('design_2_id'), 'view', NOW() - INTERVAL 4 HOURS, 'Mozilla/5.0 (Android; Mobile)', '192.168.1.5'),
(ObjectId('design_2_id'), 'view', NOW() - INTERVAL 1 HOUR, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '192.168.1.6'),

-- Likes for design 2
(ObjectId('design_2_id'), 'like', NOW() - INTERVAL 2 HOURS, 'Mozilla/5.0 (Android; Mobile)', '192.168.1.5');

-- Create indexes for better performance
CREATE INDEX idx_interactions_design_id ON interactions(designId);
CREATE INDEX idx_interactions_type ON interactions(type);
CREATE INDEX idx_interactions_timestamp ON interactions(timestamp);
CREATE INDEX idx_interactions_design_type ON interactions(designId, type);
