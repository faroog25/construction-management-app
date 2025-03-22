import * as z from "zod";

export const siteEngineerSchema = z.object({
  firstName: z.string()
    .min(2, { message: "الاسم الأول يجب أن يكون على الأقل حرفين" })
    .max(50, { message: "الاسم الأول يجب أن لا يتجاوز 50 حرف" }),
  secondName: z.string().optional(),
  thirdName: z.string().optional(),
  lastName: z.string()
    .min(2, { message: "الاسم الأخير يجب أن يكون على الأقل حرفين" })
    .max(50, { message: "الاسم الأخير يجب أن لا يتجاوز 50 حرف" }),
  email: z.string()
    .email({ message: "البريد الإلكتروني غير صالح" })
    .optional()
    .or(z.literal('')),
  phoneNumber: z.string()
    .min(9, { message: "رقم الهاتف يجب أن يكون على الأقل 9 أرقام" })
    .max(15, { message: "رقم الهاتف يجب أن لا يتجاوز 15 رقم" }),
  nationalNumber: z.string()
    .min(10, { message: "الرقم الوطني يجب أن يكون على الأقل 10 أرقام" })
    .max(20, { message: "الرقم الوطني يجب أن لا يتجاوز 20 رقم" })
    .optional()
    .or(z.literal('')),
  address: z.string()
    .min(5, { message: "العنوان يجب أن يكون على الأقل 5 أحرف" })
    .max(200, { message: "العنوان يجب أن لا يتجاوز 200 حرف" })
    .optional()
    .or(z.literal('')),
  hireDate: z.string()
    .optional()
    .or(z.literal('')),
});

export type SiteEngineerFormValues = z.infer<typeof siteEngineerSchema>; 