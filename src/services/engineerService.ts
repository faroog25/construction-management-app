import { API_BASE_URL } from '@/config/api';

export interface SiteEngineer {
  id: number;
  fullName: string;
  phoneNumber: string;
  email?: string;
  address?: string;
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

// Mock data for development
const mockEngineers: SiteEngineer[] = [
  {
    id: 1,
    fullName: "Ahmed Hassan",
    phoneNumber: "+966 555 123 4567",
    email: "ahmed.hassan@example.com",
    address: "Riyadh, Saudi Arabia",
    isAvailable: true
  },
  {
    id: 2,
    fullName: "Mohammed Ali",
    phoneNumber: "+966 555 234 5678",
    email: "mohammed.ali@example.com",
    address: "Jeddah, Saudi Arabia",
    isAvailable: false
  },
  {
    id: 3,
    fullName: "Sara Khan",
    phoneNumber: "+966 555 345 6789",
    email: "sara.khan@example.com",
    address: "Dammam, Saudi Arabia",
    isAvailable: true
  },
  {
    id: 4,
    fullName: "Yusuf Ahmed",
    phoneNumber: "+966 555 456 7890",
    email: "yusuf.ahmed@example.com",
    address: "Medina, Saudi Arabia",
    isAvailable: true
  },
  {
    id: 5,
    fullName: "Fatima Mohammed",
    phoneNumber: "+966 555 567 8901",
    email: "fatima.mohammed@example.com",
    address: "Makkah, Saudi Arabia",
    isAvailable: false
  },
  {
    id: 6,
    fullName: "Khalid Omar",
    phoneNumber: "+966 555 678 9012",
    email: "khalid.omar@example.com",
    address: "Tabuk, Saudi Arabia",
    isAvailable: true
  },
  {
    id: 7,
    fullName: "Layla Ibrahim",
    phoneNumber: "+966 555 789 0123",
    email: "layla.ibrahim@example.com",
    address: "Abha, Saudi Arabia",
    isAvailable: true
  },
  {
    id: 8,
    fullName: "Abdullah Saleh",
    phoneNumber: "+966 555 890 1234",
    email: "abdullah.saleh@example.com",
    address: "Khobar, Saudi Arabia",
    isAvailable: false
  },
  {
    id: 9,
    fullName: "Noura Al-Sheikh",
    phoneNumber: "+966 555 901 2345",
    email: "noura.alsheikh@example.com",
    address: "Yanbu, Saudi Arabia",
    isAvailable: true
  },
  {
    id: 10,
    fullName: "Majed Al-Qahtani",
    phoneNumber: "+966 555 012 3456",
    email: "majed.alqahtani@example.com",
    address: "Taif, Saudi Arabia",
    isAvailable: true
  }
];

export const getAllEngineers = async (
  page: number = 2,
  pageSize: number = 8,
  searchQuery: string = '',
  sortColumn: string = 'name',
  sortDirection: 'asc' | 'desc' = 'asc'
): Promise<SiteEngineerResponse['data']> => {
  try {
    const queryParams = new URLSearchParams({
      pageNumber: page.toString(),   // أو currentPage حسب ما ينتظر الـ backend
      pageSize: pageSize.toString(),
      search: searchQuery,
      sortColumn,
      sortDirection
    });

    const response = await fetch(`${API_BASE_URL}/SiteEngineers?${queryParams}`, {
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

    if (!result.success) {
      throw new Error(result.message || 'Unknown error from backend');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching site engineers:', error);
    throw error;
  }
};


export const createEngineer = async (engineer: Omit<SiteEngineer, 'id'>): Promise<SiteEngineer> => {
  try {
    const response = await fetch(`${API_BASE_URL}/SiteEngineers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Accept-Language': 'ar-SA,ar;q=0.9,en;q=0.8'
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
};

export const updateEngineer = async (id: number, engineer: Partial<SiteEngineer>): Promise<SiteEngineer> => {
  try {
    const response = await fetch(`${API_BASE_URL}/SiteEngineers`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Accept-Language': 'ar-SA,ar;q=0.9,en;q=0.8'
      },
      body: JSON.stringify({ id, ...engineer }),
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
};

export const deleteEngineer = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/SiteEngineers/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Accept-Language': 'ar-SA,ar;q=0.9,en;q=0.8'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to delete site engineer: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting site engineer:', error);
    throw error;
  }
}; 