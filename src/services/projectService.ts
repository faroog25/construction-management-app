import { API_BASE_URL } from '@/config/api';
import { Project, ProjectApiResponse, PaginatedResponse } from '@/types/project';

export interface Project {
  id: number;
  projectName: string;
  description?: string;
  siteAddress: string;
  geographicalCoordinates?: string;
  siteEngineerId: number;
  clientId: number;
  startDate: string;
  expectedEndDate: string;
  status: number;
  progress?: number;
  siteEngineerName?: string;
  clientName?: string;
  projectStatus?: string;
  cancellationReason?: string;
  cancellationDate?: string;
  completionDate?: string;
  handoverDate?: string;
}

// Add the ProjectWithClient interface that was referenced but not defined
export interface ProjectWithClient {
  id: number;
  name: string;
  client_name: string;
  expected_end_date: string;
  start_date: string;
  progress: number;
  status: number;
  client_id?: number;
}

export interface ProjectResponse {
  success: boolean;
  message: string;
  data: {
    items: Project[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPreveiosPage: boolean;
  };
}

export async function getAllProjects(): Promise<Project[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/Projects`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`فشل في جلب المشاريع. الرجاء المحاولة مرة أخرى. (HTTP ${response.status})`);
    }
    
    const result: ProjectResponse = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'فشل في جلب بيانات المشاريع');
    }
    
    if (!result.data?.items) {
      console.error('Invalid API response structure:', result);
      throw new Error('بيانات غير صالحة من الخادم');
    }
    
    return result.data.items;
  } catch (error) {
    console.error('Error fetching projects:', error);
    if (error instanceof Error) {
      throw new Error(`فشل في جلب المشاريع: ${error.message}`);
    }
    throw new Error('حدث خطأ غير متوقع أثناء جلب المشاريع');
  }
}

export interface ProjectsQueryParams {
  page?: number;
  pageSize?: number;
  status?: number;
}

export async function getProjects(params: ProjectsQueryParams = {}): Promise<PaginatedResponse<Project>> {
  try {
    const { page = 1, pageSize = 10, status } = params;
    
    // بناء URL مع المعلمات المناسبة
    let url = `${API_BASE_URL}/Projects?pageNumber=${page}&pageSize=${pageSize}`;
    if (status !== undefined && status !== null) {
      url += `&status=${status}`;
    }
    
    console.log('Fetching projects from:', url);
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('API Response:', result);
    
    if (!result.data || !result.data.items) {
      console.error('Invalid API response structure:', result);
      throw new Error('Invalid API response structure');
    }
    
    return result as PaginatedResponse<Project>;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
}

export async function getProjectById(id: number): Promise<Project> {
  try {
    console.log('Fetching project details from:', `${API_BASE_URL}/Projects/${id}`);
    const response = await fetch(`${API_BASE_URL}/Projects/${id}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response for project details:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: ProjectApiResponse = await response.json();
    console.log('API Response for project details:', result);
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch project details');
    }
    
    if (!result.data) {
      console.error('Invalid API response structure for project details:', result);
      throw new Error('Invalid API response structure');
    }
    
    // Map API response to our Project interface
    const projectDetails: Project = {
      id: result.data.id,
      projectName: result.data.projectName,
      description: result.data.description,
      siteAddress: result.data.siteAddress,
      geographicalCoordinates: result.data.geographicalCoordinates,
      clientName: result.data.clientName,
      siteEngineerName: result.data.siteEngineerName,
      startDate: result.data.startDate,
      expectedEndDate: result.data.expectedEndDate,
      projectStatus: result.data.projectStatus,
      status: getStatusCodeFromString(result.data.projectStatus),
      cancellationReason: result.data.cancellationReason,
      cancellationDate: result.data.cancellationDate,
      completionDate: result.data.completionDate,
      handoverDate: result.data.handoverDate,
      // Add other fields as needed
      siteEngineerId: 0, // Default value
      clientId: 0, // Default value
    };
    
    return projectDetails;
  } catch (error) {
    console.error('Error fetching project by ID:', error);
    throw error;
  }
}

// Helper function to convert status string to status code
function getStatusCodeFromString(status: string | undefined): number {
  if (!status) return 0; // Default to active (0)
  
  // Map Arabic status strings to status codes
  switch (status.trim().toLowerCase()) {
    case 'قيد التنفيذ':
      return 0; // active
    case 'معلق':
      return 1; // pending
    case 'مكتمل':
    case 'تم الانتهاء':
      return 2; // completed
    case 'ملغي':
      return 3; // cancelled
    default:
      return 0; // Default to active
  }
}

export async function createProject(projectData: Project): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/Projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(projectData),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create project');
  }
  
  return response.json();
};

// Utility to convert status code to string
export const getStatusFromCode = (statusCode: number): 'active' | 'pending' | 'completed' | 'canceled' => {
  switch (statusCode) {
    case 0:
      return 'active';
    case 1:
      return 'pending';
    case 2:
      return 'completed';
    case 3:
      return 'canceled';
    default:
      return 'active';
  }
};

// Arabic status mapping
export const getArabicStatus = (statusCode: number): string => {
  switch (statusCode) {
    case 0:
      return 'قيد التنفيذ';
    case 1:
      return 'معلق';
    case 2:
      return 'مكتمل';
    case 3:
      return 'ملغي';
    default:
      return 'قيد التنفيذ';
  }
};

export const getProjectsByStatus = async (statusCode: number): Promise<Project[]> => {
  try {
    const result = await getProjects({ status: statusCode });
    return result.data.items;
  } catch (error) {
    console.error('Error fetching projects by status:', error);
    throw error;
  }
};

export interface Client {
  id: number;
  fullName: string;
}

export interface SiteEngineer {
  id: number;
  fullName: string;
}

export const getClients = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/Clients`);
    if (!response.ok) {
      throw new Error('Failed to fetch clients');
    }
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }
};

export const getSiteEngineers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/SiteEngineers`);
    if (!response.ok) {
      throw new Error('Failed to fetch site engineers');
    }
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching site engineers:', error);
    throw error;
  }
};
