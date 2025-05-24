
import { API_BASE_URL } from '@/config/api';

export interface Document {
  id: number;
  name: string;
  description?: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadDate: string;
  projectId?: number;
  taskId?: number;
  category: string;
}

export interface DocumentResponse {
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

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Authorization': `Bearer ${token}`,
  };
};

export const getDocuments = async (
  page: number = 1,
  pageSize: number = 10,
  projectId?: number,
  taskId?: number,
  category?: string
): Promise<DocumentResponse['data']> => {
  try {
    const queryParams = new URLSearchParams({
      pageNumber: page.toString(),
      pageSize: pageSize.toString(),
    });

    if (projectId) queryParams.append('projectId', projectId.toString());
    if (taskId) queryParams.append('taskId', taskId.toString());
    if (category) queryParams.append('category', category);

    const response = await fetch(`${API_BASE_URL}/Documents?${queryParams}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch documents');
    }

    const result: DocumentResponse = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch documents');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }
};

export const uploadDocument = async (
  file: File,
  name: string,
  description?: string,
  projectId?: number,
  taskId?: number,
  category: string = 'general'
): Promise<Document> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('category', category);
    
    if (description) formData.append('description', description);
    if (projectId) formData.append('projectId', projectId.toString());
    if (taskId) formData.append('taskId', taskId.toString());

    const response = await fetch(`${API_BASE_URL}/Documents/upload`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload document');
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to upload document');
    }

    return result.data;
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
};

export const deleteDocument = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/Documents/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete document');
    }
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};

export const updateDocument = async (
  id: number,
  updates: Partial<Pick<Document, 'name' | 'description' | 'category'>>
): Promise<Document> => {
  try {
    const response = await fetch(`${API_BASE_URL}/Documents/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error('Failed to update document');
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to update document');
    }

    return result.data;
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
};
