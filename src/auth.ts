import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [Credentials({
    credentials: { email: { label: "Email", type: "email" }, password: { label: "Password", type: "password" } },
    async authorize(credentials) {
      const email = String(credentials.email ?? "").trim().toLowerCase();
      const password = String(credentials.password ?? "");
      if (!email || !password) return null;
      const { data, error } = await getSupabaseAdmin().from("users").select("id, email, name, password_hash, role").eq("email", email).maybeSingle();
      if (error || !data || !(await compare(password, data.password_hash))) return null;
      return { id: data.id, email: data.email, name: data.name, role: data.role };
    },
  })],
  callbacks: {
    jwt({ token, user }) { if (user) { token.userId = user.id; token.role = user.role; } return token; },
    session({ session, token }) { if (session.user) { session.user.id = String(token.userId); session.user.role = token.role as "admin" | "member"; } return session; },
  },
});
