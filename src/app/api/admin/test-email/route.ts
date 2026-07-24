import { NextResponse } from 'next/server';
import { getResendClient, getSenderEmail, getAdminEmail } from '@/lib/email';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { BookingConfirmation } from '@/lib/email/templates/BookingConfirmation';
import React from 'react';
import { render } from '@react-email/render';

export async function GET(request: Request) {
  const steps: any = {};
  
  try {
    const { searchParams } = new URL(request.url);
    const targetEmail = searchParams.get('to') || getAdminEmail();

    // STEP 1: Environment Variables Check
    steps.step1_environment = {
      RESEND_API_KEY_EXISTS: !!process.env.RESEND_API_KEY,
      RESEND_API_KEY_LENGTH: process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.length : 0,
      EMAIL_FROM: getSenderEmail(),
      ADMIN_EMAIL: getAdminEmail(),
    };
    if (!process.env.RESEND_API_KEY) throw new Error('Missing RESEND_API_KEY');

    // STEP 2: Database Connection Check
    try {
      const { error } = await supabaseAdmin.from('bookings').select('id').limit(1);
      if (error) throw error;
      steps.step2_database = 'PASS (Connected to Supabase)';
    } catch (dbError: any) {
      steps.step2_database = `FAIL: ${dbError.message}`;
      throw dbError;
    }

    // STEP 3: React Email Template Check
    let htmlContent = '';
    try {
      const mockProps = {
        customerName: 'Diagnostic Test User',
        bookingId: '00000000-0000-0000-0000-000000000000',
        packageType: 'Diagnostic Package',
        fleet: 'N/A',
        journeyDate: new Date().toISOString(),
        pickupLocation: 'Test Location',
        passengers: 2,
        bookingStatus: 'Diagnostic',
        supportContact: 'test@example.com',
      };
      
      const reactElement = React.createElement(BookingConfirmation, mockProps);
      htmlContent = await render(reactElement);
      steps.step3_reactRender = `PASS (Rendered HTML length: ${htmlContent.length})`;
    } catch (renderError: any) {
      steps.step3_reactRender = `FAIL: ${renderError.message || renderError}`;
      throw renderError;
    }

    // STEP 4: Resend Payload Construction Check
    const resendClient = getResendClient();
    if (!resendClient) throw new Error('Failed to initialize Resend client');
    
    const payload = {
      from: getSenderEmail(),
      to: [targetEmail],
      subject: `[Diagnostic] Booking Confirmation Test`,
      html: htmlContent.substring(0, 50) + '... (truncated)', 
    };
    steps.step4_payload = { status: 'PASS', payload };

    // STEP 5: API Execution Check
    const startTime = Date.now();
    let response;
    try {
      response = await resendClient.emails.send({
        from: getSenderEmail(),
        to: [targetEmail],
        subject: `[Diagnostic] Booking Confirmation Test`,
        html: htmlContent,
      });
      const duration = Date.now() - startTime;
      steps.step5_apiExecution = `PASS (Took ${duration}ms)`;
    } catch (apiError: any) {
      steps.step5_apiExecution = `FAIL: Network or Uncaught Exception (${apiError.message})`;
      throw apiError;
    }

    // STEP 6: Response Validation Check
    if (response.error) {
      steps.step6_responseValidation = { status: 'FAIL', error: response.error };
      throw new Error(`Resend returned error: ${response.error.message}`);
    } else {
      steps.step6_responseValidation = { status: 'PASS', data: response.data };
    }

    // STEP 7: Database Logging Check
    try {
      const { error } = await supabaseAdmin.from('email_logs').insert({
        recipient: targetEmail,
        email_type: 'diagnostic_test',
        subject: `[Diagnostic] Booking Confirmation Test`,
        status: 'sent',
        resend_message_id: response.data?.id || 'test-id',
        booking_id: '00000000-0000-0000-0000-000000000000',
      });
      if (error) throw error;
      steps.step7_databaseLog = 'PASS (Inserted into email_logs)';
    } catch (logError: any) {
      steps.step7_databaseLog = `FAIL: ${logError.message}`;
      // Do not throw here, the email was actually sent
    }

    // STEP 8: Final Report
    return NextResponse.json({
      success: true,
      message: 'All diagnostic steps passed',
      steps,
    });

  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Diagnostic failed at an intermediate step',
        error: error?.message || 'Unknown error',
        steps,
      },
      { status: 500 }
    );
  }
}
