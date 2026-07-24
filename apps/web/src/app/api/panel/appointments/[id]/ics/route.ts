import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAppointmentForUser, AppointmentNotAllowedError } from "@/lib/appointments";
import { buildAppointmentIcs } from "@/lib/ics";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const { id } = await params;

  try {
    const appointment = await getAppointmentForUser(id, session.user.id);
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
    throw error;
  }
}
