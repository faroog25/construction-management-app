
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

export interface UpdateEquipmentRequest {
  id: number;
  name: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  notes: string;
}

export interface UpdateEquipmentResponse {
  success: boolean;
  message: string;
  errors?: string[];
  data?: ApiEquipmentItem;
}

export interface DeleteEquipmentResponse {
  success: boolean;
  message: string;
  errors?: string[];
}

export interface SetEquipmentStatusResponse {
  success: boolean;
  message: string;
  errors?: string[];
}

// Helper function to get authentication headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

/**
 * Fetches equipment list with pagination
 * @param pageNumber The current page number
 * @param pageSize Number of items per page
 * @param status Optional status filter (0=Available, 1=Reserved)
 * @returns API response with equipment data
 */
export async function getEquipment(pageNumber: number = 1, pageSize: number = 10, status?: number): Promise<EquipmentResponse> {
  try {
    let url = `${API_BASE_URL}/Equipment?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    
    // Add status parameter if provided
    if (status !== undefined) {
      url += `&status=${status}`;
    }
    
    console.log(`Fetching equipment: ${url}`);
    const response = await fetch(url, {
      headers: getAuthHeaders(),
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
  // Convert API status to our internal status format
  let status: 'Available' | 'Reserved' | 'Maintenance' | 'Out of Service' = 'Available';
  
  // Normalize the status string by removing spaces and converting to lowercase
  const normalizedStatus = typeof apiEquipment.status === 'string' 
    ? apiEquipment.status.toLowerCase().replace(/\s+/g, '') 
    : String(apiEquipment.status).toLowerCase();
  
  // Map status values correctly
  // Available=0, Reserved=1 as per new requirements
  if (normalizedStatus === 'available' || normalizedStatus === '0' || normalizedStatus === '0') {
    status = 'Available';
  } else if (normalizedStatus === 'reserved' || normalizedStatus === 'inuse' || normalizedStatus === 'in-use' || normalizedStatus === '1' || normalizedStatus === '1') {
    status = 'Reserved';
  } else if (normalizedStatus === 'undermaintenance' || normalizedStatus === 'under-maintenance' || normalizedStatus === 'maintenance' || normalizedStatus === '2') {
    status = 'Maintenance';
  } else if (normalizedStatus === 'outofservice' || normalizedStatus === 'out-of-service' || normalizedStatus === '3') {
    status = 'Out of Service';
  }
  
  console.log(`API Status: ${apiEquipment.status}, Mapped Status: ${status}`);
  
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
      headers: getAuthHeaders(),
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
    const response = await fetch(`${API_BASE_URL}/Equipment/${id}`, {
      headers: getAuthHeaders(),
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
 * Updates an existing equipment item
 * @param equipment The equipment data to update
 * @returns API response with the updated equipment
 */
export async function updateEquipment(equipment: UpdateEquipmentRequest): Promise<UpdateEquipmentResponse> {
  try {
    console.log('Updating equipment:', equipment);
    const response = await fetch(`${API_BASE_URL}/Equipment`, {
      method: 'PUT',
      headers: getAuthHeaders(),
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
    
    const result: UpdateEquipmentResponse = await response.json();
    console.log('API Response - Update Equipment:', result);
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to update equipment');
    }
    
    return result;
  } catch (error) {
    console.error('Error updating equipment:', error);
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
      headers: getAuthHeaders(),
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

/**
 * Sets the status of an equipment item
 * @param equipmentId The ID of the equipment to update
 * @param status The new status to set (0=Available, 1=In Use, 2=Under Maintenance, 3=Out of Service)
 * @returns API response confirming status change
 */
export async function setEquipmentStatus(equipmentId: number, status: number): Promise<SetEquipmentStatusResponse> {
  try {
    console.log(`Setting equipment ${equipmentId} status to ${status}`);
    
    const response = await fetch(`${API_BASE_URL}/Equipment/SetStatus?equipmentId=${equipmentId}&status=${status}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
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
    let result: SetEquipmentStatusResponse;
    
    if (contentType && contentType.includes('application/json')) {
      result = await response.json();
    } else {
      // If the API returns no content on successful status change
      result = {
        success: true,
        message: 'Equipment status updated successfully'
      };
    }
    
    console.log('API Response - Set Equipment Status:', result);
    return result;
  } catch (error) {
    console.error('Error setting equipment status:', error);
    throw error;
  }
}
