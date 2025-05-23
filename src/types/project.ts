
// دعنا نضيف حقل status للنوع Project إذا كان غير موجود
export interface Project {
  id: number;
  name: string;
  description?: string;
  client_name?: string;
  client_id?: number;
  site_engineer_id?: number;
  location?: string;
  start_date: string;
  expected_end_date?: string;
  actual_end_date?: string;
  budget?: number;
  progress?: number;
  status: string; // إضافة حقل الحالة المفقود
  created_at?: string;
  updated_at?: string;
  client?: {
    id: number;
    name: string;
  };
  site_engineer?: {
    id: number;
    name: string;
  };
  stages?: Array<{
    id: number;
    name: string;
    start_date: string;
    expected_end_date?: string;
    progress?: number;
  }>;
}
