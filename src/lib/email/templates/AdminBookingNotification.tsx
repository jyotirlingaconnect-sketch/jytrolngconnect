import * as React from 'react';
import { Section, Text, Link } from '@react-email/components';
import { EmailLayout, InfoRow, emailStyles, BRAND } from './EmailLayout';

interface AdminBookingNotificationProps {
  customerName: string;
  phoneNumber: string;
  email: string;
  packageType: string;
  fleet: string;
  pickupLocation: string;
  travelDate: string;
  passengerCount: number;
  bookingTime: string;
  bookingId: string;
  message?: string;
}

export const AdminBookingNotification: React.FC<AdminBookingNotificationProps> = ({
  customerName,
  phoneNumber,
  email,
  packageType,
  fleet,
  pickupLocation,
  travelDate,
  passengerCount,
  bookingTime,
  bookingId,
  message,
}) => {
  const formattedTravelDate = (() => {
    try { return new Date(travelDate).toLocaleDateString('en-IN', { dateStyle: 'long' }); }
    catch { return travelDate; }
  })();

  const formattedBookingTime = (() => {
    try { return new Date(bookingTime).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }); }
    catch { return bookingTime; }
  })();

  const vehicleLabel = [packageType, fleet ? `(${fleet})` : ''].filter(Boolean).join(' ') || 'Not specified';

  return (
    <EmailLayout previewText={`New Booking: ${customerName} · ${bookingId} · Action Required`}>

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
          New Booking Received
        </Text>
        <Text style={{
          color: BRAND.white,
          fontSize: '20px',
          fontWeight: '700',
          margin: '0',
          letterSpacing: '-0.3px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
        }}>
          {customerName}
        </Text>
        <Text style={{ color: '#9CA3AF', fontSize: '12px', margin: '4px 0 0', fontFamily: 'monospace' }}>
          Ref: {bookingId} · {formattedBookingTime}
        </Text>
      </div>

      {/* ── Customer Info Card ────────────────────── */}
      <div style={emailStyles.card}>
        <Text style={emailStyles.cardTitle}>Customer Information</Text>
        <InfoRow label="Full Name" value={customerName} />
        <InfoRow label="Phone"     value={
          <Link href={`tel:${phoneNumber.replace(/\s/g, '')}`} style={{ color: BRAND.orange, textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}>
            {phoneNumber}
          </Link>
        } />
        <InfoRow label="Email" value={email && email !== 'N/A' ? (
          <Link href={`mailto:${email}`} style={{ color: BRAND.orange, textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}>
            {email}
          </Link>
        ) : 'Not provided'} isLast />
      </div>

      {/* ── Journey Details Card ──────────────────── */}
      <div style={emailStyles.cardAccent}>
        <Text style={emailStyles.cardTitle}>Journey Details</Text>
        <InfoRow label="Package / Vehicle"  value={vehicleLabel} />
        <InfoRow label="Travel Date"        value={formattedTravelDate} />
        <InfoRow label="Pickup Location"    value={pickupLocation} />
        <InfoRow label="Passengers"         value={`${passengerCount} Passenger${passengerCount !== 1 ? 's' : ''}`} isLast />
      </div>

      {/* ── Customer Message ──────────────────────── */}
      {message && (
        <div style={{
          ...emailStyles.card,
          marginTop: '0',
          backgroundColor: '#FFFBF5',
          border: `1px solid ${BRAND.gold}40`,
        }}>
          <Text style={emailStyles.cardTitle}>Customer Message</Text>
          <Text style={{ ...emailStyles.body, margin: '0', whiteSpace: 'pre-wrap', fontStyle: 'italic', color: BRAND.body }}>
            "{message}"
          </Text>
        </div>
      )}

      {/* ── Quick Action Buttons ──────────────────── */}
      <Section style={{ ...emailStyles.center, marginTop: '8px' }}>
        <table cellPadding="0" cellSpacing="0" style={{ margin: '0 auto' }}>
          <tbody>
            <tr>
              <td style={{ paddingRight: '12px' }}>
                <Link href="https://www.jyotirlingconnect.com/admin/bookings" style={emailStyles.buttonDark} className="btn-cta">
                  View Booking
                </Link>
              </td>
              <td>
                <Link href={`tel:${phoneNumber.replace(/\s/g, '')}`} style={emailStyles.buttonSecondary} className="btn-cta">
                  Call Customer
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </Section>

    </EmailLayout>
  );
};
