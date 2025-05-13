
import { API_BASE_URL } from '@/config/api';

export interface Worker {
  id: number;
  fullName: string;
}

export interface ApiTask {
  id: number;
  stageId: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  isCompleted: boolean;
}

export interface TaskDetailResponse {
  success: boolean;
  message: string;
  errors?: string[];
  data: {
    id: number;
    stageId: number;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    isCompleted: boolean;
    workers: Worker[];
  };
}

export interface TaskResponse {
  success: boolean;
  message: string;
  errors?: string[];
  data: {
    items: ApiTask[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPreveiosPage: boolean;
  };
}

export async function getStageTasks(stageId: number | string, page: number = 1, pageSize: number = 10): Promise<ApiTask[]> {
  try {
    console.log('Fetching tasks from:', `${API_BASE_URL}/Tasks?stageId=${stageId}&pageNumber=${page}&pageSize=${pageSize}`);
    const response = await fetch(`${API_BASE_URL}/Tasks?stageId=${stageId}&pageNumber=${page}&pageSize=${pageSize}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: TaskResponse = await response.json();
    console.log('API Response - Tasks:', result);
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch tasks data');
    }
    
    if (!result.data || !result.data.items) {
      console.error('Invalid API response structure:', result);
      throw new Error('Invalid API response structure');
    }
    
    return result.data.items;
  } catch (error) {
    console.error('Error fetching stage tasks:', error);
    throw error;
  }
}

export async function getTaskById(taskId: number | string): Promise<TaskDetailResponse> {
  try {
    console.log('Fetching task details from:', `${API_BASE_URL}/Tasks/${taskId}`);
    const response = await fetch(`${API_BASE_URL}/Tasks/${taskId}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response for task details:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: TaskDetailResponse = await response.json();
    console.log('API Response for task details:', result);
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch task details');
    }
    
    return result;
  } catch (error) {
    console.error('Error fetching task by ID:', error);
    throw error;
  }
}
