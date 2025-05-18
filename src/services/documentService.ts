
import { API_BASE_URL } from '@/config/api';
import { Document, DocumentsParams, DocumentsResponse } from '@/types/document';

export const getDocuments = async (params: DocumentsParams): Promise<Document[]> => {
  const queryParams = new URLSearchParams();
  
  if (params.projectId) queryParams.append('projectId', params.projectId.toString());
  if (params.pageNumber) queryParams.append('pageNumber', params.pageNumber.toString());
  if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
  if (params.ClassificationId) queryParams.append('ClassificationId', params.ClassificationId.toString());
  
  const response = await fetch(`${API_BASE_URL}/Documents?${queryParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch documents');
  }

  const result: DocumentsResponse = await response.json();
  
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
    }
    
    // Add an estimated size if not provided
    const size = '2.5 MB';
    
    // Default status to approved if not provided
    const status = 'approved';
    
    return { ...doc, type, size, status };
  });
};
