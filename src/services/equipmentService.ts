
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
