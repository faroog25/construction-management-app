import { SiteEngineer, SiteEngineersResponse } from '@/types/siteEngineer';
import { API_BASE_URL } from '@/config/api';

// بيانات وهمية للاستخدام عند فشل الاتصال بالخادم
const mockSiteEngineers: SiteEngineer[] = [
  {
    id: 1,
    fullName: 'أحمد محمد علي',
    phoneNumber: '+20 123 456 7890',
    email: 'ahmed.ali@constructpro.com',
    isAvailable: true,
    specialization: 'Civil Engineering',
    yearsOfExperience: 8,
    projectsCompleted: 14,
    rating: 4.8
  },
  {
    id: 2,
    fullName: 'Fatima Hassan',
    phoneNumber: '+966 55 123 4567',
    email: 'fatima.hassan@constructpro.com',
    isAvailable: false,
    specialization: 'Architecture',
    yearsOfExperience: 6,
    projectsCompleted: 10,
    rating: 4.5
  },
  {
    id: 3,
    fullName: 'Khaled Ibrahim',
    phoneNumber: '+971 50 987 6543',
    email: 'khaled.ibrahim@constructpro.com',
    isAvailable: true,
    specialization: 'Electrical Engineering',
    yearsOfExperience: 10,
    projectsCompleted: 18,
    rating: 4.9
  },
  {
    id: 4,
    fullName: 'Laila Ahmed',
    phoneNumber: '+212 661 234 567',
    email: 'laila.ahmed@constructpro.com',
    isAvailable: false,
    specialization: 'Mechanical Engineering',
    yearsOfExperience: 7,
    projectsCompleted: 12,
    rating: 4.6
  },
  {
    id: 5,
    fullName: 'Omar Youssef',
    phoneNumber: '+20 100 567 8901',
    email: 'omar.youssef@constructpro.com',
    isAvailable: true,
    specialization: 'Civil Engineering',
    yearsOfExperience: 9,
    projectsCompleted: 16,
    rating: 4.7
  },
  {
    id: 6,
    fullName: 'Aisha Salem',
    phoneNumber: '+966 53 456 7890',
    email: 'aisha.salem@constructpro.com',
    isAvailable: true,
    specialization: 'Architecture',
    yearsOfExperience: 5,
    projectsCompleted: 9,
    rating: 4.4
  },
  {
    id: 7,
    fullName: 'Tariq Al-Mansoori',
    phoneNumber: '+971 56 123 4567',
    email: 'tariq.almansoori@constructpro.com',
    isAvailable: false,
    specialization: 'Electrical Engineering',
    yearsOfExperience: 11,
    projectsCompleted: 20,
    rating: 5.0
  },
  {
    id: 8,
    fullName: 'Nadia Al-Fassi',
    phoneNumber: '+212 678 901 234',
    email: 'nadia.alfassi@constructpro.com',
    isAvailable: true,
    specialization: 'Mechanical Engineering',
    yearsOfExperience: 6,
    projectsCompleted: 11,
    rating: 4.5
  },
  {
    id: 9,
    fullName: 'Hassan Al-Amri',
    phoneNumber: '+968 99123456',
    email: 'hassan.alamri@constructpro.com',
    isAvailable: true,
    specialization: 'Civil Engineering',
    yearsOfExperience: 7,
    projectsCompleted: 13,
    rating: 4.7
  },
  {
    id: 10,
    fullName: 'Salma Al-Khalili',
    phoneNumber: '+974 66123456',
    email: 'salma.alkhalili@constructpro.com',
    isAvailable: false,
    specialization: 'Architecture',
    yearsOfExperience: 8,
    projectsCompleted: 15,
    rating: 4.8
  }
];

export const getSiteEngineers = async (
  page: number = 1,
  pageSize: number = 10,
  searchQuery: string = '', 
  sortColumn: string = 'fullName',
  sortDirection: 'asc' | 'desc' = 'asc'
): Promise<{
  items: SiteEngineer[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreveiosPage: boolean;
}> => {
  try {
    console.log('Fetching site engineers with params:', { page, pageSize, searchQuery, sortColumn, sortDirection });
    
    const queryParams = new URLSearchParams({
      pageNumber: page.toString(),
      pageSize: pageSize.toString(),
    });
    
    if (searchQuery) {
      queryParams.append('search', searchQuery);
    }
    
    if (sortColumn) {
      queryParams.append('sortColumn', sortColumn);
      queryParams.append('sortDirection', sortDirection);
    }
    
    const url = `${API_BASE_URL}/SiteEngineers?${queryParams}`;
    console.log('API URL:', url);
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Accept-Language': 'ar-SA,ar;q=0.9,en;q=0.8'
      }
    });
    
    if (!response.ok) {
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });
      throw new Error(`فشل في جلب بيانات المهندسين: (HTTP ${response.status})`);
    }
    
    const result: SiteEngineersResponse = await response.json();
    console.log('API Response:', result);
    
    if (!result.success) {
      throw new Error(result.message || 'فشل في جلب بيانات المهندسين');
    }
    
    return result.data;
  } catch (error) {
    console.error('Error in getSiteEngineers:', error);
    
    // استخدام البيانات الوهمية في حالة فشل الاتصال (للتجريب فقط)
    console.warn('Using mock data instead');
    return {
      items: mockSiteEngineers.slice((page - 1) * pageSize, page * pageSize),
      totalItems: mockSiteEngineers.length,
      totalPages: Math.ceil(mockSiteEngineers.length / pageSize),
      currentPage: page,
      pageSize: pageSize,
      hasNextPage: page * pageSize < mockSiteEngineers.length,
      hasPreveiosPage: page > 1
    };
  }
};

