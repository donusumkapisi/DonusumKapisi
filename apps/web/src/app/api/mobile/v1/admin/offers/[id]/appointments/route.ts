import { NextResponse } from "next/server";
import { proposeAppointmentSchema } from "@donusum-kapisi/shared";
import { requireMobileUser } from "@/lib/mobile-auth";
import { mobileErrorResponse } from "@/lib/mobile-api";
import { proposeAppointment, AppointmentNotAllowedError } from "@/lib/appointments";
import { toAppointmentDTO } from "@/lib/dto";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  try {
    const session = await requireMobileUser(request);
    if (session.role !== "ADMIN") {
      return NextResponse.json({ error: "Bu alana erişiminiz yok." }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json().catch(() => null);
    const parsed = proposeAppointmentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Form geçersiz." },
        { status: 400 }
      );
    }

    const appointment = await proposeAppointment(id, parsed.data);
    return NextResponse.json({ appointment: toAppointmentDTO(appointment) }, { status: 201 });
  } catch (error) {
    if (error instanceof AppointmentNotAllowedError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return mobileErrorResponse(error);
  }
}
