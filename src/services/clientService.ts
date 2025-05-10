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
  try {
    const response = await fetch(`${API_BASE_URL}/Clients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
  // TODO: Implement actual API call
  try {
    const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
      method: 'DELETE',
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
