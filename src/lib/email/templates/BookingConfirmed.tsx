import * as React from 'react';
import { Section, Text, Link } from '@react-email/components';
import { EmailLayout, InfoRow, emailStyles, BRAND } from './EmailLayout';

interface BookingConfirmedProps {
  customerName: string;
  bookingId: string;
  packageType: string;
  fleet: string;
  journeyDate: string;
  pickupLocation: string;
  supportContact: string;
}

export const BookingConfirmed: React.FC<BookingConfirmedProps> = ({
  customerName,
  bookingId,
  packageType,
  fleet,
  journeyDate,
  pickupLocation,
  supportContact,
}) => {
  const formattedDate = (() => {
    try { return new Date(journeyDate).toLocaleDateString('en-IN', { dateStyle: 'long' }); }
    catch { return journeyDate; }
  })();

  const vehicleLabel = [packageType, fleet ? `(${fleet})` : ''].filter(Boolean).join(' ') || 'Not specified';

  return (
    <EmailLayout previewText={`Booking Confirmed — ${bookingId} · Your journey is all set!`}>

      {/* ── Success Hero ──────────────────────────── */}
      <div style={{
        textAlign: 'center',
        padding: '8px 0 28px',
      }}>
        {/* Checkmark circle */}
        <div style={{
          width: '64px',
          height: '64px',
          backgroundColor: '#F0FDF4',
          borderRadius: '50%',
          border: `2px solid ${BRAND.green}30`,
          margin: '0 auto 16px',
          lineHeight: '64px',
          textAlign: 'center',
          fontSize: '28px',
        }}>
          ✓
        </div>
        <Text style={{ ...emailStyles.h1, textAlign: 'center', marginBottom: '4px' }}>
          Booking Confirmed
        </Text>
        <Text style={{ ...emailStyles.body, textAlign: 'center', color: BRAND.muted, margin: '0' }}>
          Jai Shree Mahakal, {customerName}! Your journey is all set.
        </Text>
      </div>

      {/* ── Confirmed Status Banner ────────────────── */}
      <div style={{
        backgroundColor: '#F0FDF4',
        border: `1px solid ${BRAND.green}30`,
        borderRadius: '10px',
        padding: '14px 20px',
        marginBottom: '24px',
        textAlign: 'center',
      }}>
        <Text style={{ color: BRAND.green, fontSize: '13px', fontWeight: '700', margin: '0 0 2px', letterSpacing: '0.3px' }}>
          Status: Confirmed
        </Text>
        <Text style={{ ...emailStyles.caption, margin: '0', color: '#16653A' }}>
          Booking Reference: <strong>{bookingId}</strong>
        </Text>
      </div>

      {/* ── Journey Details Card ──────────────────── */}
      <div style={emailStyles.cardSuccess}>
        <Text style={emailStyles.cardTitle}>Your Journey Details</Text>
        <InfoRow label="Booking Reference" value={bookingId} />
        <InfoRow label="Package / Vehicle"  value={vehicleLabel} />
        <InfoRow label="Journey Date"       value={formattedDate} />
        <InfoRow label="Pickup Location"    value={pickupLocation} isLast />
      </div>

      {/* ── Driver Note ───────────────────────────── */}
      <div style={{
        backgroundColor: BRAND.surface,
        border: `1px solid ${BRAND.border}`,
        borderRadius: '8px',
        padding: '16px 20px',
        marginBottom: '24px',
      }}>
        <Text style={{ color: BRAND.charcoal, fontSize: '13px', fontWeight: '700', margin: '0 0 6px' }}>
          Driver Details
        </Text>
        <Text style={{ ...emailStyles.caption, color: BRAND.body, margin: '0' }}>
          Your driver information will be shared with you <strong>12 hours before your journey</strong>. 
          Please ensure you are at the pickup location at least 15 minutes early.
        </Text>
      </div>

      {/* ── Support Note ──────────────────────────── */}
      <Text style={{ ...emailStyles.caption, color: BRAND.muted, textAlign: 'center', marginBottom: '24px' }}>
        For any assistance, reach us at{' '}
        <Link href={`tel:${supportContact.replace(/\s/g, '')}`} style={{ color: BRAND.orange, fontWeight: '600', textDecoration: 'none' }}>
          {supportContact}
        </Link>
        {' '}or on{' '}
        <Link href="https://wa.me/916268032441" style={{ color: BRAND.orange, fontWeight: '600', textDecoration: 'none' }}>
          WhatsApp
        </Link>
        . We are available 24/7.
      </Text>

      {/* ── CTA ───────────────────────────────────── */}
      <Section style={emailStyles.center}>
        <Link href="https://www.jyotirlingconnect.com" style={emailStyles.button} className="btn-cta">
          Visit Website
        </Link>
      </Section>

    </EmailLayout>
  );
};
