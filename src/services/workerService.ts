import { API_BASE_URL } from '@/config/api';

export interface Worker {
  id: number;
  fullName: string;
  specialty: string;
  isAvailable: boolean;
}

export interface WorkerResponse {
  success: boolean;
  message: string;
  data: {
    items: Worker[];
  };
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
    
    const result: WorkerResponse = await response.json();
    console.log('API Response:', result);
    
    if (!result.success) {
      throw new Error(result.message || 'فشل في جلب بيانات العمال');
    }
    
    if (!result.data?.items) {
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
 * Fetches a specific worker by ID
 */
export async function getWorkerById(id: number): Promise<Worker> {
  try {
    const response = await fetch(`${API_BASE_URL}/Workers/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error(`Error fetching worker with ID ${id}:`, error);
    throw error;
  }
}

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