// This file contains functions to interact with the site engineers database

// API endpoint
const API_BASE_URL = 'http://constructionmanagementassistant.runasp.net/api/v1';

export interface SiteEngineer {
  id: number;
  firstName: string;
  secondName: string;
  thirdName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  nationalNumber: string;
  address: string;
  hireDate: string;
  status: number;
  projects: number;
}

export interface SiteEngineerResponse {
  success: boolean;
  message: string;
  data: {
    items: SiteEngineer[];
  };
}

export async function getSiteEngineers(page: number = 1, pageSize: number = 10): Promise<SiteEngineer[]> {
  try {
    console.log('Fetching site engineers from:', `${API_BASE_URL}/SiteEngineers?pageNumber=${page}&pageSize=${pageSize}`);
    const response = await fetch(`${API_BASE_URL}/SiteEngineers?pageNumber=${page}&pageSize=${pageSize}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('API Response:', result);
    
    if (!result.data || !result.data.items) {
      console.error('Invalid API response structure:', result);
      throw new Error('Invalid API response structure');
    }
    
    return result.data.items;
  } catch (error) {
    console.error('Error fetching site engineers:', error);
    throw error;
  }
}

export async function getSiteEngineerById(id: number): Promise<SiteEngineer | undefined> {
  try {
    const response = await fetch(`${API_BASE_URL}/SiteEngineers/${id}`);
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
}): Promise<SiteEngineer> {
  try {
    const response = await fetch(`${API_BASE_URL}/SiteEngineers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
    console.error('Error creating site engineer:', error);
    throw error;
  }
}

export async function updateSiteEngineer(id: number, engineer: Partial<SiteEngineer>): Promise<SiteEngineer> {
  try {
    const response = await fetch(`${API_BASE_URL}/SiteEngineers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
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

export async function deleteSiteEngineer(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/SiteEngineers/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting site engineer:', error);
    throw error;
  }
} 