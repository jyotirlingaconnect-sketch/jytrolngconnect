import { supabaseAdmin } from "@/lib/supabaseAdmin";

// Admins sign in with Supabase Auth (see AdminLayout), not NextAuth, so server
// actions must verify the Supabase access token the admin client sends along.
export async function requireAdmin(accessToken: string | undefined) {
  if (!accessToken) {
    throw new Error("Unauthorized: Admin access required");
  }

  const { data, error } = await supabaseAdmin.auth.getUser(accessToken);
  if (error || !data.user) {
    throw new Error("Unauthorized: Admin access required");
  }

  return data.user;
}
