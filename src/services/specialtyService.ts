
import { API_BASE_URL } from '@/config/api';

// تعريف نوع البيانات للتخصص
export interface Specialty {
  id: number;
  name: string;
}

// واجهة استجابة قائمة التخصصات
export interface SpecialtiesResponse {
  success: boolean;
  message: string;
  errors?: string[];
  data: Specialty[];
}

// واجهة استجابة تخصص واحد
export interface SpecialtyResponse {
  success: boolean;
  message: string;
  errors?: string[];
  data: Specialty;
}

// واجهة طلب إنشاء تخصص جديد
export interface CreateSpecialtyRequest {
  name: string;
}

// Helper function to get authentication headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
    'Accept-Language': 'ar-SA,ar;q=0.9,en;q=0.8'
  };
};

/**
 * جلب جميع تخصصات العمال
 */
export async function getSpecialties(): Promise<Specialty[]> {
  try {
    console.log('Fetching specialties from API');
    const response = await fetch(`${API_BASE_URL}/WorkerSpecialties`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`فشل في جلب التخصصات. الرجاء المحاولة مرة أخرى. (HTTP ${response.status})`);
    }

    const result: SpecialtiesResponse = await response.json();
    console.log('API Response:', result);

    if (!result.success) {
      throw new Error(result.message || 'فشل في جلب التخصصات');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching specialties:', error);
    if (error instanceof Error) {
      throw new Error(`فشل في جلب التخصصات: ${error.message}`);
    }
    throw new Error('حدث خطأ غير متوقع أثناء جلب التخصصات');
  }
}

/**
 * إضافة تخصص جديد
 */
export async function createSpecialty(name: string): Promise<Specialty> {
  try {
    const response = await fetch(`${API_BASE_URL}/WorkerSpecialties`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`فشل في إضافة التخصص. الرجاء المحاولة مرة أخرى. (HTTP ${response.status})`);
    }

    const result: SpecialtyResponse = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'فشل في إضافة التخصص');
    }

    return result.data;
  } catch (error) {
    console.error('Error creating specialty:', error);
    if (error instanceof Error) {
      throw new Error(`فشل في إضافة التخصص: ${error.message}`);
    }
    throw new Error('حدث خطأ غير متوقع أثناء إضافة التخصص');
  }
}

/**
 * تحديث تخصص موجود
 */
export async function updateSpecialty(id: number, name: string): Promise<Specialty> {
  try {
    const response = await fetch(`${API_BASE_URL}/WorkerSpecialties`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ id, name })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`فشل في تحديث التخصص. الرجاء المحاولة مرة أخرى. (HTTP ${response.status})`);
    }

    const result: SpecialtyResponse = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'فشل في تحديث التخصص');
    }

    return result.data;
  } catch (error) {
    console.error('Error updating specialty:', error);
    if (error instanceof Error) {
      throw new Error(`فشل في تحديث التخصص: ${error.message}`);
    }
    throw new Error('حدث خطأ غير متوقع أثناء تحديث التخصص');
  }
}

/**
 * حذف تخصص
 */
export async function deleteSpecialty(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/WorkerSpecialties/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`فشل في حذف التخصص. الرجاء المحاولة مرة أخرى. (HTTP ${response.status})`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'فشل في حذف التخصص');
    }
  } catch (error) {
    console.error('Error deleting specialty:', error);
    if (error instanceof Error) {
      throw new Error(`فشل في حذف التخصص: ${error.message}`);
    }
    throw new Error('حدث خطأ غير متوقع أثناء حذف التخصص');
  }
}
