
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProjectById, UpdateProjectBasicInfo } from '@/services/projectService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProjectDetailsInfo from '@/components/ProjectDetailsInfo';
import ProjectStages from '@/components/ProjectStages';
import GanttChart from '@/components/GanttChart';
import ProjectTimeline from '@/components/ProjectTimeline';
import ProjectEquipment from '@/components/project/ProjectEquipment';
import ProjectDocuments from '@/components/ProjectDocuments';
import ProjectBasicEditDialog from '@/components/ProjectBasicEditDialog';
import { 
  Loader2, 
  AlertCircle, 
  Calendar, 
  Clock, 
  Users, 
  ChevronLeft, 
  Share2,
  Download,
  Printer,
  MoreHorizontal,
  Plus,
  FileText,
  Package,
  LayoutGrid,
  BarChart2,
  ClipboardList,
  Settings,
  Edit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Project } from '@/types/project';

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const projectId = parseInt(id || '0', 10);
  const navigate = useNavigate();
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const { data: project, isLoading, error, refetch } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => getProjectById(projectId),
    enabled: !!projectId,
  });

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('تم نسخ رابط المشروع إلى الحافظة');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    toast.success('تم تصدير بيانات المشروع');
  };

  const handleGoBack = () => {
    navigate('/projects');
  };

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
        <Button variant="outline" onClick={handleGoBack}>
          <ChevronLeft className="ml-2 h-4 w-4" />
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

  // Ensure required properties have default values for display
  const projectWithDefaults = {
    ...project,
    createdAt: project.createdAt || new Date().toISOString(),
    updatedAt: project.updatedAt || new Date().toISOString()
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-16"></div> {/* Navbar spacer */}
      <main className="flex-1 container mx-auto px-4 py-8 animate-in">
        <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground" 
                onClick={handleGoBack}
              >
                <ChevronLeft className="h-4 w-4 ml-1" />
                المشاريع
              </Button>
            </div>
            <h1 className="text-3xl font-bold tracking-tight mt-2">{project?.projectName}</h1>
            <div className="flex flex-wrap gap-4 mt-2">
              <p className="text-muted-foreground flex items-center">
                <Calendar className="w-4 h-4 ml-1" /> 
                معرف المشروع: {project?.id}
              </p>
              {project?.startDate && (
                <p className="text-muted-foreground flex items-center">
                  <Clock className="w-4 h-4 ml-1" /> 
                  تاريخ البدء: {new Date(project?.startDate).toLocaleDateString('ar-SA')}
                </p>
              )}
              {project?.clientName && (
                <p className="text-muted-foreground flex items-center">
                  <Users className="w-4 h-4 ml-1" /> 
                  العميل: {project?.clientName}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex gap-2 print:hidden sm:mt-0 mt-4 w-full sm:w-auto">
            <Button variant="outline" size="sm" onClick={handleShare} className="flex-1 sm:flex-none">
              <Share2 className="h-4 w-4 ml-1.5" />
              مشاركة
            </Button>
            <Button variant="outline" size="sm" onClick={handleEdit} className="flex-1 sm:flex-none">
              <Edit className="h-4 w-4 ml-1.5" />
              تعديل
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleExport}>
                  <Download className="h-4 w-4 ml-2" />
                  تصدير
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handlePrint}>
                  <Printer className="h-4 w-4 ml-2" />
                  طباعة
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => toast.info("سيتم توفير ميزة الأرشفة قريبًا")}>
                  أرشفة المشروع
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button className="flex-1 sm:flex-none">
              <Plus className="h-4 w-4 ml-1.5" />
              إضافة مهمة
            </Button>
          </div>
        </div>

        <Tabs defaultValue="details" className="space-y-6">
          <TabsList className="w-full max-w-md grid grid-cols-5 p-1 bg-muted/30">
            <TabsTrigger value="details" className="flex items-center gap-1.5">
              <LayoutGrid className="h-4 w-4" />
              تفاصيل المشروع
            </TabsTrigger>
            <TabsTrigger value="stages" className="flex items-center gap-1.5">
              <ClipboardList className="h-4 w-4" />
              المراحل والمهام
            </TabsTrigger>
            <TabsTrigger value="gantt" className="flex items-center gap-1.5">
              <BarChart2 className="h-4 w-4" />
              مخطط جانت
            </TabsTrigger>
            <TabsTrigger value="equipment" className="flex items-center gap-1.5">
              <Settings className="h-4 w-4" />
              المعدات
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-1.5">
              <FileText className="h-4 w-4" />
              المستندات
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-6 animate-in fade-in-50">
            <ProjectDetailsInfo project={projectWithDefaults} />
            <ProjectTimeline />
          </TabsContent>
          
          <TabsContent value="stages" className="space-y-6 animate-in fade-in-50">
            <ProjectStages project={projectWithDefaults} />
          </TabsContent>
          
          <TabsContent value="gantt" className="space-y-6 animate-in fade-in-50">
            <GanttChart project={projectWithDefaults} />
          </TabsContent>
          
          <TabsContent value="equipment" className="space-y-6 animate-in fade-in-50">
            <ProjectEquipment project={projectWithDefaults} />
          </TabsContent>

          <TabsContent value="documents" className="space-y-6 animate-in fade-in-50">
            <ProjectDocuments project={{ id: projectId, projectName: project.projectName }} />
          </TabsContent>
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
