import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/mongodb";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const db = await getDatabase();
    const ping = await db.admin().ping();
    const collections = await db.listCollections().toArray();
    const sessionData = await auth.api.getSession({ headers: request.headers });
    const user = sessionData?.user;
    const session = sessionData?.session;

    return NextResponse.json({
      ok: true,
      db: { name: db.databaseName, ping, collections: collections.map(c => c.name) },
      auth: { hasSession: Boolean(session), userEmail: user?.email ?? null },
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Health failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
