
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
