import { NextResponse } from "next/server";
import { signUpSchema, type AuthResponseDTO } from "@donusum-kapisi/shared";
import { createUser, UserAlreadyExistsError } from "@/lib/user";
import { signMobileToken } from "@/lib/mobile-auth";
import { mobileErrorResponse } from "@/lib/mobile-api";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = signUpSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Form geçersiz." },
      { status: 400 }
    );
  }

  try {
    const user = await createUser(parsed.data);
    const token = await signMobileToken(user);
    const response: AuthResponseDTO = {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return NextResponse.json(
        { error: "Bu e-posta adresiyle zaten bir hesap var." },
        { status: 409 }
      );
    }
    return mobileErrorResponse(error);
  }
}
