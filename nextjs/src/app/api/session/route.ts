import { getServerAuthSession } from "@nextjs/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerAuthSession();

  return NextResponse.json({
    authenticated: !!session,
    session,
  });
}
