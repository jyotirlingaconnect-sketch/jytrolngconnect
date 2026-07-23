import * as React from 'react';
import { Html, Head, Body, Container, Section, Text, Img, Hr, Link, Preview, Tailwind } from '@react-email/components';

interface EmailLayoutProps {
  previewText: string;
  children: React.ReactNode;
}

export const EmailLayout: React.FC<EmailLayoutProps> = ({ previewText, children }) => {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: {
                  DEFAULT: '#D4AF6A',
                  light: '#F5D08B',
                  dark: '#A68245',
                },
                ink: '#0A0A0A',
              },
            },
          },
        }}
      >
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto my-8 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg max-w-[600px]">
            {/* Header */}
            <Section className="bg-ink px-8 py-6 text-center">
              <Text className="text-brand font-bold text-2xl m-0 tracking-widest">
                JYOTIRLING CONNECT
              </Text>
            </Section>
            
            {/* Content */}
            <Section className="px-8 py-8">
              {children}
            </Section>

            {/* Footer */}
            <Hr className="border-gray-200 my-0" />
            <Section className="bg-gray-50 px-8 py-6 text-center">
              <Text className="text-gray-500 text-sm mb-4 mt-0">
                Need assistance? Contact our support team 24/7.
              </Text>
              <Link href="https://www.jyotirlingconnect.com" className="text-brand-dark font-medium">
                Visit Jyotirling Connect
              </Link>
              <Text className="text-gray-400 text-xs mt-4 mb-0">
                © {new Date().getFullYear()} Jyotirling Connect. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
