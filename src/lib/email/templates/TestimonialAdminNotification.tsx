import * as React from 'react';
import { Section, Text, Link } from '@react-email/components';
import { EmailLayout, InfoRow, emailStyles, BRAND } from './EmailLayout';

interface TestimonialAdminNotificationProps {
  customerName: string;
  rating: number;
  packageType: string;
  submissionDate: string;
}

export const TestimonialAdminNotification: React.FC<TestimonialAdminNotificationProps> = ({
  customerName,
  rating,
  packageType,
  submissionDate,
}) => {
  const formattedDate = (() => {
    try { return new Date(submissionDate).toLocaleDateString('en-IN', { dateStyle: 'long' }); }
    catch { return submissionDate; }
  })();

  const stars = '★'.repeat(Math.min(5, Math.max(0, rating))) + '☆'.repeat(Math.max(0, 5 - rating));

  return (
    <EmailLayout previewText={`New Testimonial from ${customerName} — ${rating}/5 stars · Jyotirling Connect`}>

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
          New Testimonial Received
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
        <Text style={{ color: BRAND.goldLight, fontSize: '18px', margin: '6px 0 0', letterSpacing: '2px' }}>
          {stars}
        </Text>
      </div>

      <Text style={{ ...emailStyles.body, margin: '0 0 24px' }}>
        A new testimonial has been submitted on Jyotirling Connect and is pending your review. 
        Please visit the admin dashboard to approve or manage this review.
      </Text>

      {/* ── Testimonial Details Card ──────────────── */}
      <div style={emailStyles.cardAccent}>
        <Text style={emailStyles.cardTitle}>Testimonial Details</Text>
        <InfoRow label="Customer"       value={customerName} />
        <InfoRow label="Rating"         value={`${rating} / 5 (${stars})`} />
        <InfoRow label="Package"        value={packageType || 'Not specified'} />
        <InfoRow label="Submitted On"   value={formattedDate} isLast />
      </div>

      {/* ── Action Note ───────────────────────────── */}
      <div style={{
        backgroundColor: BRAND.surface,
        border: `1px solid ${BRAND.border}`,
        borderRadius: '8px',
        padding: '16px 20px',
        marginBottom: '24px',
      }}>
        <Text style={{ color: BRAND.charcoal, fontSize: '13px', fontWeight: '700', margin: '0 0 6px' }}>
          Action Required
        </Text>
        <Text style={{ ...emailStyles.caption, color: BRAND.body, margin: '0' }}>
          Visit the admin dashboard to review, approve, or reject this testimonial before it 
          appears publicly on the website.
        </Text>
      </div>

      {/* ── CTA ───────────────────────────────────── */}
      <Section style={emailStyles.center}>
        <Link href="https://www.jyotirlingconnect.com/admin/testimonials" style={emailStyles.buttonDark} className="btn-cta">
          Review Testimonial
        </Link>
      </Section>

    </EmailLayout>
  );
};
