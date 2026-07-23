import * as React from 'react';
import { Section, Text, Row, Column } from '@react-email/components';
import { EmailLayout } from './EmailLayout';

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
  return (
    <EmailLayout previewText={`New Testimonial from ${customerName}`}>
      <Text className="text-xl font-bold text-ink mb-4 mt-0">
        New Testimonial Submitted
      </Text>
      <Text className="text-gray-600 mb-6">
        A new testimonial has been submitted on Jyotirling Connect and is pending review.
      </Text>

      <Section className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
        <Row className="mb-2">
          <Column className="w-1/3"><Text className="text-gray-500 text-sm m-0">Customer</Text></Column>
          <Column><Text className="font-semibold text-ink text-sm m-0">{customerName}</Text></Column>
        </Row>
        <Row className="mb-2">
          <Column className="w-1/3"><Text className="text-gray-500 text-sm m-0">Rating</Text></Column>
          <Column><Text className="font-semibold text-ink text-sm m-0">{rating} / 5</Text></Column>
        </Row>
        <Row className="mb-2">
          <Column className="w-1/3"><Text className="text-gray-500 text-sm m-0">Package/Vehicle</Text></Column>
          <Column><Text className="font-semibold text-ink text-sm m-0">{packageType || 'N/A'}</Text></Column>
        </Row>
        <Row>
          <Column className="w-1/3"><Text className="text-gray-500 text-sm m-0">Date</Text></Column>
          <Column><Text className="font-semibold text-ink text-sm m-0">{new Date(submissionDate).toLocaleDateString()}</Text></Column>
        </Row>
      </Section>
    </EmailLayout>
  );
};
