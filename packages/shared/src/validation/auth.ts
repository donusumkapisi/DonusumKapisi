import { z } from "zod";

export const logInSchema = z.object({
  email: z.email({ error: "Geçerli bir e-posta adresi girin." }).trim(),
  password: z.string().min(1, { error: "Şifrenizi girin." }),
});

export const signUpSchema = z.object({
  name: z
    .string()
    .min(2, { error: "Ad soyad en az 2 karakter olmalı." })
    .trim(),
  email: z.email({ error: "Geçerli bir e-posta adresi girin." }).trim(),
  password: z
    .string()
    .min(8, { error: "Şifre en az 8 karakter olmalı." })
    .regex(/[a-zA-Z]/, { error: "Şifre en az bir harf içermeli." })
    .regex(/[0-9]/, { error: "Şifre en az bir rakam içermeli." }),
  role: z.enum(["HOMEOWNER", "CONTRACTOR"], {
    error: "Hesap türünü seçin.",
  }),
});

export const forgotPasswordSchema = z.object({
  email: z.email({ error: "Geçerli bir e-posta adresi girin." }).trim(),
});

export const resetPasswordSchema = z.object({
  email: z.email({ error: "Geçerli bir e-posta adresi girin." }).trim(),
  code: z
    .string()
    .length(6, { error: "Kod 6 haneli olmalı." })
    .regex(/^\d+$/, { error: "Kod yalnızca rakam içermeli." }),
  password: z
    .string()
    .min(8, { error: "Şifre en az 8 karakter olmalı." })
    .regex(/[a-zA-Z]/, { error: "Şifre en az bir harf içermeli." })
    .regex(/[0-9]/, { error: "Şifre en az bir rakam içermeli." }),
});

export const googleAuthSchema = z.object({
  idToken: z.string().min(1, { error: "Google kimlik doğrulaması başarısız." }),
  role: z.enum(["HOMEOWNER", "CONTRACTOR"]).optional(),
});

export const appleAuthSchema = z.object({
  identityToken: z.string().min(1, { error: "Apple kimlik doğrulaması başarısız." }),
  name: z.string().trim().min(1).optional(),
  role: z.enum(["HOMEOWNER", "CONTRACTOR"]).optional(),
});

export type LogInInput = z.infer<typeof logInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type GoogleAuthInput = z.infer<typeof googleAuthSchema>;
export type AppleAuthInput = z.infer<typeof appleAuthSchema>;
