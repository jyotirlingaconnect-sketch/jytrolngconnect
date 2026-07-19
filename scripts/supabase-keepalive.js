/**
 * Supabase Keep-Alive Script
 * Performs a real database query via the public.ping() RPC function.
 * Runs on a schedule in GitHub Actions to prevent Supabase databases on the Free Tier from pausing.
 */

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Error: SUPABASE_URL and SUPABASE_ANON_KEY environment variables are required.");
  process.exit(1);
}

// Clean up trailing slash if present
const cleanedUrl = supabaseUrl.endsWith('/') ? supabaseUrl.slice(0, -1) : supabaseUrl;

// Helper to mask sensitive URL domain/keys in output
const getMaskedUrl = (url) => {
  try {
    const urlObj = new URL(url);
    return `${urlObj.protocol}//***.${urlObj.hostname.split('.').slice(-2).join('.')}`;
  } catch {
    return "https://***.supabase.co";
  }
};

async function runKeepAlive() {
  console.log("Starting keep-alive check");
  console.log(`Connecting to Supabase at: ${getMaskedUrl(cleanedUrl)}`);
  console.log("Executing database ping");

  try {
    const response = await fetch(`${cleanedUrl}/rest/v1/rpc/ping`, {
      method: "POST",
      headers: {
        "apikey": supabaseAnonKey,
        "Authorization": `Bearer ${supabaseAnonKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({})
    });

    if (!response.ok) {
      const errorText = await response.text();
      // Throw error with clean messages to avoid prints of headers
      throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
    }

    const data = await response.json();
    
    if (data === "pong") {
      console.log("Database responded successfully");
      console.log("Workflow completed");
      process.exit(0);
    } else {
      throw new Error(`Unexpected database response format: ${JSON.stringify(data)}`);
    }
  } catch (error) {
    console.error("Error: Database keep-alive check failed.");
    console.error(`Reason: ${error.message}`);
    process.exit(1);
  }
}

runKeepAlive();
