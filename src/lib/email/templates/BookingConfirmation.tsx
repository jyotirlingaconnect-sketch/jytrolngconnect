import * as React from 'react';
import { Section, Text, Button, Row, Column } from '@react-email/components';
import { EmailLayout } from './EmailLayout';

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
  return (
    <EmailLayout previewText={`Booking Received - ${bookingId}`}>
      <Text className="text-xl font-bold text-ink mb-4 mt-0">
        Namaste {customerName},
      </Text>
      <Text className="text-gray-600 mb-6">
        Thank you for choosing Jyotirling Connect for your divine journey. Your booking request has been received and is currently <strong className="text-brand-dark uppercase">{bookingStatus}</strong>.
      </Text>

      <Section className="bg-[#D4AF6A]/10 border border-[#D4AF6A]/20 rounded-xl p-6 mb-8">
        <Text className="text-lg font-bold text-ink mb-4 mt-0 border-b border-[#D4AF6A]/20 pb-2">
          Journey Details
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

        <Row className="mb-2">
          <Column className="w-1/3"><Text className="text-gray-500 text-sm m-0">Pickup Location</Text></Column>
          <Column><Text className="font-semibold text-ink text-sm m-0">{pickupLocation}</Text></Column>
        </Row>

        <Row>
          <Column className="w-1/3"><Text className="text-gray-500 text-sm m-0">Passengers</Text></Column>
          <Column><Text className="font-semibold text-ink text-sm m-0">{passengers}</Text></Column>
        </Row>
      </Section>

      <Text className="text-gray-600 mb-6">
        Our team will review your request and confirm the details shortly. If you have any immediate questions, please contact our support at <strong className="text-ink">{supportContact}</strong>.
      </Text>

      <Section className="text-center">
        <Button 
          href={`https://www.jyotirlingconnect.com/contact`} 
          className="bg-[#D4AF6A] text-white font-bold px-6 py-3 rounded-full no-underline"
        >
          Contact Support
        </Button>
      </Section>
    </EmailLayout>
  );
};
