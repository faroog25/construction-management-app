
import { API_BASE_URL } from '@/config/api';

export interface ClientName {
  id: number;
  fullName: string;
}

export interface Client {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  clientType: string;
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
    
    // Convert id to string for consistency
    const clientData = {
      ...result.data,
      id: result.data.id.toString()
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
    const response = await fetch(`${API_BASE_URL}/Clients`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(clientData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: CreateClientResponse = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to create client');
    }
    
    // Convert id to string for consistency
    return {
      ...result.data,
      id: result.data.id.toString()
    };
  } catch (error) {
    console.error('Error creating client:', error);
    throw error;
  }
}

export async function getClients(page?: number, pageSize?: number, searchTerm?: string, clientType?: string, sortBy?: string): Promise<{ items: Client[]; totalPages: number; totalItems: number; data: Client[] }> {
  try {
    const response = await fetch(`${API_BASE_URL}/Clients`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: ClientsResponse = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch clients');
    }
    
    // Convert ids to strings for consistency
    const clients = (result.data.items || []).map(client => ({
      ...client,
      id: client.id.toString()
    }));
    
    return { 
      data: clients,
      items: clients,
      totalPages: 1,
      totalItems: clients.length
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
    const response = await fetch(`${API_BASE_URL}/Clients/${clientId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(clientData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    // Convert id to string for consistency
    return {
      ...result.data,
      id: result.data.id.toString()
    };
  } catch (error) {
    console.error('Error updating client:', error);
    throw error;
  }
}
