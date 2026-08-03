"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { prisma } from "@donusum-kapisi/db";
import { announcementSchema } from "@donusum-kapisi/shared";
import { auth } from "@/lib/auth";
import { uploadAnnouncementImage } from "@/lib/storage/announcement-image";

export type AnnouncementActionState = { error: string } | null;

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Yetkiniz yok.");
  }
  return session;
}

export async function createAnnouncementAction(
  _prevState: AnnouncementActionState,
  formData: FormData
): Promise<AnnouncementActionState> {
  const session = await requireAdmin();
  const t = await getTranslations("panel");

  const parsed = announcementSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? t("errorFormInvalid") };
  }

  const imageFile = formData.get("image");
  const created = await prisma.announcement.create({
    data: {
      title: parsed.data.title,
      body: parsed.data.body,
      linkUrl: parsed.data.linkUrl ?? null,
      published: parsed.data.published,
      authorId: session.user.id,
    },
  });

  if (imageFile instanceof File && imageFile.size > 0) {
    const imageUrl = await uploadAnnouncementImage(imageFile, created.id);
    await prisma.announcement.update({
      where: { id: created.id },
      data: { imageUrl },
    });
  }

  revalidatePath("/");
  revalidatePath("/panel/admin/duyurular");
  redirect("/panel/admin/duyurular");
}

export async function updateAnnouncementAction(
  announcementId: string,
  _prevState: AnnouncementActionState,
  formData: FormData
): Promise<AnnouncementActionState> {
  await requireAdmin();
  const t = await getTranslations("panel");

  const parsed = announcementSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? t("errorFormInvalid") };
  }

  const imageFile = formData.get("image");
  const newImageUrl =
    imageFile instanceof File && imageFile.size > 0
      ? await uploadAnnouncementImage(imageFile, announcementId)
      : undefined;

  await prisma.announcement.update({
    where: { id: announcementId },
    data: {
      title: parsed.data.title,
      body: parsed.data.body,
      linkUrl: parsed.data.linkUrl ?? null,
      published: parsed.data.published,
      ...(newImageUrl ? { imageUrl: newImageUrl } : {}),
    },
  });

  revalidatePath("/");
  revalidatePath("/panel/admin/duyurular");
  redirect("/panel/admin/duyurular");
}

export async function deleteAnnouncementAction(announcementId: string) {
  await requireAdmin();
  await prisma.announcement.delete({ where: { id: announcementId } });
  revalidatePath("/");
  revalidatePath("/panel/admin/duyurular");
}
