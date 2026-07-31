import { z } from "zod";

/** Kayıt sırasında istenen evraklar. Sıra, formdaki gösterim sırasıdır. */
export const CONTRACTOR_DOCUMENT_TYPES = [
  "VERGI_LEVHASI",
  "TICARET_SICIL_GAZETESI",
  "TICARET_ODASI_KAYDI",
  "IMZA_SIRKULERI",
  "FAALIYET_BELGESI",
] as const;

export type ContractorDocumentTypeValue = (typeof CONTRACTOR_DOCUMENT_TYPES)[number];

export const ACCEPTED_DOCUMENT_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const ACCEPTED_DOCUMENT_ACCEPT_ATTR = ".pdf,.jpg,.jpeg,.png,.webp";
export const MAX_DOCUMENT_SIZE_BYTES = 10 * 1024 * 1024;

/** YAMBİS yapı müteahhitliği yetki belgesi numarası 16 hanelidir. */
export const MYBN_LENGTH = 16;

export function normalizeMybn(value: string) {
  return value.replace(/[\s-]/g, "");
}

export function isValidMybn(value: string) {
  return new RegExp(`^\\d{${MYBN_LENGTH}}$`).test(normalizeMybn(value));
}

export const contractorDocumentsSchema = z.object({
  companyName: z
    .string()
    .trim()
    .min(2, { error: "Şirket ünvanı en az 2 karakter olmalı." })
    .max(160, { error: "Şirket ünvanı en fazla 160 karakter olabilir." }),
  mybn: z
    .string()
    .trim()
    .transform(normalizeMybn)
    .refine(isValidMybn, {
      error: `Müteahhitlik Yetki Belgesi Numarası ${MYBN_LENGTH} haneli olmalı.`,
    }),
});

export type ContractorDocumentsInput = z.infer<typeof contractorDocumentsSchema>;

export function validateContractorDocumentFile(file: {
  type: string;
  size: number;
}): string | null {
  if (!ACCEPTED_DOCUMENT_MIME_TYPES.includes(file.type as (typeof ACCEPTED_DOCUMENT_MIME_TYPES)[number])) {
    return "Evraklar yalnızca PDF, JPG, PNG veya WEBP formatında olabilir.";
  }
  if (file.size > MAX_DOCUMENT_SIZE_BYTES) {
    return "Her evrak en fazla 10MB olabilir.";
  }
  return null;
}

export const reviewContractorDocumentSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"], { error: "Karar seçin." }),
  reviewNote: z
    .string()
    .trim()
    .max(500, { error: "Not en fazla 500 karakter olabilir." })
    .optional(),
});

export type ReviewContractorDocumentInput = z.infer<typeof reviewContractorDocumentSchema>;
