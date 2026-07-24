import * as React from 'react';
import { Section, Text, Link } from '@react-email/components';
import { EmailLayout, InfoRow, emailStyles, BRAND } from './EmailLayout';

interface ContactAdminNotificationProps {
  name: string;
  phone: string;
  email: string;
  message: string;
}

export const ContactAdminNotification: React.FC<ContactAdminNotificationProps> = ({
  name,
  phone,
  email,
  message,
}) => {
  return (
    <EmailLayout previewText={`New Contact Message from ${name} · Jyotirling Connect`}>

      {/* ── Alert Banner ──────────────────────────── */}
      <div style={{
        backgroundColor: BRAND.charcoal,
        borderRadius: '10px',
        padding: '16px 20px',
        marginBottom: '24px',
      }}>
        <Text style={{
          color: BRAND.goldLight,
          fontSize: '11px',
          fontWeight: '700',
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          margin: '0 0 4px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
        }}>
          New Contact Submission
        </Text>
        <Text style={{
          color: BRAND.white,
          fontSize: '20px',
          fontWeight: '700',
          margin: '0',
          letterSpacing: '-0.3px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
        }}>
          {name}
        </Text>
        <Text style={{ color: '#9CA3AF', fontSize: '12px', margin: '4px 0 0', fontFamily: 'monospace' }}>
          New message received via contact form
        </Text>
      </div>

      {/* ── Contact Info Card ─────────────────────── */}
      <div style={emailStyles.card}>
        <Text style={emailStyles.cardTitle}>Contact Information</Text>
        <InfoRow label="Full Name" value={name} />
        <InfoRow label="Phone" value={
          <Link href={`tel:${phone.replace(/\s/g, '')}`} style={{ color: BRAND.orange, textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}>
            {phone}
          </Link>
        } />
        <InfoRow label="Email" value={email ? (
          <Link href={`mailto:${email}`} style={{ color: BRAND.orange, textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}>
            {email}
          </Link>
        ) : 'Not provided'} isLast />
      </div>

      {/* ── Message Card ──────────────────────────── */}
      <div style={{
        backgroundColor: '#FFFBF5',
        border: `1px solid ${BRAND.gold}40`,
        borderRadius: '12px',
        padding: '24px',
        margin: '0 0 24px',
      }}>
        <Text style={emailStyles.cardTitle}>Message</Text>
        <Text style={{
          ...emailStyles.body,
          margin: '0',
          whiteSpace: 'pre-wrap',
          fontStyle: 'italic',
          color: BRAND.body,
          lineHeight: '1.8',
        }}>
          "{message}"
        </Text>
      </div>

      {/* ── Quick Reply Buttons ───────────────────── */}
      <Section style={{ ...emailStyles.center, marginTop: '8px' }}>
        <table cellPadding="0" cellSpacing="0" style={{ margin: '0 auto' }}>
          <tbody>
            <tr>
              {email && (
                <td style={{ paddingRight: '12px' }}>
                  <Link href={`mailto:${email}`} style={emailStyles.button} className="btn-cta">
                    Reply via Email
                  </Link>
                </td>
              )}
              <td>
                <Link href={`tel:${phone.replace(/\s/g, '')}`} style={emailStyles.buttonSecondary} className="btn-cta">
                  Call Back
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </Section>

    </EmailLayout>
  );
};
