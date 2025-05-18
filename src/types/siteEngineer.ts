
export interface SiteEngineer {
  id: number;
  fullName: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  isAvailable?: boolean;
  specialization?: string;
  yearsOfExperience?: number;
  projectsCompleted?: number;
  rating?: number;
  nationalId?: string;
  projects?: Array<{ id: number; name: string }>;
  hireDate?: string;
  firstName?: string;
  secondName?: string;
  thirdName?: string;
  lastName?: string;
  nationalNumber?: string;
}

export interface SiteEngineersResponse {
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
