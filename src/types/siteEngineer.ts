export interface SiteEngineer {
  id: number;
  name: string;
  userName: string;
  email: string;
  phoneNumber: string;
  // Keep backward compatibility fields for existing components
  fullName?: string;
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
    pageNumber: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPreveiosPage: boolean;
  };
}
