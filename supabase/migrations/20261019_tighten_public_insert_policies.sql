-- Testimonials, email logs and bookings are only written server-side through the
-- service-role client (src/app/actions/testimonial.ts, src/lib/email/sendEmail.ts,
-- src/app/actions/booking.ts), which bypasses RLS. The open INSERT policies let
-- anyone holding the public anon key write rows directly, so remove them.

DROP POLICY IF EXISTS "Public insert access to testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Allow public insert to email_logs" ON public.email_logs;
DROP POLICY IF EXISTS "Public insert access to bookings" ON public.bookings;
