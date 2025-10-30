import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;

  const isProtected = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");
  if (!isProtected) return NextResponse.next();

  // Fetch session via HTTP to stay edge-safe
  let hasSession = false;
  let role: string | undefined;
  try {
    const res = await fetch(`${origin}/api/auth/session`, {
      headers: { cookie: req.headers.get("cookie") ?? "" },
      // Revalidate on each request to keep it fresh
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json().catch(() => null);
      if (data) {
        hasSession = Boolean(data?.user);
        role = data?.user?.role;
      }
    }
  } catch {
    // If session call fails, treat as unauthenticated
    hasSession = false;
  }

  if (!hasSession) {
    const url = new URL("/login", req.url);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
