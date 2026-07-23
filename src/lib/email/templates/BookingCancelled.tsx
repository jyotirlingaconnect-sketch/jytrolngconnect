import * as React from 'react';
import { Section, Text, Row, Column } from '@react-email/components';
import { EmailLayout } from './EmailLayout';

interface BookingCancelledProps {
  customerName: string;
  bookingId: string;
  supportContact: string;
}

export const BookingCancelled: React.FC<BookingCancelledProps> = ({
  customerName,
  bookingId,
  supportContact,
}) => {
  return (
    <EmailLayout previewText={`Booking Cancelled - ${bookingId}`}>
      <Text className="text-xl font-bold text-ink mb-4 mt-0">
        Namaste {customerName},
      </Text>
      <Text className="text-gray-600 mb-6">
        We are writing to inform you that your booking <strong className="text-red-600 uppercase">HAS BEEN CANCELLED</strong>.
      </Text>

      <Section className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
        <Row>
          <Column className="w-1/3"><Text className="text-gray-500 text-sm m-0">Booking ID</Text></Column>
          <Column><Text className="font-semibold text-ink text-sm m-0">{bookingId}</Text></Column>
        </Row>
      </Section>

      <Text className="text-gray-600 mb-6">
        If you believe this was a mistake, or if you would like to make a new booking, please visit our website or contact support at <strong className="text-ink">{supportContact}</strong>.
      </Text>
    </EmailLayout>
  );
};
