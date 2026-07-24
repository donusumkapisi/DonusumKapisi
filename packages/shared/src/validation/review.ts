import { z } from "zod";

export const createReviewSchema = z.object({
  rating: z.coerce
    .number({ error: "Puan girin." })
    .int()
    .min(1, { error: "Puan en az 1 olmalı." })
    .max(5, { error: "Puan en fazla 5 olabilir." }),
  comment: z
    .string()
    .max(1000, { error: "Yorum en fazla 1000 karakter olabilir." })
    .trim()
    .optional(),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
