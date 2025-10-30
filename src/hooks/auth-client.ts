"use client";
import { createAuthClient } from "better-auth/react";

// Client-side auth utilities (signIn, signUp, useSession)
export const authClient = createAuthClient({
  // Prefer NEXT_PUBLIC_BASE_URL; fallback to runtime origin in browser or localhost in SSR
  baseURL:
    process.env.NEXT_PUBLIC_BASE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"),
});

export const { signIn, signUp, useSession } = authClient;
