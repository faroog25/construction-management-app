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

export interface CreateTaskRequest {
  stageId: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}

export interface EditTaskRequest {
  id: number;
  name: string;
  description: string;
}

export interface EditTaskResponse {
  success: boolean;
  message: string;
  errors?: string[];
  data?: any;
}

export interface CreateTaskResponse {
  success: boolean;
  message: string;
  errors?: string[];
  data?: any;
}

export interface AssignWorkersRequest {
  taskId: number;
  workerIds: number[];
}

export interface AssignWorkersResponse {
  success: boolean;
  message: string;
  errors?: string[];
}

export interface CompleteTaskResponse {
  success: boolean;
  message: string;
  errors?: string[];
}

export interface UncheckTaskResponse {
  success: boolean;
  message: string;
  errors?: string[];
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

export async function createTask(taskData: CreateTaskRequest): Promise<CreateTaskResponse> {
  try {
    console.log('Creating task with data:', taskData);
    const response = await fetch(`${API_BASE_URL}/Tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });
    
    const result = await response.json();
    console.log('API Response - Create Task:', result);
    
    return result;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
}

/**
 * Edits an existing task with updated name and description
 * @param taskData The task data to update including id, name, and description
 * @returns API response with success status and message
 */
export async function editTask(taskData: EditTaskRequest): Promise<EditTaskResponse> {
  try {
    console.log('Editing task with data:', taskData);
    const response = await fetch(`${API_BASE_URL}/Tasks`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response for task editing:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('API Response - Edit Task:', result);
    
    return result;
  } catch (error) {
    console.error('Error editing task:', error);
    throw error;
  }
}

/**
 * Assigns workers to a specific task
 * @param assignData The task ID and worker IDs to assign
 * @returns API response with success status and message
 */
export async function assignWorkersToTask(assignData: AssignWorkersRequest): Promise<AssignWorkersResponse> {
  try {
    console.log('Assigning workers to task:', assignData);
    const response = await fetch(`${API_BASE_URL}/Tasks/AssignWorkersToTask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(assignData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response for worker assignment:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: AssignWorkersResponse = await response.json();
    console.log('API Response - Assign Workers:', result);
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to assign workers to task');
    }
    
    return result;
  } catch (error) {
    console.error('Error assigning workers to task:', error);
    throw error;
  }
}

/**
 * Marks a task as completed
 * @param taskId The task ID to complete
 * @returns API response with success status and message
 */
export async function completeTask(taskId: number): Promise<CompleteTaskResponse> {
  try {
    console.log('Completing task:', taskId);
    const response = await fetch(`${API_BASE_URL}/Tasks/CompleteTask/${taskId}`, {
      method: 'Put',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response for task completion:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: CompleteTaskResponse = await response.json();
    console.log('API Response - Complete Task:', result);
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to complete task');
    }
    
    return result;
  } catch (error) {
    console.error('Error completing task:', error);
    throw error;
  }
}

/**
 * Marks a completed task as uncompleted
 * @param taskId The task ID to uncheck
 * @returns API response with success status and message
 */
export async function uncheckTask(taskId: number): Promise<UncheckTaskResponse> {
  try {
    console.log('Unchecking task:', taskId);
    const response = await fetch(`${API_BASE_URL}/Tasks/UnCheckTask/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response for task unchecking:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: UncheckTaskResponse = await response.json();
    console.log('API Response - Uncheck Task:', result);
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to uncheck task');
    }
    
    return result;
  } catch (error) {
    console.error('Error unchecking task:', error);
    throw error;
  }
}
