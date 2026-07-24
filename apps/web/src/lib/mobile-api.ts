import { NextResponse } from "next/server";
import { MobileAuthError } from "@/lib/mobile-auth";

/**
 * `new URL(request.url).origin` her zaman "localhost" döner (dev sunucusu
 * hangi arayüzden bağlanılırsa bağlanılsın); mobil istemciler LAN IP'sinden
 * bağlandığı için istemcinin gerçekte kullandığı Host başlığını okumak gerekir.
 */
export function getRequestOrigin(request: Request) {
  const protocol = request.headers.get("x-forwarded-proto") ?? "http";
  const host = request.headers.get("host");
  return `${protocol}://${host}`;
}

export function mobileErrorResponse(error: unknown) {
  if (error instanceof MobileAuthError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  console.error(error);
  return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
}
