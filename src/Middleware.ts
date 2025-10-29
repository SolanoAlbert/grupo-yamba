import { NextRequest, NextResponse } from "next/server";

// Rutas públicas que no requieren sesión
const PUBLIC_PATHS = new Set<string>([
  "/",
  "/login",
  "/register",
  "/health",
]);

function isPublic(pathname: string): boolean {
  if (PUBLIC_PATHS.has(pathname)) return true;
  // Evitar ejecutar en assets y en el propio endpoint de auth
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/api/auth")
  ) {
    return true;
  }
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;

  // No proteger rutas públicas ni assets
  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  // Consultar la sesión vía endpoint (edge-safe)
  const res = await fetch(`${origin}/api/auth/session`, {
    headers: {
      cookie: request.headers.get("cookie") ?? "",
    },
    cache: "no-store",
  });

  const json = res.ok ? await res.json().catch(() => null) : null;
  const hasSession = Boolean(json?.session || json?.user);

  if (!hasSession) {
    const redirectUrl = new URL("/login", origin);
    redirectUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Ejemplo opcional: forzar admin en /admin/*
  if (pathname.startsWith("/admin")) {
    const role = json?.session?.user?.role || json?.user?.role;
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", origin));
    }
  }

  return NextResponse.next();
}

export const config = {
  // Middleware siempre corre en Edge (no se puede forzar Node.js)
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};