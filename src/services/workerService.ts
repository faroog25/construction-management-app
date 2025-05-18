
import { API_BASE_URL } from '@/config/api';

export interface WorkerTask {
  id: number;
  projectName: string;
  name: string;
}

export interface Worker {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  specialty: string;
  isAvailable?: boolean;
  tasks?: WorkerTask[];
  // الحقول التفصيلية
  firstName?: string;
  secondName?: string;
  thirdName?: string;
  lastName?: string;
  nationalNumber?: string;
  address?: string;
  specialtyId?: number;
}

export interface WorkersListResponse {
  success: boolean;
  message: string;
  errors?: string[];
  data: {
    items: Worker[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPreveiosPage: boolean;
  };
}

export interface WorkerResponse {
  success: boolean;
  message: string;
  errors?: string[];
  data: Worker;
}

export interface CreateWorkerRequest {
  firstName: string;
  secondName: string;
  thirdName: string;
  lastName: string;
  nationalNumber: string;
  phoneNumber: string;
  email: string;
  address: string;
  specialtyId: number;
}

export interface CreateWorkerResponse {
  success: boolean;
  message: string;
  data: Worker;
}

export interface DeleteWorkerResponse {
  success: boolean;
  message: string;
}

export interface UpdateWorkerRequest extends CreateWorkerRequest {
  id: number;
}

export interface UpdateWorkerResponse {
  success: boolean;
  message: string;
  data: Worker;
}

export interface Specialty {
  id: number;
  name: string;
}

/**
 * Fetches all workers from the API
 * @throws {Error} When the API request fails or returns invalid data
 */
export async function getAllWorkers(): Promise<Worker[]> {
  try {
    console.log('Fetching workers from:', `${API_BASE_URL}/Workers`);
    const response = await fetch(`${API_BASE_URL}/Workers`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`فشل في جلب العمال. الرجاء المحاولة مرة أخرى. (HTTP ${response.status})`);
    }
    
    const result: WorkersListResponse = await response.json();
    console.log('API Response:', result);
    
    if (!result.success) {
      throw new Error(result.message || 'فشل في جلب بيانات العمال');
    }
    
    if (!result.data || !result.data.items) {
      console.error('Invalid API response structure:', result);
      throw new Error('بيانات غير صالحة من الخادم');
    }
    
    return result.data.items;
  } catch (error) {
    console.error('Error fetching workers:', error);
    if (error instanceof Error) {
      throw new Error(`فشل في جلب العمال: ${error.message}`);
    }
    throw new Error('حدث خطأ غير متوقع أثناء جلب العمال');
  }
}

/**
 * Creates a new worker
 */
export async function createWorker(workerData: CreateWorkerRequest): Promise<Worker> {
  try {
    const response = await fetch(`${API_BASE_URL}/Workers`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Accept-Language': 'ar-SA,ar;q=0.9,en;q=0.8'
      },
      body: JSON.stringify(workerData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`فشل في إضافة العامل. الرجاء المحاولة مرة أخرى. (HTTP ${response.status})`);
    }

    const result: CreateWorkerResponse = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'فشل في إضافة العامل');
    }

    return result.data;
  } catch (error) {
    console.error('Error creating worker:', error);
    if (error instanceof Error) {
      throw new Error(`فشل في إضافة العامل: ${error.message}`);
    }
    throw new Error('حد�� خطأ غير متوقع أثناء إضافة العامل');
  }
}

/**
 * Fetches all specialties from the API
 */
export async function getSpecialties(): Promise<Specialty[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/WorkerSpecialties`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Accept-Language': 'ar-SA,ar;q=0.9,en;q=0.8'
      }
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

    const result = await response.json();

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
 * Fetches a specific worker by ID
 */
export const getWorkerById = async (id: number): Promise<Worker> => {
  try {
    console.log('Fetching worker with ID:', id);
    const url = `${API_BASE_URL}/Workers/${id}`;
    console.log('API URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Accept-Language': 'ar-SA,ar;q=0.9,en;q=0.8'
      },
    });

    console.log('Response status:', response.status);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: WorkerResponse = await response.json();
    console.log('API Response:', result);

    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch worker');
    }

    if (!result.data) {
      throw new Error('No worker data received');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching worker:', error);
    throw error;
  }
};

/**
 * Fetches workers assigned to a specific project
 */
export async function getWorkersByProjectId(projectId: number): Promise<Worker[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/Workers/project/${projectId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result.data.items;
  } catch (error) {
    console.error(`Error fetching workers for project ${projectId}:`, error);
    throw error;
  }
}

/**
 * Deletes a worker by ID
 */
export async function deleteWorker(id: number): Promise<void> {
  try {
    console.log('Deleting worker with ID:', id);
    const response = await fetch(`${API_BASE_URL}/Workers/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Accept-Language': 'ar-SA,ar;q=0.9,en;q=0.8'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`فشل في حذف العامل. الرجاء المحاولة مرة أخرى. (HTTP ${response.status})`);
    }

    const result: DeleteWorkerResponse = await response.json();
    console.log('Delete API Response:', result);

    if (!result.success) {
      throw new Error(result.message || 'فشل في حذف العامل');
    }
  } catch (error) {
    console.error('Error deleting worker:', error);
    if (error instanceof Error) {
      throw new Error(`فشل في حذف العامل: ${error.message}`);
    }
    throw new Error('حدث خطأ غير متوقع أثناء حذف العامل');
  }
}

/**
 * Updates an existing worker
 */
export async function updateWorker(id: number, workerData: CreateWorkerRequest): Promise<Worker> {
  try {
    console.log('Updating worker:', { id, workerData });
    const response = await fetch(`${API_BASE_URL}/Workers/${id}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Accept-Language': 'ar-SA,ar;q=0.9,en;q=0.8'
      },
      body: JSON.stringify(workerData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`فشل في تحديث بيانات العامل. الرجاء المحاولة مرة أخرى. (HTTP ${response.status})`);
    }

    const result: UpdateWorkerResponse = await response.json();
    console.log('Update API Response:', result);

    if (!result.success) {
      throw new Error(result.message || 'فشل في تحديث بيانات العامل');
    }

    return result.data;
  } catch (error) {
    console.error('Error updating worker:', error);
    if (error instanceof Error) {
      throw new Error(`فشل في تحديث بيانات العامل: ${error.message}`);
    }
    throw new Error('حدث خطأ غير متوقع أثناء تحديث بيانات العامل');
  }
}
