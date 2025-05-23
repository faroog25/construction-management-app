
import { z } from "zod";
import { getLocalStorageLanguage } from "@/utils/languageUtils";

// Helper function to get error messages based on language
const getErrorMessage = (arabicMsg: string, englishMsg: string) => {
  const language = getLocalStorageLanguage();
  return language === 'ar' ? arabicMsg : englishMsg;
};

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { 
      message: getErrorMessage("الإيميل مطلوب", "Email is required") 
    })
    .email({ 
      message: getErrorMessage("يرجى إدخال إيميل صحيح", "Please enter a valid email") 
    }),
  password: z
    .string()
    .min(1, { 
      message: getErrorMessage("كلمة المرور مطلوبة", "Password is required") 
    })
    .min(8, { 
      message: getErrorMessage("يجب أن تتكون كلمة المرور من 8 أحرف على الأقل", "Password must be at least 8 characters long") 
    }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { 
      message: getErrorMessage("الإيميل مطلوب", "Email is required") 
    })
    .email({ 
      message: getErrorMessage("يرجى إدخال إيميل صحيح", "Please enter a valid email") 
    }),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(1, { 
      message: getErrorMessage("كلمة المرور مطلوبة", "Password is required") 
    })
    .min(8, { 
      message: getErrorMessage("يجب أن تتكون كلمة المرور من 8 أحرف على الأقل", "Password must be at least 8 characters long") 
    }),
  confirmPassword: z
    .string()
    .min(1, { 
      message: getErrorMessage("تأكيد كلمة المرور مطلوب", "Confirm password is required") 
    }),
}).refine((data) => data.password === data.confirmPassword, {
  message: getErrorMessage("كلمات المرور غير متطابقة", "Passwords do not match"),
  path: ["confirmPassword"],
});

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
