import { Resend } from 'resend';

let cachedResend: { key: string; instance: Resend } | null = null;

export function getResendClient(): Resend | null {
  const rawKey = process.env.RESEND_API_KEY;
  if (!rawKey) {
    console.warn('[EMAIL SYSTEM] RESEND_API_KEY environment variable is not defined.');
    return null;
  }

  // Clean quotes/spaces if present
  const apiKey = rawKey.trim().replace(/^["']|["']$/g, '');
  if (!apiKey) {
    console.warn('[EMAIL SYSTEM] RESEND_API_KEY is empty after sanitization.');
    return null;
  }

  if (cachedResend && cachedResend.key === apiKey) {
    return cachedResend.instance;
  }

  const instance = new Resend(apiKey);
  cachedResend = { key: apiKey, instance };
  return instance;
}

export function getSenderEmail(): string {
  const envFrom = process.env.EMAIL_FROM?.trim().replace(/^["']|["']$/g, '');
  return envFrom || 'Jyotirling Connect <support@jyotirlingconnect.com>';
}

export function getAdminEmail(): string {
  const envAdmin = process.env.ADMIN_EMAIL?.trim().replace(/^["']|["']$/g, '');
  return envAdmin || 'jyotirlingaconnect@gmail.com';
}

// Backwards compatibility exports
export const EMAIL_FROM = getSenderEmail();
export const ADMIN_EMAIL = getAdminEmail();
export const resend = getResendClient();
