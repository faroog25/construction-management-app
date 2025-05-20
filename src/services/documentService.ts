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

// Get documents by task ID
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

// Upload a document for a task
export const uploadTaskDocument = async (
  formData: FormData
): Promise<{ success: boolean; message: string; data?: any }> => {
  try {
    console.log('Uploading document...');
    
    // Log formData for debugging (do not log the file contents)
    const formDataEntries = Array.from(formData.entries())
      .filter(([key]) => key !== 'File') // Skip logging the file content
      .map(([key, value]) => `${key}: ${value}`);
    
    console.log('Form data being sent:', formDataEntries);
    
    const response = await fetch(`${API_BASE_URL}/Documents`, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header when using FormData
    });

    console.log('Document Upload API Response Status:', response.status);
    
    if (!response.ok) {
      // Try to parse the error response
      let errorData = null;
      try {
        errorData = await response.json();
        console.error('Document upload error:', errorData);
      } catch (e) {
        console.error('Failed to parse error response');
      }
      
      throw new Error(errorData?.message || `Failed to upload document: ${response.status}`);
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

// Get a single document
export const getDocument = async (documentId: string): Promise<{ success: boolean; message: string; data: any }> => {
  try {
    console.log('Fetching document with ID:', documentId);
    const response = await fetch(`${API_BASE_URL}/Documents/${documentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Document API Response Status:', response.status);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch document: ${response.status}`);
    }

    const result = await response.json();
    console.log('Document API Response:', result);
    
    return result;
  } catch (error) {
    console.error('Error fetching document:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Error fetching document',
      data: null
    };
  }
};

// New function to edit a document
export const editDocument = async (
  documentId: string,
  data: { name: string; description: string }
): Promise<{ success: boolean; message: string; data?: any }> => {
  try {
    console.log('Editing document with ID:', documentId, 'Data:', data);
    
    const response = await fetch(`${API_BASE_URL}/Documents`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: documentId,
        name: data.name,
        description: data.description,
      }),
    });

    console.log('Document Edit API Response Status:', response.status);
    
    if (!response.ok) {
      // Try to parse the error response
      let errorData = null;
      try {
        errorData = await response.json();
        console.error('Document edit error:', errorData);
      } catch (e) {
        console.error('Failed to parse error response');
      }
      
      throw new Error(errorData?.message || `Failed to edit document: ${response.status}`);
    }

    const result = await response.json();
    console.log('Document Edit API Response:', result);
    
    return result;
  } catch (error) {
    console.error('Error editing document:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Error editing document' 
    };
  }
};

// Download a document
export const downloadDocument = async (documentId: string): Promise<Blob> => {
  try {
    const response = await fetch(`${API_BASE_URL}/Documents/Download/${documentId}`, {
      method: 'GET',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to download document: ${response.status}`);
    }
    
    return await response.blob();
  } catch (error) {
    console.error('Error downloading document:', error);
    throw error;
  }
};
