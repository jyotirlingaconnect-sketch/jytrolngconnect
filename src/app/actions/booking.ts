'use server';

import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { sendEmail } from '@/lib/email/sendEmail';
import { getAdminEmail } from '@/lib/email';
import { BookingConfirmation } from '@/lib/email/templates/BookingConfirmation';
import { AdminBookingNotification } from '@/lib/email/templates/AdminBookingNotification';
import { BookingConfirmed } from '@/lib/email/templates/BookingConfirmed';
import { BookingCancelled } from '@/lib/email/templates/BookingCancelled';
import React from 'react';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';
import { requireAdmin } from '@/lib/adminAuth';

export async function createBookingAction(formData: any) {
  try {
    const bookingId = uuidv4();
    const bookingReference = `JC-${bookingId.substring(0, 8).toUpperCase()}`;
    const customerEmail = formData.email || formData.user_email;
    const supportPhone = '+91 98765 43210';
    const adminEmail = getAdminEmail();

    console.log(`[BOOKING ACTION] Creating new booking: ${bookingReference}`, {
      full_name: formData.full_name,
      customerEmail,
      adminEmail,
    });

    // 1. Insert into Supabase
    const { error: insertError } = await supabaseAdmin.from('bookings').insert([
      {
        id: bookingId,
        booking_reference: bookingReference,
        full_name: formData.full_name,
        phone: formData.phone,
        email: customerEmail || null,
        travel_date: formData.travel_date,
        no_of_passengers: parseInt(formData.no_of_passengers, 10),
        vehicle_preference: formData.vehicle_preference,
        pickup_location: formData.pickup_location,
        drop_location: formData.drop_location,
        message: formData.message || null,
        status: 'pending',
        user_id: formData.user_id || null,
        user_email: formData.user_email || null,
      },
    ]);

    if (insertError) {
      console.error('[BOOKING ACTION ERROR] Database insert failed:', insertError);
      return { success: false, error: 'Failed to create booking in database' };
    }

    console.log(`[BOOKING ACTION] Booking saved to database. Starting emails execution...`);

    // 2. Prepare email tasks and await them so serverless functions don't terminate prematurely
    const emailPromises: Promise<any>[] = [];

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

    if (adminEmail) {
      emailPromises.push(
        sendEmail({
          to: adminEmail,
          subject: `🔔 New Booking Received – Jyotirling Connect`,
          react: React.createElement(AdminBookingNotification, {
            customerName: formData.full_name,
            phoneNumber: formData.phone,
            email: customerEmail || 'N/A',
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
    }

    // MANDATORY: Await all email promises to complete before returning
    const results = await Promise.allSettled(emailPromises);
    console.log(`[BOOKING ACTION] Email execution finished. Results:`, results);

    return { success: true, bookingId: bookingId, bookingReference };
  } catch (error: any) {
    console.error('[BOOKING ACTION ERROR] Unhandled exception:', error);
    return { success: false, error: error?.message || 'Internal server error' };
  }
}

const BOOKING_STATUSES = ['pending', 'confirmed', 'completed', 'cancelled'];

export async function updateBookingStatusAction(accessToken: string | undefined, bookingId: string, newStatus: string) {
  try {
    await requireAdmin(accessToken);
  } catch {
    return { success: false, error: 'Unauthorized: Admin access required' };
  }

  if (!BOOKING_STATUSES.includes(newStatus)) {
    return { success: false, error: 'Invalid booking status' };
  }

  try {
    // Read customer details from the database rather than trusting client-supplied data
    const { data: customerData, error } = await supabaseAdmin
      .from('bookings')
      .update({ status: newStatus })
      .eq('id', bookingId)
      .select('*')
      .single();
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
          packageType: customerData.package_name || '',
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
        await sendEmail({
          to: targetEmail,
          subject,
          react: emailComponent,
          emailType: 'status_change',
          bookingId,
        });
      }
    }

    revalidatePath('/admin/bookings');
    revalidatePath(`/admin/bookings/${bookingId}`);
    return { success: true };
  } catch (error: any) {
    console.error('[STATUS UPDATE ACTION ERROR]:', error);
    return { success: false, error: error.message };
  }
}

export async function retryBookingEmailAction(accessToken: string | undefined, bookingId: string, emailType: 'customer' | 'admin') {
  try {
    await requireAdmin(accessToken);
  } catch {
    return { success: false, error: 'Unauthorized: Admin access required' };
  }

  try {
    const { data: booking, error } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (error || !booking) {
      return { success: false, error: 'Booking not found' };
    }

    const bookingReference = booking.booking_reference || `JC-${booking.id.substring(0, 8).toUpperCase()}`;
    const customerEmail = booking.email || booking.user_email;
    const supportPhone = '+91 98765 43210';
    const adminEmail = getAdminEmail();

    if (emailType === 'customer') {
      if (!customerEmail) {
        return { success: false, error: 'Customer email address is missing' };
      }

      const result = await sendEmail({
        to: customerEmail,
        subject: `Booking Request Received - Jyotirling Connect`,
        react: React.createElement(BookingConfirmation, {
          customerName: booking.full_name,
          bookingId: bookingReference,
          packageType: booking.package_name || '',
          fleet: booking.vehicle_preference || '',
          journeyDate: booking.travel_date,
          pickupLocation: booking.pickup_location,
          passengers: booking.no_of_passengers || 1,
          bookingStatus: booking.status || 'pending',
          supportContact: supportPhone,
        }),
        emailType: 'booking_confirmation',
        bookingId: booking.id,
      });

      revalidatePath(`/admin/bookings/${bookingId}`);
      return result;
    } else if (emailType === 'admin') {
      if (!adminEmail) {
        return { success: false, error: 'Admin email address is missing' };
      }

      const result = await sendEmail({
        to: adminEmail,
        subject: `🔔 New Booking Received – Jyotirling Connect`,
        react: React.createElement(AdminBookingNotification, {
          customerName: booking.full_name,
          phoneNumber: booking.phone,
          email: customerEmail || 'N/A',
          packageType: booking.package_name || '',
          fleet: booking.vehicle_preference || '',
          pickupLocation: booking.pickup_location,
          travelDate: booking.travel_date,
          passengerCount: booking.no_of_passengers || 1,
          bookingTime: booking.created_at,
          bookingId: bookingReference,
          message: booking.message || '',
        }),
        emailType: 'admin_notification',
        bookingId: booking.id,
      });

      revalidatePath(`/admin/bookings/${bookingId}`);
      return result;
    }

    return { success: false, error: 'Invalid email type' };
  } catch (error: any) {
    console.error('[RETRY EMAIL ACTION ERROR]:', error);
    return { success: false, error: error?.message || 'Failed to retry email' };
  }
}
