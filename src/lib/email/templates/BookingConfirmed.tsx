import * as React from 'react';
import { Section, Text, Button, Row, Column } from '@react-email/components';
import { EmailLayout } from './EmailLayout';

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
  return (
    <EmailLayout previewText={`Booking Confirmed - ${bookingId}`}>
      <Text className="text-xl font-bold text-ink mb-4 mt-0">
        Jai Shree Mahakal, {customerName}!
      </Text>
      <Text className="text-gray-600 mb-6">
        Great news! Your booking <strong className="text-brand-dark">{bookingId}</strong> has been <strong className="text-green-600 uppercase">CONFIRMED</strong>. 
        We are thrilled to be part of your spiritual journey.
      </Text>

      <Section className="bg-[#D4AF6A]/10 border border-[#D4AF6A]/20 rounded-xl p-6 mb-8">
        <Text className="text-lg font-bold text-ink mb-4 mt-0 border-b border-[#D4AF6A]/20 pb-2">
          Confirmed Details
        </Text>
        
        <Row className="mb-2">
          <Column className="w-1/3"><Text className="text-gray-500 text-sm m-0">Booking ID</Text></Column>
          <Column><Text className="font-semibold text-ink text-sm m-0">{bookingId}</Text></Column>
        </Row>
        <Row className="mb-2">
          <Column className="w-1/3"><Text className="text-gray-500 text-sm m-0">Package/Vehicle</Text></Column>
          <Column><Text className="font-semibold text-ink text-sm m-0">{packageType || 'N/A'} {fleet ? `(${fleet})` : ''}</Text></Column>
        </Row>
        <Row className="mb-2">
          <Column className="w-1/3"><Text className="text-gray-500 text-sm m-0">Journey Date</Text></Column>
          <Column><Text className="font-semibold text-ink text-sm m-0">{new Date(journeyDate).toLocaleDateString(undefined, { dateStyle: 'long' })}</Text></Column>
        </Row>
        <Row>
          <Column className="w-1/3"><Text className="text-gray-500 text-sm m-0">Pickup</Text></Column>
          <Column><Text className="font-semibold text-ink text-sm m-0">{pickupLocation}</Text></Column>
        </Row>
      </Section>

      <Text className="text-gray-600 mb-6">
        Your driver details will be shared with you 12 hours prior to the journey. For any assistance, reach out to us at <strong className="text-ink">{supportContact}</strong>.
      </Text>
    </EmailLayout>
  );
};
