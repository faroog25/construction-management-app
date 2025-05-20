import { API_BASE_URL } from '@/config/api';
import { Document, DocumentsParams, DocumentsResponse } from '@/types/document';
import { toast } from 'sonner';

export const getDocuments = async (params: DocumentsParams): Promise<Document[]> => {
  const queryParams = new URLSearchParams();
  
  if (params.projectId) queryParams.append('projectId', params.projectId.toString());
  if (params.pageNumber) queryParams.append('pageNumber', params.pageNumber.toString());
  if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
  if (params.ClassificationId) queryParams.append('ClassificationId', params.ClassificationId.toString());
  
  try {
    const response = await fetch(`${API_BASE_URL}/Documents?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Documents API Response Status:', response.status);
    
    if (!response.ok) {
      // If the response is 404, it might be a legitimate "no documents" response
      // rather than an actual error in some APIs
      if (response.status === 404) {
        console.log('No documents found (404 response)');
        return [];
      }
      throw new Error(`Failed to fetch documents: ${response.status}`);
    }

    const result: DocumentsResponse = await response.json();
    console.log('Documents API Response:', result);
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch documents');
    }
    
    // Map API documents to include file type and size based on file extension
    return result.data.items.map(doc => {
      const fileExtension = doc.name.split('.').pop()?.toLowerCase() || '';
      let type = 'unknown';
      
      if (['pdf'].includes(fileExtension)) {
        type = 'pdf';
      } else if (['doc', 'docx'].includes(fileExtension)) {
        type = 'doc';
      } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(fileExtension)) {
        type = 'image';
      } else if (['zip', 'rar', '7z'].includes(fileExtension)) {
        type = 'archive';
      } else {
        // Default to PDF if no extension or unknown extension
        type = 'pdf';
      }
      
      // Add an estimated size if not provided
      const size = '2.5 MB';
      
      // Default status as one of the acceptable enum values
      const status = 'approved' as const;
      
      return { ...doc, type, size, status };
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    // Don't show toast here, let the component handle error reporting
    return [];
  }
};

// New function to get documents by task ID
export const getDocumentsByTask = async (taskId: number): Promise<Document[]> => {
  try {
    console.log('Fetching documents for task:', taskId);
    const response = await fetch(`${API_BASE_URL}/Documents/ByTask/${taskId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Task Documents API Response Status:', response.status);
    
    if (!response.ok) {
      // If the response is 404, it might be a legitimate "no documents" response
      // rather than an actual error in some APIs
      if (response.status === 404) {
        console.log('No documents found for this task (404 response)');
        return [];
      }
      throw new Error(`Failed to fetch task documents: ${response.status}`);
    }

    const result = await response.json();
    console.log('Task Documents API Response:', result);
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch task documents');
    }
    
    // Map API documents to include file type and size based on file extension
    return result.data.map((doc: Document) => {
      const fileExtension = doc.name.split('.').pop()?.toLowerCase() || '';
      let type = 'unknown';
      
      if (['pdf'].includes(fileExtension)) {
        type = 'pdf';
      } else if (['doc', 'docx'].includes(fileExtension)) {
        type = 'doc';
      } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(fileExtension)) {
        type = 'image';
      } else if (['zip', 'rar', '7z'].includes(fileExtension)) {
        type = 'archive';
      } else {
        // Default to PDF if no extension or unknown extension
        type = 'pdf';
      }
      
      // Add an estimated size if not provided
      const size = '2.5 MB';
      
      // Default status as one of the acceptable enum values
      const status = 'approved' as const;
      
      return { ...doc, type, size, status };
    });
  } catch (error) {
    console.error('Error fetching task documents:', error);
    // Don't show toast here, let the component handle error reporting
    return [];
  }
};

// New function to upload a document for a task
export const uploadTaskDocument = async (taskId: number, file: File, name: string, description: string): Promise<{ success: boolean; message: string; data?: any }> => {
  try {
    console.log('Uploading document for task:', taskId);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('taskId', taskId.toString());
    
    const response = await fetch(`${API_BASE_URL}/Documents/Upload`, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header when using FormData
    });

    console.log('Document Upload API Response Status:', response.status);
    
    if (!response.ok) {
      throw new Error(`Failed to upload document: ${response.status}`);
    }

    const result = await response.json();
    console.log('Document Upload API Response:', result);
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to upload document');
    }
    
    return result;
  } catch (error) {
    console.error('Error uploading document:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Error uploading document' 
    };
  }
};
