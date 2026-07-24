import { NextResponse } from "next/server";
import { prisma } from "@donusum-kapisi/db";
import { requireMobileUser } from "@/lib/mobile-auth";
import { mobileErrorResponse } from "@/lib/mobile-api";
import { toContractorProfileDTO } from "@/lib/dto";

export async function GET(request: Request) {
  try {
    const session = await requireMobileUser(request);
    if (session.role !== "ADMIN") {
      return NextResponse.json({ error: "Bu alana erişiminiz yok." }, { status: 403 });
    }

    const profiles = await prisma.contractorProfile.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: [{ verified: "asc" }, { updatedAt: "desc" }],
    });

    return NextResponse.json({
      contractors: profiles.map((profile) => ({
        ...toContractorProfileDTO(profile),
        user: profile.user,
      })),
    });
  } catch (error) {
    return mobileErrorResponse(error);
  }
}
