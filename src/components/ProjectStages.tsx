import React, { useState, useEffect } from 'react';
import { Project } from '@/services/projectService';
import { Worker, getAllWorkers } from '@/services/workerService';
import { ApiStage, getProjectStages, createStage, CreateStageRequest, updateStage, UpdateStageRequest, deleteStage } from '@/services/stageService';
import { ApiTask, getStageTasks, createTask, completeTask, uncheckTask, deleteTask } from '@/services/taskService';
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
import { EditTaskModal } from './EditTaskModal';
import TaskFormModal, { TaskFormData } from './TaskFormModal';
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
import { toast } from '@/components/ui/use-toast';
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
  const [noStagesFound, setNoStagesFound] = useState(false);
  const [isTaskFormModalOpen, setIsTaskFormModalOpen] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [selectedStageForTask, setSelectedStageForTask] = useState<number | null>(null);
  const [completingTaskId, setCompletingTaskId] = useState<number | null>(null);
  
  // New state for EditTaskModal
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [selectedTaskForEdit, setSelectedTaskForEdit] = useState<{ id: number; name: string; description: string } | null>(null);
  const [isDeletingTask, setIsDeletingTask] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [isDeleteTaskDialogOpen, setIsDeleteTaskDialogOpen] = useState(false);
  
  // Fetch workers and stages
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        setNoStagesFound(false);
        
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
          try {
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
                    const endDate = new Date(task.expectedEndDate);
                    
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
          } catch (err: any) {
            console.error('Error fetching stages:', err);
            // Check if it's a 404 error indicating no stages found
            if (err.message && err.message.includes('404')) {
              setNoStagesFound(true);
            } else {
              setError(err instanceof Error ? err.message : 'Failed to fetch stages');
            }
            setApiStages([]);
          }
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
  
  const toggleTaskCompletion = async (taskId: number) => {
    // Find the task to determine its current completion status
    let isAlreadyCompleted = false;
    let stageId = 0;
    
    // Find the task in the stages
    for (const stage of apiStages) {
      const task = stage.tasks.find(t => t.id === taskId);
      if (task) {
        isAlreadyCompleted = task.isCompleted;
        stageId = stage.id;
        break;
      }
    }
    
    // Set loading state for this specific task
    setCompletingTaskId(taskId);
    
    try {
      let result;
      
      if (isAlreadyCompleted) {
        // If already completed, uncheck it
        result = await uncheckTask(taskId);
        
        if (result.success) {
          // Update UI state to mark as not completed
          setCompletedTasks(prev => prev.filter(id => id !== taskId));
          
          toast({
            title: "Success",
            description: "Task completion has been successfully cancelled",
          });
          // Find and update the task in state
          const updatedStages = [...apiStages];
          for (let i = 0; i < updatedStages.length; i++) {
            const taskIndex = updatedStages[i].tasks.findIndex(t => t.id === taskId);
            if (taskIndex !== -1) {
              updatedStages[i].tasks[taskIndex] = {
                ...updatedStages[i].tasks[taskIndex],
                isCompleted: false,
                status: 'in-progress',
                progress: 0
              };
              
              // Update stage progress
              const completedTasksCount = updatedStages[i].tasks.filter(t => t.isCompleted).length;
              const totalTasks = updatedStages[i].tasks.length;
              const stageProgress = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;
              updatedStages[i].progress = stageProgress;
              
              break;
            }
          }
          setApiStages(updatedStages);
        } else {
          toast({
            title: "Error",
            description: result.message || "Failed to cancel task completion",
            variant: "destructive"
          });
        }
      } else {
        // If not completed, complete it
        result = await completeTask(taskId);
        
        if (result.success) {
          // Update UI state
          setCompletedTasks(prev => [...prev, taskId]);
          
          toast({
            title: "Success",
            description: "Task completion has been successfully completed",
          });
          
          // Find and update the task in state
          const updatedStages = [...apiStages];
          for (let i = 0; i < updatedStages.length; i++) {
            const taskIndex = updatedStages[i].tasks.findIndex(t => t.id === taskId);
            if (taskIndex !== -1) {
              updatedStages[i].tasks[taskIndex] = {
                ...updatedStages[i].tasks[taskIndex],
                isCompleted: true,
                status: 'completed',
                progress: 100
              };
              
              // Update stage progress
              const completedTasksCount = updatedStages[i].tasks.filter(t => t.isCompleted).length;
              const totalTasks = updatedStages[i].tasks.length;
              const stageProgress = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;
              updatedStages[i].progress = stageProgress;
              
              break;
            }
          }
          setApiStages(updatedStages);
        } else {
          toast({
            title: "Error",
            description: result.message || "Failed to complete task",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('Error toggling task completion:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to change task status",
        variant: "destructive"
      });
    } finally {
      // Clear loading state
      setCompletingTaskId(null);
    }
  };
  
  const handleAddStage = () => {
    setIsAddStageModalOpen(true);
  };
  
  const handleAddStageSubmit = async (formData: { name: string; description: string; startDate: string; endDate: string }) => {
    if (!project.id) {
      toast({
        title: "Error",
        description: "Project ID is missing",
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
          title: "Success",
          description: result.message || "Stage created successfully",
        });
        setIsAddStageModalOpen(false);
        setNoStagesFound(false); // Reset the no stages found state
        
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
          title: "Error",
          description: result.message || "Failed to create stage",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error creating stage:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create stage",
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
          title: "Success",
          description: result.message || "Stage updated successfully",
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
          title: "Error",
          description: result.message || "Failed to update stage",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error updating stage:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update stage",
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
          title: "Success",
          description: result.message || "Stage deleted successfully",
        });
        
        // Remove deleted stage from state
        const updatedStages = apiStages.filter(stage => stage.id !== stageToDelete);
        setApiStages(updatedStages);
        
        // If we deleted the last stage, set noStagesFound to true
        if (updatedStages.length === 0) {
          setNoStagesFound(true);
        }
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to delete stage",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error deleting stage:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete stage",
        variant: "destructive"
      });
    } finally {
      setIsDeletingStage(false);
      setIsDeleteDialogOpen(false);
      setStageToDelete(null);
    }
  };
  
  const handleAddTask = (stageId: number) => {
    setSelectedStageForTask(stageId);
    setIsTaskFormModalOpen(true);
  };
  
  const handleAddTaskSubmit = async (formData: TaskFormData) => {
    setIsCreatingTask(true);
    
    try {
      const result = await createTask({
        stageId: formData.stageId,
        name: formData.name,
        description: formData.description,
        startDate: formData.startDate,
        expectedEndDate: formData.endDate
      });
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Task added successfully",
        });
        setIsTaskFormModalOpen(false);
        
        // Refresh tasks for this stage
        if (project && project.id && formData.stageId) {
          // Find the stage that needs to be refreshed
          const updatedStages = [...apiStages];
          const stageIndex = updatedStages.findIndex(s => s.id === formData.stageId);
          
          if (stageIndex !== -1) {
            try {
              const refreshedTasks = await getStageTasks(formData.stageId);
              
              // Convert API tasks to UI tasks
              const uiTasks = refreshedTasks.map(task => {
                let status = 'not-started';
                if (task.isCompleted) {
                  status = 'completed';
                } else {
                  const now = new Date();
                  const startDate = new Date(task.startDate);
                  const endDate = new Date(task.expectedEndDate);
                  
                  if (now > endDate) {
                    status = 'delayed';
                  } else if (now >= startDate) {
                    status = 'in-progress';
                  }
                }
                
                // Update completedTasks state for newly added task
                if (task.isCompleted) {
                  setCompletedTasks(prev => 
                    prev.includes(task.id) ? prev : [...prev, task.id]
                  );
                }
                
                return {
                  ...task,
                  status,
                  progress: task.isCompleted ? 100 : 0,
                  assignedWorkers: []
                };
              });
              
              // Update the tasks for this stage
              updatedStages[stageIndex] = {
                ...updatedStages[stageIndex],
                tasks: uiTasks
              };
              
              setApiStages(updatedStages);
              
            } catch (err) {
              console.error(`Error refreshing tasks for stage ${formData.stageId}:`, err);
              toast({
                title: "Error",
                description: "Task added but failed to update the list",
                variant: "destructive"
              });
            }
          }
        }
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to add task",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add task",
        variant: "destructive"
      });
    } finally {
      setIsCreatingTask(false);
    }
  };
  
  const handleEditTask = (task: ApiTask) => {
    setSelectedTaskForEdit({
      id: task.id,
      name: task.name,
      description: task.description
    });
    setIsEditTaskModalOpen(true);
  };
  
  const handleTaskEdited = async () => {
    // Refresh tasks for the stage containing the edited task
    if (project && project.id) {
      try {
        // Refresh stages
        const stagesData = await getProjectStages(project.id);
        
        // Create enhanced stages array
        const enhancedStages: EnhancedStage[] = [];
        
        // Process each stage
        for (const stage of stagesData) {
          try {
            // Fetch tasks for this stage
            const stageTasks = await getStageTasks(stage.id);
            
            // Map API tasks to UI format
            const uiTasks: UITask[] = stageTasks.map(task => {
              let status = 'not-started';
              if (task.isCompleted) {
                status = 'completed';
              } else {
                const now = new Date();
                const startDate = new Date(task.startDate);
                const endDate = new Date(task.expectedEndDate);
                
                if (now > endDate) {
                  status = 'delayed';
                } else if (now >= startDate) {
                  status = 'in-progress';
                }
              }
              
              if (task.isCompleted) {
                setCompletedTasks(prev => 
                  prev.includes(task.id) ? prev : [...prev, task.id]
                );
              }
              
              return {
                ...task,
                status,
                progress: task.isCompleted ? 100 : 0,
                assignedWorkers: []
              };
            });
            
            enhancedStages.push({
              ...stage,
              tasks: uiTasks
            });
          } catch (err) {
            console.error(`Error fetching tasks for stage ${stage.id}:`, err);
            enhancedStages.push({
              ...stage,
              tasks: []
            });
          }
        }
        
        setApiStages(enhancedStages);
        
      } catch (err) {
        console.error('Error refreshing stages:', err);
        toast({
          title: "Error",
          description: "Failed to update data",
          variant: "destructive"
        });
      }
    }
  };
  
  const handleDeleteTaskConfirm = (taskId: number) => {
    setTaskToDelete(taskId);
    setIsDeleteTaskDialogOpen(true);
  };
  
  const handleDeleteTask = async () => {
    if (!taskToDelete) {
      setIsDeleteTaskDialogOpen(false);
      return;
    }
    
    setIsDeletingTask(true);
    
    try {
      const result = await deleteTask(taskToDelete);
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Task deleted successfully",
        });
        
        // Remove deleted task from state
        const updatedStages = [...apiStages].map(stage => ({
          ...stage,
          tasks: stage.tasks.filter(task => task.id !== taskToDelete)
        }));
        
        // Update stage progress for the affected stage
        const affectedStageIndex = updatedStages.findIndex(stage => 
          stage.tasks.length < apiStages[updatedStages.indexOf(stage)].tasks.length
        );
        
        if (affectedStageIndex !== -1) {
          const completedTasksCount = updatedStages[affectedStageIndex].tasks.filter(t => t.isCompleted).length;
          const totalTasks = updatedStages[affectedStageIndex].tasks.length;
          const stageProgress = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;
          updatedStages[affectedStageIndex].progress = stageProgress;
        }
        
        setApiStages(updatedStages);
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to delete task",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete task",
        variant: "destructive"
      });
    } finally {
      setIsDeletingTask(false);
      setIsDeleteTaskDialogOpen(false);
      setTaskToDelete(null);
    }
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
          <p className="mt-4 text-gray-500">Loading project stages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-md">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-700">Failed to load stages</h3>
          <p className="text-red-600 mt-2">{error}</p>
          <Button 
            variant="outline" 
            className="mt-4 border-red-300 text-red-700 hover:bg-red-50"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <SquareKanban className="h-7 w-7 text-indigo-600 mr-3" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Project Stages</h2>
            <p className="text-gray-500 mt-1">Manage and track all stages and tasks</p>
          </div>
        </div>
        <Button 
          onClick={handleAddStage} 
          className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white shadow-md transition-all duration-300"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Stage
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
      
      {/* Task Form Modal */}
      <TaskFormModal
        isOpen={isTaskFormModalOpen}
        onClose={() => setIsTaskFormModalOpen(false)}
        onSubmit={handleAddTaskSubmit}
        isLoading={isCreatingTask}
        stageId={selectedStageForTask || 0}
      />
      
      {/* Edit Task Modal */}
      {selectedTaskForEdit && (
        <EditTaskModal
          isOpen={isEditTaskModalOpen}
          onClose={() => setIsEditTaskModalOpen(false)}
          onTaskUpdated={handleTaskEdited}
          task={selectedTaskForEdit}
        />
      )}
      
      {/* Delete Stage Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Stage Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this stage? This action cannot be undone and will delete all associated tasks.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingStage}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteStage}
              disabled={isDeletingStage}
              className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
            >
              {isDeletingStage ? (
                <>
                  <span className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                <>Delete</>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Delete Task Confirmation Dialog */}
      <AlertDialog open={isDeleteTaskDialogOpen} onOpenChange={setIsDeleteTaskDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Task Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingTask}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteTask}
              disabled={isDeletingTask}
              className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
            >
              {isDeletingTask ? (
                <>
                  <span className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                <>Delete</>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* No Stages Found or Empty Stages Array */}
      {(noStagesFound || apiStages.length === 0) ? (
        <div className="flex flex-col items-center justify-center py-16 bg-slate-50 rounded-lg border border-dashed border-slate-200">
          <div className="p-3 rounded-full bg-slate-100">
            <Clock className="h-6 w-6 text-slate-400" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-slate-900">No Stages Found</h3>
          <p className="mt-1 text-sm text-slate-500 text-center max-w-sm">
            This project does not have any stages yet. Add your first stage to start tracking progress.
          </p>
          <Button onClick={handleAddStage} className="mt-6">
            <Plus className="mr-2 h-4 w-4" />
            Add First Stage
          </Button>
        </div>
      ) : (
        <div className="grid gap-6">
          {apiStages.map((stage) => {
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
                            Edit Stage
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleAddTask(stage.id); }}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Task
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600" 
                            onClick={(e) => { e.stopPropagation(); handleDeleteStageConfirm(stage.id); }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Stage
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
                            Add Task
                          </Button>
                        </div>
                        
                        {stage.tasks && stage.tasks.length > 0 ? (
                          <div className="space-y-4">
                            {stage.tasks.map((task) => {
                              const overdueDays = calculateOverdueDays(task.expectedEndDate);
                              const isCompleted = completedTasks.includes(task.id);
                              const isCompletingThisTask = completingTaskId === task.id;
                              const isDeletingThisTask = isDeletingTask && taskToDelete === task.id;
                              
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
                                       
                                        {overdueDays > 0 && !isCompleted && (
                                          <Badge variant="destructive" className="h-6 px-2 text-xs">
                                            Delayed {overdueDays} days
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                    
                                    <div className="mt-3 flex justify-between items-center">
                                      <div className="flex gap-6">
                                        <div className="flex items-center gap-1.5">
                                          <Calendar className="h-3.5 w-3.5 text-violet-400" />
                                          <span className="text-xs text-gray-500">
                                            {formatDate(task.startDate)} - {formatDate(task.expectedEndDate)}
                                          </span>
                                        </div>
                                      </div>
                                      
                                      <div className="flex items-center gap-2">
                                        <div className="relative">
                                          <Checkbox
                                            id={`task-${task.id}`}
                                            checked={isCompleted}
                                            onCheckedChange={() => toggleTaskCompletion(task.id)}
                                            disabled={isCompletingThisTask}
                                            className={cn(
                                              "h-5 w-5 rounded-md transition-all duration-200",
                                              isCompleted ? "bg-green-500 border-green-500 text-white" : "border-slate-300",
                                              "data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500",
                                              "focus:ring-2 focus:ring-green-200 focus:ring-offset-0"
                                            )}
                                          />
                                          {isCompletingThisTask && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-md">
                                              <div className="h-3 w-3 border-2 border-t-transparent border-violet-600 rounded-full animate-spin"></div>
                                            </div>
                                          )}
                                        </div>
                                        
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
                                          onClick={() => handleEditTask(task)}
                                          disabled={isDeletingThisTask}
                                        >
                                          <Edit className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button 
                                          variant="ghost" 
                                          size="icon" 
                                          className="h-7 w-7 text-red-500 hover:bg-red-50" 
                                          onClick={() => handleDeleteTaskConfirm(task.id)}
                                          disabled={isDeletingThisTask}
                                        >
                                          {isDeletingThisTask ? (
                                            <div className="h-3.5 w-3.5 border-2 border-t-transparent border-red-500 rounded-full animate-spin"></div>
                                          ) : (
                                            <Trash2 className="h-3.5 w-3.5" />
                                          )}
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
                              Add Task
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
