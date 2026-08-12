import { NextResponse } from "next/server";
import { requireMobileUser } from "@/lib/mobile-auth";
import { mobileErrorResponse } from "@/lib/mobile-api";
import { getSiteSettings, updateSiteSettings } from "@/lib/site-settings";

export async function GET(request: Request) {
  try {
    const session = await requireMobileUser(request);
    if (session.role !== "ADMIN") {
      return NextResponse.json({ error: "Bu alana erişiminiz yok." }, { status: 403 });
    }

    const settings = await getSiteSettings();
    return NextResponse.json({
      maintenanceMode: settings.maintenanceMode,
      message: settings.maintenanceMessage,
      updatedAt: settings.updatedAt.toISOString(),
    });
  } catch (error) {
    return mobileErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireMobileUser(request);
    if (session.role !== "ADMIN") {
      return NextResponse.json({ error: "Bu alana erişiminiz yok." }, { status: 403 });
    }

    const body = (await request.json()) as {
      maintenanceMode?: boolean;
      message?: string | null;
    };

    if (typeof body.maintenanceMode !== "boolean") {
      return NextResponse.json({ error: "maintenanceMode gerekli." }, { status: 400 });
    }

    await updateSiteSettings({
      maintenanceMode: body.maintenanceMode,
      maintenanceMessage: body.message,
    });

    const settings = await getSiteSettings();
    return NextResponse.json({
      maintenanceMode: settings.maintenanceMode,
      message: settings.maintenanceMessage,
      updatedAt: settings.updatedAt.toISOString(),
    });
  } catch (error) {
    return mobileErrorResponse(error);
  }
}
