import { z } from "zod";

function optionalCoerceNumber(min: number) {
  return z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? undefined : val),
    z.coerce.number().min(min).optional()
  );
}

export const createSavedSearchSchema = z.object({
  name: z
    .string()
    .min(2, { error: "Arama adı en az 2 karakter olmalı." })
    .max(80, { error: "Arama adı en fazla 80 karakter olabilir." })
    .trim(),
  province: z.string().trim().optional(),
  q: z.string().trim().max(120).optional(),
  maxBuildingAge: optionalCoerceNumber(0),
  minSquareMeters: optionalCoerceNumber(0),
});

export type CreateSavedSearchInput = z.infer<typeof createSavedSearchSchema>;
