import { Project, Task, Stage } from '../types/project';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Project API
export const projectApi = {
  // Get all projects
  getAll: async (): Promise<Project[]> => {
    const response = await fetch(`${API_BASE_URL}/projects`);
    return response.json();
  },

  // Get project by ID
  getById: async (id: string): Promise<Project> => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`);
    return response.json();
  },

  // Create new project
  create: async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> => {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    });
    return response.json();
  },

  // Update project
  update: async (id: string, project: Partial<Project>): Promise<Project> => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    });
    return response.json();
  },

  // Delete project
  delete: async (id: string): Promise<void> => {
    await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
    });
  },
};

// Task API
export const taskApi = {
  // Get all tasks for a project
  getByProjectId: async (projectId: string): Promise<Task[]> => {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/tasks`);
    return response.json();
  },

  // Get task by ID
  getById: async (id: string): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`);
    return response.json();
  },

  // Create new task
  create: async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });
    return response.json();
  },

  // Update task
  update: async (id: string, task: Partial<Task>): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });
    return response.json();
  },

  // Delete task
  delete: async (id: string): Promise<void> => {
    await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
    });
  },
};

// Stage API
export const stageApi = {
  // Get all stages for a project
  getByProjectId: async (projectId: string): Promise<Stage[]> => {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/stages`);
    return response.json();
  },

  // Get stage by ID
  getById: async (id: string): Promise<Stage> => {
    const response = await fetch(`${API_BASE_URL}/stages/${id}`);
    return response.json();
  },

  // Create new stage
  create: async (stage: Omit<Stage, 'id' | 'createdAt' | 'updatedAt'>): Promise<Stage> => {
    const response = await fetch(`${API_BASE_URL}/stages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stage),
    });
    return response.json();
  },

  // Update stage
  update: async (id: string, stage: Partial<Stage>): Promise<Stage> => {
    const response = await fetch(`${API_BASE_URL}/stages/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stage),
    });
    return response.json();
  },

  // Delete stage
  delete: async (id: string): Promise<void> => {
    await fetch(`${API_BASE_URL}/stages/${id}`, {
      method: 'DELETE',
    });
  },
}; 