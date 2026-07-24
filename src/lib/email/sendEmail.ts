import { getResendClient, getSenderEmail } from './index';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import React from 'react';

export interface SendEmailParams {
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
  const recipients = Array.isArray(to) ? to.filter(Boolean) : [to];
  const recipientStr = recipients.join(', ');

  console.log(`[EMAIL] 🚀 Initiating email send`, {
    emailType,
    recipient: recipientStr,
    subject,
    bookingId: bookingId || 'N/A',
  });

  const resendClient = getResendClient();
  const sender = getSenderEmail();

  if (!resendClient) {
    const errorMsg = 'RESEND_API_KEY is missing or invalid. Email sending aborted.';
    console.error(`[EMAIL ERROR] ❌ ${errorMsg}`, { recipient: recipientStr, subject });

    await logEmail({
      recipient: recipientStr,
      emailType,
      subject,
      status: 'failed',
      errorMessage: errorMsg,
      bookingId,
    });

    if (bookingId) {
      await updateBookingEmailStatus(bookingId, emailType, false, errorMsg);
    }

    return { success: false, error: new Error(errorMsg) };
  }

  let attempt = 0;
  let lastError: any = null;
  let responseData: any = null;

  while (attempt < retries) {
    attempt++;
    try {
      console.log(`[EMAIL] Attempt ${attempt}/${retries} to send to ${recipientStr}...`);

      const response = await resendClient.emails.send({
        from: sender,
        to: recipients,
        subject,
        react,
      });

      if (response.error) {
        console.error(`[EMAIL ERROR] Resend API returned error on attempt ${attempt}:`, response.error);
        const errorMessage = response.error.message || 'Resend API returned an error';
        throw new Error(errorMessage);
      }

      responseData = response.data;
      console.log(`[EMAIL SUCCESS] ✅ Email sent successfully! Message ID: ${responseData?.id}`, {
        emailType,
        recipient: recipientStr,
        bookingId: bookingId || 'N/A',
      });

      // Log success in database
      await logEmail({
        recipient: recipientStr,
        emailType,
        subject,
        status: 'sent',
        resendMessageId: responseData?.id,
        bookingId,
      });

      // Update booking status in database
      if (bookingId) {
        await updateBookingEmailStatus(bookingId, emailType, true, null);
      }

      return { success: true, data: responseData };
    } catch (error: any) {
      lastError = error;
      console.error(`[EMAIL ERROR] ❌ Failed to send email (attempt ${attempt}/${retries}):`, {
        message: error?.message || error,
        stack: error?.stack,
      });

      if (attempt < retries) {
        const backoffMs = 1000 * Math.pow(2, attempt);
        console.log(`[EMAIL] Waiting ${backoffMs}ms before retry...`);
        await new Promise((resolve) => setTimeout(resolve, backoffMs));
      }
    }
  }

  const finalErrorMsg = lastError?.message || 'Email delivery failed after max retries';

  // Log final failure in database
  await logEmail({
    recipient: recipientStr,
    emailType,
    subject,
    status: 'failed',
    errorMessage: finalErrorMsg,
    bookingId,
  });

  // Record failure in booking record
  if (bookingId) {
    await updateBookingEmailStatus(bookingId, emailType, false, finalErrorMsg);
  }

  return { success: false, error: lastError || new Error(finalErrorMsg) };
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
    const { error } = await supabaseAdmin.from('email_logs').insert({
      recipient: data.recipient,
      email_type: data.emailType,
      subject: data.subject,
      status: data.status,
      resend_message_id: data.resendMessageId || null,
      error_message: data.errorMessage || null,
      booking_id: data.bookingId || null,
    });

    if (error) {
      console.error('[EMAIL SYSTEM LOG ERROR] Failed to insert email_log into Supabase:', error);
    } else {
      console.log('[EMAIL SYSTEM LOG] Email log saved to database.');
    }
  } catch (err) {
    console.error('[EMAIL SYSTEM LOG ERROR] Exception while logging email:', err);
  }
}

async function updateBookingEmailStatus(
  bookingId: string,
  emailType: string,
  success: boolean,
  errorMessage: string | null
) {
  try {
    const updates: Record<string, unknown> = {};

    if (success) {
      if (emailType === 'booking_confirmation') {
        updates.email_sent = true;
        updates.confirmation_sent_at = new Date().toISOString();
      } else if (emailType === 'admin_notification') {
        updates.admin_notification_sent = true;
        updates.admin_notification_sent_at = new Date().toISOString();
      } else if (emailType === 'status_change') {
        updates.booking_status_email_sent_at = new Date().toISOString();
      }
      updates.last_email_error = null;
    } else {
      if (errorMessage) {
        updates.last_email_error = errorMessage;
      }
    }

    if (Object.keys(updates).length > 0) {
      const { error } = await supabaseAdmin.from('bookings').update(updates).eq('id', bookingId);
      if (error) {
        console.error('[EMAIL SYSTEM UPDATE ERROR] Failed to update booking email status:', error);
      } else {
        console.log('[EMAIL SYSTEM UPDATE] Booking email status updated in database.');
      }
    }
  } catch (err) {
    console.error('[EMAIL SYSTEM UPDATE ERROR] Exception updating booking email status:', err);
  }
}
