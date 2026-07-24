import { NextResponse } from "next/server";
import { updateNotificationPreferencesSchema } from "@donusum-kapisi/shared";
import { requireMobileUser } from "@/lib/mobile-auth";
import { mobileErrorResponse } from "@/lib/mobile-api";
import { getNotificationPreferences, updateNotificationPreferences } from "@/lib/notification-preferences";

export async function GET(request: Request) {
  try {
    const session = await requireMobileUser(request);
    const preferences = await getNotificationPreferences(session.userId);
    return NextResponse.json({ preferences });
  } catch (error) {
    return mobileErrorResponse(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await requireMobileUser(request);
    const body = await request.json().catch(() => null);
    const parsed = updateNotificationPreferencesSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Form geçersiz." },
        { status: 400 }
      );
    }

    const preferences = await updateNotificationPreferences(session.userId, parsed.data);
    return NextResponse.json({ preferences });
  } catch (error) {
    return mobileErrorResponse(error);
  }
}
