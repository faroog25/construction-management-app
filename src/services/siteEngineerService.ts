
import { API_BASE_URL } from '@/config/api';

export interface SiteEngineerName {
  id: number;
  name: string;
}

interface SiteEngineerNamesResponse {
  success: boolean;
  message: string;
  errors?: string[];
  data: SiteEngineerName[];
}

// Helper function to get authentication headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export async function getSiteEngineerNames(): Promise<SiteEngineerName[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/SiteEngineers/Names`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: SiteEngineerNamesResponse = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch site engineer names');
    }
    
    return result.data || [];
  } catch (error) {
    console.error('Error fetching site engineer names:', error);
    throw error;
  }
}
