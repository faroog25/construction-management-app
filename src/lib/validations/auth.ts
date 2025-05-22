
import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "الإيميل مطلوب" })
    .email({ message: "يرجى إدخال إيميل صحيح" }),
  password: z
    .string()
    .min(1, { message: "كلمة المرور مطلوبة" })
    .min(8, { message: "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل" }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "الإيميل مطلوب" })
    .email({ message: "يرجى إدخال إيميل صحيح" }),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(1, { message: "كلمة المرور مطلوبة" })
    .min(8, { message: "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل" }),
  confirmPassword: z
    .string()
    .min(1, { message: "تأكيد كلمة المرور مطلوب" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "كلمات المرور غير متطابقة",
  path: ["confirmPassword"],
});

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
