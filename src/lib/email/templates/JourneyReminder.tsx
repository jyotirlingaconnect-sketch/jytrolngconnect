import * as React from 'react';
import { Section, Text, Link } from '@react-email/components';
import { EmailLayout, InfoRow, emailStyles, BRAND } from './EmailLayout';

interface JourneyReminderProps {
  customerName: string;
  bookingId: string;
  journeyDate: string;
  pickupLocation: string;
  driverDetails?: string;
  supportContact: string;
}

export const JourneyReminder: React.FC<JourneyReminderProps> = ({
  customerName,
  bookingId,
  journeyDate,
  pickupLocation,
  driverDetails,
  supportContact,
}) => {
  const formattedDate = (() => {
    try { return new Date(journeyDate).toLocaleDateString('en-IN', { dateStyle: 'long' }); }
    catch { return journeyDate; }
  })();

  return (
    <EmailLayout previewText={`Journey Reminder — Your yatra starts tomorrow! · ${bookingId}`}>

      {/* ── Urgency Banner ────────────────────────── */}
      <div style={{
        backgroundColor: BRAND.charcoal,
        borderRadius: '10px',
        padding: '14px 20px',
        marginBottom: '24px',
        textAlign: 'center',
      }}>
        <Text style={{
          color: BRAND.goldLight,
          fontSize: '11px',
          fontWeight: '700',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          margin: '0 0 2px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
        }}>
          Journey Reminder
        </Text>
        <Text style={{
          color: BRAND.white,
          fontSize: '18px',
          fontWeight: '700',
          margin: '0',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
        }}>
          Your Sacred Yatra Begins Tomorrow
        </Text>
      </div>

      {/* ── Greeting ──────────────────────────────── */}
      <Text style={{ ...emailStyles.h1, marginBottom: '4px' }}>
        Namaste, {customerName}
      </Text>
      <Text style={{ ...emailStyles.body, margin: '0 0 24px' }}>
        This is a friendly reminder that your spiritual journey with Jyotirling Connect 
        begins tomorrow. We are excited to be your travel partner on this blessed yatra.
      </Text>

      {/* ── Journey Summary Card ──────────────────── */}
      <div style={emailStyles.cardAccent}>
        <Text style={emailStyles.cardTitle}>Tomorrow's Journey</Text>
        <InfoRow label="Booking Reference" value={bookingId} />
        <InfoRow label="Journey Date"      value={formattedDate} />
        <InfoRow label="Pickup Location"   value={pickupLocation} />
        {driverDetails && (
          <InfoRow label="Driver Details" value={driverDetails} isLast />
        )}
        {!driverDetails && (
          <InfoRow label="Driver Details" value="Details being finalized — will be shared shortly" isLast />
        )}
      </div>

      {/* ── Checklist ────────────────────────────── */}
      <Text style={{ ...emailStyles.h2, marginTop: '8px' }}>Before You Travel</Text>
      <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '24px' }}>
        <tbody>
          {[
            'Keep this email handy for your booking reference.',
            'Arrive at the pickup location at least 15 minutes early.',
            'Carry valid identification documents.',
            'Save our support number in case of emergency.',
          ].map((item, i) => (
            <tr key={i}>
              <td style={{ width: '24px', verticalAlign: 'top', paddingBottom: '10px' }}>
                <span style={{ color: BRAND.orange, fontSize: '14px', fontWeight: '700' }}>✓</span>
              </td>
              <td style={{ paddingBottom: '10px', paddingLeft: '8px', verticalAlign: 'top' }}>
                <Text style={{ ...emailStyles.body, margin: '0', fontSize: '14px', lineHeight: '1.5' }}>{item}</Text>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ── Support Note ──────────────────────────── */}
      <div style={{
        backgroundColor: BRAND.surface,
        border: `1px solid ${BRAND.border}`,
        borderRadius: '8px',
        padding: '16px 20px',
        marginBottom: '24px',
      }}>
        <Text style={{ color: BRAND.charcoal, fontSize: '13px', fontWeight: '700', margin: '0 0 6px' }}>
          Emergency Contact
        </Text>
        <Text style={{ ...emailStyles.caption, color: BRAND.body, margin: '0' }}>
          For urgent assistance, call us at{' '}
          <Link href={`tel:${supportContact.replace(/\s/g, '')}`} style={{ color: BRAND.orange, fontWeight: '600', textDecoration: 'none' }}>
            {supportContact}
          </Link>
          {' '}or reach us on{' '}
          <Link href="https://wa.me/916268032441" style={{ color: BRAND.orange, fontWeight: '600', textDecoration: 'none' }}>
            WhatsApp
          </Link>
          . Available 24/7.
        </Text>
      </div>

      {/* ── Blessing ──────────────────────────────── */}
      <Text style={{ ...emailStyles.body, textAlign: 'center', fontStyle: 'italic', color: BRAND.muted, marginBottom: '24px' }}>
        Wishing you a safe, peaceful, and spiritually fulfilling yatra.
      </Text>

      {/* ── CTA ───────────────────────────────────── */}
      <Section style={emailStyles.center}>
        <Link href="https://www.jyotirlingconnect.com/contact" style={emailStyles.button} className="btn-cta">
          Contact Support
        </Link>
      </Section>

    </EmailLayout>
  );
};
