import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req) => {
  const isProtected = req.nextUrl.pathname.startsWith("/panel");
  if (isProtected && !req.auth) {
    const loginUrl = new URL("/giris", req.nextUrl);
    loginUrl.searchParams.set("from", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
});

export const config = {
  matcher: ["/panel/:path*"],
};
