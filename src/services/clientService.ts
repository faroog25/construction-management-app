import { API_BASE_URL } from '@/config/api';
import { Client, ClientType } from '@/types/client';

// This file contains functions to interact with the clients database

export interface ClientResponse {
  success: boolean;
  message: string;
  data: {
    items: Client[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPreveiosPage: boolean;
  };
}

// Re-export ClientType from types
export { ClientType } from '@/types/client';

export async function getClients(page: number = 1, pageSize: number = 10): Promise<Client[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/clients?page=${page}&pageSize=${pageSize}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: ClientResponse = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch clients');
    }
    
    return result.data.items;
  } catch (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }
}

export async function getClientById(id: string): Promise<Client | undefined> {
  try {
    const clients = await getClients();
    return clients.find(client => client.id === id);
  } catch (error) {
    console.error('Error fetching client by ID:', error);
    throw error;
  }
}

export async function createClient(client: Omit<Client, 'id'>): Promise<Client> {
  // TODO: Implement actual API call
  return {
    id: Math.random().toString(36).substr(2, 9),
    ...client,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export async function updateClient(id: string, client: Partial<Omit<Client, 'id'>>): Promise<Client> {
  // TODO: Implement actual API call
  return {
    id,
    fullName: client.fullName || '',
    email: client.email || '',
    phoneNumber: client.phoneNumber || '',
    clientType: client.clientType || ClientType.Individual,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export async function deleteClient(id: string): Promise<void> {
  // TODO: Implement actual API call
}

export async function getClient(id: string): Promise<Client> {
  // TODO: Implement actual API call
  return {
    id,
    fullName: 'Test Client',
    email: 'test@example.com',
    phoneNumber: '1234567890',
    clientType: ClientType.Individual,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
