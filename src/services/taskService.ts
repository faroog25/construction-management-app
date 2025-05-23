import { API_BASE_URL } from '@/config/api';

export interface Worker {
  id: number;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  specialty?: string;
}

export interface ApiTask {
  id: number;
  stageId: number;
  name: string;
  description: string;
  startDate: string;
  expectedEndDate: string;
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
    endDate?: string;
    expectedEndDate?: string;
    isCompleted: boolean;
    workers?: Worker[];
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
  expectedEndDate: string;
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

export interface DeleteTaskResponse {
  success: boolean;
  message: string;
  errors?: string[];
}

export interface UnassignWorkersRequest {
  taskId: number;
  workerIds: number[];
}

export interface UnassignWorkersResponse {
  success: boolean;
  message: string;
  errors?: string[];
}

/**
 * Interface for worker assignment data returned from the API
 */
export interface WorkerAssignment {
  taskId: number;
  workerId: number;
  assignedDate: string;
  taskName: string;
  workerName: string;
}

export interface TaskAssignmentsResponse {
  success: boolean;
  message: string;
  errors?: string[];
  data: WorkerAssignment[];
}

export interface UpcomingTask {
  id: number;
  name: string;
  description: string;
  startDate: string;
  expectedEndDate: string;
  stageName: string;
  projectName: string;
  isCompleted: boolean;
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

    // Fetch task workers in a separate request if they're not included
    if (!result.data.workers) {
      try {
        const workersResponse = await fetch(`${API_BASE_URL}/TaskAssignments/GetWorkersForTask/${taskId}`);
        
        if (workersResponse.ok) {
          const workersResult = await workersResponse.json();
          if (workersResult.success && workersResult.data) {
            result.data.workers = workersResult.data;
          } else {
            result.data.workers = [];
          }
        }
      } catch (error) {
        console.error('Error fetching task workers:', error);
        result.data.workers = [];
      }
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
    const response = await fetch(`${API_BASE_URL}/TaskAssignments/AssignWorkersToTask`, {
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
 * Unassigns workers from a specific task
 * @param unassignData The task ID and worker IDs to unassign
 * @returns API response with success status and message
 */
export async function unassignWorkersFromTask(unassignData: UnassignWorkersRequest): Promise<UnassignWorkersResponse> {
  try {
    console.log('Unassigning workers from task:', unassignData);
    const response = await fetch(`${API_BASE_URL}/TaskAssignments/unassign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(unassignData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response for worker unassignment:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: UnassignWorkersResponse = await response.json();
    console.log('API Response - Unassign Workers:', result);
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to unassign workers from task');
    }
    
    return result;
  } catch (error) {
    console.error('Error unassigning workers from task:', error);
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

/**
 * Deletes a task
 * @param taskId The task ID to delete
 * @returns API response with success status and message
 */
export async function deleteTask(taskId: number): Promise<DeleteTaskResponse> {
  try {
    console.log('Deleting task:', taskId);
    const response = await fetch(`${API_BASE_URL}/Tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response for task deletion:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: DeleteTaskResponse = await response.json();
    console.log('API Response - Delete Task:', result);
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to delete task');
    }
    
    return result;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
}

/**
 * Fetches workers assigned to a specific task
 * @param taskId The task ID to get assigned workers for
 * @returns API response with worker data
 */
export async function getWorkersForTask(taskId: number): Promise<Worker[]> {
  try {
    console.log('Fetching workers for task:', taskId);
    const response = await fetch(`${API_BASE_URL}/TaskAssignments/ByTask/${taskId}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        console.log('No workers assigned to this task yet');
        return [];
      }
      const errorText = await response.text();
      console.error('API Error Response for task workers:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: TaskAssignmentsResponse = await response.json();
    console.log('API Response - Task Workers:', result);
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch workers for task');
    }
    
    // Convert WorkerAssignment objects to Worker objects
    const workers: Worker[] = result.data.map(assignment => ({
      id: assignment.workerId,
      fullName: assignment.workerName
    }));
    
    return workers;
  } catch (error) {
    console.error('Error fetching workers for task:', error);
    return [];
  }
}

/**
 * Fetches tasks assigned to a specific worker
 * @param workerId The worker ID to get assigned tasks for
 * @returns API response with task assignments data
 */
export async function getTasksForWorker(workerId: number): Promise<WorkerAssignment[]> {
  try {
    console.log('Fetching tasks for worker:', workerId);
    const response = await fetch(`${API_BASE_URL}/TaskAssignments/ByWorker/${workerId}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        console.log('No tasks assigned to this worker yet');
        return [];
      }
      const errorText = await response.text();
      console.error('API Error Response for worker tasks:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: TaskAssignmentsResponse = await response.json();
    console.log('API Response - Worker Tasks:', result);
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch tasks for worker');
    }
    
    return result.data;
  } catch (error) {
    console.error('Error fetching tasks for worker:', error);
    return [];
  }
}

/**
 * Fetches upcoming tasks within the specified number of days
 * @param daysAhead Number of days to look ahead for upcoming tasks
 * @returns Array of upcoming tasks
 */
export async function getUpcomingTasks(daysAhead: number = 60): Promise<UpcomingTask[]> {
  try {
    console.log('Fetching upcoming tasks from:', `${API_BASE_URL}/Tasks/upcoming?daysAhead=${daysAhead}`);
    const response = await fetch(`${API_BASE_URL}/Tasks/upcoming?daysAhead=${daysAhead}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response for upcoming tasks:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: UpcomingTask[] = await response.json();
    console.log('API Response - Upcoming Tasks:', result);
    
    return result;
  } catch (error) {
    console.error('Error fetching upcoming tasks:', error);
    throw error;
  }
}
