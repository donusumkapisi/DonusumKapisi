import { NextResponse } from "next/server";
import { requireMobileUser } from "@/lib/mobile-auth";
import { mobileErrorResponse } from "@/lib/mobile-api";
import { getAppointmentForUser, AppointmentNotAllowedError } from "@/lib/appointments";
import { buildAppointmentIcs } from "@/lib/ics";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Params) {
  try {
    const session = await requireMobileUser(request);
    const { id } = await params;

    const appointment = await getAppointmentForUser(id, session.userId);
    const ics = buildAppointmentIcs(appointment, `Keşif randevusu: ${appointment.offer.listing.title}`);

    return new NextResponse(ics, {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="randevu-${appointment.id}.ics"`,
      },
    });
  } catch (error) {
    if (error instanceof AppointmentNotAllowedError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return mobileErrorResponse(error);
  }
}
