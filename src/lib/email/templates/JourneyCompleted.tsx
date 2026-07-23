import * as React from 'react';
import { Section, Text, Button } from '@react-email/components';
import { EmailLayout } from './EmailLayout';

interface JourneyCompletedProps {
  customerName: string;
  bookingId: string;
}

export const JourneyCompleted: React.FC<JourneyCompletedProps> = ({
  customerName,
  bookingId,
}) => {
  return (
    <EmailLayout previewText={`Journey Completed - ${bookingId}`}>
      <Text className="text-xl font-bold text-ink mb-4 mt-0">
        Har Har Mahadev, {customerName}!
      </Text>
      <Text className="text-gray-600 mb-6">
        We hope your divine journey with Jyotirling Connect was comfortable, peaceful, and spiritually fulfilling.
      </Text>

      <Text className="text-gray-600 mb-6">
        Your feedback is extremely valuable to us. It helps us improve our services and guide other devotees in planning their pilgrimage.
      </Text>

      <Section className="text-center mb-8">
        <Button 
          href={`https://www.jyotirlingconnect.com/share/testimonial`} 
          className="bg-[#D4AF6A] text-white font-bold px-6 py-3 rounded-full no-underline"
        >
          Share Your Experience
        </Button>
      </Section>

      <Text className="text-gray-600 mb-6">
        Thank you for giving us the opportunity to serve you. We look forward to being a part of your future spiritual journeys.
      </Text>
    </EmailLayout>
  );
};
