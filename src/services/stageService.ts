
import { API_BASE_URL } from '@/config/api';

export interface ApiStage {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
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
