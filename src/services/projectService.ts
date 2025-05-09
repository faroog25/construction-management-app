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

// In your projectService.ts file
export const createProject = async (projectData: Project) => {
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
