import { API_BASE_URL } from '@/config/api';

export interface Project {
  id: number;
  projectName: string;
  siteAddress: string;
  clientName: string;
  projectStatus: string;
  description?: string;
  startDate?: string;
  expectedEndDate?: string;
  actualEndDate?: string;
  status?: number;
  orderId?: number;
  siteEngineerId?: number;
  clientId?: number;
  stageId?: number;
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

export async function getProjects(page: number = 1, pageSize: number = 10): Promise<Project[]> {
  try {
    console.log('Fetching projects from:', `${API_BASE_URL}/Projects?pageNumber=${page}&pageSize=${pageSize}`);
    const response = await fetch(`${API_BASE_URL}/Projects?pageNumber=${page}&pageSize=${pageSize}`);
    
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
    
    return result.data.items;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
}

export async function getProjectsByStatus(statusCode: number): Promise<Project[]> {
  try {
    const projects = await getProjects();
    return projects.filter(project => project.status === statusCode);
  } catch (error) {
    console.error('Error fetching projects by status:', error);
    throw error;
  }
}

export async function getProjectById(id: number): Promise<Project | undefined> {
  try {
    // For now, we'll just use the getProjects and filter by ID
    // In a real application, you'd have a dedicated API endpoint
    const projects = await getProjects();
    return projects.find(project => project.id === id);
  } catch (error) {
    console.error('Error fetching project by ID:', error);
    throw error;
  }
}

export async function createProject(project: Omit<Project, 'id'>): Promise<Project> {
  try {
    if (!project.name?.trim()) {
      throw new Error('اسم المشروع مطلوب');
    }
    if (!project.description?.trim()) {
      throw new Error('وصف المشروع مطلوب');
    }
    if (!project.startDate) {
      throw new Error('تاريخ بدء المشروع مطلوب');
    }

    const response = await fetch(`${API_BASE_URL}/Projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `فشل في إنشاء المشروع. الرجاء المحاولة مرة أخرى. (HTTP ${response.status})`);
    }

    const result: ProjectResponse = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'فشل في إنشاء المشروع');
    }
    
    if (!result.data) {
      throw new Error('بيانات غير صالحة من الخادم');
    }

    return result.data;
  } catch (error) {
    console.error('Error creating project:', error);
    if (error instanceof Error) {
      throw new Error(`فشل في إنشاء المشروع: ${error.message}`);
    }
    throw new Error('حدث خطأ غير متوقع أثناء إنشاء المشروع');
  }
}

// Utility to convert status code to string
export const getStatusFromCode = (statusCode: number): 'active' | 'completed' | 'pending' | 'delayed' => {
  switch (statusCode) {
    case 1:
      return 'active';
    case 2:
      return 'completed';
    case 3:
      return 'pending';
    case 4:
      return 'delayed';
    default:
      return 'active';
  }
};
