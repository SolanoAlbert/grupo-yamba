import "server-only";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { dbPromise } from "@/lib/db/mongodb";

const db = await dbPromise;

if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error("❌ BETTER_AUTH_SECRET is not defined in .env");
}

const baseURL =
  process.env.BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
const facebookEnabled = Boolean(process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET);

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase());

export const auth = betterAuth({
  database: mongodbAdapter(db),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL,
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      enabled: googleEnabled,
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
      enabled: facebookEnabled,
    },
  },
  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "user", required: true },
      active: { type: "boolean", defaultValue: true, required: true },
      registrationDate: { type: "date", defaultValue: () => new Date(), required: true },
    },
  },
  callbacks: {
    async signIn({ user }: { user: { email?: string | null; role?: string; active?: boolean } }) {
      const email = user.email?.toLowerCase();
      if (email && ADMIN_EMAILS.includes(email)) user.role = "admin";
      return true;
    },
    async session(
      { session, user }: {
        session: { user?: { role?: string; active?: boolean } | null };
        user: { role?: string; active?: boolean };
      }
    ) {
      if (session.user) {
        session.user.role = user.role;
        session.user.active = user.active;
      }
      return session;
    },
  },
});

export type Session = typeof auth.$Infer.Session;
