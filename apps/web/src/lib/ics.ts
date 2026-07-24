import type { Appointment } from "@donusum-kapisi/db";

function formatIcsDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function escapeIcsText(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

export function buildAppointmentIcs(appointment: Appointment, summary: string): string {
  const start = new Date(appointment.scheduledAt);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  const now = formatIcsDate(new Date());

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//DonusumKapisi//Appointment//TR",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${appointment.id}@donusumkapisi.com`,
    `DTSTAMP:${now}`,
    `DTSTART:${formatIcsDate(start)}`,
    `DTEND:${formatIcsDate(end)}`,
    `SUMMARY:${escapeIcsText(summary)}`,
    appointment.location ? `LOCATION:${escapeIcsText(appointment.location)}` : null,
    appointment.note ? `DESCRIPTION:${escapeIcsText(appointment.note)}` : null,
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter((line): line is string => line !== null);

  return lines.join("\r\n");
}
