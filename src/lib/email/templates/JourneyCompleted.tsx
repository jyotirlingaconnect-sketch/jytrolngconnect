import * as React from 'react';
import { Section, Text, Link } from '@react-email/components';
import { EmailLayout, emailStyles, BRAND } from './EmailLayout';

interface JourneyCompletedProps {
  customerName: string;
  bookingId: string;
}

export const JourneyCompleted: React.FC<JourneyCompletedProps> = ({
  customerName,
  bookingId,
}) => {
  return (
    <EmailLayout previewText={`Journey Completed — Thank you for travelling with us, ${customerName}!`}>

      {/* ── Celebration Hero ──────────────────────── */}
      <div style={{ textAlign: 'center', padding: '8px 0 28px' }}>
        <div style={{
          width: '64px',
          height: '64px',
          backgroundColor: '#FFFBF0',
          borderRadius: '50%',
          border: `2px solid ${BRAND.gold}40`,
          margin: '0 auto 16px',
          lineHeight: '64px',
          textAlign: 'center',
          fontSize: '28px',
        }}>
          🙏
        </div>
        <Text style={{ ...emailStyles.h1, textAlign: 'center', marginBottom: '4px' }}>
          Har Har Mahadev!
        </Text>
        <Text style={{ ...emailStyles.body, textAlign: 'center', color: BRAND.muted, margin: '0' }}>
          Your divine journey has been completed.
        </Text>
      </div>

      {/* ── Personal Greeting ─────────────────────── */}
      <Text style={{ ...emailStyles.body, textAlign: 'center', marginBottom: '8px' }}>
        Dear <strong style={{ color: BRAND.charcoal }}>{customerName}</strong>,
      </Text>
      <Text style={{ ...emailStyles.body, textAlign: 'center', marginBottom: '24px' }}>
        We hope your pilgrimage with Jyotirling Connect was comfortable, peaceful, 
        and spiritually fulfilling. It was an honour to be part of your sacred journey.
      </Text>

      {/* ── Testimonial Request Card ──────────────── */}
      <div style={{
        backgroundColor: '#FFFBF5',
        border: `1px solid ${BRAND.gold}40`,
        borderRadius: '12px',
        padding: '28px 24px',
        margin: '0 0 24px',
        textAlign: 'center',
        borderTop: `4px solid ${BRAND.orange}`,
      }}>
        <Text style={{
          color: BRAND.orange,
          fontSize: '11px',
          fontWeight: '700',
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          margin: '0 0 8px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
        }}>
          Share Your Experience
        </Text>
        <Text style={{ ...emailStyles.h2, textAlign: 'center', marginBottom: '10px' }}>
          How Was Your Journey?
        </Text>
        <Text style={{ ...emailStyles.body, color: BRAND.muted, margin: '0 0 20px', textAlign: 'center' }}>
          Your feedback helps other devotees plan their pilgrimage and motivates our 
          team to keep improving our service.
        </Text>

        {/* Star rating visual */}
        <Text style={{ fontSize: '28px', margin: '0 0 20px', lineHeight: '1' }}>
          ★★★★★
        </Text>

        <Link
          href="https://www.jyotirlingconnect.com/share/testimonial"
          style={emailStyles.button}
          className="btn-cta"
        >
          Share Your Experience
        </Link>
      </div>

      {/* ── Book Again ────────────────────────────── */}
      <div style={{
        backgroundColor: BRAND.surface,
        border: `1px solid ${BRAND.border}`,
        borderRadius: '8px',
        padding: '16px 20px',
        marginBottom: '24px',
        textAlign: 'center',
      }}>
        <Text style={{ color: BRAND.charcoal, fontSize: '13px', fontWeight: '700', margin: '0 0 6px' }}>
          Planning Your Next Pilgrimage?
        </Text>
        <Text style={{ ...emailStyles.caption, color: BRAND.body, margin: '0 0 12px' }}>
          Explore our range of Jyotirlinga packages and book your next sacred journey.
        </Text>
        <Link href="https://www.jyotirlingconnect.com/booking" style={emailStyles.buttonSecondary} className="btn-cta">
          Book Again
        </Link>
      </div>

      {/* ── Booking Reference ─────────────────────── */}
      <Text style={{ ...emailStyles.caption, textAlign: 'center', color: BRAND.muted }}>
        Booking Reference: <strong style={{ color: BRAND.charcoal, fontFamily: 'monospace' }}>{bookingId}</strong>
      </Text>

    </EmailLayout>
  );
};
