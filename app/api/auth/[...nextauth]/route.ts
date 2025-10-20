// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "البريد", type: "email" },
        name: { label: "الاسم", type: "text" },
      },
      async authorize(creds) {
        const email = (creds?.email || "").trim().toLowerCase();
        const name = (creds?.name || "").trim();

        const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!ok) return null;

        return { id: email, email, name: name || "وليّ أمر" };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        // @ts-expect-error
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string | undefined;
        // @ts-expect-error
        session.user.name = (token as any).name;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export const GET = handler;
export const POST = handler;
