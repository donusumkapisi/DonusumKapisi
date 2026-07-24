import { z } from "zod";

export const createOfferSchema = z
  .object({
    priceMin: z.coerce
      .number({ error: "Minimum fiyat girin." })
      .int()
      .positive({ error: "Minimum fiyat 0'dan büyük olmalı." }),
    priceMax: z.coerce
      .number({ error: "Maksimum fiyat girin." })
      .int()
      .positive({ error: "Maksimum fiyat 0'dan büyük olmalı." }),
    durationMonths: z.coerce
      .number({ error: "Süre girin." })
      .int()
      .positive({ error: "Süre 0'dan büyük olmalı." })
      .optional(),
    note: z
      .string()
      .max(1000, { error: "Not en fazla 1000 karakter olabilir." })
      .trim()
      .optional(),
  })
  .refine((data) => data.priceMax >= data.priceMin, {
    error: "Maksimum fiyat, minimum fiyattan küçük olamaz.",
    path: ["priceMax"],
  });

export type CreateOfferInput = z.infer<typeof createOfferSchema>;

export const OFFER_STATUS_VALUES = [
  "PENDING",
  "INTERESTED",
  "DECLINED",
  "WITHDRAWN",
] as const;

export const updateOfferStatusSchema = z.object({
  status: z.enum(OFFER_STATUS_VALUES, { error: "Geçerli bir durum seçin." }),
});

export type UpdateOfferStatusInput = z.infer<typeof updateOfferStatusSchema>;
