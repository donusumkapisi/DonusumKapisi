import { NextResponse } from "next/server";

/**
 * Apple Sign In popup akışı bu URL'ye döner.
 * Apple Developer Console'da Services ID > Return URLs listesine eklenmeli.
 */
export async function GET() {
  const html = `<!DOCTYPE html>
<html lang="tr">
  <head><meta charset="utf-8" /><title>Apple</title></head>
  <body>
    <script>
      if (window.opener) { window.close(); }
      else { window.location.replace("/giris"); }
    </script>
  </body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

export async function POST() {
  return GET();
}
