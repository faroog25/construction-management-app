
import { z } from 'zod';

export const siteEngineerSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون أكثر من حرفين'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  confirmPassword: z.string().min(6, 'تأكيد كلمة المرور مطلوب'),
  phoneNumber: z.string().min(10, 'رقم الهاتف يجب أن يكون 10 أرقام على الأقل'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "كلمة المرور غير متطابقة",
  path: ["confirmPassword"],
});

export type SiteEngineerFormValues = z.infer<typeof siteEngineerSchema>;
