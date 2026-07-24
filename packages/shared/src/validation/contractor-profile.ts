import { z } from "zod";

export const updateContractorProfileSchema = z.object({
  companyName: z
    .string()
    .max(160, { error: "Şirket adı en fazla 160 karakter olabilir." })
    .trim()
    .optional(),
  about: z
    .string()
    .max(2000, { error: "Hakkında en fazla 2000 karakter olabilir." })
    .trim()
    .optional(),
});

export type UpdateContractorProfileInput = z.infer<typeof updateContractorProfileSchema>;
