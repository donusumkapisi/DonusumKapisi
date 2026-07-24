import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@donusum-kapisi/db";
import { requireMobileUser } from "@/lib/mobile-auth";
import { mobileErrorResponse } from "@/lib/mobile-api";

const registerPushTokenSchema = z.object({ token: z.string().min(1) });

export async function POST(request: Request) {
  try {
    const session = await requireMobileUser(request);
    const body = await request.json().catch(() => null);
    const parsed = registerPushTokenSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Form geçersiz." }, { status: 400 });
    }

    await prisma.pushToken.upsert({
      where: { token: parsed.data.token },
      create: { token: parsed.data.token, userId: session.userId },
      update: { userId: session.userId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return mobileErrorResponse(error);
  }
}
