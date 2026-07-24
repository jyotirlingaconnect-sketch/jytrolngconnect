import * as React from 'react';
import { Section, Text, Link } from '@react-email/components';
import { EmailLayout, InfoRow, emailStyles, BRAND } from './EmailLayout';

interface BookingCancelledProps {
  customerName: string;
  bookingId: string;
  supportContact: string;
}

export const BookingCancelled: React.FC<BookingCancelledProps> = ({
  customerName,
  bookingId,
  supportContact,
}) => {
  return (
    <EmailLayout previewText={`Booking Cancelled — ${bookingId} · Jyotirling Connect`}>

      {/* ── Header Message ────────────────────────── */}
      <Text style={{ ...emailStyles.h1, marginBottom: '4px' }}>
        Namaste, {customerName}
      </Text>
      <Text style={{ ...emailStyles.body, color: BRAND.muted, margin: '0 0 24px' }}>
        We are writing to inform you about your recent booking with Jyotirling Connect.
      </Text>

      {/* ── Cancellation Status Banner ────────────── */}
      <div style={{
        backgroundColor: '#FEF2F2',
        border: `1px solid ${BRAND.red}25`,
        borderRadius: '10px',
        padding: '16px 20px',
        marginBottom: '24px',
        textAlign: 'center',
      }}>
        <Text style={{ color: BRAND.red, fontSize: '13px', fontWeight: '700', margin: '0 0 2px', letterSpacing: '0.3px' }}>
          Status: Cancelled
        </Text>
        <Text style={{ ...emailStyles.caption, margin: '0', color: '#991B1B' }}>
          Booking Reference: <strong>{bookingId}</strong> has been cancelled.
        </Text>
      </div>

      {/* ── Cancellation Details Card ─────────────── */}
      <div style={emailStyles.cardDanger}>
        <Text style={emailStyles.cardTitle}>Cancellation Details</Text>
        <InfoRow label="Booking Reference" value={bookingId} isLast />
      </div>

      {/* ── Reassurance & Next Steps ──────────────── */}
      <Text style={{ ...emailStyles.body, marginTop: '0' }}>
        If this cancellation was unexpected or if you believe this was made in error, 
        please contact our support team immediately. We are here to help you reschedule 
        or make a new booking at your convenience.
      </Text>

      {/* ── Book Again Prompt ─────────────────────── */}
      <div style={{
        backgroundColor: '#FFFBF5',
        border: `1px solid ${BRAND.gold}40`,
        borderRadius: '8px',
        padding: '16px 20px',
        marginBottom: '24px',
      }}>
        <Text style={{ color: BRAND.charcoal, fontSize: '13px', fontWeight: '700', margin: '0 0 6px' }}>
          Planning Another Journey?
        </Text>
        <Text style={{ ...emailStyles.caption, color: BRAND.body, margin: '0' }}>
          We would love to serve you on your next spiritual journey. Visit our website 
          to explore our packages and make a new booking.
        </Text>
      </div>

      {/* ── Support Contact ───────────────────────── */}
      <Text style={{ ...emailStyles.caption, color: BRAND.muted, textAlign: 'center', marginBottom: '24px' }}>
        Need help? Contact us at{' '}
        <Link href={`tel:${supportContact.replace(/\s/g, '')}`} style={{ color: BRAND.orange, fontWeight: '600', textDecoration: 'none' }}>
          {supportContact}
        </Link>
        {' '}or on{' '}
        <Link href="https://wa.me/916268032441" style={{ color: BRAND.orange, fontWeight: '600', textDecoration: 'none' }}>
          WhatsApp
        </Link>
        . We are available 24/7.
      </Text>

      {/* ── CTAs ──────────────────────────────────── */}
      <Section style={emailStyles.center}>
        <table cellPadding="0" cellSpacing="0" style={{ margin: '0 auto' }}>
          <tbody>
            <tr>
              <td style={{ paddingRight: '12px' }}>
                <Link href="https://www.jyotirlingconnect.com/booking" style={emailStyles.button} className="btn-cta">
                  Book Again
                </Link>
              </td>
              <td>
                <Link href="https://www.jyotirlingconnect.com/contact" style={emailStyles.buttonSecondary} className="btn-cta">
                  Contact Support
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </Section>

    </EmailLayout>
  );
};
