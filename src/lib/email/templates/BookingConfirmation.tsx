import * as React from 'react';
import { Section, Text, Link } from '@react-email/components';
import { EmailLayout, InfoRow, emailStyles, BRAND } from './EmailLayout';

interface BookingConfirmationProps {
  customerName: string;
  bookingId: string;
  packageType: string;
  fleet: string;
  journeyDate: string;
  pickupLocation: string;
  passengers: number;
  bookingStatus: string;
  supportContact: string;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  customerName,
  bookingId,
  packageType,
  fleet,
  journeyDate,
  pickupLocation,
  passengers,
  bookingStatus,
  supportContact,
}) => {
  const formattedDate = (() => {
    try { return new Date(journeyDate).toLocaleDateString('en-IN', { dateStyle: 'long' }); }
    catch { return journeyDate; }
  })();

  const vehicleLabel = [packageType, fleet ? `(${fleet})` : ''].filter(Boolean).join(' ') || 'Not specified';

  return (
    <EmailLayout previewText={`Booking Request Received — ${bookingId} · Jyotirling Connect`}>

      {/* ── Greeting ──────────────────────────────── */}
      <Text style={{ ...emailStyles.h1, marginBottom: '4px' }}>
        Namaste, {customerName}
      </Text>
      <Text style={{ ...emailStyles.body, color: BRAND.muted, margin: '0 0 24px' }}>
        Thank you for choosing Jyotirling Connect for your sacred journey.
      </Text>

      {/* ── Status Banner ─────────────────────────── */}
      <div style={{
        backgroundColor: '#FFFBF0',
        border: `1px solid ${BRAND.gold}60`,
        borderRadius: '10px',
        padding: '16px 20px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
      }}>
        <table width="100%" cellPadding="0" cellSpacing="0">
          <tbody>
            <tr>
              <td>
                <Text style={{ color: BRAND.charcoal, fontSize: '14px', fontWeight: '700', margin: '0 0 2px' }}>
                  Booking Request Received
                </Text>
                <Text style={{ color: BRAND.body, fontSize: '13px', margin: '0' }}>
                  Your booking is currently{' '}
                  <span style={{
                    display: 'inline-block',
                    backgroundColor: '#FEF3C7',
                    color: '#92400E',
                    fontSize: '10px',
                    fontWeight: '700',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    padding: '2px 8px',
                    borderRadius: '20px',
                  }}>
                    {bookingStatus}
                  </span>
                  . Our team will confirm your details shortly.
                </Text>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── Journey Details Card ───────────────────── */}
      <div style={emailStyles.cardAccent}>
        <Text style={emailStyles.cardTitle}>Journey Details</Text>
        <InfoRow label="Booking Reference" value={bookingId} />
        <InfoRow label="Package / Vehicle"  value={vehicleLabel} />
        <InfoRow label="Journey Date"       value={formattedDate} />
        <InfoRow label="Pickup Location"    value={pickupLocation} />
        <InfoRow label="Passengers"         value={`${passengers} Passenger${passengers !== 1 ? 's' : ''}`} isLast />
      </div>

      {/* ── What Happens Next ─────────────────────── */}
      <Text style={{ ...emailStyles.h2, marginTop: '8px' }}>What happens next?</Text>
      <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '24px' }}>
        <tbody>
          {[
            { step: '1', text: 'Our team reviews your booking request within 2 hours.' },
            { step: '2', text: 'You will receive a booking confirmation email once approved.' },
            { step: '3', text: 'Driver details are shared 12 hours before your journey.' },
          ].map(({ step, text }) => (
            <tr key={step}>
              <td style={{ width: '32px', verticalAlign: 'top', paddingBottom: '12px', paddingTop: '2px' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  backgroundColor: BRAND.orange,
                  borderRadius: '50%',
                  textAlign: 'center',
                  lineHeight: '24px',
                  color: BRAND.white,
                  fontSize: '11px',
                  fontWeight: '700',
                }}>
                  {step}
                </div>
              </td>
              <td style={{ paddingBottom: '12px', paddingLeft: '12px', verticalAlign: 'top' }}>
                <Text style={{ ...emailStyles.body, margin: '0', fontSize: '14px', lineHeight: '1.5' }}>{text}</Text>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ── Support Note ──────────────────────────── */}
      <div style={{
        backgroundColor: BRAND.surface,
        borderRadius: '8px',
        padding: '16px 20px',
        marginBottom: '24px',
        border: `1px solid ${BRAND.border}`,
      }}>
        <Text style={{ ...emailStyles.caption, color: BRAND.body, margin: '0' }}>
          Need immediate assistance? Call us at{' '}
          <Link href={`tel:${supportContact.replace(/\s/g, '')}`} style={{ color: BRAND.orange, fontWeight: '600', textDecoration: 'none' }}>
            {supportContact}
          </Link>
          {' '}or reach us on{' '}
          <Link href="https://wa.me/916268032441" style={{ color: BRAND.orange, fontWeight: '600', textDecoration: 'none' }}>
            WhatsApp
          </Link>
          . We are available 24/7.
        </Text>
      </div>

      {/* ── CTA ───────────────────────────────────── */}
      <Section style={emailStyles.center}>
        <Link
          href="https://www.jyotirlingconnect.com/contact"
          style={emailStyles.button}
          className="btn-cta"
        >
          Contact Support
        </Link>
      </Section>

    </EmailLayout>
  );
};
