
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Upload, ArrowRight, Loader2, File, Plus, Download, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import DocumentCard from '@/components/documents/DocumentCard';
import { getDocuments } from '@/services/documentService';
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

  // Fetch documents using React Query with retry disabled for 404 responses
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['project-documents', project.id],
    queryFn: () => getDocuments({ 
      projectId: project.id,
      pageNumber: 1,
      pageSize: 20,
      ClassificationId: 1
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
    toast.info('سيتم تنفيذ وظيفة الرفع قريبًا');
  };

  const handleViewAll = () => {
    navigate('/documents', { state: { projectId: project.id } });
  };

  const handleView = (id: string) => {
    toast.info(`عرض المستند ${id}`);
  };

  const handleDownload = (id: string) => {
    toast.info(`تحميل المستند ${id}`);
  };

  const handleShare = (id: string) => {
    toast.info(`مشاركة المستند ${id}`);
  };

  const handleEdit = (id: string) => {
    toast.info(`تعديل المستند ${id}`);
  };

  const handleDelete = (id: string) => {
    toast.info(`حذف المستند ${id}`);
  };

  const getDocumentType = (name: string): string => {
    const extension = name.split('.').pop()?.toLowerCase();
    if (extension === 'pdf') return 'pdf';
    if (['doc', 'docx'].includes(extension || '')) return 'doc';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) return 'image';
    if (['zip', 'rar', '7z'].includes(extension || '')) return 'archive';
    return 'pdf'; // Default to PDF
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

  // Filter documents based on search term and document type
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = searchTerm ? 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.description || '').toLowerCase().includes(searchTerm.toLowerCase()) :
      true;
    
    const matchesType = documentType === 'all' ? 
      true : 
      (doc.type || getDocumentType(doc.name)) === documentType;
    
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
                    type: doc.type || getDocumentType(doc.name),
                    size: doc.size || '2.5 MB',
                    dateModified: formatDate(doc.createdDate),
                    project: doc.projectName,
                    owner: doc.taskName || 'المشروع',
                    status: mapStatus(doc.status)
                  }}
                  onView={() => handleView(doc.id)}
                  onDownload={() => handleDownload(doc.id)}
                  onShare={() => handleShare(doc.id)}
                  onEdit={() => handleEdit(doc.id)}
                  onDelete={() => handleDelete(doc.id)}
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
    </div>
  );
};

export default ProjectDocuments;
