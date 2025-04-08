
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

export async function getClients(page: number = 1, pageSize: number = 10): Promise<ClientType[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/clients?page=${page}&pageSize=${pageSize}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: ClientResponse = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch clients');
    }
    
    return result.data.items.map(client => ({
      ...client,
      // Convert id to string to match the ClientType interface
      id: client.id.toString()
    }));
  } catch (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }
}

export async function getClientById(id: string): Promise<ClientType | undefined> {
  try {
    const clients = await getClients();
    return clients.find(client => client.id === id);
  } catch (error) {
    console.error('Error fetching client by ID:', error);
    throw error;
  }
}

export async function createClient(client: Omit<ClientType, 'id'>): Promise<ClientType> {
  // TODO: Implement actual API call
  return {
    id: Math.floor(Math.random() * 1000).toString(),
    ...client,
  };
}

export async function updateClient(id: string, client: Partial<Omit<ClientType, 'id'>>): Promise<ClientType> {
  // TODO: Implement actual API call
  return {
    id: id,
    fullName: client.fullName || '',
    email: client.email || '',
    phoneNumber: client.phoneNumber || '',
    clientType: client.clientType || ClientTypeEnum.Individual,
  };
}

export async function deleteClient(id: string): Promise<void> {
  // TODO: Implement actual API call
  console.log(`Client with ID ${id} deleted`);
}
