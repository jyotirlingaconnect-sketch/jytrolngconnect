'use server';

import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { sendEmail } from '@/lib/email/sendEmail';
import { ADMIN_EMAIL } from '@/lib/email';
import { TestimonialAdminNotification } from '@/lib/email/templates/TestimonialAdminNotification';
import React from 'react';

export async function createTestimonialAction(formData: any) {
  try {
    const { data: testimonial, error } = await supabaseAdmin.from('testimonials').insert([
      {
        customer_name: formData.customer_name,
        rating: formData.rating,
        review_text: formData.review_text,
        package_name: formData.package_name || null,
        is_approved: false,
      }
    ]).select().single();

    if (error) {
      console.error('Error inserting testimonial:', error);
      return { success: false, error: 'Failed to save testimonial' };
    }

    sendEmail({
      to: ADMIN_EMAIL,
      subject: `New Testimonial Submitted by ${formData.customer_name}`,
      react: React.createElement(TestimonialAdminNotification, {
        customerName: formData.customer_name,
        rating: formData.rating,
        packageType: formData.package_name || '',
        submissionDate: testimonial.created_at,
      }),
      emailType: 'testimonial_admin',
    });

    return { success: true };
  } catch (error: any) {
    console.error('Unhandled error in createTestimonialAction:', error);
    return { success: false, error: 'Internal server error' };
  }
}
