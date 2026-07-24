"use server";

import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { proposeAppointmentSchema } from "@donusum-kapisi/shared";
import { auth } from "@/lib/auth";
import { proposeAppointment, updateAppointmentStatus } from "@/lib/appointments";

export type AppointmentActionState = { error: string } | { success: true } | null;

export async function proposeAppointmentAction(
  offerId: string,
  _prevState: AppointmentActionState,
  formData: FormData
): Promise<AppointmentActionState> {
  const t = await getTranslations("panel");
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return { error: t("errorUnauthorized") };
  }

  const parsed = proposeAppointmentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? t("errorFormInvalid") };
  }

  await proposeAppointment(offerId, parsed.data);

  revalidatePath("/panel/admin");
  revalidatePath("/panel/ev-sahibi");
  revalidatePath("/panel/muteahhit");
  return { success: true };
}

export async function updateAppointmentStatusAction(
  appointmentId: string,
  status: "CONFIRMED" | "CANCELLED"
) {
  const session = await auth();
  if (!session) throw new Error("Giriş yapmalısınız.");

  await updateAppointmentStatus(appointmentId, session.user.id, status);

  revalidatePath("/panel/ev-sahibi");
  revalidatePath("/panel/muteahhit");
}
