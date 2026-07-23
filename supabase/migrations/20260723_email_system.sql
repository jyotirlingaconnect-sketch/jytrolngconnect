-- Add email tracking columns to bookings table
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS booking_reference VARCHAR(255) UNIQUE,
ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS email_sent BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS confirmation_sent_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS admin_notification_sent BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS admin_notification_sent_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS booking_status_email_sent_at TIMESTAMPTZ;

-- Generate booking_reference for existing bookings (simple UUID substring for fallback)
UPDATE bookings SET booking_reference = CONCAT('JC-', SUBSTRING(id::text, 1, 8)) WHERE booking_reference IS NULL;

-- Create email_logs table
CREATE TABLE IF NOT EXISTS email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    recipient VARCHAR(255) NOT NULL,
    email_type VARCHAR(100) NOT NULL, -- e.g., 'booking_confirmation', 'admin_notification', 'status_change', 'contact_admin'
    subject VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL, -- e.g., 'sent', 'failed'
    resend_message_id VARCHAR(255),
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS policies for email_logs (only admin can view)
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin all access email_logs" ON email_logs
    FOR ALL USING (auth.role() = 'authenticated');

-- Since this table is mostly populated via Server Actions bypassing RLS, we don't necessarily need public insert policies.
