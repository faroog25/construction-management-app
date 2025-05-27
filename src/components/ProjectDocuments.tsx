
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Upload, ArrowRight, Loader2, File, Plus, Download, Search, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import DocumentCard from '@/components/documents/DocumentCard';
import { getDocuments, downloadDocument, deleteDocument, getDocument } from '@/services/documentService';
import { Document } from '@/types/document';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EditDocumentDialog } from '@/components/documents/EditDocumentDialog';
import { UploadDocumentDialog } from '@/components/documents/UploadDocumentDialog';
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

interface ProjectDocumentsProps {
  project: {
    id: number;
    projectName: string;
  };
}

const ProjectDocuments = ({ project }: ProjectDocumentsProps) => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [documentType, setDocumentType] = useState<string>('all');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch documents using React Query with retry disabled for 404 responses
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['project-documents', project.id],
    queryFn: () => getDocuments({ 
      projectId: project.id,
      pageNumber: 1,
      pageSize: 50
    }),
    retry: false // Don't retry on failure
  });

  useEffect(() => {
    if (data) {
      console.log('Documents data set:', data);
      setDocuments(data);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      console.error('Error fetching documents:', error);
      toast.error('حدث خطأ أثناء جلب المستندات');
    }
  }, [error]);

  const handleUpload = () => {
    setUploadDialogOpen(true);
  };

  const handleViewAll = () => {
    navigate('/documents', { state: { projectId: project.id } });
  };

  // Function to open the document in a new tab
  const handleView = async (id: string) => {
    try {
      toast.loading('جاري تحميل المستند...');
      
      const result = await getDocument(id);
      
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

  const handleDownload = async (id: string) => {
    try {
      toast.promise(
        downloadDocument(id).then(blob => {
          // Create a blob URL for the file
          const url = window.URL.createObjectURL(blob);
          
          // Create a temporary link element
          const link = window.document.createElement('a');
          link.href = url;
          const docName = documents.find(d => d.id === id)?.name || 'document';
          link.download = docName;
          
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

  // Function to handle document editing
  const handleEdit = (id: string) => {
    const document = documents.find(doc => doc.id === id);
    if (document) {
      setSelectedDocument(document);
      setEditDialogOpen(true);
    }
  };

  // Function to handle document deletion confirmation
  const handleDeleteConfirm = (id: string) => {
    const document = documents.find(doc => doc.id === id);
    if (document) {
      setSelectedDocument(document);
      setDeleteDialogOpen(true);
    }
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
        refetch();
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

  // Handle document upload success
  const handleDocumentUploaded = () => {
    refetch();
  };

  // Handle document edit success
  const handleDocumentEdited = () => {
    refetch();
  };

  // Format the date
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('ar-SA');
    } catch (e) {
      return dateString;
    }
  };

  // Map status string to the appropriate enum value
  const mapStatus = (status?: string): 'approved' | 'pending' | 'rejected' | 'draft' => {
    if (status === 'approved') return 'approved';
    if (status === 'pending') return 'pending';
    if (status === 'rejected') return 'rejected';
    if (status === 'draft') return 'draft';
    return 'approved'; // Default
  };

  // Filter documents based on search term and document type using fileType from API
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = searchTerm ? 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.description || '').toLowerCase().includes(searchTerm.toLowerCase()) :
      true;
    
    const matchesType = documentType === 'all' ? 
      true : 
      doc.fileType === documentType;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border rounded-lg shadow-sm">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold">مستندات المشروع</CardTitle>
            <div className="flex gap-2">
              <Button onClick={handleUpload} className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                <Upload className="h-4 w-4" />
                رفع مستند
              </Button>
              <Button variant="outline" onClick={handleViewAll} className="gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                عرض جميع المستندات
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-5">
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="بحث في المستندات..." 
                className="pl-3 pr-10" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={documentType} onValueChange={setDocumentType}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="نوع الملف" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>نوع الملف</SelectLabel>
                  <SelectItem value="all">جميع الملفات</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="doc">Word</SelectItem>
                  <SelectItem value="docx">Word</SelectItem>
                  <SelectItem value="image">صور</SelectItem>
                  <SelectItem value="archive">ملفات مضغوطة</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="all" className="mb-6">
            <TabsList className="bg-muted/40 w-full md:w-auto">
              <TabsTrigger value="all">جميع المستندات</TabsTrigger>
              <TabsTrigger value="project">وثائق المشروع</TabsTrigger>
              <TabsTrigger value="contracts">العقود</TabsTrigger>
              <TabsTrigger value="drawings">المخططات</TabsTrigger>
            </TabsList>
          </Tabs>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              <span className="mr-2">جاري تحميل المستندات...</span>
            </div>
          ) : filteredDocuments.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocuments.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  document={{
                    id: Number(doc.id) || 0,
                    name: doc.name,
                    type: doc.fileType || 'pdf', // Use fileType from API response
                    size: doc.size || '2.5 MB',
                    dateModified: formatDate(doc.createdDate),
                    project: doc.projectName,
                    owner: doc.taskName || 'المشروع',
                    status: mapStatus(doc.status)
                  }}
                  onView={() => handleView(doc.id)}
                  onDownload={() => handleDownload(doc.id)}
                  onShare={() => toast.info(`مشاركة المستند ${doc.id}`)}
                  onEdit={() => handleEdit(doc.id)}
                  onDelete={() => handleDeleteConfirm(doc.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <div className="bg-white p-4 rounded-full mb-4 shadow-sm">
                <FileText className="h-12 w-12 text-indigo-300" />
              </div>
              <h3 className="text-lg font-medium mb-2">لا توجد مستندات</h3>
              <p className="text-muted-foreground mb-6 max-w-md">لم يتم إضافة أي مستندات لهذا المشروع بعد. يمكنك رفع المستندات أو إنشاء مستند جديد.</p>
              <div className="flex gap-3">
                <Button onClick={handleUpload} className="gap-2">
                  <Upload className="h-4 w-4 mr-2" />
                  رفع مستند
                </Button>
                <Button variant="outline" onClick={() => toast.info('سيتم تنفيذ هذه الوظيفة قريبًا')}>
                  <Plus className="h-4 w-4 mr-2" />
                  إنشاء مستند
                </Button>
              </div>
            </div>
          )}

          {filteredDocuments.length > 0 && filteredDocuments.length < documents.length && (
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground mb-2">تم عرض {filteredDocuments.length} من أصل {documents.length} مستند</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setSearchTerm('');
                  setDocumentType('all');
                }}
              >
                إعادة ضبط البحث
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Document Dialog */}
      <EditDocumentDialog
        isOpen={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        document={selectedDocument}
        onDocumentUpdated={handleDocumentEdited}
      />
      
      {/* Upload Document Dialog */}
      <UploadDocumentDialog
        isOpen={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        taskId={0} // 0 means project document
        projectId={project.id}
        onUploadSuccess={handleDocumentUploaded}
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
                  <Trash2 className="h-4 w-4 mr-2" />
                  نعم، حذف المستند
                </>
              )}
            </AlertDialogAction>
            <AlertDialogCancel className="sm:mr-2">إلغاء</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProjectDocuments;
