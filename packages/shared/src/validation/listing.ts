import { z } from "zod";

function optionalCoordinate(min: number, max: number) {
  return z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? undefined : val),
    z.coerce.number().min(min).max(max).optional()
  );
}

export const createListingSchema = z
  .object({
    title: z
      .string()
      .min(10, { error: "Başlık en az 10 karakter olmalı." })
      .max(120, { error: "Başlık en fazla 120 karakter olabilir." })
      .trim(),
    province: z.string().min(2, { error: "İl seçin." }),
    district: z.string().min(2, { error: "İlçe girin." }).trim(),
    squareMeters: z.coerce
      .number({ error: "Metrekare girin." })
      .int()
      .positive({ error: "Metrekare 0'dan büyük olmalı." }),
    buildingAge: z.coerce
      .number({ error: "Bina yaşı girin." })
      .int()
      .min(0, { error: "Bina yaşı negatif olamaz." })
      .max(150, { error: "Geçerli bir bina yaşı girin." }),
    floorCount: z.coerce
      .number({ error: "Kat sayısı girin." })
      .int()
      .positive({ error: "Kat sayısı 0'dan büyük olmalı." }),
    unitCount: z.coerce
      .number({ error: "Daire sayısı girin." })
      .int()
      .positive({ error: "Daire sayısı 0'dan büyük olmalı." }),
    priceMin: z.coerce
      .number({ error: "Minimum fiyat girin." })
      .int()
      .positive({ error: "Minimum fiyat 0'dan büyük olmalı." }),
    priceMax: z.coerce
      .number({ error: "Maksimum fiyat girin." })
      .int()
      .positive({ error: "Maksimum fiyat 0'dan büyük olmalı." }),
    description: z
      .string()
      .min(30, { error: "Açıklama en az 30 karakter olmalı." })
      .max(3000, { error: "Açıklama en fazla 3000 karakter olabilir." })
      .trim(),
    latitude: optionalCoordinate(-90, 90),
    longitude: optionalCoordinate(-180, 180),
  })
  .refine((data) => data.priceMax >= data.priceMin, {
    error: "Maksimum fiyat, minimum fiyattan küçük olamaz.",
    path: ["priceMax"],
  });

export type CreateListingInput = z.infer<typeof createListingSchema>;

export const MAX_PHOTOS = 10;
export const MAX_PHOTO_SIZE_BYTES = 5 * 1024 * 1024;
export const ACCEPTED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const LISTING_STATUS_VALUES = ["PENDING", "APPROVED", "REJECTED", "CLOSED"] as const;

export const updateListingStatusSchema = z.object({
  status: z.enum(LISTING_STATUS_VALUES, { error: "Geçerli bir durum seçin." }),
});

export type UpdateListingStatusInput = z.infer<typeof updateListingStatusSchema>;

export function validateListingPhotos(
  files: { type: string; size: number }[]
): string | null {
  if (files.length === 0) return "En az bir fotoğraf ekleyin.";
  if (files.length > MAX_PHOTOS) return `En fazla ${MAX_PHOTOS} fotoğraf ekleyebilirsiniz.`;
  for (const file of files) {
    if (!ACCEPTED_PHOTO_TYPES.includes(file.type)) {
      return "Fotoğraflar yalnızca JPG, PNG veya WEBP formatında olabilir.";
    }
    if (file.size > MAX_PHOTO_SIZE_BYTES) {
      return "Her fotoğraf en fazla 5MB olabilir.";
    }
  }
  return null;
}
