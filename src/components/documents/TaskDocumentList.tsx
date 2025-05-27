
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
          // Create a blob URL for the file
          const url = window.URL.createObjectURL(blob);
          
          // Create a temporary link element
          const link = window.document.createElement('a');
          link.href = url;
          link.download = document.name || 'document';
          
          // Trigger download
          window.document.body.appendChild(link);
          link.click();
          
          // Clean up
          window.document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }),
        {
          loading: 'جاري تحميل المستند...',
          success: 'تم تحميل المستند بنجاح',
          error: 'فشل في تحميل المستند'
        }
      );
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error('فشل في تحميل المستند');
    }
  };

  // Function to open the document in a new tab
  const handleOpenDocument = async (document: Document) => {
    try {
      toast.loading('جاري تحميل المستند...');
      
      const result = await getDocument(document.id);
      
      if (result.success && result.data && result.data.fileUrl) {
        // Open the file URL in a new tab
        window.open(result.data.fileUrl, '_blank');
        toast.dismiss();
        toast.success('تم فتح المستند بنجاح');
      } else {
        toast.dismiss();
        toast.error('فشل في فتح المستند');
      }
    } catch (error) {
      console.error('Error opening document:', error);
      toast.dismiss();
      toast.error('فشل في فتح المستند');
    }
  };

  // Function to handle document editing
  const handleEditDocument = (document: Document) => {
    setSelectedDocument(document);
    setEditDialogOpen(true);
  };

  // Function to handle document deletion confirmation
  const handleDeleteConfirm = (document: Document) => {
    setSelectedDocument(document);
    setDeleteDialogOpen(true);
  };

  // Function to handle document deletion
  const handleDeleteDocument = async () => {
    if (!selectedDocument) return;
    
    setIsDeleting(true);
    
    try {
      const result = await deleteDocument(selectedDocument.id);
      
      if (result.success) {
        toast.success('تم حذف المستند بنجاح');
        setDeleteDialogOpen(false);
        
        // Refresh documents list
        if (onDocumentUpdated) {
          onDocumentUpdated();
        }
      } else {
        toast.error(result.message || 'فشل في حذف المستند');
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('فشل في حذف المستند');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle edit success
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
      return new Date(dateString).toLocaleDateString('ar-SA', {
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
        <p className="mt-4 text-muted-foreground">جاري تحميل المستندات...</p>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <FileText className="h-16 w-16 text-muted-foreground/30 mb-4" />
        <h3 className="text-lg font-medium mb-1">لا توجد مستندات</h3>
        <p className="text-muted-foreground max-w-md">
          لم يتم إضافة أي مستندات لهذه المهمة بعد. استخدم زر "رفع مستند جديد" لإضافة مستندات.
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
                     ['jpg', 'jpeg', 'png', 'gif'].includes(doc.fileType || '') ? 'صورة' :
                     ['zip', 'rar', '7z'].includes(doc.fileType || '') ? 'ملف مضغوط' : 'مستند'}
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
                  e.stopPropagation(); // Prevent triggering the parent onClick
                  handleOpenDocument(doc);
                }}
              >
                <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                فتح
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="text-xs h-8"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the parent onClick
                  handleEditDocument(doc);
                }}
              >
                <Pencil className="h-3.5 w-3.5 mr-1.5" />
                تعديل
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="text-xs h-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the parent onClick
                  handleDeleteConfirm(doc);
                }}
              >
                <Trash className="h-3.5 w-3.5 mr-1.5" />
                حذف
              </Button>
              <Button 
                size="sm" 
                variant="secondary"
                className="text-xs h-8"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the parent onClick
                  handleDownload(doc);
                }}
              >
                <Download className="h-3.5 w-3.5 mr-1.5" />
                تحميل
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
            <AlertDialogTitle className="text-right">تأكيد حذف المستند</AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              هل أنت متأكد من رغبتك في حذف هذا المستند؟ لا يمكن التراجع عن هذا الإجراء.
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
                  جاري الحذف...
                </>
              ) : (
                <>
                  <Trash className="h-4 w-4 mr-2" />
                  نعم، حذف المستند
                </>
              )}
            </AlertDialogAction>
            <AlertDialogCancel className="sm:mr-2">إلغاء</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
