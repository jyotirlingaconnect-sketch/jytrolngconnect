import * as React from 'react';
import { Section, Text, Button, Row, Column } from '@react-email/components';
import { EmailLayout } from './EmailLayout';

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
  return (
    <EmailLayout previewText={`New Booking: ${customerName}`}>
      <Text className="text-xl font-bold text-ink mb-4 mt-0">
        New Booking Received
      </Text>
      <Text className="text-gray-600 mb-6">
        A new booking request has been submitted on Jyotirling Connect.
      </Text>

      <Section className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
        <Row className="mb-2">
          <Column className="w-1/3"><Text className="text-gray-500 text-sm m-0">Booking ID</Text></Column>
          <Column><Text className="font-semibold text-ink text-sm m-0">{bookingId}</Text></Column>
        </Row>
        <Row className="mb-2">
          <Column className="w-1/3"><Text className="text-gray-500 text-sm m-0">Customer</Text></Column>
          <Column><Text className="font-semibold text-ink text-sm m-0">{customerName}</Text></Column>
        </Row>
        <Row className="mb-2">
          <Column className="w-1/3"><Text className="text-gray-500 text-sm m-0">Phone</Text></Column>
          <Column><Text className="font-semibold text-ink text-sm m-0">{phoneNumber}</Text></Column>
        </Row>
        <Row className="mb-2">
          <Column className="w-1/3"><Text className="text-gray-500 text-sm m-0">Email</Text></Column>
          <Column><Text className="font-semibold text-ink text-sm m-0">{email || 'N/A'}</Text></Column>
        </Row>
        <Row className="mb-2">
          <Column className="w-1/3"><Text className="text-gray-500 text-sm m-0">Package/Vehicle</Text></Column>
          <Column><Text className="font-semibold text-ink text-sm m-0">{packageType || 'N/A'} {fleet ? `(${fleet})` : ''}</Text></Column>
        </Row>
        <Row className="mb-2">
          <Column className="w-1/3"><Text className="text-gray-500 text-sm m-0">Travel Date</Text></Column>
          <Column><Text className="font-semibold text-ink text-sm m-0">{new Date(travelDate).toLocaleDateString()}</Text></Column>
        </Row>
        <Row className="mb-2">
          <Column className="w-1/3"><Text className="text-gray-500 text-sm m-0">Pickup</Text></Column>
          <Column><Text className="font-semibold text-ink text-sm m-0">{pickupLocation}</Text></Column>
        </Row>
        <Row className="mb-2">
          <Column className="w-1/3"><Text className="text-gray-500 text-sm m-0">Passengers</Text></Column>
          <Column><Text className="font-semibold text-ink text-sm m-0">{passengerCount}</Text></Column>
        </Row>
        <Row className="mb-2">
          <Column className="w-1/3"><Text className="text-gray-500 text-sm m-0">Booking Time</Text></Column>
          <Column><Text className="font-semibold text-ink text-sm m-0">{new Date(bookingTime).toLocaleString()}</Text></Column>
        </Row>
        {message && (
          <Row>
            <Column className="w-1/3"><Text className="text-gray-500 text-sm m-0">Message</Text></Column>
            <Column><Text className="font-semibold text-ink text-sm m-0">{message}</Text></Column>
          </Row>
        )}
      </Section>

      <Section className="text-center">
        <Button 
          href={`https://www.jyotirlingconnect.com/admin/bookings`} 
          className="bg-ink text-white font-bold px-6 py-3 rounded-full no-underline"
        >
          View Booking
        </Button>
      </Section>
    </EmailLayout>
  );
};
