
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Loader2, PlusCircle, MoreHorizontal, ChevronRight, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { Project } from '@/services/projectService';
import { ApiStage, getStages, createStage, updateStage, deleteStage } from '@/services/stageService';
import { ApiTask, getTasks, createTask, updateTask, completeTask, deleteTask } from '@/services/taskService';
import { StageFormModal } from './StageFormModal';
import { TaskFormModal } from './TaskFormModal';
import { TaskDetailsModal } from './TaskDetailsModal';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import EditStageModal from './EditStageModal';
import { EditTaskModal } from './EditTaskModal';
import { TaskAssignWorkers } from './TaskAssignWorkers';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

interface ProjectStagesProps {
  project: Project;
  readOnly?: boolean;
}

const ProjectStages = ({ project, readOnly = false }: ProjectStagesProps) => {
  const [selectedStageId, setSelectedStageId] = useState<number | null>(null);
  const [isStageFormOpen, setIsStageFormOpen] = useState(false);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [isTaskDetailsOpen, setIsTaskDetailsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editStageOpen, setEditStageOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState<ApiStage | null>(null);
  const [editTaskOpen, setEditTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ApiTask | null>(null);
  const [isAssignWorkersOpen, setIsAssignWorkersOpen] = useState(false);
  const [deleteStageConfirmOpen, setDeleteStageConfirmOpen] = useState(false);
  const [deleteTaskConfirmOpen, setDeleteTaskConfirmOpen] = useState(false);
  const [expandedStageIds, setExpandedStageIds] = useState<Set<number>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

  const queryClient = useQueryClient();

  // Use React Query to fetch stages
  const {
    data: stages,
    isLoading: isLoadingStages,
    refetch: refetchStages
  } = useQuery({
    queryKey: ['stages', project.id],
    queryFn: () => getStages(project.id),
  });

  // Use React Query to fetch tasks
  const {
    data: tasks,
    isLoading: isLoadingTasks,
    refetch: refetchTasks
  } = useQuery({
    queryKey: ['tasks', project.id],
    queryFn: () => getTasks(project.id),
  });

  // Expand the first stage by default when stages are loaded
  useEffect(() => {
    if (stages && stages.length > 0 && expandedStageIds.size === 0) {
      setExpandedStageIds(new Set([stages[0].id]));
    }
  }, [stages]);

  // Toggle stage expansion
  const toggleStageExpansion = (stageId: number) => {
    const newExpanded = new Set(expandedStageIds);
    if (newExpanded.has(stageId)) {
      newExpanded.delete(stageId);
    } else {
      newExpanded.add(stageId);
    }
    setExpandedStageIds(newExpanded);
  };

  // Filter tasks by search query
  const getFilteredTasks = (stageId: number) => {
    if (!tasks) return [];
    
    return tasks
      .filter(task => task.stageId === stageId)
      .filter(task => 
        searchQuery === '' || 
        task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
  };

  // Handle stage creation
  const handleCreateStage = async (stageName: string, description: string) => {
    try {
      await createStage({
        name: stageName,
        description,
        projectId: project.id
      });
      
      toast.success('تم إنشاء المرحلة بنجاح');
      refetchStages();
      setIsStageFormOpen(false);
    } catch (error) {
      toast.error('حدث خطأ أثناء إنشاء المرحلة');
    }
  };

  // Handle task creation
  const handleCreateTask = async (data: any) => {
    try {
      if (!selectedStageId) return;
      
      await createTask({
        name: data.name,
        description: data.description,
        stageId: selectedStageId,
      });
      
      toast.success('تم إنشاء المهمة بنجاح');
      refetchTasks();
      setIsTaskFormOpen(false);
    } catch (error) {
      toast.error('حدث خطأ أثناء إنشاء المهمة');
    }
  };

  // Handle stage edit
  const handleEditStage = async (data: any) => {
    try {
      await updateStage(data);
      toast.success('تم تحديث المرحلة بنجاح');
      refetchStages();
      setEditStageOpen(false);
    } catch (error) {
      toast.error('حدث خطأ أثناء تحديث المرحلة');
    }
  };

  // Handle stage deletion
  const handleDeleteStage = async () => {
    if (!selectedStage) return;
    
    setIsDeleting(true);
    try {
      await deleteStage(selectedStage.id);
      toast.success('تم حذف المرحلة بنجاح');
      refetchStages();
      setDeleteStageConfirmOpen(false);
    } catch (error) {
      toast.error('حدث خطأ أثناء حذف المرحلة');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle task deletion
  const handleDeleteTask = async () => {
    if (!selectedTask) return;
    
    setIsDeleting(true);
    try {
      await deleteTask(selectedTask.id);
      toast.success('تم حذف المهمة بنجاح');
      refetchTasks();
      setDeleteTaskConfirmOpen(false);
    } catch (error) {
      toast.error('حدث خطأ أثناء حذف المهمة');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle task completion
  const handleCompleteTask = async (taskId: number) => {
    try {
      await completeTask(taskId);
      toast.success('تم إكمال المهمة بنجاح');
      refetchTasks();
    } catch (error) {
      toast.error('حدث خطأ أثناء إكمال المهمة');
    }
  };

  // Add task to stage
  const handleAddTask = (stageId: number) => {
    setSelectedStageId(stageId);
    setIsTaskFormOpen(true);
  };

  // View task details
  const handleViewTask = (taskId: number) => {
    setSelectedTaskId(taskId);
    setIsTaskDetailsOpen(true);
  };

  // Edit stage
  const handleOpenEditStage = (stage: ApiStage) => {
    setSelectedStage(stage);
    setEditStageOpen(true);
  };

  // Edit task
  const handleOpenEditTask = (task: ApiTask) => {
    setSelectedTask(task);
    setEditTaskOpen(true);
  };

  // Open confirm dialog for stage deletion
  const handleConfirmDeleteStage = (stage: ApiStage) => {
    setSelectedStage(stage);
    setDeleteStageConfirmOpen(true);
  };

  // Open confirm dialog for task deletion
  const handleConfirmDeleteTask = (task: ApiTask) => {
    setSelectedTask(task);
    setDeleteTaskConfirmOpen(true);
  };

  // Assign workers to task
  const handleAssignWorkers = (task: ApiTask) => {
    setSelectedTask(task);
    setIsAssignWorkersOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>مراحل المشروع</CardTitle>
        <div className="flex space-x-2 rtl:space-x-reverse">
          <div className="relative w-[200px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="بحث في المهام..."
              className="w-[200px] pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {!readOnly && (
            <Button
              variant="default"
              size="sm"
              className="gap-1"
              onClick={() => setIsStageFormOpen(true)}
            >
              <Plus className="h-4 w-4" />
              <span>إضافة مرحلة</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoadingStages || isLoadingTasks ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !stages || stages.length === 0 ? (
          <div className="text-center py-12 border rounded-lg">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <PlusCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-medium">لا توجد مراحل</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
              {readOnly 
                ? 'لا توجد مراحل مضافة لهذا المشروع بعد.'
                : 'قم بإضافة مراحل جديدة للمشروع لتنظيم المهام وتتبع التقدم.'}
            </p>
            {!readOnly && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setIsStageFormOpen(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                إضافة مرحلة جديدة
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {stages.map((stage) => (
              <Collapsible
                key={stage.id}
                open={expandedStageIds.has(stage.id)}
                onOpenChange={() => toggleStageExpansion(stage.id)}
                className="border rounded-md overflow-hidden"
              >
                <div className="bg-muted/30 p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="p-1">
                        {expandedStageIds.has(stage.id) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <div>
                      <h3 className="text-lg font-medium">{stage.name}</h3>
                      {stage.description && (
                        <p className="text-sm text-muted-foreground">{stage.description}</p>
                      )}
                    </div>
                  </div>
                  
                  {!readOnly && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>خيارات المرحلة</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleOpenEditStage(stage)}>
                          تعديل المرحلة
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAddTask(stage.id)}>
                          إضافة مهمة
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleConfirmDeleteStage(stage)}
                          className="text-red-500 focus:text-red-500"
                        >
                          حذف المرحلة
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
                
                <CollapsibleContent>
                  <div className="p-4 space-y-2">
                    {/* Tasks in this stage */}
                    {getFilteredTasks(stage.id).length === 0 ? (
                      <div className="text-center py-4 text-sm text-muted-foreground">
                        لا توجد مهام في هذه المرحلة
                        {!searchQuery ? "" : " تطابق البحث"}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {getFilteredTasks(stage.id).map((task) => (
                          <div
                            key={task.id}
                            className={`p-3 border rounded-md flex items-center justify-between ${
                              task.isCompleted ? "bg-green-50" : "hover:bg-muted/50"
                            } transition-colors`}
                            onClick={() => handleViewTask(task.id)}
                          >
                            <div className="flex-1 cursor-pointer">
                              <div className="flex items-center">
                                <span className={`font-medium ${task.isCompleted ? "line-through text-muted-foreground" : ""}`}>
                                  {task.name}
                                </span>
                                {task.isCompleted && (
                                  <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                    مكتملة
                                  </span>
                                )}
                              </div>
                              {task.description && (
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                                  {task.description}
                                </p>
                              )}
                            </div>
                            
                            <div className="flex space-x-2 rtl:space-x-reverse">
                              {!readOnly && !task.isCompleted && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-1 h-8"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCompleteTask(task.id);
                                  }}
                                >
                                  إكمال
                                </Button>
                              )}
                              
                              {!readOnly && (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>خيارات المهمة</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenEditTask(task);
                                      }}
                                    >
                                      تعديل المهمة
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleAssignWorkers(task);
                                      }}
                                    >
                                      تعيين عمال
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleConfirmDeleteTask(task);
                                      }}
                                      className="text-red-500 focus:text-red-500"
                                    >
                                      حذف المهمة
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Add Task Button */}
                    {!readOnly && (
                      <div className="mt-4">
                        <Button
                          variant="outline"
                          className="w-full text-muted-foreground border-dashed"
                          onClick={() => handleAddTask(stage.id)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          إضافة مهمة
                        </Button>
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        )}
      </CardContent>

      {/* Stage Form Modal */}
      {!readOnly && (
        <StageFormModal
          isOpen={isStageFormOpen}
          onClose={() => setIsStageFormOpen(false)}
          onSubmit={handleCreateStage}
        />
      )}

      {/* Task Form Modal */}
      {!readOnly && (
        <TaskFormModal
          isOpen={isTaskFormOpen}
          onClose={() => setIsTaskFormOpen(false)}
          onSubmit={handleCreateTask}
        />
      )}

      {/* Task Details Modal */}
      <TaskDetailsModal
        isOpen={isTaskDetailsOpen}
        onClose={() => setIsTaskDetailsOpen(false)}
        taskId={selectedTaskId}
        readOnly={readOnly}
      />

      {/* Edit Stage Modal */}
      {!readOnly && (
        <EditStageModal
          isOpen={editStageOpen}
          onClose={() => setEditStageOpen(false)}
          onSubmit={handleEditStage}
          isLoading={false}
          stage={selectedStage}
        />
      )}

      {/* Edit Task Modal */}
      {!readOnly && (
        <EditTaskModal
          isOpen={editTaskOpen}
          onClose={() => setEditTaskOpen(false)}
          onTaskUpdated={() => {
            refetchTasks();
            setEditTaskOpen(false);
          }}
          task={selectedTask ? {
            id: selectedTask.id,
            name: selectedTask.name,
            description: selectedTask.description || ''
          } : { id: 0, name: '', description: '' }}
        />
      )}

      {/* Assign Workers Modal */}
      {!readOnly && (
        <TaskAssignWorkers
          isOpen={isAssignWorkersOpen}
          onClose={() => setIsAssignWorkersOpen(false)}
          taskId={selectedTask?.id || 0}
        />
      )}

      {/* Delete Stage Confirmation */}
      {!readOnly && (
        <AlertDialog open={deleteStageConfirmOpen} onOpenChange={setDeleteStageConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>هل أنت متأكد من حذف هذه المرحلة؟</AlertDialogTitle>
              <AlertDialogDescription>
                سيؤدي حذف هذه المرحلة إلى حذف جميع المهام المرتبطة بها. هذا الإجراء لا يمكن التراجع عنه.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>إلغاء</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteStage}
                className="bg-red-500 hover:bg-red-600"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    جارٍ الحذف...
                  </>
                ) : (
                  'تأكيد الحذف'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Delete Task Confirmation */}
      {!readOnly && (
        <AlertDialog open={deleteTaskConfirmOpen} onOpenChange={setDeleteTaskConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>هل أنت متأكد من حذف هذه المهمة؟</AlertDialogTitle>
              <AlertDialogDescription>
                هذا الإجراء لا يمكن التراجع عنه.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>إلغاء</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteTask}
                className="bg-red-500 hover:bg-red-600"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    جارٍ الحذف...
                  </>
                ) : (
                  'تأكيد الحذف'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </Card>
  );
};

export default ProjectStages;
