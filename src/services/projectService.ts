
// This file contains functions to interact with the projects database
import { fetchFromApi, mapApiProjectToProjectWithClient } from './apiClient';

export interface Project {
  id: number;
  name: string;
  description: string | null;
  start_date: string;
  expected_end_date: string;
  actual_end_date: string | null;
  status: number;
  order_id: number | null;
  site_engineer_id: number | null;
  client_id: number | null;
  stage_id: number | null;
}

export interface ProjectWithClient {
  id: number;
  name: string;
  description: string | null;
  start_date: string;
  expected_end_date: string;
  actual_end_date: string | null;
  status: number;
  client_name?: string;
  stage_name?: string;
  progress: number; // Calculated based on tasks or stages
  site_engineer_id?: number | null;
  order_id?: number | null;
  client_id?: number | null;
  stage_id?: number | null;
}

// Function to get all projects
export const getProjects = async (): Promise<ProjectWithClient[]> => {
  try {
    // Fetch projects from the API
    const apiProjects = await fetchFromApi<any[]>('projects');
    
    // Map API response to our ProjectWithClient interface
    return apiProjects.map(mapApiProjectToProjectWithClient);
  } catch (error) {
    console.error('Error fetching projects:', error);
    // Return empty array in case of error
    return [];
  }
};

// Get projects filtered by status
export const getProjectsByStatus = async (statusCode: number): Promise<ProjectWithClient[]> => {
  try {
    // Fetch all projects and filter by status
    // Note: If the API has a dedicated endpoint for filtering, we could use that instead
    const allProjects = await getProjects();
    return allProjects.filter(project => project.status === statusCode);
  } catch (error) {
    console.error('Error fetching projects by status:', error);
    return [];
  }
};

// Get project details by ID
export const getProjectById = async (id: number): Promise<ProjectWithClient | undefined> => {
  try {
    // Fetch project by ID from the API
    const apiProject = await fetchFromApi<any>(`projects/${id}`);
    return mapApiProjectToProjectWithClient(apiProject);
  } catch (error) {
    console.error(`Error fetching project with ID ${id}:`, error);
    return undefined;
  }
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
