"use server";

import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { prisma } from "@donusum-kapisi/db";
import { auth } from "@/lib/auth";
import { generateListingNumber } from "@/lib/listing-number";
import { uploadListingPhotos } from "@/lib/storage/listing-photos";
import { createListingSchema, validateListingPhotos } from "@donusum-kapisi/shared";

export type CreateListingState = { error: string } | null;

export async function createListingAction(
  _prevState: CreateListingState,
  formData: FormData
): Promise<CreateListingState> {
  const t = await getTranslations("listingWizard");
  const session = await auth();
  if (!session || session.user.role !== "HOMEOWNER") {
    return { error: t("errorMustBeHomeowner") };
  }

  const parsed = createListingSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? t("errorFormInvalid") };
  }

  const photoFiles = formData
    .getAll("photos")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  const photoError = validateListingPhotos(photoFiles);
  if (photoError) {
    return { error: photoError };
  }

  const listingNumber = await generateListingNumber();
  const photoUrls = await uploadListingPhotos(photoFiles, listingNumber);

  await prisma.listing.create({
    data: {
      ...parsed.data,
      listingNumber,
      ownerId: session.user.id,
      coverImageUrl: photoUrls[0],
      photos: photoUrls,
      status: "PENDING",
    },
  });

  redirect(`/ilan-ver/basarili?ilanNo=${listingNumber}`);
}
