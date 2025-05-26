
import { API_BASE_URL } from '@/config/api';

export async function generateProjectReport(project: { id: number }): Promise<void> {
  try {
    console.log('بدء تحميل تقرير المشروع من الخادم:', project.id);
    
    // إرسال طلب لتحميل التقرير من الخادم
    const response = await fetch(`${API_BASE_URL}/Reports/downloadProjectReprot/${project.id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/pdf',
      },
    });

    if (!response.ok) {
      throw new Error(`فشل في تحميل التقرير: ${response.status} ${response.statusText}`);
    }

    // الحصول على اسم الملف من header
    const contentDisposition = response.headers.get('content-disposition');
    let fileName = `تقرير_المشروع_${project.id}.pdf`;
    
    if (contentDisposition) {
      // استخراج اسم الملف من header
      const fileNameMatch = contentDisposition.match(/filename\*?=['"]?([^'";\r\n]*)['"]?/);
      if (fileNameMatch && fileNameMatch[1]) {
        fileName = decodeURIComponent(fileNameMatch[1]);
      }
    }

    // تحويل الاستجابة إلى blob
    const blob = await response.blob();
    
    // إنشاء رابط التحميل
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    
    // إضافة الرابط إلى الصفحة وتفعيله ثم حذفه
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // تنظيف الذاكرة
    window.URL.revokeObjectURL(url);
    
    console.log('تم تحميل التقرير بنجاح:', fileName);
  } catch (error) {
    console.error('خطأ في تحميل تقرير المشروع:', error);
    throw new Error('فشل في تحميل تقرير المشروع');
  }
}
