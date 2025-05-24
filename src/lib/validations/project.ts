
import * as z from "zod"

// المخطط الأساسي للمشروع
export const projectSchema = z.object({
  projectName: z.string()
    .min(3, { message: "اسم المشروع يجب أن يكون 3 أحرف على الأقل" })
    .max(100, { message: "اسم المشروع يجب أن لا يتجاوز 100 حرف" }),
  description: z.string().optional(),
  siteAddress: z.string()
    .min(5, { message: "عنوان الموقع يجب أن يكون 5 أحرف على الأقل" })
    .max(200, { message: "عنوان الموقع يجب أن لا يتجاوز 200 حرف" }),
  clientName: z.string()
    .min(3, { message: "اسم العميل يجب أن يكون 3 أحرف على الأقل" }),
  projectStatus: z.string(),
  geographicalCoordinates: z.string().optional(),
  siteEngineerId: z.number().optional(),
  clientId: z.number().optional(),
  startDate: z.string().optional(), // تغيير من date إلى string
  expectedEndDate: z.string().optional(), // تغيير من date إلى string
  status: z.number().default(1)
})

// مخطط تعديل المعلومات الأساسية للمشروع
export const projectBasicEditSchema = z.object({
  projectName: z.string()
    .min(3, { message: "اسم المشروع يجب أن يكون 3 أحرف على الأقل" })
    .max(100, { message: "اسم المشروع يجب أن لا يتجاوز 100 حرف" }),
  description: z.string().optional(),
  siteAddress: z.string()
    .min(5, { message: "عنوان الموقع يجب أن يكون 5 أحرف على الأقل" })
    .max(200, { message: "عنوان الموقع يجب أن لا يتجاوز 200 حرف" }),
  geographicalCoordinates: z.string().optional(),
})

export type ProjectFormValues = z.infer<typeof projectSchema> 
export type ProjectBasicEditValues = z.infer<typeof projectBasicEditSchema>
