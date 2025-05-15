import React, { useState, useEffect } from 'react';
import { Project } from '@/services/projectService';
import { Worker, getAllWorkers } from '@/services/workerService';
import { ApiStage, getProjectStages, createStage, CreateStageRequest, updateStage, UpdateStageRequest, deleteStage } from '@/services/stageService';
import { ApiTask, getStageTasks } from '@/services/taskService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { WorkerMultiSelect } from './WorkerMultiSelect';
import StageFormModal from './StageFormModal';
import EditStageModal from './EditStageModal';
import TaskDetailsModal from './TaskDetailsModal';
import { 
  CircleDot, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Plus, 
  ChevronDown, 
  ChevronUp,
  MoreHorizontal,
  Edit,
  Trash2,
  PlayCircle,
  PauseCircle,
  User,
  Info,
  Calendar,
  CalendarClock,
  ListTodo,
  SquareKanban
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
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
}

// Format date function
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Add this function after the formatDate function
const calculateOverdueDays = (endDate: string) => {
  const today = new Date();
  const end = new Date(endDate);
  const diffTime = today.getTime() - end.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

// Interface for tasks with UI-specific properties
interface UITask extends ApiTask {
  status: string;
  progress: number;
  assignedWorkers: Worker[];
}

// Enhanced stage interface to include tasks
interface EnhancedStage extends ApiStage {
  tasks: UITask[];
}

const ProjectStages = ({ project }: { project: Project }) => {
  const [apiStages, setApiStages] = useState<EnhancedStage[]>([]);
  const [expandedStages, setExpandedStages] = useState<number[]>([]);
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddStageModalOpen, setIsAddStageModalOpen] = useState(false);
  const [isEditStageModalOpen, setIsEditStageModalOpen] = useState(false);
  const [isCreatingStage, setIsCreatingStage] = useState(false);
  const [isEditingStage, setIsEditingStage] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [selectedStage, setSelectedStage] = useState<ApiStage | null>(null);
  const [isTaskDetailsModalOpen, setIsTaskDetailsModalOpen] = useState(false);
  const [isDeletingStage, setIsDeletingStage] = useState(false);
  const [stageToDelete, setStageToDelete] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Fetch workers and stages
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch workers
        const workersData = await getAllWorkers();
        if (Array.isArray(workersData)) {
          setWorkers(workersData);
        } else {
          console.error('Invalid workers data:', workersData);
          setWorkers([]);
        }
        
        // Fetch stages
        if (project && project.id) {
          const stagesData = await getProjectStages(project.id);
          
          // Create enhanced stages array to store stages with their tasks
          const enhancedStages: EnhancedStage[] = [];
          
          // Process each stage
          for (const stage of stagesData) {
            try {
              // Fetch tasks for this stage
              const stageTasks = await getStageTasks(stage.id);
              
              // Map API tasks to UI format with status and other UI properties
              const uiTasks: UITask[] = stageTasks.map(task => {
                // Determine task status based on isCompleted and dates
                let status = 'not-started';
                if (task.isCompleted) {
                  status = 'completed';
                } else {
                  const now = new Date();
                  const startDate = new Date(task.startDate);
                  const endDate = new Date(task.endDate);
                  
                  if (now > endDate) {
                    status = 'delayed';
                  } else if (now >= startDate) {
                    status = 'in-progress';
                  }
                }
                
                // Set completedTasks state for checked tasks
                if (task.isCompleted) {
                  setCompletedTasks(prev => 
                    prev.includes(task.id) ? prev : [...prev, task.id]
                  );
                }
                
                return {
                  ...task,
                  status,
                  progress: task.isCompleted ? 100 : 0,
                  assignedWorkers: [] // Placeholder for assigned workers
                };
              });
              
              // Add enhanced stage to array
              enhancedStages.push({
                ...stage,
                tasks: uiTasks
              });
            } catch (err) {
              console.error(`Error fetching tasks for stage ${stage.id}:`, err);
              
              // Add stage with empty tasks list in case of error
              enhancedStages.push({
                ...stage,
                tasks: []
              });
            }
          }
          
          setApiStages(enhancedStages);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [project?.id]);
  
  const toggleStage = (stageId: number) => {
    setExpandedStages(prev => 
      prev.includes(stageId) 
        ? prev.filter(id => id !== stageId) 
        : [...prev, stageId]
    );
  };
  
  const toggleTaskCompletion = (taskId: number) => {
    setCompletedTasks(prev => 
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };
  
  const handleAddStage = () => {
    setIsAddStageModalOpen(true);
  };
  
  const handleAddStageSubmit = async (formData: { name: string; description: string; startDate: string; endDate: string }) => {
    if (!project.id) {
      toast({
        title: "خطأ",
        description: "رقم المشروع مفقود",
        variant: "destructive"
      });
      return;
    }
    
    setIsCreatingStage(true);
    
    try {
      const stageData: CreateStageRequest = {
        ...formData,
        projectId: Number(project.id)
      };
      
      const result = await createStage(stageData);
      
      if (result.success) {
        toast({
          title: "تم بنجاح",
          description: result.message || "تم إنشاء المرحلة بنجاح",
          variant: "success"
        });
        setIsAddStageModalOpen(false);
        
        // Refresh the stages list
        const stagesData = await getProjectStages(project.id);
        
        // Update state with new stages (simplified for brevity)
        const newStages = stagesData.map(stage => ({
          ...stage,
          tasks: []
        }));
        
        setApiStages(newStages);
      } else {
        toast({
          title: "خطأ",
          description: result.message || "فشل في إنشاء المرحلة",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error creating stage:', error);
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "فشل في إنشاء المرحلة",
        variant: "destructive"
      });
    } finally {
      setIsCreatingStage(false);
    }
  };
  
  const handleEditStage = (stage: ApiStage) => {
    setSelectedStage(stage);
    setIsEditStageModalOpen(true);
  };
  
  const handleEditStageSubmit = async (formData: UpdateStageRequest) => {
    setIsEditingStage(true);
    
    try {
      const result = await updateStage(formData);
      
      if (result.success) {
        toast({
          title: "تم بنجاح",
          description: result.message || "تم تحديث المرحلة بنجاح",
          variant: "success"
        });
        setIsEditStageModalOpen(false);
        
        // Refresh the stages list
        if (project && project.id) {
          const stagesData = await getProjectStages(project.id);
          
          // Update state with refreshed stages
          const updatedStages = stagesData.map(stage => {
            const existingStage = apiStages.find(s => s.id === stage.id);
            return {
              ...stage,
              tasks: existingStage?.tasks || []
            };
          });
          
          setApiStages(updatedStages);
        }
      } else {
        toast({
          title: "خطأ",
          description: result.message || "فشل في تحديث المرحلة",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error updating stage:', error);
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "فشل في تحديث المرحلة",
        variant: "destructive"
      });
    } finally {
      setIsEditingStage(false);
    }
  };
  
  const handleDeleteStageConfirm = (stageId: number) => {
    setStageToDelete(stageId);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteStage = async () => {
    if (!stageToDelete) {
      setIsDeleteDialogOpen(false);
      return;
    }
    
    setIsDeletingStage(true);
    
    try {
      const result = await deleteStage(stageToDelete);
      
      if (result.success) {
        toast({
          title: "تم بنجاح",
          description: result.message || "تم حذف المرحلة بنجاح",
          variant: "success"
        });
        
        // Remove deleted stage from state
        setApiStages(prev => prev.filter(stage => stage.id !== stageToDelete));
      } else {
        toast({
          title: "خطأ",
          description: result.message || "فشل في حذف المرحلة",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error deleting stage:', error);
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "فشل في حذف المرحلة",
        variant: "destructive"
      });
    } finally {
      setIsDeletingStage(false);
      setIsDeleteDialogOpen(false);
      setStageToDelete(null);
    }
  };
  
  const handleAddTask = (stageId: number) => {
    toast({
      title: "قريبًا",
      description: `سيتم تنفيذ إضافة مهمة للمرحلة ${stageId} قريبًا`,
      variant: "info"
    });
  };
  
  const handleEditTask = (taskId: number) => {
    toast({
      title: "قريبًا",
      description: `سيتم تنفيذ تعديل المهمة ${taskId} قريبًا`,
      variant: "info"
    });
  };
  
  const handleDeleteTask = (taskId: number) => {
    toast({
      title: "قريبًا",
      description: `سيتم تنفيذ حذف المهمة ${taskId} قريبًا`,
      variant: "info"
    });
  };
  
  const handleViewTaskDetails = (taskId: number) => {
    setSelectedTaskId(taskId);
    setIsTaskDetailsModalOpen(true);
  };

  const handleWorkerSelection = (taskId: number, selectedWorkers: Worker[]) => {
    // Update the task's assigned workers
    console.log('Updated worker assignments for task:', taskId, selectedWorkers);
    // TODO: Update the backend with the new worker assignments
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="flex flex-col items-center">
          <div className="h-8 w-8 border-4 border-t-primary animate-spin rounded-full"></div>
          <p className="mt-4 text-gray-500">جاري تحميل مراحل المشروع...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-md">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-700">فشل في تحميل المراحل</h3>
          <p className="text-red-600 mt-2">{error}</p>
          <Button 
            variant="outline" 
            className="mt-4 border-red-300 text-red-700 hover:bg-red-50"
            onClick={() => window.location.reload()}
          >
            إعادة المحاولة
          </Button>
        </div>
      </div>
    );
  }

  // Use the real API stages if they exist, otherwise use an empty array
  const projectStages = apiStages.length > 0 ? apiStages : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <SquareKanban className="h-7 w-7 text-indigo-600 mr-3" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">مراحل المشروع</h2>
            <p className="text-gray-500 mt-1">إدارة وتتبع جميع المراحل والمهام</p>
          </div>
        </div>
        <Button 
          onClick={handleAddStage} 
          className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white shadow-md transition-all duration-300"
        >
          <Plus className="mr-2 h-4 w-4" />
          إضافة مرحلة
        </Button>
      </div>
      
      {/* Stage Form Modal */}
      <StageFormModal 
        isOpen={isAddStageModalOpen} 
        onClose={() => setIsAddStageModalOpen(false)}
        onSubmit={handleAddStageSubmit}
        isLoading={isCreatingStage}
        projectId={Number(project.id)}
      />
      
      {/* Edit Stage Modal */}
      <EditStageModal 
        isOpen={isEditStageModalOpen}
        onClose={() => setIsEditStageModalOpen(false)}
        onSubmit={handleEditStageSubmit}
        isLoading={isEditingStage}
        stage={selectedStage}
      />
      
      {/* Task Details Modal */}
      <TaskDetailsModal
        isOpen={isTaskDetailsModalOpen}
        onClose={() => setIsTaskDetailsModalOpen(false)}
        taskId={selectedTaskId}
      />
      
      {/* Delete Stage Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد حذف المرحلة</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من أنك تريد حذف هذه المرحلة؟ هذا الإجراء لا يمكن التراجع عنه وسيؤدي إلى حذف جميع المهام المرتبطة بها.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingStage}>إلغاء</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteStage}
              disabled={isDeletingStage}
              className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
            >
              {isDeletingStage ? (
                <>
                  <span className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2" />
                  جاري الحذف...
                </>
              ) : (
                <>حذف</>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {projectStages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-slate-50 rounded-lg border border-dashed border-slate-200">
          <div className="p-3 rounded-full bg-slate-100">
            <Clock className="h-6 w-6 text-slate-400" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-slate-900">لا توجد مراحل</h3>
          <p className="mt-1 text-sm text-slate-500 text-center max-w-sm">
            هذا المشروع لا يحتوي على أي مراحل بعد. أضف أول مرحلة لبدء تتبع التقدم.
          </p>
          <Button onClick={handleAddStage} className="mt-6">
            <Plus className="mr-2 h-4 w-4" />
            إضافة أول مرحلة
          </Button>
        </div>
      ) : (
        <div className="grid gap-6">
          {projectStages.map((stage) => {
            const isExpanded = expandedStages.includes(stage.id);
            
            return (
              <Card 
                key={stage.id} 
                className={cn(
                  "shadow-lg border-0 overflow-hidden transition-all duration-300 bg-gradient-to-br from-slate-50 to-white",
                  isExpanded && "ring-1 ring-indigo-200"
                )}
              >
                <div 
                  className={cn(
                    "flex flex-col md:flex-row md:items-center justify-between px-5 py-4 cursor-pointer transition-colors",
                    isExpanded ? "bg-indigo-50/50 border-b border-indigo-100" : "hover:bg-indigo-50/30"
                  )}
                  onClick={() => toggleStage(stage.id)}
                >
                  <div className="flex items-center gap-3 mb-2 md:mb-0">
                    <div className="p-2 rounded-lg bg-indigo-100">
                      <SquareKanban className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base">{stage.name}</h3>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 md:gap-6">
                    <div className="flex flex-1 items-center gap-2 md:w-48">
                      <div className="h-2.5 flex-1 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                        <div 
                          className={cn(
                            "h-full transition-all duration-300 ease-out",
                            stage.progress === 100 ? "bg-gradient-to-r from-emerald-400 to-emerald-500" : 
                            stage.progress > 50 ? "bg-gradient-to-r from-blue-400 to-blue-500" : 
                            stage.progress > 0 ? "bg-gradient-to-r from-amber-400 to-amber-500" : "bg-gray-300"
                          )}
                          style={{ width: `${stage.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium w-10 text-right">{stage.progress}%</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-slate-500" onClick={(e) => e.stopPropagation()}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditStage(stage); }}>
                            <Edit className="mr-2 h-4 w-4" />
                            تعديل مرحلة
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleAddTask(stage.id); }}>
                            <Plus className="mr-2 h-4 w-4" />
                            إضافة مهمة
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600" 
                            onClick={(e) => { e.stopPropagation(); handleDeleteStageConfirm(stage.id); }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            حذف مرحلة
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-slate-500"
                        onClick={(e) => { e.stopPropagation(); toggleStage(stage.id); }}
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="p-5 bg-white">
                    <div className="py-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-50 rounded-full">
                            <Calendar className="h-3.5 w-3.5 text-emerald-500" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Start Date</p>
                            <p className="text-sm font-medium">{formatDate(stage.startDate)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-amber-50 rounded-full">
                            <CalendarClock className="h-3.5 w-3.5 text-amber-500" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Expected Date</p>
                            <p className="text-sm font-medium">
                              {stage.expectedEndDate ? formatDate(stage.expectedEndDate) : 
                               stage.endDate ? formatDate(stage.endDate) : 'Not set'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {stage.description && (
                        <div className="mb-6 p-4 bg-white border border-slate-100 rounded-lg">
                          <p className="text-sm font-medium text-gray-700 mb-1">Description</p>
                          <p className="text-sm text-gray-600">{stage.description}</p>
                        </div>
                      )}
                      
                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-gray-900 flex items-center">
                            <ListTodo className="h-5 w-5 text-violet-600 mr-2" />
                            Tasks
                            <Badge className="ml-2 h-5 px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 font-medium">
                              {stage.tasks ? stage.tasks.length : 0}
                            </Badge>
                          </h4>
                          <Button size="sm" onClick={(e) => { e.stopPropagation(); handleAddTask(stage.id); }}
                            className="bg-violet-100 text-violet-700 hover:bg-violet-200 hover:text-violet-800">
                            <Plus className="mr-1 h-3.5 w-3.5" />
                            إضافة مهمة
                          </Button>
                        </div>
                        
                        {stage.tasks && stage.tasks.length > 0 ? (
                          <div className="space-y-4">
                            {stage.tasks.map((task) => {
                              const overdueDays = calculateOverdueDays(task.endDate);
                              const isCompleted = completedTasks.includes(task.id);
                              
                              return (
                                <Card key={task.id} className={cn(
                                  "border rounded-lg overflow-hidden transition-all hover:shadow-md",
                                  isCompleted ? "bg-slate-50/70 border-slate-200" : "bg-gradient-to-r from-white to-slate-50/50 border-slate-200"
                                )}>
                                  <div className="p-4">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                      <div className="flex items-start gap-3">
                                        <div className="p-1.5 rounded-md bg-violet-50">
                                          <ListTodo className="h-3.5 w-3.5 text-violet-500" />
                                        </div>
                                        <div>
                                          <div className="flex items-center">
                                            <p className={cn(
                                              "font-medium",
                                              isCompleted && "line-through text-gray-500"
                                            )}>{task.name}</p>
                                          </div>
                                          <p className="text-xs text-gray-500 mt-0.5">{task.description || 'No description'}</p>
                                        </div>
                                      </div>
                                      
                                      <div className="flex items-center gap-3 w-full md:w-auto">
                                        {!loading && workers.length > 0 && (
                                          <WorkerMultiSelect
                                            workers={workers}
                                            selectedWorkers={task.assignedWorkers || []}
                                            onSelectionChange={(selectedWorkers) => handleWorkerSelection(task.id, selectedWorkers)}
                                            placeholder="Assign workers..."
                                            className="w-64"
                                          />
                                        )}
                                        
                                        {overdueDays > 0 && !isCompleted && (
                                          <Badge variant="destructive" className="h-6 px-2 text-xs">
                                            متأخر {overdueDays} يوم
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                    
                                    <div className="mt-3 flex justify-between items-center">
                                      <div className="flex gap-6">
                                        <div className="flex items-center gap-1.5">
                                          <Calendar className="h-3.5 w-3.5 text-violet-400" />
                                          <span className="text-xs text-gray-500">
                                            {formatDate(task.startDate)} - {formatDate(task.endDate)}
                                          </span>
                                        </div>
                                      </div>
                                      
                                      <div className="flex items-center gap-2">
                                        <Checkbox
                                          id={`task-${task.id}`}
                                          checked={isCompleted}
                                          onCheckedChange={() => toggleTaskCompletion(task.id)}
                                          className="h-4 w-4 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600"
                                        />
                                        
                                        <Button 
                                          variant="ghost" 
                                          size="icon" 
                                          className="h-7 w-7 text-slate-500 hover:bg-violet-50 hover:text-violet-700" 
                                          onClick={() => handleViewTaskDetails(task.id)}
                                        >
                                          <Info className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button 
                                          variant="ghost" 
                                          size="icon" 
                                          className="h-7 w-7 text-slate-500 hover:bg-violet-50 hover:text-violet-700" 
                                          onClick={() => handleEditTask(task.id)}
                                        >
                                          <Edit className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button 
                                          variant="ghost" 
                                          size="icon" 
                                          className="h-7 w-7 text-red-500 hover:bg-red-50" 
                                          onClick={() => handleDeleteTask(task.id)}
                                        >
                                          <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </Card>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                            <p className="text-sm text-slate-500">No tasks for this stage yet.</p>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mt-2" 
                              onClick={(e) => { e.stopPropagation(); handleAddTask(stage.id); }}
                            >
                              <Plus className="mr-1 h-3.5 w-3.5" />
                              إضافة مهمة
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProjectStages;
