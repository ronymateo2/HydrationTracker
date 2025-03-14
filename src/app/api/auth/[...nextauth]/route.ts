import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createClient } from "@/lib/supabase-server";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async session({ session, token }: any) {
      if (session?.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async signIn({ user, account, profile }: any) {
      try {
        // Create or update user in Supabase when they sign in
        const supabase = createClient();

        console.log("Attempting to create/update user in Supabase:", user.id);

        // Check if user exists
        const { data: existingUser, error: queryError } = await supabase
          .from("users")
          .select("id")
          .eq("id", user.id)
          .single();

        console.log("User ID type:", typeof user.id, user.id);

        if (queryError && queryError.code !== "PGRST116") {
          console.error("Error checking if user exists:", queryError);
        }

        if (!existingUser) {
          // Create new user
          // Ensure user.id is in UUID format
          const userId = user.id;
          console.log("Inserting user with ID:", userId);

          const { error: insertError } = await supabase.from("users").insert({
            id: userId,
            email: user.email,
            name: user.name,
          });

          if (insertError) {
            console.error("Error inserting user:", insertError);
          } else {
            console.log("User created successfully:", user.id);

            // Also create a default profile for the user
            const { error: profileError } = await supabase
              .from("user_profiles")
              .insert({
                user_id: userId,
                daily_goal: 2500, // Default daily goal in ml
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              });

            if (profileError) {
              console.error("Error creating user profile:", profileError);
            } else {
              console.log("User profile created successfully");
            }
          }
        } else {
          console.log("User already exists:", user.id);
        }

        return true;
      } catch (error) {
        console.error("Error saving user to Supabase:", error);
        return true; // Still allow sign in even if Supabase insert fails
      }
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
