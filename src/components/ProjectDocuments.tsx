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

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['project-documents', project.id],
    queryFn: () => getDocuments({ 
      projectId: project.id,
      pageNumber: 1,
      pageSize: 50
    }),
    retry: false
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
      toast.error('Error occurred while fetching documents');
    }
  }, [error]);

  const handleUpload = () => {
    setUploadDialogOpen(true);
  };

  const handleViewAll = () => {
    navigate('/documents', { state: { projectId: project.id } });
  };

  const handleView = async (id: string) => {
    try {
      toast.loading('Loading document...');
      
      const result = await getDocument(id);
      
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

  const handleDownload = async (id: string) => {
    try {
      toast.promise(
        downloadDocument(id).then(blob => {
          const url = window.URL.createObjectURL(blob);
          const link = window.document.createElement('a');
          link.href = url;
          const docName = documents.find(d => d.id === id)?.name || 'document';
          link.download = docName;
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

  const handleEdit = (id: string) => {
    const document = documents.find(doc => doc.id === id);
    if (document) {
      setSelectedDocument(document);
      setEditDialogOpen(true);
    }
  };

  const handleDeleteConfirm = (id: string) => {
    const document = documents.find(doc => doc.id === id);
    if (document) {
      setSelectedDocument(document);
      setDeleteDialogOpen(true);
    }
  };

  const handleDeleteDocument = async () => {
    if (!selectedDocument) return;
    
    setIsDeleting(true);
    
    try {
      const result = await deleteDocument(selectedDocument.id);
      
      if (result.success) {
        toast.success('Document deleted successfully');
        setDeleteDialogOpen(false);
        refetch();
      } else {
        toast.error(result.message || 'Failed to delete document');
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDocumentUploaded = () => {
    refetch();
  };

  const handleDocumentEdited = () => {
    refetch();
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US');
    } catch (e) {
      return dateString;
    }
  };

  const mapStatus = (status?: string): 'approved' | 'pending' | 'rejected' | 'draft' => {
    if (status === 'approved') return 'approved';
    if (status === 'pending') return 'pending';
    if (status === 'rejected') return 'rejected';
    if (status === 'draft') return 'draft';
    return 'approved';
  };

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
            <CardTitle className="text-xl font-bold">Project Documents</CardTitle>
            <div className="flex gap-2">
              <Button onClick={handleUpload} className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                <Upload className="h-4 w-4" />
                Upload Document
              </Button>
            
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-5">
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search documents..." 
                className="pl-3 pr-10" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={documentType} onValueChange={setDocumentType}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="File Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>File Type</SelectLabel>
                  <SelectItem value="all">All Files</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="docx">Word</SelectItem>
                  <SelectItem value="image">Images</SelectItem>
                  <SelectItem value="archive">Compressed Files</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="all" className="mb-6">
            <TabsList className="bg-muted/40 w-full md:w-auto">
              <TabsTrigger value="all">All Documents</TabsTrigger>
              <TabsTrigger value="project">Project Documents</TabsTrigger>
              <TabsTrigger value="contracts">Contracts</TabsTrigger>
            </TabsList>
          </Tabs>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              <span className="mr-2">Loading documents...</span>
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
                    owner: doc.taskName || 'Project',
                    status: mapStatus(doc.status)
                  }}
                  onView={() => handleView(doc.id)}
                  onDownload={() => handleDownload(doc.id)}
                  onShare={() => toast.info(`Share document ${doc.id}`)}
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
              <h3 className="text-lg font-medium mb-2">No Documents</h3>
              <p className="text-muted-foreground mb-6 max-w-md">No documents have been added to this project yet. You can upload documents or create a new one.</p>
              <div className="flex gap-3">
                <Button onClick={handleUpload} className="gap-2">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
                <Button variant="outline" onClick={() => toast.info('This feature will be available soon')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Document
                </Button>
              </div>
            </div>
          )}

          {filteredDocuments.length > 0 && filteredDocuments.length < documents.length && (
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground mb-2">Showing {filteredDocuments.length} of {documents.length} documents</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setSearchTerm('');
                  setDocumentType('all');
                }}
              >
                Reset Search
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
            <AlertDialogTitle className="text-right">Confirm Document Deletion</AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              Are you sure you want to delete this document? This action cannot be undone.
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
                  <Trash2 className="h-4 w-4 mr-2" />
                  Yes, Delete Document
                </>
              )}
            </AlertDialogAction>
            <AlertDialogCancel className="sm:mr-2">Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProjectDocuments;
