
import { API_BASE_URL } from '@/config/api';

export interface Project {
  id: number;
  projectName: string;
  description: string;
  siteAddress: string;
  geographicalCoordinates: string;
  siteEngineerId: number;
  clientId: number;
  startDate: string;
  expectedEndDate: string;
  status: number;
  clientName?: string;
  siteEngineerName?: string;
  projectStatus?: string;
  progress?: number;
}

export interface Client {
  id: number;
  fullName: string;
  phoneNumber: string;
  email: string;
  clientType: number;
}

export interface SiteEngineer {
  id: number;
  fullName: string;
  phoneNumber: string;
  email?: string;
  isAvailable: boolean;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    items: T[];
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

export const getProjects = async (params?: {
  page?: number;
  pageSize?: number;
  status?: number;
}): Promise<PaginatedResponse<Project>> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('pageNumber', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params?.status !== undefined) queryParams.append('status', params.status.toString());

    const url = `${API_BASE_URL}/Projects?${queryParams}`;
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

export const createProject = async (project: Project): Promise<Project> => {
  try {
    const response = await fetch(`${API_BASE_URL}/Projects`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(project),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

export const getClients = async (): Promise<PaginatedResponse<Client>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/Clients`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch clients');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }
};

export const getSiteEngineers = async (): Promise<PaginatedResponse<SiteEngineer>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/SiteEngineers`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch site engineers');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching site engineers:', error);
    throw error;
  }
};

export const getStatusFromCode = (statusCode: number): string => {
  const statusMap: { [key: number]: string } = {
    0: 'قيد التنفيذ',
    1: 'معلق',
    2: 'مكتمل',
    3: 'ملغي'
  };
  return statusMap[statusCode] || 'غير معروف';
};

export const getArabicStatus = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    'active': 'قيد التنفيذ',
    'pending': 'معلق',
    'completed': 'مكتمل',
    'canceled': 'ملغي'
  };
  return statusMap[status.toLowerCase()] || status;
};
