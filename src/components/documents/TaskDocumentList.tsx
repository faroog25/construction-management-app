import React, { useState } from 'react';
import { Document } from '@/types/document';
import { FileText, Download, Info, Calendar, File, ExternalLink, Pencil, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { downloadDocument, getDocument, deleteDocument } from '@/services/documentService';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { API_BASE_URL } from '@/config/api';
import { EditDocumentDialog } from './EditDocumentDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TaskDocumentListProps {
  documents: Document[];
  isLoading: boolean;
  onDocumentUpdated?: () => void;
}

export function TaskDocumentList({ documents, isLoading, onDocumentUpdated }: TaskDocumentListProps) {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDownload = async (document: Document) => {
    try {
      toast.promise(
        downloadDocument(document.id).then(blob => {
          const url = window.URL.createObjectURL(blob);
          const link = window.document.createElement('a');
          link.href = url;
          link.download = document.name || 'document';
          window.document.body.appendChild(link);
          link.click();
          window.document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }),
        {
          loading: 'Loading document...',
          success: 'Document downloaded successfully',
          error: 'Failed to download document'
        }
      );
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error('Failed to download document');
    }
  };

  const handleOpenDocument = async (document: Document) => {
    try {
      toast.loading('Loading document...');
      
      const result = await getDocument(document.id);
      
      if (result.success && result.data && result.data.fileUrl) {
        window.open(result.data.fileUrl, '_blank');
        toast.dismiss();
        toast.success('Document opened successfully');
      } else {
        toast.dismiss();
        toast.error('Failed to open document');
      }
    } catch (error) {
      console.error('Error opening document:', error);
      toast.dismiss();
      toast.error('Failed to open document');
    }
  };

  const handleEditDocument = (document: Document) => {
    setSelectedDocument(document);
    setEditDialogOpen(true);
  };

  const handleDeleteConfirm = (document: Document) => {
    console.log('Delete confirmation dialog opened for document:', document);
    setSelectedDocument(document);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDocument = async () => {
    if (!selectedDocument) {
      console.error('No document selected for deletion');
      return;
    }
    
    console.log('Starting deletion process for document:', selectedDocument);
    setIsDeleting(true);
    
    try {
      console.log('Calling deleteDocument API for ID:', selectedDocument.id);
      const result = await deleteDocument(selectedDocument.id);
      console.log('Delete API response:', result);
      
      if (result.success) {
        console.log('Document deleted successfully, showing success toast');
        toast.success('Document deleted successfully');
        setDeleteDialogOpen(false);
        setSelectedDocument(null);
        
        console.log('Checking if onDocumentUpdated callback exists:', !!onDocumentUpdated);
        if (onDocumentUpdated) {
          console.log('Calling onDocumentUpdated callback');
          onDocumentUpdated();
        } else {
          console.warn('onDocumentUpdated callback is not available');
        }
      } else {
        console.error('Delete failed with message:', result.message);
        toast.error(result.message || 'Failed to delete document');
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    } finally {
      console.log('Deletion process completed, setting isDeleting to false');
      setIsDeleting(false);
    }
  };

  const handleDocumentEdited = () => {
    if (onDocumentUpdated) {
      onDocumentUpdated();
    }
  };

  const getDocumentIcon = (fileType: string | undefined) => {
    switch (fileType) {
      case 'pdf':
        return <File className="h-8 w-8 text-red-500" />;
      case 'doc':
      case 'docx':
        return <File className="h-8 w-8 text-blue-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <File className="h-8 w-8 text-green-500" />;
      case 'zip':
      case 'rar':
      case '7z':
        return <File className="h-8 w-8 text-yellow-500" />;
      default:
        return <FileText className="h-8 w-8 text-primary/80" />;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-40">
        <div className="h-10 w-10 border-4 border-t-primary animate-spin rounded-full"></div>
        <p className="mt-4 text-muted-foreground">Loading documents...</p>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <FileText className="h-16 w-16 text-muted-foreground/30 mb-4" />
        <h3 className="text-lg font-medium mb-1">No documents</h3>
        <p className="text-muted-foreground max-w-md">
          No documents have been added to this task yet. Use the "Upload new document" button to add documents.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        {documents.map((doc) => (
          <div 
            key={doc.id}
            className="border rounded-lg p-4 hover:border-primary/50 hover:bg-primary/5 transition-colors group cursor-pointer"
            onClick={() => handleOpenDocument(doc)}
          >
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                {getDocumentIcon(doc.fileType)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <h4 className="font-semibold text-lg truncate">{doc.name}</h4>
                  <Badge variant="outline" className="shrink-0 sm:ml-2">
                    {doc.fileType === 'pdf' ? 'PDF' : 
                     doc.fileType === 'doc' || doc.fileType === 'docx' ? 'Word' :
                     ['jpg', 'jpeg', 'png', 'gif'].includes(doc.fileType || '') ? 'Image' :
                     ['zip', 'rar', '7z'].includes(doc.fileType || '') ? 'Compressed' : 'Document'}
                  </Badge>
                </div>
                
                {doc.description && (
                  <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{doc.description}</p>
                )}
                
                <div className="flex items-center flex-wrap gap-2 mt-2">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="inline h-3.5 w-3.5 mr-1" />
                    <span>{formatDate(doc.createdDate)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t flex justify-end gap-2">
              <Button 
                size="sm" 
                variant="outline"
                className="text-xs h-8"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenDocument(doc);
                }}
              >
                <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                Open
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="text-xs h-8"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditDocument(doc);
                }}
              >
                <Pencil className="h-3.5 w-3.5 mr-1.5" />
                Edit
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="text-xs h-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Delete button clicked for document:', doc);
                  handleDeleteConfirm(doc);
                }}
              >
                <Trash className="h-3.5 w-3.5 mr-1.5" />
                Delete
              </Button>
              <Button 
                size="sm" 
                variant="secondary"
                className="text-xs h-8"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(doc);
                }}
              >
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Download
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Document Dialog */}
      <EditDocumentDialog
        isOpen={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        document={selectedDocument}
        onDocumentUpdated={handleDocumentEdited}
      />
      
      {/* Delete Document Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right">Confirm Document Deletion</AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              Are you sure you want to delete this document? This action cannot be undone.
              {selectedDocument && (
                <div className="mt-2 p-2 bg-muted rounded text-sm">
                  Document: {selectedDocument.name}
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse gap-2 sm:justify-start">
            <AlertDialogAction
              onClick={handleDeleteDocument}
              className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <span className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash className="h-4 w-4 mr-2" />
                  Yes, Delete Document
                </>
              )}
            </AlertDialogAction>
            <AlertDialogCancel className="sm:mr-2">Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
