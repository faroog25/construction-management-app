import * as z from "zod"
import { ClientType } from "@/types/client"

export const clientSchema = z.object({
  id: z.string().optional(),
  fullName: z.string()
    .min(3, { message: "الاسم يجب أن يكون 3 أحرف على الأقل" })
    .max(50, { message: "الاسم يجب أن لا يتجاوز 50 حرف" }),
  email: z.string()
    .min(1, { message: "البريد الإلكتروني مطلوب" })
    .email({ message: "البريد الإلكتروني غير صالح" }),
  phoneNumber: z.string()
    .min(10, { message: "رقم الهاتف يجب أن يكون 10 أرقام على الأقل" })
    .max(15, { message: "رقم الهاتف يجب أن لا يتجاوز 15 رقم" })
    .regex(/^[0-9+]+$/, { message: "رقم الهاتف يجب أن يحتوي على أرقام فقط" }),
  clientType: z.number()
    .refine((val) => val === ClientType.Individual || val === ClientType.Company, {
      message: "نوع العميل غير صالح"
    })
})

export type ClientFormValues = z.infer<typeof clientSchema> 