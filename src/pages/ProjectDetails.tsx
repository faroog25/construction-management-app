
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProjectById, UpdateProjectBasicInfo, cancelProject, pendProject, activateProject } from '@/services/projectService';
import { Tabs } from '@/components/ui/tabs';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProjectBasicEditDialog from '@/components/ProjectBasicEditDialog';
import ProjectHeader from '@/components/project/ProjectHeader';
import ProjectTabsNav from '@/components/project/ProjectTabsNav';
import ProjectTabsContent from '@/components/project/ProjectTabsContent';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const projectId = parseInt(id || '0', 10);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isActivating, setIsActivating] = useState(false);

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

  const handleProjectUpdated = () => {
    refetch();
  };

  const handleCancelProject = async () => {
    if (!cancellationReason.trim()) {
      toast.error("يرجى إدخال سبب الإلغاء");
      return;
    }

    try {
      setIsCancelling(true);
      await cancelProject(projectId, cancellationReason);
      toast.success("تم إلغاء المشروع بنجاح");
      setCancelDialogOpen(false);
      setCancellationReason('');
      refetch();
    } catch (error) {
      console.error("فشل في إلغاء المشروع:", error);
      toast.error("حدث خطأ أثناء محاولة إلغاء المشروع");
    } finally {
      setIsCancelling(false);
    }
  };

  const handlePendProject = async () => {
    try {
      setIsPending(true);
      await pendProject(projectId);
      toast.success("تم تعليق المشروع بنجاح");
      refetch();
    } catch (error) {
      console.error("فشل في تعليق المشروع:", error);
      toast.error("حدث خطأ أثناء محاولة تعليق المشروع");
    } finally {
      setIsPending(false);
    }
  };

  const handleActivateProject = async () => {
    try {
      setIsActivating(true);
      await activateProject(projectId);
      toast.success("تم تفعيل المشروع بنجاح");
      refetch();
    } catch (error) {
      console.error("فشل في تفعيل المشروع:", error);
      toast.error("حدث خطأ أثناء محاولة تفعيل المشروع");
    } finally {
      setIsActivating(false);
    }
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

  // تحديد حالة المشروع باستخدام status codes و string values
  const isProjectCancelled = project.projectStatus?.toLowerCase() === 'ملغي' || 
                            project.projectStatus?.toLowerCase() === 'cancelled' || 
                            project.status === 3;
  
  const isProjectCompleted = project.projectStatus?.toLowerCase() === 'مكتمل' || 
                           project.projectStatus?.toLowerCase() === 'completed' || 
                           project.status === 2;
  
  const isProjectActive = project.projectStatus?.toLowerCase() === 'قيد التنفيذ' || 
                         project.projectStatus?.toLowerCase() === 'active' || 
                         project.status === 0;
  
  const isProjectPending = project.projectStatus?.toLowerCase() === 'معلق' || 
                          project.projectStatus?.toLowerCase() === 'pending' || 
                          project.status === 1;
  
  // تحديد أي الأزرار التي يجب عرضها
  const showCancelButton = !isProjectCancelled && !isProjectCompleted;
  const showPendButton = isProjectActive;
  const showActivateButton = isProjectPending;

  console.log('Project status debug:', {
    projectStatus: project.projectStatus,
    status: project.status,
    isProjectCancelled,
    isProjectCompleted,
    isProjectActive,
    isProjectPending,
    showCancelButton,
    showPendButton,
    showActivateButton
  });

  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-16"></div>
      <main className="flex-1 container mx-auto px-4 py-8 animate-in">
        <ProjectHeader 
          project={project} 
          onEdit={handleEdit} 
          onCancel={() => setCancelDialogOpen(true)}
          onPend={handlePendProject}
          onActivate={handleActivateProject}
          showCancelButton={showCancelButton}
          showPendButton={showPendButton}
          showActivateButton={showActivateButton}
        />

        <Tabs defaultValue="details" className="space-y-6">
          <ProjectTabsNav />
          <ProjectTabsContent 
            project={project} 
            projectId={projectId} 
            onProjectUpdated={handleProjectUpdated}
          />
        </Tabs>
      </main>

      <ProjectBasicEditDialog 
        project={projectForEdit}
        isOpen={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={handleEditSuccess}
      />

      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>إلغاء المشروع</DialogTitle>
            <DialogDescription>
              هذا الإجراء سيؤدي إلى إلغاء المشروع ولن يمكن التراجع عنه. يرجى إدخال سبب الإلغاء أدناه.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reason" className="text-right">سبب الإلغاء</Label>
              <Textarea
                id="reason"
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="يرجى ذكر سبب إلغاء المشروع..."
                className="resize-none"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
              disabled={isCancelling}
            >
              إلغاء
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleCancelProject}
              disabled={isCancelling}
            >
              {isCancelling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جارٍ الإلغاء...
                </>
              ) : (
                'تأكيد الإلغاء'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectDetails;
