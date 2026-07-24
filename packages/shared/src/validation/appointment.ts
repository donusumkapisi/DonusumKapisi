import { z } from "zod";

export const proposeAppointmentSchema = z.object({
  scheduledAt: z.coerce.date({ error: "Geçerli bir tarih/saat girin." }),
  location: z.string().max(200, { error: "Konum en fazla 200 karakter olabilir." }).trim().optional(),
  note: z.string().max(500, { error: "Not en fazla 500 karakter olabilir." }).trim().optional(),
});

export type ProposeAppointmentInput = z.infer<typeof proposeAppointmentSchema>;

export const APPOINTMENT_STATUS_VALUES = ["PROPOSED", "CONFIRMED", "CANCELLED"] as const;

export const updateAppointmentStatusSchema = z.object({
  status: z.enum(["CONFIRMED", "CANCELLED"], { error: "Geçerli bir durum seçin." }),
});

export type UpdateAppointmentStatusInput = z.infer<typeof updateAppointmentStatusSchema>;
