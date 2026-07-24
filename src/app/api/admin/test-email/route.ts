import { NextResponse } from 'next/server';
import { getResendClient, getSenderEmail, getAdminEmail } from '@/lib/email';
import { sendEmail } from '@/lib/email/sendEmail';
import React from 'react';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const targetEmail = searchParams.get('to') || getAdminEmail();

    const rawApiKey = process.env.RESEND_API_KEY;
    const sender = getSenderEmail();
    const admin = getAdminEmail();
    const resendClient = getResendClient();

    const envStatus = {
      RESEND_API_KEY_EXISTS: !!rawApiKey,
      RESEND_API_KEY_LENGTH: rawApiKey ? rawApiKey.length : 0,
      EMAIL_FROM: sender,
      ADMIN_EMAIL: admin,
      RESEND_CLIENT_INITIALIZED: !!resendClient,
    };

    if (!resendClient) {
      return NextResponse.json(
        {
          success: false,
          message: 'Resend API key is missing or failed to initialize.',
          envStatus,
        },
        { status: 400 }
      );
    }

    // Send test email
    const testResult = await sendEmail({
      to: targetEmail,
      subject: `[Diagnostic Test] Jyotirling Connect Email System`,
      react: React.createElement('div', { style: { fontFamily: 'sans-serif', padding: '20px' } }, [
        React.createElement('h2', { key: 'h2', style: { color: '#C8B091' } }, 'Jyotirling Connect — Email System Diagnostic Test'),
        React.createElement('p', { key: 'p1' }, `This is a test email sent from the Jyotirling Connect server at ${new Date().toISOString()}.`),
        React.createElement('p', { key: 'p2' }, `Target Recipient: ${targetEmail}`),
        React.createElement('p', { key: 'p3' }, `Sender Identity: ${sender}`),
      ]),
      emailType: 'diagnostic_test',
    });

    return NextResponse.json({
      success: testResult.success,
      envStatus,
      result: testResult,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to execute test email diagnostic',
      },
      { status: 500 }
    );
  }
}
