import { API_BASE_URL } from '@/config/api';

// This file contains functions to interact with the site engineers database

export interface SiteEngineer {
  id: number;
  fullName: string;
  phoneNumber: string;
  email: string | null;
  address: string;
  isAvailable: boolean;
}

export interface SiteEngineerResponse {
  success: boolean;
  message: string;
  errors?: string[];
  data: {
    items: SiteEngineer[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPreveiosPage: boolean;
  };
}

/**
 * Fetches site engineers from the API with proper handling for Arabic text
 */
export async function getSiteEngineers(page: number = 1, pageSize: number = 10): Promise<SiteEngineerResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/SiteEngineers?pageNumber=${page}&pageSize=${pageSize}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Accept-Language': 'ar-SA,ar;q=0.9,en;q=0.8'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch site engineers: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching site engineers:', error);
    throw error;
  }
}

/**
 * Fetches a site engineer by ID with proper handling for Arabic text
 */
export async function getSiteEngineerById(id: number): Promise<SiteEngineer | undefined> {
  try {
    const response = await fetch(`${API_BASE_URL}/SiteEngineers/${id}`, {
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'ar-SA,ar;q=0.9,en;q=0.8' // Support Arabic content
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching site engineer by ID:', error);
    throw error;
  }
}

/**
 * Creates a new site engineer with proper handling for Arabic text
 */
export async function createSiteEngineer(engineer: {
  firstName: string;
  secondName: string;
  thirdName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  nationalNumber: string;
  address: string;
  hireDate: string;
}): Promise<SiteEngineerResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/SiteEngineers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Accept-Language': 'ar-SA,ar;q=0.9,en;q=0.8' // Support Arabic content
      },
      body: JSON.stringify(engineer),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating site engineer:', error);
    throw error;
  }
}

/**
 * Updates a site engineer with proper handling for Arabic text
 */
export async function updateSiteEngineer(id: number, engineer: Partial<SiteEngineer>): Promise<SiteEngineer> {
  try {
    const response = await fetch(`${API_BASE_URL}/SiteEngineers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Accept-Language': 'ar-SA,ar;q=0.9,en;q=0.8' // Support Arabic content
      },
      body: JSON.stringify(engineer),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error updating site engineer:', error);
    throw error;
  }
}

/**
 * Deletes a site engineer
 */
export async function deleteSiteEngineer(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/SiteEngineers/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'ar-SA,ar;q=0.9,en;q=0.8' // Support Arabic content
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting site engineer:', error);
    throw error;
  }
} 