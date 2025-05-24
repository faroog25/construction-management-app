
import { API_BASE_URL } from '@/config/api';

export interface ClientName {
  id: number;
  fullName: string;
}

interface ClientNamesResponse {
  success: boolean;
  message: string;
  errors?: string[];
  data: ClientName[];
}

// Helper function to get authentication headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export async function getClientNames(): Promise<ClientName[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/Clients/Names`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: ClientNamesResponse = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch client names');
    }
    
    return result.data || [];
  } catch (error) {
    console.error('Error fetching client names:', error);
    throw error;
  }
}
