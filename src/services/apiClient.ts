
import { ProjectWithClient } from './projectService';

const API_BASE_URL = 'http://constructionmanagementassistant.runasp.net/api';

/**
 * Fetches data from the construction management API
 */
export async function fetchFromApi<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API fetch error:', error);
    throw error;
  }
}

/**
 * Maps API project data to our ProjectWithClient interface
 */
export function mapApiProjectToProjectWithClient(apiProject: any): ProjectWithClient {
  return {
    id: apiProject.id,
    name: apiProject.name,
    description: apiProject.description,
    start_date: apiProject.startDate,
    expected_end_date: apiProject.expectedEndDate,
    actual_end_date: apiProject.actualEndDate,
    status: mapStatusCodeFromApi(apiProject.status),
    client_name: apiProject.clientName || 'Unknown Client',
    stage_name: apiProject.stageName,
    progress: apiProject.progress || 0,
    site_engineer_id: apiProject.siteEngineerId,
    client_id: apiProject.clientId,
    order_id: apiProject.orderId,
    stage_id: apiProject.stageId,
  };
}

/**
 * Maps API status values to our internal status codes
 */
function mapStatusCodeFromApi(apiStatus: string | number): number {
  // Convert string status to our numeric codes
  if (typeof apiStatus === 'string') {
    switch (apiStatus.toLowerCase()) {
      case 'active': return 1;
      case 'completed': return 2;
      case 'pending': return 3;
      case 'delayed': return 4;
      default: return 1;
    }
  }
  
  // If API already uses numeric codes similar to ours
  if (typeof apiStatus === 'number') {
    return apiStatus;
  }
  
  // Default to active if unknown format
  return 1;
}
