// This file contains functions to interact with the clients database

// API endpoint
const API_BASE_URL = 'http://constructionmanagementassistant.runasp.net/api/v1';

export enum ClientType {
  Individual = "فرد",
  Corporate = "شركة"
}

export interface Client {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  clientType: ClientType;
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

export async function getClients(page: number = 1, pageSize: number = 10): Promise<Client[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/Clients?pageNumber=${page}&pageSize=${pageSize}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result: ClientResponse = await response.json();
    return result.data.items;
  } catch (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }
}

export async function getClientById(id: number): Promise<Client | undefined> {
  try {
    const clients = await getClients();
    return clients.find(client => client.id === id);
  } catch (error) {
    console.error('Error fetching client by ID:', error);
    throw error;
  }
}

export async function createClient(client: Omit<Client, 'id'>): Promise<Client> {
  try {
    const payload = {
      fullName: client.fullName,
      email: client.email,
      phoneNumber: client.phoneNumber,
      clientType: client.clientType
    };
    
    console.log('Sending payload:', payload);

    const response = await fetch(`${API_BASE_URL}/Clients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Error response:', errorData);
      throw new Error(errorData?.message || `Failed to create client: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating client:', error);
    throw error;
  }
}

export async function updateClient(id: number, client: Partial<Client>): Promise<Client> {
  try {
    const response = await fetch(`${API_BASE_URL}/Clients/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(client),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating client:', error);
    throw error;
  }
}

export async function deleteClient(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/Clients/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting client:', error);
    throw error;
  }
}
