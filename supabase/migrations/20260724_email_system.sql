-- =============================================================
-- Email System Migration: Columns, Tables & RLS Policies
-- =============================================================

-- Add email tracking columns to bookings table
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS booking_reference TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS customer_email TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS email_sent BOOLEAN DEFAULT false;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS confirmation_sent_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS admin_notification_sent BOOLEAN DEFAULT false;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS admin_notification_sent_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS booking_status_email_sent_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS last_email_error TEXT;

-- Generate booking_reference for existing bookings without reference
UPDATE public.bookings 
SET booking_reference = CONCAT('JC-', UPPER(SUBSTRING(id::text, 1, 8))) 
WHERE booking_reference IS NULL;

-- Create email_logs table for audit & tracking
CREATE TABLE IF NOT EXISTS public.email_logs (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id        UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    recipient         TEXT NOT NULL,
    email_type        TEXT NOT NULL, -- e.g., 'booking_confirmation', 'admin_notification', 'status_change', 'contact_admin'
    subject           TEXT NOT NULL,
    status            TEXT NOT NULL, -- 'sent', 'failed'
    resend_message_id TEXT,
    error_message     TEXT,
    created_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS and setup admin access policy
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin all access email_logs" ON public.email_logs;
CREATE POLICY "Admin all access email_logs" ON public.email_logs FOR ALL USING (auth.role() = 'authenticated');
