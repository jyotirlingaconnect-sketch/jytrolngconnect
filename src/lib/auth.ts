import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { supabase } from "@/lib/supabase";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          // Check if user exists in the Supabase users table
          const { data: existingUser, error: fetchError } = await supabase
            .from("users")
            .select("*")
            .eq("email", user.email)
            .single();

          if (fetchError && fetchError.code !== "PGRST116") {
            // Error other than "No rows found"
            console.error("Error fetching user:", fetchError);
            return false;
          }

          if (!existingUser) {
            // First time login, create the user
            const { error: insertError } = await supabase.from("users").insert([
              {
                google_id: user.id,
                name: user.name,
                email: user.email,
                image: user.image,
                provider: "google",
                last_login_at: new Date().toISOString(),
              },
            ]);

            if (insertError) {
              console.error("Error creating user:", insertError);
              return false;
            }
          } else {
            // Existing user, update last login
            const { error: updateError } = await supabase
              .from("users")
              .update({ last_login_at: new Date().toISOString() })
              .eq("id", existingUser.id);

            if (updateError) {
              console.error("Error updating user login time:", updateError);
            }
          }
          return true;
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        const { data: dbUser } = await supabase
          .from("users")
          .select("id")
          .eq("email", user.email)
          .single();
        if (dbUser) {
          token.id = dbUser.id;
        } else {
          token.id = user.id; // fallback to google id
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as any).id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
    error: "/",
  },
};
