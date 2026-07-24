import { z } from "zod";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const BLOG_CATEGORIES = [
  {
    slug: "surec-ve-mevzuat",
    label: "Süreç ve Mevzuat",
    description:
      "6306 sayılı Kanun, riskli yapı tespiti, kat malikleri kararı ve itiraz süreçleri hakkında güncel rehberler.",
  },
  {
    slug: "ilce-rehberleri",
    label: "İlçe ve Bölge Rehberleri",
    description:
      "Türkiye genelinde il ve ilçe bazında kentsel dönüşüm süreci, kat karşılığı oranları ve yerel dinamikler.",
  },
  {
    slug: "maliyet-ve-finansman",
    label: "Maliyet ve Finansman",
    description:
      "Kat karşılığı hesaplama, emsal hesabı, kentsel dönüşüm kredisi ve devlet destekleri üzerine rehberler.",
  },
  {
    slug: "muteahhit-secimi",
    label: "Müteahhit Seçimi",
    description:
      "Güvenilir müteahhit nasıl seçilir, sözleşmede nelere dikkat edilmeli, referanslar nasıl kontrol edilir.",
  },
  {
    slug: "hak-sahibi-rehberi",
    label: "Hak Sahibi Rehberi",
    description:
      "Kira yardımı, hak sahipliği, anlaşmazlık durumları ve ev sahibi haklarıyla ilgili kapsamlı bilgiler.",
  },
] as const;

export type BlogCategorySlug = (typeof BLOG_CATEGORIES)[number]["slug"];

export function getBlogCategoryLabel(slug: string): string {
  return BLOG_CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}

export function getBlogCategoryDescription(slug: string): string | undefined {
  return BLOG_CATEGORIES.find((c) => c.slug === slug)?.description;
}

export const blogPostSchema = z.object({
  title: z
    .string()
    .min(5, { error: "Başlık en az 5 karakter olmalı." })
    .max(150, { error: "Başlık en fazla 150 karakter olabilir." })
    .trim(),
  slug: z
    .string()
    .min(3, { error: "Bağlantı en az 3 karakter olmalı." })
    .max(150, { error: "Bağlantı en fazla 150 karakter olabilir." })
    .regex(slugPattern, {
      error: "Bağlantı yalnızca küçük harf, rakam ve tire (-) içerebilir.",
    }),
  excerpt: z
    .string()
    .min(10, { error: "Özet en az 10 karakter olmalı." })
    .max(300, { error: "Özet en fazla 300 karakter olabilir." })
    .trim(),
  body: z
    .string()
    .min(50, { error: "İçerik en az 50 karakter olmalı." })
    .trim(),
  coverImageUrl: z.string().trim().optional(),
  category: z
    .string()
    .min(2, { error: "Kategori seçmelisiniz." })
    .max(60, { error: "Kategori en fazla 60 karakter olabilir." })
    .trim(),
  tags: z
    .string()
    .trim()
    .optional()
    .transform((value) =>
      value
        ? value
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : []
    ),
  metaDescription: z
    .string()
    .trim()
    .max(160, { error: "Meta açıklama en fazla 160 karakter olabilir." })
    .optional()
    .transform((value) => (value ? value : undefined)),
  province: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined)),
  district: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined)),
  published: z.coerce.boolean().default(false),
});

export type BlogPostInput = z.infer<typeof blogPostSchema>;

export function slugify(title: string): string {
  return title
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
