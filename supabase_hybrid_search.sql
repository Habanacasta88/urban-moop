-- Hybrid Search 2.0: Database Schema Updates
-- Add source tracking and web discovery metadata

-- 1. Add source tracking column
ALTER TABLE map_items ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'manual';

-- 2. Add discovery and verification metadata
ALTER TABLE map_items ADD COLUMN IF NOT EXISTS discovered_at TIMESTAMP;
ALTER TABLE map_items ADD COLUMN IF NOT EXISTS verification_count INT DEFAULT 0;
ALTER TABLE map_items ADD COLUMN IF NOT EXISTS last_verified_at TIMESTAMP;

-- 3. Add hours/schedule info for web results
ALTER TABLE map_items ADD COLUMN IF NOT EXISTS hours TEXT;

-- 4. Create index for efficient source filtering
CREATE INDEX IF NOT EXISTS idx_map_items_source ON map_items(source);

-- 5. Create index for recent discoveries
CREATE INDEX IF NOT EXISTS idx_map_items_discovered ON map_items(discovered_at DESC) WHERE source = 'web_discovery';

-- Comments for documentation
COMMENT ON COLUMN map_items.source IS 'Origin of the item: manual, web_discovery, user_created';
COMMENT ON COLUMN map_items.discovered_at IS 'Timestamp when item was discovered via web search';
COMMENT ON COLUMN map_items.verification_count IS 'Number of times users have verified this place exists';
COMMENT ON COLUMN map_items.last_verified_at IS 'Last time a user confirmed this place is still valid';
COMMENT ON COLUMN map_items.hours IS 'Opening hours or schedule information';
