import { API_BASE_URL } from '@/config/api';
import { Client as ClientType, ClientType as ClientTypeEnum } from '@/types/client';

// Define a response interface for the API
export interface ClientResponse {
  success: boolean;
  message: string;
  data: {
    items: ClientType[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPreveiosPage: boolean;
  };
}

// Re-export ClientType from types
export { ClientType as ClientTypeEnum } from '@/types/client';

export async function getClients(
  page: number = 1,
  pageSize: number = 10,
  searchQuery: string = '',
  sortColumn: string = 'name',
  sortDirection: 'asc' | 'desc' = 'asc'
): Promise<ClientResponse['data']> {
  try {
    const token = localStorage.getItem('authToken');
    const queryParams = new URLSearchParams({
      pageNumber: page.toString(),
      pageSize: pageSize.toString(),
      search: searchQuery,
      sortColumn,
      sortDirection
    });

    const response = await fetch(`${API_BASE_URL}/Clients?${queryParams}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Accept-Language': 'ar-SA,ar;q=0.9,en;q=0.8',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: ClientResponse = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch clients');
    }
    
    return result.data;
  } catch (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }
}

export async function getClientById(id: string): Promise<ClientType | undefined> {
  try {
    const token = localStorage.getItem('authToken');
    console.log('Fetching client with ID:', id);
    const url = `${API_BASE_URL}/Clients/${id}`;
    console.log('API URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: errorText
      });
      throw new Error(`فشل في جلب بيانات العميل. الرجاء المحاولة مرة أخرى. (HTTP ${response.status})`);
    }
    
    const result = await response.json();
    console.log('API Response:', result);
    
    if (!result.success) {
      console.error('API returned error:', result.message);
      throw new Error(result.message || 'فشل في جلب بيانات العميل');
    }
    
    if (!result.data) {
      console.error('No data in API response');
      throw new Error('لم يتم استلام بيانات من الخادم');
    }
    
    // Transform the response to match our ClientType interface
    const transformedClient = {
      id: result.data.id.toString(),
      fullName: result.data.fullName,
      email: result.data.email,
      phoneNumber: result.data.phoneNumber,
      clientType: result.data.clientType,
      projects: result.data.projects
    };
    
    console.log('Transformed client data:', transformedClient);
    return transformedClient;
  } catch (error) {
    console.error('Error fetching client by ID:', error);
    if (error instanceof Error) {
      throw new Error(`فشل في جلب بيانات العميل: ${error.message}`);
    }
    throw new Error('حدث خطأ غير متوقع أثناء جلب بيانات العميل');
  }
}

export async function createClient(client: Omit<ClientType, 'id'>): Promise<ClientType> {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/Clients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(client),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to create client');
    }

    return {
      ...result.data,
        id: result.id,
    };
  } catch (error) {
    console.error('Error creating client:', error);
    throw error;
  }
}

export async function updateClient(id: string, client: Partial<Omit<ClientType, 'id'>>): Promise<ClientType> {
  try {
    const token = localStorage.getItem('authToken');
    // Log the incoming data
    console.log('Updating client with data:', { id, client });

    // Prepare the update data
    const updateData = {
      id: id,
      fullName: client.fullName,
      email: client.email,
      phoneNumber: client.phoneNumber,
      clientType: client.clientType
    };

    // Log the prepared data
    console.log('Sending update request with data:', updateData);

    const response = await fetch(`${API_BASE_URL}/clients`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Update failed:', errorData);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Update response:', result);

    if (!result.success) {
      throw new Error(result.message || 'Failed to update client');
    }

    // Ensure the response data has the correct types
    const updatedClient = {
      ...result.data,
      id: id,
      clientType: result.clientType
    };

    console.log('Returning updated client:', updatedClient);
    return updatedClient;
  } catch (error) {
    console.error('Error updating client:', error);
    throw error;
  }
}

export async function deleteClient(id: string): Promise<void> {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log(`Client with ID ${id} deleted`);
  } catch (error) {
    console.error('Error deleting client:', error);
    throw error;
  }
}
