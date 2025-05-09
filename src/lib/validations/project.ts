import * as z from "zod"

export const projectSchema = z.object({
  projectName: z.string()
    .min(3, { message: "اسم المشروع يجب أن يكون 3 أحرف على الأقل" })
    .max(100, { message: "اسم المشروع يجب أن لا يتجاوز 100 حرف" }),
  description: z.string().optional(),
  siteAddress: z.string()
    .min(5, { message: "عنوان الموقع يجب أن يكون 5 أحرف على الأقل" })
    .max(200, { message: "عنوان الموقع يجب أن لا يتجاوز 200 حرف" }),
  geographicalCoordinates: z.string()
    .min(5, { message: "الإحداثيات الجغرافية يجب أن تكون 5 أحرف على الأقل" })
    .max(100, { message: "الإحداثيات الجغرافية يجب أن لا تتجاوز 100 حرف" }),
  siteEngineerId: z.number()
    .min(1, { message: "معرف مهندس الموقع مطلوب" }),
  clientId: z.number()
    .min(1, { message: "معرف العميل مطلوب" }),
  startDate: z.string()
    .min(1, { message: "تاريخ البدء مطلوب" }),
  expectedEndDate: z.string()
    .min(1, { message: "تاريخ الانتهاء المتوقع مطلوب" }),
  status: z.number()
    .default(1)
})

export type ProjectFormValues = z.infer<typeof projectSchema> 