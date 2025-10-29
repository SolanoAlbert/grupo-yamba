import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { dbPromise } from "@/infra/db/mongodb-client";

// Inicializa la conexión a MongoDB (Db) de forma explícita para cumplir con los tipos
const db = await dbPromise;

// Validar variables de entorno críticas
if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error("❌ BETTER_AUTH_SECRET is not defined in .env");
}

// Resolver baseURL de forma robusta (local, env público o Vercel)
const baseURL =
  process.env.BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

// Flags de proveedores: habilitar solo si hay ID y SECRET
const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
const facebookEnabled = Boolean(process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET);

// Parsear emails de admin (normalizados)
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase());

// Inicializa Better Auth
export const auth = betterAuth({
  // Usamos la instancia de Db ya resuelta
  database: mongodbAdapter(db),
  // Secret para firmar tokens
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL,

  // Configuración de sesión
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 días
    updateAge: 60 * 60 * 24, // 24 horas
  },

  // Proveedores de autenticación OAuth
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

  // Campos adicionales del usuario
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        required: true,
      },
      active: {
        type: "boolean",
        defaultValue: true,
        required: true,
      },
      registrationDate: {
        type: "date",
        defaultValue: () => new Date(),
        required: true,
      },
    },
  },

  // Callbacks para lógica personalizada
  callbacks: {
    async signIn({ user }: { user: { email?: string | null; role?: string; active?: boolean } }) {
      const email = user.email?.toLowerCase();
      if (email && ADMIN_EMAILS.includes(email)) user.role = "admin";
      if (!email) console.warn("⚠️ signIn: user without email");
      if (process.env.NODE_ENV === "development") {
        console.log(`✅ User signed in: ${user.email} (role: ${user.role})`);
      }
      return true;
    },

    async session(
      { session, user }: {
        session: { user?: { role?: string; active?: boolean } | null };
        user: { role?: string; active?: boolean }
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

// Tipos para TypeScript
export type Session = typeof auth.$Infer.Session;