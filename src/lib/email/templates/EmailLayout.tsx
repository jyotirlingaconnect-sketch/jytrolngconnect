import * as React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Preview,
  Hr,
} from '@react-email/components';

// ─── Design Tokens ───────────────────────────────────────────────────────────
export const BRAND = {
  orange:    '#C8611A',
  gold:      '#D4AF6A',
  goldLight: '#F5D08B',
  charcoal:  '#1A1A1A',
  dark:      '#2D2D2D',
  body:      '#4A4A4A',
  muted:     '#6B7280',
  border:    '#E5E7EB',
  surface:   '#F9FAFB',
  white:     '#FFFFFF',
  green:     '#16A34A',
  red:       '#DC2626',
};

// ─── Exported Shared Styles (imported by all templates) ──────────────────────
export const emailStyles = {
  // Typography
  h1: {
    color: BRAND.charcoal,
    fontSize: '24px',
    fontWeight: '700',
    lineHeight: '1.3',
    margin: '0 0 8px',
    letterSpacing: '-0.3px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
  } as React.CSSProperties,

  h2: {
    color: BRAND.charcoal,
    fontSize: '18px',
    fontWeight: '700',
    lineHeight: '1.4',
    margin: '0 0 16px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
  } as React.CSSProperties,

  body: {
    color: BRAND.body,
    fontSize: '15px',
    lineHeight: '1.7',
    margin: '0 0 16px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
  } as React.CSSProperties,

  caption: {
    color: BRAND.muted,
    fontSize: '13px',
    lineHeight: '1.6',
    margin: '0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
  } as React.CSSProperties,

  // Cards
  card: {
    backgroundColor: BRAND.surface,
    border: `1px solid ${BRAND.border}`,
    borderRadius: '12px',
    padding: '24px',
    margin: '24px 0',
  } as React.CSSProperties,

  cardAccent: {
    backgroundColor: '#FFFBF5',
    border: `1px solid #E8C98040`,
    borderRadius: '12px',
    padding: '24px',
    margin: '24px 0',
    borderLeftWidth: '4px',
    borderLeftColor: BRAND.orange,
    borderLeftStyle: 'solid',
  } as React.CSSProperties,

  cardDanger: {
    backgroundColor: '#FEF2F2',
    border: `1px solid #FCA5A530`,
    borderRadius: '12px',
    padding: '24px',
    margin: '24px 0',
    borderLeftWidth: '4px',
    borderLeftColor: BRAND.red,
    borderLeftStyle: 'solid',
  } as React.CSSProperties,

  cardSuccess: {
    backgroundColor: '#F0FDF4',
    border: `1px solid #86EFAC30`,
    borderRadius: '12px',
    padding: '24px',
    margin: '24px 0',
    borderLeftWidth: '4px',
    borderLeftColor: BRAND.green,
    borderLeftStyle: 'solid',
  } as React.CSSProperties,

  cardAdmin: {
    backgroundColor: BRAND.surface,
    border: `1px solid ${BRAND.border}`,
    borderRadius: '12px',
    padding: '24px',
    margin: '24px 0',
    borderLeftWidth: '4px',
    borderLeftColor: BRAND.charcoal,
    borderLeftStyle: 'solid',
  } as React.CSSProperties,

  // Card section title
  cardTitle: {
    color: BRAND.charcoal,
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '1px',
    textTransform: 'uppercase' as const,
    margin: '0 0 16px',
    paddingBottom: '12px',
    borderBottom: `1px solid ${BRAND.border}`,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
  } as React.CSSProperties,

  // Info row
  rowLabel: {
    color: BRAND.muted,
    fontSize: '11px',
    fontWeight: '600',
    margin: '0',
    letterSpacing: '0.5px',
    textTransform: 'uppercase' as const,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
    whiteSpace: 'nowrap' as const,
  } as React.CSSProperties,

  rowValue: {
    color: BRAND.charcoal,
    fontSize: '14px',
    fontWeight: '600',
    margin: '0',
    lineHeight: '1.5',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
  } as React.CSSProperties,

  // Buttons
  button: {
    backgroundColor: BRAND.orange,
    color: BRAND.white,
    fontSize: '14px',
    fontWeight: '700',
    textDecoration: 'none',
    padding: '14px 32px',
    borderRadius: '8px',
    display: 'inline-block',
    letterSpacing: '0.2px',
    lineHeight: '1',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
  } as React.CSSProperties,

  buttonDark: {
    backgroundColor: BRAND.charcoal,
    color: BRAND.white,
    fontSize: '14px',
    fontWeight: '700',
    textDecoration: 'none',
    padding: '14px 32px',
    borderRadius: '8px',
    display: 'inline-block',
    letterSpacing: '0.2px',
    lineHeight: '1',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
  } as React.CSSProperties,

  buttonSecondary: {
    backgroundColor: 'transparent',
    color: BRAND.orange,
    fontSize: '14px',
    fontWeight: '600',
    textDecoration: 'none',
    padding: '12px 28px',
    borderRadius: '8px',
    display: 'inline-block',
    border: `2px solid ${BRAND.orange}`,
    letterSpacing: '0.2px',
    lineHeight: '1',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
  } as React.CSSProperties,

  center: {
    textAlign: 'center' as const,
    padding: '8px 0 24px',
  } as React.CSSProperties,

  divider: {
    borderColor: BRAND.border,
    margin: '24px 0',
  } as React.CSSProperties,
};

