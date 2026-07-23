import * as React from 'react';
import { Section, Text, Row, Column } from '@react-email/components';
import { EmailLayout } from './EmailLayout';

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
  return (
    <EmailLayout previewText={`Your Journey Starts Tomorrow - ${bookingId}`}>
      <Text className="text-xl font-bold text-ink mb-4 mt-0">
        Namaste {customerName},
      </Text>
      <Text className="text-gray-600 mb-6">
        This is a friendly reminder that your spiritual journey with Jyotirling Connect starts tomorrow!
      </Text>

      <Section className="bg-[#D4AF6A]/10 border border-[#D4AF6A]/20 rounded-xl p-6 mb-8">
        <Row className="mb-2">
          <Column className="w-1/3"><Text className="text-gray-500 text-sm m-0">Journey Date</Text></Column>
          <Column><Text className="font-semibold text-ink text-sm m-0">{new Date(journeyDate).toLocaleDateString(undefined, { dateStyle: 'long' })}</Text></Column>
        </Row>
        <Row className="mb-2">
          <Column className="w-1/3"><Text className="text-gray-500 text-sm m-0">Pickup</Text></Column>
          <Column><Text className="font-semibold text-ink text-sm m-0">{pickupLocation}</Text></Column>
        </Row>
        {driverDetails && (
          <Row>
            <Column className="w-1/3"><Text className="text-gray-500 text-sm m-0">Driver</Text></Column>
            <Column><Text className="font-semibold text-ink text-sm m-0">{driverDetails}</Text></Column>
          </Row>
        )}
      </Section>

      <Text className="text-gray-600 mb-6">
        Please ensure you are ready at the pickup location. If you need to contact us urgently, please reach out to <strong className="text-ink">{supportContact}</strong>.
      </Text>
      <Text className="text-gray-600 mb-6">
        Wishing you a safe and blessed yatra.
      </Text>
    </EmailLayout>
  );
};
