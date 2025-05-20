export interface Document {
  id: string;
  name: string;
  description?: string;
  taskId?: number;
  taskName?: string;
  projectId: number;
  projectName: string;
  classificationId?: number;
  classificationName?: string;
  createdDate: string;
  type?: string; // Added for UI display
  size?: string; // Added for UI display
  status?: 'approved' | 'pending' | 'rejected' | 'draft'; // Fixed typing
  fileUrl?: string; // Added for document viewing
  fileType?: string; // Added for file type information
}

export interface DocumentsParams {
  projectId?: number;
  taskId?: number;
  pageNumber?: number;
  pageSize?: number;
  ClassificationId?: number;
}

export interface DocumentsResponse {
  success: boolean;
  message: string;
  errors?: string[];
  data: {
    items: Document[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPreveiosPage: boolean;
  };
}
