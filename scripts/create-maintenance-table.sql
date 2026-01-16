-- Create maintenance status table
CREATE TABLE IF NOT EXISTS maintenance_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  is_active BOOLEAN DEFAULT FALSE,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  title VARCHAR(255) DEFAULT 'Scheduled Maintenance',
  message TEXT DEFAULT 'We are currently performing scheduled maintenance. We will be back online shortly.',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for quick lookups
CREATE INDEX IF NOT EXISTS idx_maintenance_active ON maintenance_status(is_active);

-- Enable RLS
ALTER TABLE maintenance_status ENABLE ROW LEVEL SECURITY;

-- Create policy for reading maintenance status (public read)
CREATE POLICY "Allow public read" ON maintenance_status
  FOR SELECT USING (true);

-- Create policy for updating maintenance status (admin only)
CREATE POLICY "Allow authenticated updates" ON maintenance_status
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Insert initial record
INSERT INTO maintenance_status (id, is_active, title, message)
VALUES ('00000000-0000-0000-0000-000000000001', false, 'Scheduled Maintenance', 'We are currently performing scheduled maintenance. We will be back online shortly.');
