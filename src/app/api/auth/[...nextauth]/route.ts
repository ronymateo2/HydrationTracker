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

        // Check if user exists
        const { data: existingUser } = await supabase
          .from("users")
          .select("id")
          .eq("id", user.id)
          .single();

        if (!existingUser) {
          // Create new user
          await supabase.from("users").insert({
            id: user.id,
            email: user.email,
            name: user.name,
          });
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
