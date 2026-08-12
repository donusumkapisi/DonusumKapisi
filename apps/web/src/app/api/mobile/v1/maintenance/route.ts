import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/site-settings";

export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json({
      maintenanceMode: settings.maintenanceMode,
      message: settings.maintenanceMessage,
      updatedAt: settings.updatedAt.toISOString(),
    });
  } catch {
    return NextResponse.json({
      maintenanceMode: false,
      message: null,
      updatedAt: null,
    });
  }
}
