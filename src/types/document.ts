
export interface Document {
  id: string;
  name: string;
  description: string;
  taskId?: number;
  taskName?: string;
  projectId: number;
  projectName: string;
  classificationId: number;
  classificationName: string;
  createdDate: string;
  type?: string; // File type (pdf, doc, etc.)
  size?: string; // File size
  status?: 'approved' | 'pending' | 'rejected' | 'draft';
}

export interface DocumentsResponse {
  success: boolean;
  message: string;
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

export interface DocumentsParams {
  projectId?: number;
  pageNumber?: number;
  pageSize?: number;
  ClassificationId?: number;
}
