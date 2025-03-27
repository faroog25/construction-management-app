import { API_BASE_URL } from '@/config/api';
import { ClientType } from '@/types/client';

// Define the Client interface that will be used throughout the application
export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
  // Keep the original client properties for backward compatibility
  fullName?: string;
  phoneNumber?: string;
  clientType?: ClientType;
  createdAt?: Date;
  updatedAt?: Date;
}

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
    return clients.find(client => client.id.toString() === id);
  } catch (error) {
    console.error('Error fetching client by ID:', error);
    throw error;
  }
}

export async function createClient(client: Omit<Client, 'id'>): Promise<Client> {
  // TODO: Implement actual API call
  return {
    id: Math.floor(Math.random() * 1000),
    ...client,
  };
}

export async function updateClient(id: string, client: Partial<Omit<Client, 'id'>>): Promise<Client> {
  // TODO: Implement actual API call
  return {
    id: parseInt(id),
    name: client.name || '',
    email: client.email || '',
    phone: client.phone || '',
    address: client.address || '',
    notes: client.notes,
  };
}

export async function deleteClient(id: string): Promise<void> {
  // TODO: Implement actual API call
  console.log(`Client with ID ${id} deleted`);
}

export async function getClient(id: string): Promise<Client> {
  // TODO: Implement actual API call
  return {
    id: parseInt(id),
    name: 'Test Client',
    email: 'test@example.com',
    phone: '1234567890',
    address: '123 Test Street',
    notes: 'This is a test client',
  };
}
