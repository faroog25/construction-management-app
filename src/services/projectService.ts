
// API endpoint
const API_BASE_URL = 'http://constructionmanagementassistant.runasp.net/api/v1';

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

export interface ProjectResponse {
  success: boolean;
  message: string;
  data: {
    items: Project[];
  };
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
    const projects = await getProjects();
    return projects.find(project => project.id === id);
  } catch (error) {
    console.error('Error fetching project by ID:', error);
    throw error;
  }
}

export async function createProject(project: {
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
}): Promise<Project> {
  try {
    const response = await fetch(`${API_BASE_URL}/Projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data.items[0];
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
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
