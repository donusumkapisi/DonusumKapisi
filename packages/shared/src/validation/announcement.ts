import { z } from "zod";

export const announcementSchema = z.object({
  title: z
    .string()
    .min(3, { error: "Başlık en az 3 karakter olmalı." })
    .max(150, { error: "Başlık en fazla 150 karakter olabilir." })
    .trim(),
  body: z
    .string()
    .min(10, { error: "İçerik en az 10 karakter olmalı." })
    .max(5000, { error: "İçerik en fazla 5000 karakter olabilir." })
    .trim(),
  linkUrl: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined))
    .refine((value) => value === undefined || /^https?:\/\//i.test(value), {
      error: "Bağlantı http:// veya https:// ile başlamalı.",
    }),
  published: z.coerce.boolean().default(false),
});

export type AnnouncementInput = z.infer<typeof announcementSchema>;
