import * as React from 'react';
import { Section, Text, Row, Column } from '@react-email/components';
import { EmailLayout } from './EmailLayout';

interface ContactAdminNotificationProps {
  name: string;
  phone: string;
  email: string;
  message: string;
}

export const ContactAdminNotification: React.FC<ContactAdminNotificationProps> = ({
  name,
  phone,
  email,
  message,
}) => {
  return (
    <EmailLayout previewText={`New Contact Message from ${name}`}>
      <Text className="text-xl font-bold text-ink mb-4 mt-0">
        New Contact Submission
      </Text>
      <Text className="text-gray-600 mb-6">
        A new message has been submitted via the contact form.
      </Text>

      <Section className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
        <Row className="mb-2">
          <Column className="w-1/3"><Text className="text-gray-500 text-sm m-0">Name</Text></Column>
          <Column><Text className="font-semibold text-ink text-sm m-0">{name}</Text></Column>
        </Row>
        <Row className="mb-2">
          <Column className="w-1/3"><Text className="text-gray-500 text-sm m-0">Phone</Text></Column>
          <Column><Text className="font-semibold text-ink text-sm m-0">{phone}</Text></Column>
        </Row>
        <Row className="mb-2">
          <Column className="w-1/3"><Text className="text-gray-500 text-sm m-0">Email</Text></Column>
          <Column><Text className="font-semibold text-ink text-sm m-0">{email || 'N/A'}</Text></Column>
        </Row>
        <Row>
          <Column className="w-1/3"><Text className="text-gray-500 text-sm m-0">Message</Text></Column>
          <Column><Text className="font-semibold text-ink text-sm m-0 whitespace-pre-wrap">{message}</Text></Column>
        </Row>
      </Section>
    </EmailLayout>
  );
};
