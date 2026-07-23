const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wskuqdicxjwqufikview.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indza3VxZGljeGp3cXVmaWt2aWV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1ODc0OTksImV4cCI6MjA5OTE2MzQ5OX0.HT3SHk0E1BfqdDkczvSvz2Axkj4u1EbCNycaaXbMPTs';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*');
  console.log('Total:', data ? data.length : 0);
  console.log('Error:', error);
  if (data) {
    for (const row of data) {
      console.log(`- ${row.id} | status: ${row.status} | consent: ${row.consent_to_publish} | is_approved: ${row.is_approved}`);
    }
  }
}

test();
