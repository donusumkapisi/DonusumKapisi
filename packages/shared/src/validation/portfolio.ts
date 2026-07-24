import { z } from "zod";

export const createPortfolioItemSchema = z.object({
  title: z
    .string()
    .min(3, { error: "Başlık en az 3 karakter olmalı." })
    .max(120, { error: "Başlık en fazla 120 karakter olabilir." })
    .trim(),
  description: z.string().max(1000, { error: "Açıklama en fazla 1000 karakter olabilir." }).trim().optional(),
});

export type CreatePortfolioItemInput = z.infer<typeof createPortfolioItemSchema>;
