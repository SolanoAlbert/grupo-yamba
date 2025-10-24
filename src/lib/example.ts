import { NextResponse } from "next/server"; // Importa utilidades de Next.js (App Router) para construir respuestas HTTP.
import { headers } from "next/headers";     // Permite leer los encabezados del request actual en el entorno de servidor.
import { auth } from "@/lib/auth";           // Tu instancia configurada de Better Auth (se asume que la exportas desde lib/auth).

export async function POST(req: Request) {   // Manejador de la ruta POST /api/login en el App Router de Next.js.
  const hdrs = await headers();              // ✅ Await para resolver la Promise de headers
  const userAgent = hdrs.get("user-agent")   // Obtiene el agente de usuario (navegador/cliente) enviado por el cliente...
    ?? "";                                   // ...o usa cadena vacía si no existe.
  const ip = hdrs.get("x-forwarded-for")     // En entornos detrás de un proxy/CDN, este header lista IPs encadenadas...
    ?.split(",")[0]?.trim()                  // ...toma la primera IP (la del cliente original) y elimina espacios.
    ?? "";                                   // Si no existe (p. ej., desarrollo local), usa cadena vacía.

  const body = await req.json();             // Lee el cuerpo JSON enviado por el cliente (p. ej., { email, password }).

  const result = await auth.api.signInEmail({ // Llama al endpoint de Better Auth para iniciar sesión con email/password.
    body,                                     // Pasa el payload de credenciales recibido del cliente.
    headers: hdrs,                            // Pasa los headers originales (útil para IP, User-Agent, cookies, etc.).
    returnHeaders: true,                      // Pide que devuelva los headers de respuesta (para capturar Set-Cookie).
  });

  const setCookie = result.headers.get("set-cookie"); // Extrae el header Set-Cookie que Better Auth retorna (sesión).

  const res = NextResponse.json(              // Construye una respuesta JSON para el cliente.
    {
      ok: true,                               // Indicador de operación exitosa (convención propia).
      meta: { ip, userAgent },                // Devuelve metadata útil (no sensible) al cliente.
      data: result.response || null,          // ✅ result.response ya es el objeto, no necesita .json()
    },
    { status: 200 }                           // Código HTTP 200: OK.
  );

  if (setCookie) {                            // Si Better Auth devolvió cookies de sesión...
    res.headers.set("set-cookie", setCookie); // ...propágalas al cliente para que quede autenticado en su navegador.
  }

  return res;                                 // Envía la respuesta final al cliente.
}