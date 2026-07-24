import { NextResponse } from "next/server";
import { logInSchema, type AuthResponseDTO } from "@donusum-kapisi/shared";
import { verifyCredentials } from "@/lib/credentials";
import { signMobileToken } from "@/lib/mobile-auth";
import { mobileErrorResponse } from "@/lib/mobile-api";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = logInSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Form geçersiz." },
      { status: 400 }
    );
  }

  try {
    const user = await verifyCredentials(parsed.data.email, parsed.data.password);
    if (!user) {
      return NextResponse.json({ error: "E-posta veya şifre hatalı." }, { status: 401 });
    }

    const token = await signMobileToken(user);
    const response: AuthResponseDTO = { token, user };
    return NextResponse.json(response);
  } catch (error) {
    return mobileErrorResponse(error);
  }
}
