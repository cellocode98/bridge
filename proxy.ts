// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const url = req.url;

  const suspicious = /\$\{.*\}/i.test(url) || /jndi/i.test(url);
  if (suspicious) {
    console.warn("🚨 Suspicious request blocked:", url);
    return new NextResponse("Blocked", { status: 403 });
  }

  return NextResponse.next();
}

// 👇 This ensures it applies to ALL routes
export const config = {
  matcher: "/:path*",
};