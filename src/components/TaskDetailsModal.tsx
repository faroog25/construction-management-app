
import React, { useState, useEffect } from 'react';
import { getTaskById, TaskDetailResponse, completeTask, uncheckTask, getWorkersForTask, WorkerAssignment } from '@/services/taskService';
import { toast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TaskAssignWorkers } from './TaskAssignWorkers';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, CalendarClock, ListTodo, Users, CheckCircle, AlertCircle, X, Pencil, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { EditTaskModal } from './EditTaskModal';
import { Worker } from '@/services/workerService';
import { Document } from '@/types/document';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getDocumentsByTask } from '@/services/documentService';

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: number | null;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export default function TaskDetailsModal({ isOpen, onClose, taskId }: TaskDetailsModalProps) {
  const [taskData, setTaskData] = useState<TaskDetailResponse | null>(null);
  const [assignedWorkers, setAssignedWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [loadingWorkers, setLoadingWorkers] = useState(false);
  const [taskDocuments, setTaskDocuments] = useState<Document[]>([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);

  const fetchTaskDetails = async () => {
    if (!taskId) return;
    
    try {
      setLoading(true);
      const data = await getTaskById(taskId);
      setTaskData(data);
      
      // Fetch assigned workers separately using the new API endpoint
      await fetchAssignedWorkers(taskId);
      await fetchTaskDocuments(taskId);
    } catch (error) {
      console.error('Error fetching task details:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل تفاصيل المهمة",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const fetchAssignedWorkers = async (taskId: number) => {
    try {
      setLoadingWorkers(true);
      const workers = await getWorkersForTask(taskId);
      setAssignedWorkers(workers);
    } catch (error) {
      console.error('Error fetching assigned workers:', error);
      setAssignedWorkers([]);
    } finally {
      setLoadingWorkers(false);
    }
  };

  const fetchTaskDocuments = async (taskId: number) => {
    try {
      setLoadingDocuments(true);
      const documents = await getDocumentsByTask(taskId);
      setTaskDocuments(documents);
    } catch (error) {
      console.error('Error fetching task documents:', error);
      setTaskDocuments([]);
    } finally {
      setLoadingDocuments(false);
    }
  };

  useEffect(() => {
    if (isOpen && taskId) {
      fetchTaskDetails();
    }
  }, [isOpen, taskId]);

  // Handler when workers are successfully assigned
  const handleWorkersAssigned = () => {
    if (taskId) {
      fetchAssignedWorkers(taskId);
    }
  };

  // Handler when task is successfully edited
  const handleTaskUpdated = () => {
    fetchTaskDetails();
  };

  // Handle task completion or unchecking
  const handleToggleTaskCompletion = async () => {
    if (!taskId || !taskData) return;
    
    setIsCompleting(true);
    
    try {
      // Determine if we need to complete or uncheck the task
      const isTaskCompleted = taskData.data.isCompleted;
      
      let result;
      if (isTaskCompleted) {
        // Task is already completed, uncheck it
        result = await uncheckTask(taskId);
      } else {
        // Task is not completed, complete it
        result = await completeTask(taskId);
      }
      
      if (result.success) {
        toast({
          title: "تم بنجاح",
          description: isTaskCompleted ? "تم إلغاء اكتمال المهمة بنجاح" : "تم إكمال المهمة بنجاح"
        });
        
        // Update the local state to show the task as completed/uncompleted
        setTaskData(prev => {
          if (!prev) return null;
          return {
            ...prev,
            data: {
              ...prev.data,
              isCompleted: !isTaskCompleted
            }
          };
        });
      } else {
        toast({
          title: "خطأ",
          description: result.message || (isTaskCompleted ? "فشل في إلغاء اكتمال المهمة" : "فشل في إكمال المهمة"),
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error toggling task completion:', error);
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "فشل في تغيير حالة المهمة",
        variant: "destructive"
      });
    } finally {
      setIsCompleting(false);
    }
  };

  if (!taskId) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold">تفاصيل المهمة</DialogTitle>
              <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <DialogDescription className="text-base">
              عرض تفاصيل المهمة، العمال والمستندات
            </DialogDescription>
          </DialogHeader>

          {loading ? (
            <div className="py-8 flex justify-center items-center">
              <div className="h-8 w-8 border-4 border-t-primary animate-spin rounded-full"></div>
            </div>
          ) : taskData?.data ? (
            <Tabs defaultValue="details" className="w-full mt-4">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="details" className="text-sm">تفاصيل المهمة</TabsTrigger>
                <TabsTrigger value="workers" className="text-sm">العمال</TabsTrigger>
                <TabsTrigger value="documents" className="text-sm">المستندات</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-6">
                <Card className="overflow-hidden border shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-semibold">{taskData.data.name}</h3>
                          <Badge variant={taskData.data.isCompleted ? "success" : "warning"}>
                            {taskData.data.isCompleted ? "مكتملة" : "جارية"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {taskData.data.description || 'لا يوجد وصف لهذه المهمة'}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setEditModalOpen(true)}
                          className="h-9 flex items-center gap-1"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          تعديل
                        </Button>

                        <div className="relative">
                          <Checkbox
                            id="complete-task"
                            checked={taskData.data.isCompleted}
                            onCheckedChange={handleToggleTaskCompletion}
                            disabled={isCompleting}
                            className={cn(
                              "h-6 w-6 rounded-md transition-all duration-200 border-2",
                              "data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500",
                              "focus-visible:ring-2 focus-visible:ring-green-200"
                            )}
                          />
                          {isCompleting && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-md">
                              <div className="h-4 w-4 border-2 border-t-transparent border-green-600 rounded-full animate-spin"></div>
                            </div>
                          )}
                        </div>
                        <span className="text-sm text-green-600 font-medium">
                          {taskData.data.isCompleted ? "إلغاء الاكتمال" : "إكمال المهمة"}
                        </span>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-medium text-sm text-muted-foreground">معلومات المهمة</h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                            <Calendar className="h-5 w-5 text-primary" />
                            <div>
                              <p className="text-xs text-muted-foreground">تاريخ البدء</p>
                              <p className="text-sm font-medium">{formatDate(taskData.data.startDate)}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                            <CalendarClock className="h-5 w-5 text-primary" />
                            <div>
                              <p className="text-xs text-muted-foreground">تاريخ الانتهاء المتوقع</p>
                              <p className="text-sm font-medium">{formatDate(taskData.data.endDate || taskData.data.expectedEndDate || '')}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-medium text-sm text-muted-foreground">العمال المعينون</h4>
                        {loadingWorkers ? (
                          <div className="flex justify-center py-6">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                          </div>
                        ) : assignedWorkers && assignedWorkers.length > 0 ? (
                          <div className="p-3 bg-muted/30 rounded-lg">
                            <div className="flex flex-col gap-2">
                              {assignedWorkers.map((worker) => (
                                <div key={worker.id} className="flex items-center justify-between bg-background p-2 rounded-md">
                                  <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                                      <Users className="h-4 w-4 text-primary" />
                                    </div>
                                    <span className="text-sm font-medium">{worker.fullName}</span>
                                  </div>
                                  {worker.specialty && (
                                    <Badge variant="outline" className="text-xs">
                                      {worker.specialty}
                                    </Badge>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 bg-muted/30 rounded-lg text-center">
                            <p className="text-sm text-muted-foreground">لم يتم تعيين أي عمال لهذه المهمة</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="workers">
                <Card>
                  <CardContent className="pt-6">
                    <h4 className="text-lg font-medium mb-4 flex items-center">
                      <Users className="mr-2 h-5 w-5" /> تعيين العمال للمهمة
                    </h4>
                    <p className="text-sm text-muted-foreground mb-6">اختر العمال الذين سيعملون على هذه المهمة</p>
                    <TaskAssignWorkers 
                      taskId={taskId} 
                      onWorkersAssigned={handleWorkersAssigned} 
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="documents">
                <Card>
                  <CardContent className="pt-6">
                    <h4 className="text-lg font-medium mb-4 flex items-center">
                      <FileText className="mr-2 h-5 w-5" /> مستندات المهمة
                    </h4>
                    {loadingDocuments ? (
                      <div className="flex justify-center py-10">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : taskDocuments.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {taskDocuments.map((document) => (
                          <div 
                            key={document.id} 
                            className="border rounded-lg p-4 hover:border-primary/50 hover:bg-muted/30 transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 bg-primary/10 rounded-md flex items-center justify-center">
                                <FileText className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5 className="font-medium text-sm truncate">{document.name}</h5>
                                <p className="text-xs text-muted-foreground truncate">
                                  {document.description || 'لا يوجد وصف'}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {new Date(document.createdDate).toLocaleDateString('ar-SA')}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-10 text-center bg-muted/30 rounded-lg border border-dashed">
                        <FileText className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
                        <p className="text-muted-foreground">لا توجد مستندات مرتبطة بهذه المهمة</p>
                        <p className="text-xs text-muted-foreground mt-1">يمكنك إضافة مستندات للمهمة من صفحة المستندات</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="py-8 text-center">
              <p className="text-gray-500">لا توجد بيانات متاحة</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {taskData && (
        <EditTaskModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onTaskUpdated={handleTaskUpdated}
          task={{
            id: taskData.data.id,
            name: taskData.data.name,
            description: taskData.data.description || '',
          }}
        />
      )}
    </>
  );
}
