import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req) => {
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", req.nextUrl.pathname);

  const isProtected = req.nextUrl.pathname.startsWith("/panel");
  if (isProtected && !req.auth) {
    const loginUrl = new URL("/giris", req.nextUrl);
    loginUrl.searchParams.set("from", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
