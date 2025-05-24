
import { API_BASE_URL } from '@/config/api';

export interface SiteEngineer {
  id: number;
  name: string;
  userName: string;
  email: string;
  phoneNumber: string;
  // Backward compatibility
  fullName?: string;
}

export interface SiteEngineerResponse {
  success: boolean;
  message: string;
  errors?: string[];
  data: {
    items: SiteEngineer[];
    totalItems: number;
    totalPages: number;
    pageNumber: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPreveiosPage: boolean;
  };
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const getAllEngineers = async (
  page: number = 1,
  pageSize: number = 10,
  searchQuery: string = '',
  sortColumn: string = 'name',
  sortDirection: 'asc' | 'desc' = 'asc'
): Promise<SiteEngineerResponse['data']> => {
  try {
    const queryParams = new URLSearchParams({
      pageNumber: page.toString(),
      pageSize: pageSize.toString(),
    });

    if (searchQuery) {
      queryParams.append('search', searchQuery);
    }

    if (sortColumn) {
      queryParams.append('sortColumn', sortColumn);
      queryParams.append('sortDirection', sortDirection);
    }

    console.log('Fetching engineers with URL:', `${API_BASE_URL}/SiteEngineers?${queryParams}`);

    const response = await fetch(`${API_BASE_URL}/SiteEngineers?${queryParams}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      // Handle 404 specifically - return empty data instead of throwing error
      if (response.status === 404) {
        return {
          items: [],
          totalItems: 0,
          totalPages: 0,
          pageNumber: page,
          pageSize: pageSize,
          hasNextPage: false,
          hasPreveiosPage: false
        };
      }
      throw new Error(`Failed to fetch site engineers: ${response.status}`);
    }

    const result: SiteEngineerResponse = await response.json();
    console.log('API Response:', result);

    if (!result.success) {
      // If API says no success but we have empty data, return empty instead of error
      if (result.data && result.data.items && result.data.items.length === 0) {
        return result.data;
      }
      throw new Error(result.message || 'Unknown error from backend');
    }

    // Map the response to include fullName for backward compatibility
    const mappedItems = result.data.items.map(engineer => ({
      ...engineer,
      fullName: engineer.name || `${engineer.userName}` // Use name as fullName
    }));

    return {
      ...result.data,
      items: mappedItems
    };
  } catch (error) {
    console.error('Error fetching site engineers:', error);
    
    // If it's a network error, return empty data structure to show the "no engineers" UI
    if (error instanceof TypeError || (error instanceof Error && error.message.includes('fetch'))) {
      return {
        items: [],
        totalItems: 0,
        totalPages: 0,
        pageNumber: page,
        pageSize: pageSize,
        hasNextPage: false,
        hasPreveiosPage: false
      };
    }
    
    throw error;
  }
};

export const createEngineer = async (engineer: Omit<SiteEngineer, 'id'>): Promise<SiteEngineer> => {
  try {
    const response = await fetch(`${API_BASE_URL}/SiteEngineers`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(engineer),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error creating site engineer:', error);
    throw error;
  }
};

export const updateEngineer = async (id: number, engineer: Partial<SiteEngineer> | any): Promise<SiteEngineer> => {
  try {
    console.log('Updating engineer with data:', engineer);
    
    const response = await fetch(`${API_BASE_URL}/SiteEngineers`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(engineer),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API error response:', errorData);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Update response:', result);
    return result.data;
  } catch (error) {
    console.error('Error updating site engineer:', error);
    throw error;
  }
};

export const deleteEngineer = async (id: number): Promise<void> => {
  try {
    console.log(`Deleting engineer with ID: ${id}`);
    
    const response = await fetch(`${API_BASE_URL}/SiteEngineers/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API error response for delete:', errorData);
      throw new Error(errorData.message || `فشل في حذف مهندس الموقع: ${response.status}`);
    }
    
    console.log('Engineer deleted successfully');
    return;
  } catch (error) {
    console.error('Error deleting site engineer:', error);
    throw error;
  }
};
