
import { API_BASE_URL } from '@/config/api';

export interface ApiStage {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  expectedEndDate?: string;
  progress: number;
}

export interface StageResponse {
  success: boolean;
  message: string;
  errors?: string[];
  data: {
    items: ApiStage[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPreveiosPage: boolean;
  };
}

export interface CreateStageRequest {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  projectId: number;
}

export interface UpdateStageRequest {
  id: number;
  name: string;
  description: string;
}

export interface CreateStageResponse {
  success: boolean;
  message: string;
  errors?: string[];
  data: string;
}

export interface UpdateStageResponse {
  success: boolean;
  message: string;
  errors?: string[];
  data: string;
}

export interface DeleteStageResponse {
  success: boolean;
  message: string;
  errors?: string[];
}

export async function getProjectStages(projectId: number | string, page: number = 1, pageSize: number = 10): Promise<ApiStage[]> {
  try {
    console.log('Fetching stages from:', `${API_BASE_URL}/Stages?projectId=${projectId}&pageNumber=${page}&pageSize=${pageSize}`);
    const response = await fetch(`${API_BASE_URL}/Stages?projectId=${projectId}&pageNumber=${page}&pageSize=${pageSize}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: StageResponse = await response.json();
    console.log('API Response - Stages:', result);
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch stages data');
    }
    
    if (!result.data || !result.data.items) {
      console.error('Invalid API response structure:', result);
      throw new Error('Invalid API response structure');
    }
    
    return result.data.items;
  } catch (error) {
    console.error('Error fetching project stages:', error);
    throw error;
  }
}

export async function createStage(stageData: CreateStageRequest): Promise<CreateStageResponse> {
  try {
    console.log('Creating stage with data:', stageData);
    const response = await fetch(`${API_BASE_URL}/Stages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stageData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response when creating stage:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: CreateStageResponse = await response.json();
    console.log('API Response - Create Stage:', result);
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to create stage');
    }
    
    return result;
  } catch (error) {
    console.error('Error creating stage:', error);
    throw error;
  }
}

export async function updateStage(stageData: UpdateStageRequest): Promise<UpdateStageResponse> {
  try {
    console.log('Updating stage with data:', stageData);
    const response = await fetch(`${API_BASE_URL}/Stages`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stageData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response when updating stage:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: UpdateStageResponse = await response.json();
    console.log('API Response - Update Stage:', result);
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to update stage');
    }
    
    return result;
  } catch (error) {
    console.error('Error updating stage:', error);
    throw error;
  }
}

export async function deleteStage(stageId: number): Promise<DeleteStageResponse> {
  try {
    console.log('Deleting stage with ID:', stageId);
    const response = await fetch(`${API_BASE_URL}/Stages/${stageId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response when deleting stage:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: DeleteStageResponse = await response.json();
    console.log('API Response - Delete Stage:', result);
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to delete stage');
    }
    
    return result;
  } catch (error) {
    console.error('Error deleting stage:', error);
    throw error;
  }
}