// ─── Reusable Info Row Component ─────────────────────────────────────────────
interface InfoRowProps {
  label: string;
  value: React.ReactNode;
  isLast?: boolean;
}

export const InfoRow: React.FC<InfoRowProps> = ({ label, value, isLast = false }) => (
  <table
    width="100%"
    cellPadding="0"
    cellSpacing="0"
    style={{
      borderBottom: isLast ? 'none' : `1px solid ${BRAND.border}`,
      marginBottom: '0',
    }}
  >
    <tbody>
      <tr>
        <td style={{ padding: '10px 0', width: '38%', verticalAlign: 'top' }}>
          <span style={emailStyles.rowLabel}>{label}</span>
        </td>
        <td style={{ padding: '10px 0 10px 12px', verticalAlign: 'top' }}>
          <span style={emailStyles.rowValue}>{value}</span>
        </td>
      </tr>
    </tbody>
  </table>
);

// ─── Main Email Layout ───────────────────────────────────────────────────────
interface EmailLayoutProps {
  previewText: string;
  children: React.ReactNode;
}

export const EmailLayout: React.FC<EmailLayoutProps> = ({ previewText, children }) => {
  const year = new Date().getFullYear();

  return (
    <Html lang="en" dir="ltr">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <style>{`
          @media only screen and (max-width: 600px) {
            .email-wrapper { margin: 0 !important; border-radius: 0 !important; }
            .email-content { padding: 24px 20px !important; }
            .email-footer  { padding: 24px 20px !important; }
            .email-header  { padding: 20px 20px !important; }
            .footer-td     { display: block !important; text-align: center !important; margin-bottom: 12px; }
            .btn-cta       { display: block !important; text-align: center !important; }
          }
        `}</style>
      </Head>
      <Preview>{previewText}</Preview>
      <Body style={{
        backgroundColor: '#F3F4F6',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        margin: '0',
        padding: '0',
        WebkitTextSizeAdjust: '100%',
        textSizeAdjust: '100%',
      } as React.CSSProperties}>
        <Container style={{
          maxWidth: '600px',
          margin: '32px auto',
          backgroundColor: BRAND.white,
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          border: `1px solid ${BRAND.border}`,
        }} className="email-wrapper">

          {/* ── Header / Logo ─────────────────────────── */}
          <Section style={{
            backgroundColor: BRAND.charcoal,
            padding: '28px 40px',
            textAlign: 'center',
          }} className="email-header">
            <div style={{ lineHeight: '1', marginBottom: '6px' }}>
              <span style={{
                fontSize: '22px',
                fontWeight: '800',
                color: BRAND.goldLight,
                letterSpacing: '-0.5px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
              }}>
                Jyotirling
              </span>
              <span style={{
                fontSize: '22px',
                fontWeight: '800',
                color: BRAND.white,
                letterSpacing: '-0.5px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
              }}>
                Connect
              </span>
            </div>
            <Text style={{
              color: BRAND.gold,
              fontSize: '10px',
              fontWeight: '500',
              letterSpacing: '2.5px',
              textTransform: 'uppercase',
              margin: '0',
              opacity: 0.8,
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
            }}>
              Premium Spiritual Travel Partner
            </Text>
          </Section>

          {/* ── Saffron Accent Bar ─────────────────────── */}
          <div style={{
            height: '4px',
            backgroundColor: BRAND.orange,
            backgroundImage: `linear-gradient(90deg, ${BRAND.orange} 0%, ${BRAND.goldLight} 50%, ${BRAND.orange} 100%)`,
          }} />

          {/* ── Email Body ─────────────────────────────── */}
          <Section style={{
            padding: '40px 40px 32px',
            backgroundColor: BRAND.white,
          }} className="email-content">
            {children}
          </Section>

          {/* ── Footer ─────────────────────────────────── */}
          <Section style={{
            backgroundColor: BRAND.surface,
            borderTop: `1px solid ${BRAND.border}`,
            padding: '32px 40px',
            textAlign: 'center',
          }} className="email-footer">

            <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '20px' }}>
              <tbody>
                <tr>
                  <td className="footer-td" style={{ textAlign: 'center', padding: '0 8px' }}>
                    <Text style={{ color: BRAND.muted, fontSize: '10px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 3px' }}>Website</Text>
                    <Link href="https://www.jyotirlingconnect.com" style={{ color: BRAND.orange, fontSize: '12px', fontWeight: '500', textDecoration: 'none' }}>
                      jyotirlingconnect.com
                    </Link>
                  </td>
                  <td className="footer-td" style={{ textAlign: 'center', padding: '0 8px' }}>
                    <Text style={{ color: BRAND.muted, fontSize: '10px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 3px' }}>Phone</Text>
                    <Link href="tel:+916268032441" style={{ color: BRAND.orange, fontSize: '12px', fontWeight: '500', textDecoration: 'none' }}>
                      +91 62680 32441
                    </Link>
                  </td>
                  <td className="footer-td" style={{ textAlign: 'center', padding: '0 8px' }}>
                    <Text style={{ color: BRAND.muted, fontSize: '10px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 3px' }}>WhatsApp</Text>
                    <Link href="https://wa.me/916268032441" style={{ color: BRAND.orange, fontSize: '12px', fontWeight: '500', textDecoration: 'none' }}>
                      +91 62680 32441
                    </Link>
                  </td>
                  <td className="footer-td" style={{ textAlign: 'center', padding: '0 8px' }}>
                    <Text style={{ color: BRAND.muted, fontSize: '10px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 3px' }}>Email</Text>
                    <Link href="mailto:jyotirlingaconnect@gmail.com" style={{ color: BRAND.orange, fontSize: '12px', fontWeight: '500', textDecoration: 'none' }}>
                      jyotirlingaconnect@gmail.com
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>

            <Hr style={{ borderColor: BRAND.border, margin: '0 0 16px' }} />

            <Text style={{
              color: BRAND.muted,
              fontSize: '11px',
              lineHeight: '1.6',
              margin: '0 0 8px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
            }}>
              {`© ${year} Jyotirling Connect. All rights reserved. · 24/7 Support Available`}
            </Text>

            <Text style={{ color: BRAND.muted, fontSize: '11px', margin: '0', lineHeight: '2' }}>
              <Link href="https://www.jyotirlingconnect.com/privacy-policy" style={{ color: BRAND.muted, textDecoration: 'underline', marginRight: '16px' }}>
                Privacy Policy
              </Link>
              <Link href="https://www.jyotirlingconnect.com/terms-conditions" style={{ color: BRAND.muted, textDecoration: 'underline', marginRight: '16px' }}>
                Terms &amp; Conditions
              </Link>
              <Link href="https://www.jyotirlingconnect.com" style={{ color: BRAND.muted, textDecoration: 'underline' }}>
                Visit Website
              </Link>
            </Text>

          </Section>
        </Container>
      </Body>
    </Html>
  );
};
