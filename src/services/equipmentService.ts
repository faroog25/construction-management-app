import { API_BASE_URL } from '@/config/api';
import { EquipmentItem } from '@/types/equipment';

export interface ApiEquipmentItem {
  id: number;
  name: string;
  model: string;
  status: string;
  purchaseDate: string;
}

export interface EquipmentResponse {
  success: boolean;
  message: string;
  errors?: string[];
  data: {
    items: ApiEquipmentItem[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPreveiosPage: boolean;
  };
}

export interface CreateEquipmentRequest {
  name: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  notes: string;
}

export interface CreateEquipmentResponse {
  success: boolean;
  message: string;
  errors?: string[];
  data?: ApiEquipmentItem;
}

export interface EquipmentDetailResponse {
  success: boolean;
  message: string;
  errors?: string[];
  data: {
    id: number;
    name: string;
    model: string;
    serialNumber: string;
    status: string;
    purchaseDate: string;
    notes: string;
  };
}

export interface DeleteEquipmentResponse {
  success: boolean;
  message: string;
  errors?: string[];
}

/**
 * Fetches equipment list with pagination
 * @param pageNumber The current page number
 * @param pageSize Number of items per page
 * @returns API response with equipment data
 */
export async function getEquipment(pageNumber: number = 1, pageSize: number = 10): Promise<EquipmentResponse> {
  try {
    console.log(`Fetching equipment: page ${pageNumber}, size ${pageSize}`);
    const response = await fetch(`${API_BASE_URL}/Equipment?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: EquipmentResponse = await response.json();
    console.log('API Response - Equipment:', result);
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch equipment');
    }
    
    return result;
  } catch (error) {
    console.error('Error fetching equipment:', error);
    throw error;
  }
}

/**
 * Maps API equipment data to our internal equipment type
 * @param apiEquipment The equipment data from the API
 * @returns Formatted equipment item for the UI
 */
export function mapApiEquipmentToEquipmentItem(apiEquipment: ApiEquipmentItem): EquipmentItem {
  // Determine the status based on the API status string
  const statusMap: Record<string, 'Available' | 'In Use' | 'Maintenance'> = {
    'Available': 'Available',
    'In Use': 'In Use',
    'Maintenance': 'Maintenance',
    // Add more mappings as needed
  };
  
  const status = statusMap[apiEquipment.status] || 'Maintenance';
  
  // Convert the equipment from API format to our internal format
  return {
    id: apiEquipment.id.toString(),
    name: apiEquipment.name,
    category: apiEquipment.model, // Using model as category
    description: `Model: ${apiEquipment.model}`,
    status: status,
    featured: false, // Default to false since the API doesn't provide this
    purchaseDate: apiEquipment.purchaseDate
  };
}

/**
 * Creates a new equipment item
 * @param equipment The equipment data to create
 * @returns API response with the created equipment
 */
export async function createEquipment(equipment: CreateEquipmentRequest): Promise<CreateEquipmentResponse> {
  try {
    console.log('Creating new equipment:', equipment);
    const response = await fetch(`${API_BASE_URL}/Equipment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(equipment),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: CreateEquipmentResponse = await response.json();
    console.log('API Response - Create Equipment:', result);
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to create equipment');
    }
    
    return result;
  } catch (error) {
    console.error('Error creating equipment:', error);
    throw error;
  }
}

/**
 * Fetches equipment details by ID
 * @param id The equipment ID to fetch
 * @returns API response with detailed equipment information
 */
export async function getEquipmentById(id: number): Promise<EquipmentDetailResponse> {
  try {
    console.log(`Fetching equipment details for ID: ${id}`);
    const response = await fetch(`${API_BASE_URL}/Equipment/${id}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: EquipmentDetailResponse = await response.json();
    console.log('API Response - Equipment Details:', result);
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch equipment details');
    }
    
    return result;
  } catch (error) {
    console.error('Error fetching equipment details:', error);
    throw error;
  }
}

/**
 * Deletes an equipment item by ID
 * @param id The equipment ID to delete
 * @returns API response confirming deletion
 */
export async function deleteEquipment(id: number): Promise<DeleteEquipmentResponse> {
  try {
    console.log(`Deleting equipment with ID: ${id}`);
    
    const response = await fetch(`${API_BASE_URL}/Equipment/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Handle both JSON response and empty response
    const contentType = response.headers.get('content-type');
    let result: DeleteEquipmentResponse;
    
    if (contentType && contentType.includes('application/json')) {
      result = await response.json();
    } else {
      // If the API returns no content on successful delete
      result = {
        success: true,
        message: 'Equipment deleted successfully'
      };
    }
    
    console.log('API Response - Delete Equipment:', result);
    return result;
  } catch (error) {
    console.error('Error deleting equipment:', error);
    throw error;
  }
}
