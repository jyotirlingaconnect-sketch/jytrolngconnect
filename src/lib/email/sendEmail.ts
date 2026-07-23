import { resend, EMAIL_FROM } from './index';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import React from 'react';

interface SendEmailParams {
  to: string | string[];
  subject: string;
  react: React.ReactNode;
  emailType: string;
  bookingId?: string;
  retries?: number;
}

export async function sendEmail({
  to,
  subject,
  react,
  emailType,
  bookingId,
  retries = 3,
}: SendEmailParams): Promise<{ success: boolean; data?: unknown; error?: unknown }> {
  if (!resend) {
    console.warn('RESEND_API_KEY is not set. Email sending skipped.', { to, subject, emailType });
    return { success: false, error: 'RESEND_API_KEY missing' };
  }

  let attempt = 0;
  let lastError: any = null;
  let responseData = null;

  while (attempt < retries) {
    try {
      const response = await resend.emails.send({
        from: EMAIL_FROM,
        to: Array.isArray(to) ? to : [to],
        subject,
        react,
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      responseData = response.data;

      // Log success
      await logEmail({
        recipient: Array.isArray(to) ? to.join(', ') : to,
        emailType,
        subject,
        status: 'sent',
        resendMessageId: responseData?.id,
        bookingId,
      });

      // Update booking if needed
      if (bookingId && (emailType === 'booking_confirmation' || emailType === 'admin_notification' || emailType === 'status_change')) {
        await updateBookingEmailStatus(bookingId, emailType);
      }

      return { success: true, data: responseData };
    } catch (error: unknown) {
      lastError = error;
      attempt++;
      console.error(`Failed to send email (attempt ${attempt}/${retries}):`, error);
      if (attempt >= retries) {
        break;
      }
      // Wait before retrying (exponential backoff)
      await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
    }
  }

  // Log failure
  await logEmail({
    recipient: Array.isArray(to) ? to.join(', ') : to,
    emailType,
    subject,
    status: 'failed',
    errorMessage: lastError?.message || 'Unknown error',
    bookingId,
  });

  return { success: false, error: lastError };
}

async function logEmail(data: {
  recipient: string;
  emailType: string;
  subject: string;
  status: string;
  resendMessageId?: string;
  errorMessage?: string;
  bookingId?: string;
}) {
  try {
    await supabaseAdmin.from('email_logs').insert({
      recipient: data.recipient,
      email_type: data.emailType,
      subject: data.subject,
      status: data.status,
      resend_message_id: data.resendMessageId,
      error_message: data.errorMessage,
      booking_id: data.bookingId || null,
    });
  } catch (err) {
    console.error('Failed to log email:', err);
  }
}

async function updateBookingEmailStatus(bookingId: string, emailType: string) {
  try {
    const updates: Record<string, unknown> = {};
    if (emailType === 'booking_confirmation') {
      updates.email_sent = true;
      updates.confirmation_sent_at = new Date().toISOString();
    } else if (emailType === 'admin_notification') {
      updates.admin_notification_sent = true;
      updates.admin_notification_sent_at = new Date().toISOString();
    } else if (emailType === 'status_change') {
      updates.booking_status_email_sent_at = new Date().toISOString();
    }

    if (Object.keys(updates).length > 0) {
      await supabaseAdmin.from('bookings').update(updates).eq('id', bookingId);
    }
  } catch (err) {
    console.error('Failed to update booking email status:', err);
  }
}
