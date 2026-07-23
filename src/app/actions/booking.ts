'use server';

import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { sendEmail } from '@/lib/email/sendEmail';
import { ADMIN_EMAIL } from '@/lib/email';
import { BookingConfirmation } from '@/lib/email/templates/BookingConfirmation';
import { AdminBookingNotification } from '@/lib/email/templates/AdminBookingNotification';
import { BookingConfirmed } from '@/lib/email/templates/BookingConfirmed';
import { BookingCancelled } from '@/lib/email/templates/BookingCancelled';
import React from 'react';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

export async function createBookingAction(formData: any) {
  try {
    const bookingId = uuidv4();
    const bookingReference = `JC-${bookingId.substring(0, 8)}`;
    
    // 1. Insert into Supabase
    const { error } = await supabaseAdmin.from('bookings').insert([
      {
        id: bookingId,
        booking_reference: bookingReference,
        full_name: formData.full_name,
        phone: formData.phone,
        email: formData.email || null,
        travel_date: formData.travel_date,
        no_of_passengers: parseInt(formData.no_of_passengers, 10),
        vehicle_preference: formData.vehicle_preference,
        pickup_location: formData.pickup_location,
        drop_location: formData.drop_location,
        message: formData.message || null,
        status: 'pending',
        user_id: formData.user_id || null,
        user_email: formData.user_email || null,
      }
    ]);

    if (error) {
      console.error('Error inserting booking:', error);
      return { success: false, error: 'Failed to create booking in database' };
    }

    // 2. Fire and forget emails safely
    const emailPromises = [];
    const customerEmail = formData.email || formData.user_email;
    const supportPhone = '+91 98765 43210';

    if (customerEmail) {
      emailPromises.push(
        sendEmail({
          to: customerEmail,
          subject: `Booking Request Received - Jyotirling Connect`,
          react: React.createElement(BookingConfirmation, {
            customerName: formData.full_name,
            bookingId: bookingReference,
            packageType: formData.package_name || '', 
            fleet: formData.vehicle_preference || '',
            journeyDate: formData.travel_date,
            pickupLocation: formData.pickup_location,
            passengers: parseInt(formData.no_of_passengers, 10),
            bookingStatus: 'pending',
            supportContact: supportPhone,
          }),
          emailType: 'booking_confirmation',
          bookingId: bookingId,
        })
      );
    }

    emailPromises.push(
      sendEmail({
        to: ADMIN_EMAIL,
        subject: `New Booking Received: ${formData.full_name}`,
        react: React.createElement(AdminBookingNotification, {
          customerName: formData.full_name,
          phoneNumber: formData.phone,
          email: customerEmail || '',
          packageType: formData.package_name || '',
          fleet: formData.vehicle_preference || '',
          pickupLocation: formData.pickup_location,
          travelDate: formData.travel_date,
          passengerCount: parseInt(formData.no_of_passengers, 10),
          bookingTime: new Date().toISOString(),
          bookingId: bookingReference,
          message: formData.message || '',
        }),
        emailType: 'admin_notification',
        bookingId: bookingId,
      })
    );

    Promise.allSettled(emailPromises).then(results => {
      console.log('Email sending completed for booking', bookingId);
    });

    return { success: true, bookingId: bookingId };
  } catch (error: any) {
    console.error('Unhandled error in createBookingAction:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function updateBookingStatusAction(bookingId: string, newStatus: string, customerData: any) {
  try {
    const { error } = await supabaseAdmin.from('bookings').update({ status: newStatus }).eq('id', bookingId);
    if (error) throw error;

    const targetEmail = customerData.email || customerData.user_email;

    if (targetEmail) {
      let emailComponent = null;
      let subject = '';

      if (newStatus === 'confirmed') {
        subject = 'Your Booking is Confirmed - Jyotirling Connect';
        emailComponent = React.createElement(BookingConfirmed, {
          customerName: customerData.full_name,
          bookingId: customerData.booking_reference || customerData.id.substring(0, 8),
          packageType: customerData.packageType || '',
          fleet: customerData.vehicle_preference || '',
          journeyDate: customerData.travel_date,
          pickupLocation: customerData.pickup_location,
          supportContact: '+91 98765 43210',
        });
      } else if (newStatus === 'cancelled') {
        subject = 'Booking Cancelled - Jyotirling Connect';
        emailComponent = React.createElement(BookingCancelled, {
          customerName: customerData.full_name,
          bookingId: customerData.booking_reference || customerData.id.substring(0, 8),
          supportContact: '+91 98765 43210',
        });
      }

      if (emailComponent) {
        // Fire and forget or await, we'll await so the admin gets feedback eventually or just let it run.
        sendEmail({
          to: targetEmail,
          subject,
          react: emailComponent,
          emailType: 'status_change',
          bookingId,
        });
      }
    }

    revalidatePath('/admin/bookings');
    return { success: true };
  } catch (error: any) {
    console.error('Error in updateBookingStatusAction:', error);
    return { success: false, error: error.message };
  }
}
