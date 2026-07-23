const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wskuqdicxjwqufikview.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indza3VxZGljeGp3cXVmaWt2aWV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1ODc0OTksImV4cCI6MjA5OTE2MzQ5OX0.HT3SHk0E1BfqdDkczvSvz2Axkj4u1EbCNycaaXbMPTs';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase
    .from('testimonials')
    .select('id, name, city, overall_rating, experience, profile_image_url, package_name, fleet_name')
    .eq('status', 'approved')
    .eq('consent_to_publish', true)
    .order('created_at', { ascending: false });
  console.log('Error:', error);
  console.log('Data:', data);
}

test();
