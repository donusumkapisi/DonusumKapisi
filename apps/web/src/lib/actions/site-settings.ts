"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { updateSiteSettings } from "@/lib/site-settings";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Yetkiniz yok.");
  }
  return session;
}

export async function setMaintenanceModeAction(formData: FormData) {
  await requireAdmin();

  const enabled = formData.get("enabled") === "true";
  const messageRaw = formData.get("message");
  const message = typeof messageRaw === "string" ? messageRaw : undefined;

  await updateSiteSettings({
    maintenanceMode: enabled,
    maintenanceMessage: message,
  });

  revalidatePath("/", "layout");
  revalidatePath("/panel/admin/bakim");
}
