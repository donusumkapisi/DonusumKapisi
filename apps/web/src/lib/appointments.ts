import { prisma } from "@donusum-kapisi/db";
import type { ProposeAppointmentInput } from "@donusum-kapisi/shared";
import { sendPushNotification } from "@/lib/push";
import { sendSms } from "@/lib/sms";

export class AppointmentNotAllowedError extends Error {}

export async function proposeAppointment(offerId: string, input: ProposeAppointmentInput) {
  const offer = await prisma.offer.findUnique({
    where: { id: offerId },
    include: { listing: true },
  });
  if (!offer) throw new AppointmentNotAllowedError("Teklif bulunamadı.");

  const appointment = await prisma.appointment.create({
    data: {
      offerId,
      scheduledAt: input.scheduledAt,
      location: input.location ?? null,
      note: input.note ?? null,
    },
  });

  const formatted = new Date(appointment.scheduledAt).toLocaleString("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  const smsBody = `DönüşümKapısı: "${offer.listing.title}" için ${formatted} tarihinde bir keşif randevusu önerildi.`;

  const [owner, contractor] = await Promise.all([
    prisma.user.findUnique({
      where: { id: offer.listing.ownerId },
      select: { phone: true, notifyAppointments: true },
    }),
    prisma.user.findUnique({
      where: { id: offer.contractorId },
      select: { phone: true, notifyAppointments: true },
    }),
  ]);

  await Promise.all([
    sendPushNotification(
      offer.listing.ownerId,
      {
        title: "Keşif randevusu planlandı",
        body: `"${offer.listing.title}" için ${formatted} tarihinde bir randevu önerildi.`,
        data: { offerId },
      },
      "APPOINTMENTS"
    ),
    sendPushNotification(
      offer.contractorId,
      {
        title: "Keşif randevusu planlandı",
        body: `"${offer.listing.title}" için ${formatted} tarihinde bir randevu önerildi.`,
        data: { offerId },
      },
      "APPOINTMENTS"
    ),
    owner?.phone && owner.notifyAppointments ? sendSms(owner.phone, smsBody) : Promise.resolve(),
    contractor?.phone && contractor.notifyAppointments
      ? sendSms(contractor.phone, smsBody)
      : Promise.resolve(),
  ]);

  return appointment;
}

export async function listAppointmentsForOffer(offerId: string) {
  return prisma.appointment.findMany({ where: { offerId }, orderBy: { scheduledAt: "desc" } });
}

export async function getAppointmentForUser(appointmentId: string, userId: string) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: { offer: { include: { listing: true } } },
  });
  if (!appointment) throw new AppointmentNotAllowedError("Randevu bulunamadı.");

  const isHomeowner = appointment.offer.listing.ownerId === userId;
  const isContractor = appointment.offer.contractorId === userId;
  if (!isHomeowner && !isContractor) {
    throw new AppointmentNotAllowedError("Bu randevu üzerinde yetkiniz yok.");
  }

  return appointment;
}

export async function updateAppointmentStatus(
  appointmentId: string,
  userId: string,
  status: "CONFIRMED" | "CANCELLED"
) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: { offer: { include: { listing: true } } },
  });
  if (!appointment) throw new AppointmentNotAllowedError("Randevu bulunamadı.");

  const isHomeowner = appointment.offer.listing.ownerId === userId;
  const isContractor = appointment.offer.contractorId === userId;
  if (!isHomeowner && !isContractor) {
    throw new AppointmentNotAllowedError("Bu randevu üzerinde yetkiniz yok.");
  }

  const updated = await prisma.appointment.update({
    where: { id: appointmentId },
    data: { status },
  });

  const otherPartyId = isHomeowner ? appointment.offer.contractorId : appointment.offer.listing.ownerId;
  const statusLabel = status === "CONFIRMED" ? "onaylandı" : "iptal edildi";

  await sendPushNotification(
    otherPartyId,
    {
      title: "Randevu durumu güncellendi",
      body: `"${appointment.offer.listing.title}" için randevu ${statusLabel}.`,
      data: { offerId: appointment.offerId },
    },
    "APPOINTMENTS"
  );

  return updated;
}
