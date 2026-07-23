import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;

export const resend = resendApiKey ? new Resend(resendApiKey) : null;
export const EMAIL_FROM = process.env.EMAIL_FROM || 'Jyotirling Connect <support@jyotirlingconnect.com>';
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'support@jyotirlingconnect.com';
