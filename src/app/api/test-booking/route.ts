import { NextResponse } from 'next/server';
import { createBookingAction } from '@/app/actions/booking';

export async function GET() {
  console.log('[DEBUG_TRACE] Triggering test booking via API...');
  try {
    const result = await createBookingAction({
      full_name: 'Test Debug Trace',
      phone: '1234567890',
      email: 'testdebug@example.com',
      travel_date: new Date().toISOString(),
      no_of_passengers: '2',
      vehicle_preference: 'Innova Crysta',
      pickup_location: 'Test Pickup',
      drop_location: 'Test Drop',
      message: 'Debug trace test',
      user_id: null,
      user_email: null,
      package_name: ''
    });

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error('[DEBUG_TRACE] Exception in test API:', error);
    return NextResponse.json({ success: false, error: error?.message });
  }
}
