
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProjectById, UpdateProjectBasicInfo } from '@/services/projectService';
import { Tabs } from '@/components/ui/tabs';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProjectBasicEditDialog from '@/components/ProjectBasicEditDialog';
import ProjectHeader from '@/components/project/ProjectHeader';
import ProjectTabsNav from '@/components/project/ProjectTabsNav';
import ProjectTabsContent from '@/components/project/ProjectTabsContent';

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const projectId = parseInt(id || '0', 10);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const { data: project, isLoading, error, refetch } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => getProjectById(projectId),
    enabled: !!projectId,
  });

  const handleEdit = () => {
    setEditDialogOpen(true);
  };

  const handleEditSuccess = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="mt-4 text-lg text-muted-foreground">جارٍ تحميل تفاصيل المشروع...</span>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="flex items-center text-destructive">
          <AlertCircle className="w-5 h-5 ml-2" />
          <p>فشل تحميل تفاصيل المشروع</p>
        </div>
        <Button variant="outline" onClick={() => window.history.back()}>
          العودة إلى المشاريع
        </Button>
      </div>
    );
  }

  // بيانات المشروع للتعديل
  const projectForEdit: UpdateProjectBasicInfo = {
    id: project.id,
    projectName: project.projectName,
    description: project.description,
    siteAddress: project.siteAddress || '',
    geographicalCoordinates: project.geographicalCoordinates
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-16"></div> {/* Navbar spacer */}
      <main className="flex-1 container mx-auto px-4 py-8 animate-in">
        <ProjectHeader project={project} onEdit={handleEdit} />

        <Tabs defaultValue="details" className="space-y-6">
          <ProjectTabsNav />
          <ProjectTabsContent project={project} projectId={projectId} />
        </Tabs>
      </main>

      {/* حوار تعديل بيانات المشروع الأساسية */}
      <ProjectBasicEditDialog 
        project={projectForEdit}
        isOpen={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
};

export default ProjectDetails;