// باقي الدوال الموجودة مسبقاً
export interface SiteEngineerProject {
  id: number;
  name: string;
}

export interface SiteEngineerResponse {
  success: boolean;
  message: string;
  errors: string[];
  data: SiteEngineer;
}

export async function getSiteEngineerById(id: string): Promise<SiteEngineer> {
  try {
    console.log('Fetching site engineer with ID:', id);
    const url = `${API_BASE_URL}/SiteEngineers/${id}`;
    console.log('API URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: errorText
      });
      throw new Error(`فشل في جلب بيانات مهندس الموقع. الرجاء المحاولة مرة أخرى. (HTTP ${response.status})`);
    }
    
    const result: SiteEngineerResponse = await response.json();
    console.log('API Response:', result);
    
    if (!result.success) {
      console.error('API returned error:', result.message);
      throw new Error(result.message || 'فشل في جلب بيانات مهندس الموقع');
    }
    
    if (!result.data) {
      console.error('No data in API response');
      throw new Error('لم يتم استلام بيانات من الخادم');
    }
    
    return result.data;
  } catch (error) {
    console.error('Error fetching site engineer by ID:', error);
    
    // إذا فشل الاتصال بـ API، سنستخدم بيانات وهمية للتجربة
    console.warn('Using mock data instead for engineer ID:', id);
    const mockEngineer = mockSiteEngineers.find(engineer => engineer.id === parseInt(id));
    
    if (mockEngineer) {
      return mockEngineer;
    }
    
    if (error instanceof Error) {
      throw new Error(`فشل في جلب بيانات مهندس الموقع: ${error.message}`);
    }
    throw new Error('حدث خطأ غير متوقع أثناء جلب بيانات مهندس الموقع');
  }
}

type CreateSiteEngineerResponse = {
  siteEngineer: SiteEngineer;
  message: string;
};

/**
 * Creates a new site engineer
 */
export const createSiteEngineer = async (
  siteEngineer: Omit<SiteEngineer, "id">
): Promise<CreateSiteEngineerResponse> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate ID for new site engineer (in a real application, the backend would do this)
      const newId = Math.max(...mockSiteEngineers.map((w) => w.id), 0) + 1;

      // Create the new site engineer
      const newSiteEngineer: SiteEngineer = {
        id: newId,
        ...siteEngineer
      };

      // Add to mock array (in a real application, this would be saved to a database)
      mockSiteEngineers.push(newSiteEngineer);

      resolve({
        siteEngineer: newSiteEngineer,
        message: 'Site engineer created successfully',
      });
    }, 500);
  });
};

export const updateSiteEngineer = async (
  id: number,
  updates: Partial<SiteEngineer>
): Promise<SiteEngineer> => {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockSiteEngineers.findIndex((e) => e.id === id);
      
      if (index === -1) {
        reject(new Error('Site engineer not found'));
        return;
      }
      
      const updatedSiteEngineer = { ...mockSiteEngineers[index], ...updates };
      mockSiteEngineers[index] = updatedSiteEngineer;
      
      resolve(updatedSiteEngineer);
    }, 500);
  });
};

export const deleteSiteEngineer = async (id: number): Promise<{ success: boolean; message: string }> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockSiteEngineers.findIndex((e) => e.id === id);
      
      if (index !== -1) {
        mockSiteEngineers.splice(index, 1);
        resolve({ success: true, message: 'Site engineer deleted successfully' });
      } else {
        resolve({ success: false, message: 'Site engineer not found' });
      }
    }, 500);
  });
};

export const getPaginatedSiteEngineers = async (
  page: number = 1,
  pageSize: number = 10
): Promise<{
  items: SiteEngineer[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreveiosPage: boolean;
}> => {
  // Simulate API call with pagination
  return new Promise((resolve) => {
    setTimeout(() => {
      const totalItems = mockSiteEngineers.length;
      const totalPages = Math.ceil(totalItems / pageSize);
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedItems = mockSiteEngineers.slice(startIndex, endIndex);

      resolve({
        items: paginatedItems,
        totalItems,
        totalPages,
        currentPage: page,
        pageSize,
        hasNextPage: page < totalPages,
        hasPreveiosPage: page > 1
      });
    }, 800);
  });
};
