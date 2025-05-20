import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { getTasks, updateTask, completeTask, ApiTask } from '@/services/taskService';
import { Loader2, CheckCircle, Users, CalendarRange, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { UploadDocumentDialog } from './documents/UploadDocumentDialog';
import { TaskDocumentList } from './documents/TaskDocumentList';
import { getTaskDocuments } from '@/services/documentService';
import { Document } from '@/types/document';
import { Separator } from '@/components/ui/separator';

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: number | null;
  readOnly?: boolean;
}

export function TaskDetailsModal({ isOpen, onClose, taskId, readOnly = false }: TaskDetailsModalProps) {
  const queryClient = useQueryClient();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [taskDetails, setTaskDetails] = useState<ApiTask | null>(null);

  // Get task details
  const { 
    data: tasks,
    isLoading: isLoadingTask 
  } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => getTasks(0), // Get all tasks
    enabled: isOpen && taskId !== null
  });

  // Get task documents
  const {
    data: taskDocuments,
    isLoading: isLoadingDocuments,
    refetch: refetchDocuments
  } = useQuery({
    queryKey: ['task-documents', taskId],
    queryFn: async () => {
      if (!taskId) return [];
      try {
        const result = await getTaskDocuments(taskId);
        return result || [];
      } catch (error) {
        console.error('Error fetching task documents:', error);
        toast.error('فشل في جلب مستندات المهمة');
        return [];
      }
    },
    enabled: isOpen && taskId !== null
  });

  // Complete task mutation
  const completeTaskMutation = useMutation({
    mutationFn: (taskId: number) => completeTask(taskId),
    onSuccess: () => {
      toast.success('تم اكمال المهمة بنجاح');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      onClose();
    },
    onError: (error) => {
      console.error('Error completing task:', error);
      toast.error('فشل في إكمال المهمة');
    }
  });

  // Find task details when tasks are loaded
  useEffect(() => {
    if (tasks && taskId) {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        setTaskDetails(task);
      }
    }
  }, [tasks, taskId]);

  const handleCompleteTask = () => {
    if (taskId) {
      completeTaskMutation.mutate(taskId);
    }
  };

  const handleDocumentUploaded = () => {
    refetchDocuments();
    setIsUploadDialogOpen(false);
  };

  // Format dates for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'غير محدد';
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  if (isLoadingTask) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!taskDetails && !isLoadingTask) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-center">لم يتم العثور على المهمة</DialogTitle>
            <DialogDescription className="text-center">
              المهمة المطلوبة غير موجودة أو تم حذفها.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-4">
            <Button onClick={onClose}>إغلاق</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{taskDetails?.name}</DialogTitle>
          <div className="flex items-center gap-2 mt-2">
            {taskDetails?.isCompleted ? (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                مكتملة
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                قيد التنفيذ
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {taskDetails?.description && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">الوصف:</h3>
              <p className="text-base">{taskDetails.description}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-2">
              <CalendarRange className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">تاريخ البداية:</p>
                <p>{formatDate(taskDetails?.startDate)}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CalendarRange className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">تاريخ النهاية المتوقع:</p>
                <p>{formatDate(taskDetails?.expectedEndDate)}</p>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">المستندات</h3>
              {!readOnly && !taskDetails?.isCompleted && (
                <Button 
                  onClick={() => setIsUploadDialogOpen(true)} 
                  variant="outline"
                  size="sm"
                >
                  رفع مستند
                </Button>
              )}
            </div>

            <TaskDocumentList 
              documents={taskDocuments || []} 
              isLoading={isLoadingDocuments}
              onDocumentUpdated={refetchDocuments}
              readOnly={readOnly || taskDetails?.isCompleted}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            إغلاق
          </Button>
          
          {!readOnly && !taskDetails?.isCompleted && (
            <Button 
              onClick={handleCompleteTask}
              disabled={completeTaskMutation.isPending}
            >
              {completeTaskMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جاري المعالجة...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  إكمال المهمة
                </>
              )}
            </Button>
          )}
        </DialogFooter>

        {/* Document Upload Dialog */}
        {!readOnly && !taskDetails?.isCompleted && taskDetails?.id && (
          <UploadDocumentDialog
            isOpen={isUploadDialogOpen}
            onClose={() => setIsUploadDialogOpen(false)}
            taskId={taskDetails.id}
            projectId={0} // Will be determined by the task's project
            onUploadSuccess={handleDocumentUploaded}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
