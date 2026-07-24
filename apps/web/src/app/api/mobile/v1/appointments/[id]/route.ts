import { NextResponse } from "next/server";
import { updateAppointmentStatusSchema } from "@donusum-kapisi/shared";
import { requireMobileUser } from "@/lib/mobile-auth";
import { mobileErrorResponse } from "@/lib/mobile-api";
import { updateAppointmentStatus, AppointmentNotAllowedError } from "@/lib/appointments";
import { toAppointmentDTO } from "@/lib/dto";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  try {
    const session = await requireMobileUser(request);
    const { id } = await params;
    const body = await request.json().catch(() => null);
    const parsed = updateAppointmentStatusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Form geçersiz." },
        { status: 400 }
      );
    }

    const appointment = await updateAppointmentStatus(id, session.userId, parsed.data.status);
    return NextResponse.json({ appointment: toAppointmentDTO(appointment) });
  } catch (error) {
    if (error instanceof AppointmentNotAllowedError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return mobileErrorResponse(error);
  }
}
