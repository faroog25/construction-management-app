
import { API_BASE_URL } from '@/config/api';

export interface Worker {
  id: number;
  fullName: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  specialtyId: number;
  specialtyName?: string;
  isAssigned: boolean;
  projectId?: number;
  projectName?: string;
}

export interface WorkerResponse {
  success: boolean;
  message: string;
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

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export async function getWorkers(
  page: number = 1,
  pageSize: number = 10,
  searchQuery: string = '',
  sortColumn: string = 'fullName',
  sortDirection: 'asc' | 'desc' = 'asc'
): Promise<WorkerResponse['data']> {
  try {
    const queryParams = new URLSearchParams({
      pageNumber: page.toString(),
      pageSize: pageSize.toString(),
      search: searchQuery,
      sortColumn,
      sortDirection
    });

    const response = await fetch(`${API_BASE_URL}/Workers?${queryParams}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: WorkerResponse = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch workers');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching workers:', error);
    throw error;
  }
}

export async function createWorker(worker: Omit<Worker, 'id'>): Promise<Worker> {
  try {
    const response = await fetch(`${API_BASE_URL}/Workers`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(worker),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error creating worker:', error);
    throw error;
  }
}

export async function updateWorker(id: number, worker: Partial<Worker>): Promise<Worker> {
  try {
    const response = await fetch(`${API_BASE_URL}/Workers`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ id, ...worker }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error updating worker:', error);
    throw error;
  }
}

export async function deleteWorker(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/Workers/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting worker:', error);
    throw error;
  }
}
