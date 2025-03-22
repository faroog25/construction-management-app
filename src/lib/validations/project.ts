import * as z from "zod"

export const projectSchema = z.object({
  projectName: z.string()
    .min(3, { message: "اسم المشروع يجب أن يكون 3 أحرف على الأقل" })
    .max(100, { message: "اسم المشروع يجب أن لا يتجاوز 100 حرف" }),
  siteAddress: z.string()
    .min(5, { message: "عنوان الموقع يجب أن يكون 5 أحرف على الأقل" })
    .max(200, { message: "عنوان الموقع يجب أن لا يتجاوز 200 حرف" }),
  clientName: z.string()
    .min(3, { message: "اسم العميل يجب أن يكون 3 أحرف على الأقل" })
    .max(100, { message: "اسم العميل يجب أن لا يتجاوز 100 حرف" }),
  projectStatus: z.enum(["Active", "Completed", "Pending", "Delayed"], {
    required_error: "حالة المشروع مطلوبة",
  }),
  description: z.string().optional(),
  startDate: z.date({
    required_error: "تاريخ البدء مطلوب",
    invalid_type_error: "تاريخ البدء غير صالح",
  }),
  expectedEndDate: z.date({
    required_error: "تاريخ الانتهاء المتوقع مطلوب",
    invalid_type_error: "تاريخ الانتهاء المتوقع غير صالح",
  })
}).refine((data) => {
  return data.expectedEndDate > data.startDate
}, {
  message: "تاريخ الانتهاء المتوقع يجب أن يكون بعد تاريخ البدء",
  path: ["expectedEndDate"],
})

export type ProjectFormValues = z.infer<typeof projectSchema> 