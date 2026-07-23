'use server';

import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { sendEmail } from '@/lib/email/sendEmail';
import { ADMIN_EMAIL } from '@/lib/email';
import { ContactAdminNotification } from '@/lib/email/templates/ContactAdminNotification';
import React from 'react';

export async function createContactAction(formData: any) {
  try {
    const { data: contact, error } = await supabaseAdmin.from('bookings').insert([{
        full_name: formData.name,
        phone: formData.phone,
        email: formData.email || null,
        message: `Subject: ${formData.subject}\nDate: ${formData.travel_date}\nPassengers: ${formData.passengers}\n\n${formData.message}`,
        status: "pending",
        travel_date: formData.travel_date, // adding this just to be safe
        no_of_passengers: parseInt(formData.passengers, 10),
        pickup_location: "Contact Form Enquiry",
        drop_location: "Contact Form Enquiry"
      }]).select().single();

    if (error) {
      console.error('Error inserting contact message into bookings:', error);
      return { success: false, error: 'Failed to save message' };
    }

    sendEmail({
      to: ADMIN_EMAIL,
      subject: `New Contact Submission from ${formData.name}`,
      react: React.createElement(ContactAdminNotification, {
        name: formData.name,
        phone: formData.phone,
        email: formData.email || '',
        message: formData.message,
      }),
      emailType: 'contact_admin',
    });

    return { success: true };
  } catch (error: any) {
    console.error('Unhandled error in createContactAction:', error);
    return { success: false, error: 'Internal server error' };
  }
}
