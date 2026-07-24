import { z } from "zod";

export const priceEstimateSchema = z.object({
  province: z.string().min(2, { error: "İl seçin." }),
  district: z.string().min(2, { error: "İlçe girin." }).trim(),
  squareMeters: z.coerce
    .number({ error: "Metrekare girin." })
    .int()
    .min(50, { error: "Metrekare en az 50 olmalı." })
    .max(100_000, { error: "Metrekare çok yüksek." }),
  unitCount: z.coerce
    .number({ error: "Daire sayısı girin." })
    .int()
    .min(1, { error: "Daire sayısı en az 1 olmalı." })
    .max(500, { error: "Daire sayısı çok yüksek." }),
  buildingAge: z.coerce
    .number({ error: "Bina yaşı girin." })
    .int()
    .min(0, { error: "Bina yaşı negatif olamaz." })
    .max(150, { error: "Geçerli bir bina yaşı girin." }),
  floorCount: z.coerce
    .number({ error: "Kat sayısı girin." })
    .int()
    .min(1, { error: "Kat sayısı en az 1 olmalı." })
    .max(100, { error: "Kat sayısı çok yüksek." }),
});

export type PriceEstimateInput = z.infer<typeof priceEstimateSchema>;
