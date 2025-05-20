
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FileUp, Loader2, ChevronDown, FileText } from 'lucide-react';
import { getProjectDocuments, getTaskDocuments } from '@/services/documentService';
import { Document } from '@/types/document';
import { toast } from 'sonner';
import { UploadDocumentDialog } from '@/components/documents/UploadDocumentDialog';
import { TaskDocumentList } from '@/components/documents/TaskDocumentList';
import { DocumentsViewToggle } from '@/components/documents/DocumentsViewToggle';
import { DocumentsFilter } from '@/components/documents/DocumentsFilter';
import { DocumentCard } from '@/components/documents/DocumentCard';

interface ProjectDocumentsProps {
  project: {
    id: number;
    projectName: string;
  };
  readOnly?: boolean;
}

const ProjectDocuments = ({ project, readOnly = false }: ProjectDocumentsProps) => {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [documentType, setDocumentType] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch project documents
  const {
    data: projectDocuments,
    isLoading: isLoadingProjectDocs,
    refetch: refetchProjectDocs
  } = useQuery({
    queryKey: ['project-documents', project.id],
    queryFn: async () => {
      try {
        const result = await getProjectDocuments(project.id);
        return result.data || [];
      } catch (error) {
        console.error('Error fetching project documents:', error);
        toast.error('فشل في جلب مستندات المشروع');
        return [];
      }
    },
    enabled: project.id > 0
  });

  // Filter documents
  const filterDocuments = (documents: Document[] | undefined) => {
    if (!documents) return [];
    
    return documents.filter(doc => {
      // Apply type filter
      if (documentType && doc.type !== documentType) {
        return false;
      }
      
      // Apply search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          doc.name.toLowerCase().includes(query) ||
          (doc.description && doc.description.toLowerCase().includes(query))
        );
      }
      
      return true;
    });
  };

  const filteredProjectDocuments = filterDocuments(projectDocuments);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <CardTitle className="text-xl">مستندات المشروع</CardTitle>
            <CardDescription>
              مستندات ومرفقات خاصة بالمشروع
            </CardDescription>
          </div>
          
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <DocumentsViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
            {!readOnly && (
              <Button 
                onClick={() => setIsUploadDialogOpen(true)} 
                className="flex items-center gap-2"
              >
                <FileUp className="h-4 w-4" />
                <span>رفع مستند</span>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <DocumentsFilter 
              onTypeChange={setDocumentType} 
              onSearchChange={setSearchQuery} 
              selectedType={documentType} 
              searchQuery={searchQuery} 
            />
          </div>
          
          {isLoadingProjectDocs ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {filteredProjectDocuments.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
                  <h3 className="mt-4 text-lg font-medium">لا توجد مستندات</h3>
                  <p className="text-muted-foreground mt-1">
                    {readOnly 
                      ? 'لا توجد مستندات مرفقة بالمشروع حالياً.'
                      : 'قم برفع مستندات جديدة باستخدام زر "رفع مستند" أعلاه.'}
                  </p>
                </div>
              ) : viewMode === 'list' ? (
                <TaskDocumentList 
                  documents={filteredProjectDocuments} 
                  isLoading={false} 
                  onDocumentUpdated={refetchProjectDocs} 
                  readOnly={readOnly}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProjectDocuments.map((document) => (
                    <DocumentCard 
                      key={document.id} 
                      document={document} 
                      onDocumentUpdated={refetchProjectDocs} 
                      readOnly={readOnly}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Upload Document Dialog */}
      <UploadDocumentDialog
        isOpen={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        taskId={0} // 0 means this is a project document, not a task document
        projectId={project.id}
        onUploadSuccess={refetchProjectDocs}
      />
    </div>
  );
};

export default ProjectDocuments;
