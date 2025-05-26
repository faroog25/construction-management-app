
import { API_BASE_URL } from '@/config/api';
import { ClientType } from '@/types/client';

export interface ClientName {
  id: number;
  fullName: string;
}

export interface Client {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  clientType: ClientType;
  projects?: {
    id: number;
    name: string;
  }[];
}

interface ClientNamesResponse {
  success: boolean;
  message: string;
  errors?: string[];
  data: ClientName[];
}

interface ClientsResponse {
  success: boolean;
  message: string;
  errors?: string[];
  data: {
    items: Client[];
    totalItems: number;
    totalPages: number;
    pageNumber: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPreveiosPage: boolean;
  };
}

interface CreateClientResponse {
  success: boolean;
  message: string;
  errors?: string[];
  data: Client;
}

interface ClientResponse {
  success: boolean;
  message: string;
  errors?: string[];
  data: Client;
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

export async function getClientById(clientId: string): Promise<Client> {
  try {
    const response = await fetch(`${API_BASE_URL}/Clients/${clientId}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: ClientResponse = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch client');
    }
    
    const clientData = {
      ...result.data,
      id: result.data.id.toString(),
      clientType: result.data.clientType as ClientType
    };
    
    if (!clientData.projects) {
      clientData.projects = [];
    }
    
    return clientData;
  } catch (error) {
    console.error('Error fetching client:', error);
    throw error;
  }
}

export async function createClient(clientData: Omit<Client, 'id'>): Promise<Client> {
  try {
    console.log('Creating client with data:', clientData);
    
    const response = await fetch(`${API_BASE_URL}/Clients`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(clientData),
    });
    
    console.log('Create client response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: CreateClientResponse = await response.json();
    console.log('Create client response data:', result);
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to create client');
    }
    
    if (result.data) {
      return {
        ...result.data,
        id: result.data.id.toString(),
        clientType: result.data.clientType as ClientType
      };
    } else {
      throw new Error('Invalid response format from server');
    }
  } catch (error) {
    console.error('Error creating client:', error);
    throw error;
  }
}

export async function getClients(
  pageNumber?: number, 
  pageSize?: number, 
  searchTerm?: string, 
  sortBy?: string, 
  sortDirection?: string
): Promise<{ 
  items: Client[]; 
  totalPages: number; 
  totalItems: number; 
  hasNextPage: boolean; 
  hasPreviousPage: boolean;
}> {
  try {
    // Build query parameters
    const params = new URLSearchParams();
    
    if (pageNumber) {
      params.append('pageNumber', pageNumber.toString());
    }
    
    if (pageSize) {
      params.append('pageSize', pageSize.toString());
    }
    
    if (searchTerm && searchTerm.trim()) {
      params.append('searchTerm', searchTerm.trim());
    }
    
    if (sortBy) {
      params.append('sortBy', sortBy);
    }
    
    if (sortDirection) {
      params.append('sortDirection', sortDirection);
    }

    const queryString = params.toString();
    const url = queryString ? `${API_BASE_URL}/Clients?${queryString}` : `${API_BASE_URL}/Clients`;
    
    console.log('Fetching clients from URL:', url);
    
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: ClientsResponse = await response.json();
    console.log('API Response:', result);
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch clients');
    }
    
    const clients = (result.data.items || []).map(client => ({
      ...client,
      id: client.id.toString(),
      clientType: client.clientType as ClientType
    }));
    
    return { 
      items: clients,
      totalPages: result.data.totalPages || 1,
      totalItems: result.data.totalItems || clients.length,
      hasNextPage: result.data.hasNextPage || false,
      hasPreviousPage: result.data.hasPreveiosPage || false, // Note: API has typo "hasPreveiosPage"
    };
  } catch (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }
}

export async function deleteClient(clientId: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/Clients/${clientId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting client:', error);
    throw error;
  }
}

export async function updateClient(clientId: string, clientData: Partial<Client>): Promise<Client> {
  try {
    const requestBody = {
      id: parseInt(clientId),
      fullName: clientData.fullName,
      email: clientData.email,
      phoneNumber: clientData.phoneNumber,
      clientType: clientData.clientType
    };

    console.log('Updating client with ID:', clientId);
    console.log('Request body:', requestBody);

    const response = await fetch(`${API_BASE_URL}/Clients`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(requestBody),
    });
    
    console.log('Update client response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('Update client response data:', result);
    
    if (result.data) {
      return {
        ...result.data,
        id: result.data.id.toString(),
        clientType: result.data.clientType as ClientType
      };
    } else {
      return {
        ...result,
        id: result.id ? result.id.toString() : clientId,
        clientType: result.clientType as ClientType
      };
    }
  } catch (error) {
    console.error('Error updating client:', error);
    throw error;
  }
}
