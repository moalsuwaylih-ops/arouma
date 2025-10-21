import NextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Email only",
      credentials: {
        email: { label: "البريد", type: "email" },
      },
      async authorize(creds) {
        const email = (creds?.email || "").trim().toLowerCase();
        const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!ok) return null;

        // ✅ نتحقق أن البريد موجود ونقرأ الاسم من القاعدة
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;

        return { id: user.email, email: user.email, name: user.name || "وليّ أمر" };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
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
