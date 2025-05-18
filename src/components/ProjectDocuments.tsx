
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Upload, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import DocumentCard from '@/components/documents/DocumentCard';
import { getDocuments } from '@/services/documentService';
import { Document } from '@/types/document';
import { useQuery } from '@tanstack/react-query';

interface ProjectDocumentsProps {
  project: {
    id: number;
    projectName: string;
  };
}

const ProjectDocuments = ({ project }: ProjectDocumentsProps) => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([]);

  // Fetch documents using React Query
  const { data, isLoading, error } = useQuery({
    queryKey: ['project-documents', project.id],
    queryFn: () => getDocuments({ 
      projectId: project.id,
      pageNumber: 1,
      pageSize: 10,
      ClassificationId: 1
    }),
  });

  useEffect(() => {
    if (data) {
      setDocuments(data);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error('حدث خطأ أثناء جلب المستندات');
      console.error('Error fetching documents:', error);
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

  // Map status string to the appropriate enum value
  const mapStatus = (status?: string): 'approved' | 'pending' | 'rejected' | 'draft' => {
    if (status === 'approved') return 'approved';
    if (status === 'pending') return 'pending';
    if (status === 'rejected') return 'rejected';
    if (status === 'draft') return 'draft';
    return 'approved'; // Default
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold">مستندات المشروع</CardTitle>
            <div className="flex gap-2">
              <Button onClick={handleUpload} className="gap-2">
                <Upload className="h-4 w-4" />
                رفع مستند
              </Button>
              <Button variant="outline" onClick={handleViewAll} className="gap-2">
                عرض جميع المستندات
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="mr-2">جاري تحميل المستندات...</span>
            </div>
          ) : documents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  document={{
                    id: Number(doc.id) || 0,
                    name: doc.name,
                    type: doc.type || getDocumentType(doc.name),
                    size: doc.size || '2.5 MB',
                    dateModified: new Date(doc.createdDate).toLocaleDateString('ar-SA'),
                    project: doc.projectName,
                    owner: 'Admin',
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
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">لا توجد مستندات</h3>
              <p className="text-muted-foreground mb-4">لم يتم إضافة أي مستندات لهذا المشروع بعد</p>
              <Button onClick={handleUpload}>
                <Upload className="h-4 w-4 mr-2" />
                رفع مستند جديد
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDocuments;
