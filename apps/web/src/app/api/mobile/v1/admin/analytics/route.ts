import { NextResponse } from "next/server";
import { requireMobileUser } from "@/lib/mobile-auth";
import { mobileErrorResponse } from "@/lib/mobile-api";
import { getMonthlyTrends, getPlatformStats, getTopContractors } from "@/lib/analytics";

export async function GET(request: Request) {
  try {
    const session = await requireMobileUser(request);
    if (session.role !== "ADMIN") {
      return NextResponse.json({ error: "Bu alana erişiminiz yok." }, { status: 403 });
    }

    const [stats, topContractors, trends] = await Promise.all([
      getPlatformStats(),
      getTopContractors(5),
      getMonthlyTrends(6),
    ]);

    return NextResponse.json({ stats, topContractors, trends });
  } catch (error) {
    return mobileErrorResponse(error);
  }
}
