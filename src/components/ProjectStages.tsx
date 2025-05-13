
import React, { useState, useEffect } from 'react';
import { Project } from '@/services/projectService';
import { Worker, getAllWorkers } from '@/services/workerService';
import { ApiStage, getProjectStages } from '@/services/stageService';
import { ApiTask, getStageTasks } from '@/services/taskService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { WorkerMultiSelect } from './WorkerMultiSelect';
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
  CalendarClock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface ProjectStagesProps {
  project: Project;
}

// Status configuration
const statusConfig = {
  'completed': { label: 'Completed', className: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
  'in-progress': { label: 'In Progress', className: 'bg-blue-100 text-blue-800 border-blue-200', icon: PlayCircle },
  'delayed': { label: 'Delayed', className: 'bg-red-100 text-red-800 border-red-200', icon: AlertCircle },
  'not-started': { label: 'Not Started', className: 'bg-gray-100 text-gray-800 border-gray-200', icon: Clock },
  'paused': { label: 'Paused', className: 'bg-amber-100 text-amber-800 border-amber-200', icon: PauseCircle },
};

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
  assignee?: string;
  nameAr?: string;
  assignedWorkers: Worker[];
}

// Enhanced stage interface to include progress and status
interface EnhancedStage extends ApiStage {
  progress: number;
  status: string;
  nameAr?: string;
  assignee?: string;
  tasks: UITask[];
}

const ProjectStages = ({ project }: ProjectStagesProps) => {
  const [apiStages, setApiStages] = useState<EnhancedStage[]>([]);
  const [expandedStages, setExpandedStages] = useState<number[]>([]);
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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
              
              // Calculate stage progress based on task completion
              const stageProgress = stageTasks.length > 0
                ? Math.round((stageTasks.filter(task => task.isCompleted).length / stageTasks.length) * 100)
                : 0;
              
              // Determine status based on progress
              let stageStatus = 'not-started';
              if (stageProgress === 100) {
                stageStatus = 'completed';
              } else if (stageProgress > 0) {
                stageStatus = 'in-progress';
              }
              
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
                  assignee: "Assigned Worker", // Placeholder assignee
                  nameAr: `${task.name} (Arabic)`, // Placeholder for Arabic name
                  assignedWorkers: [] // Placeholder for assigned workers
                };
              });
              
              // Add enhanced stage to array
              enhancedStages.push({
                ...stage,
                progress: stageProgress,
                status: stageStatus,
                nameAr: `${stage.name} (Arabic)`, // Placeholder for Arabic name
                assignee: "Project Manager", // Placeholder assignee
                tasks: uiTasks
              });
            } catch (err) {
              console.error(`Error fetching tasks for stage ${stage.id}:`, err);
              
              // Add stage with empty tasks list in case of error
              enhancedStages.push({
                ...stage,
                progress: 0,
                status: 'not-started',
                nameAr: `${stage.name} (Arabic)`,
                assignee: "Project Manager",
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
    toast.info('Add stage functionality will be implemented soon');
  };
  
  const handleAddTask = (stageId: number) => {
    toast.info(`Add task to stage ${stageId} will be implemented soon`);
  };
  
  const handleEditStage = (stageId: number) => {
    toast.info(`Edit stage ${stageId} will be implemented soon`);
  };
  
  const handleDeleteStage = (stageId: number) => {
    toast.info(`Delete stage ${stageId} will be implemented soon`);
  };
  
  const handleEditTask = (taskId: number) => {
    toast.info(`Edit task ${taskId} will be implemented soon`);
  };
  
  const handleDeleteTask = (taskId: number) => {
    toast.info(`Delete task ${taskId} will be implemented soon`);
  };
  
  const handleViewTaskDetails = (taskId: number) => {
    toast.info(`View details for task ${taskId} will be implemented soon`);
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

  // Use the real API stages if they exist, otherwise use an empty array
  const projectStages = apiStages.length > 0 ? apiStages : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Project Stages</h2>
          <p className="text-gray-500 mt-1">Manage and track all stages and tasks</p>
        </div>
        <Button onClick={handleAddStage} className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white shadow-md transition-all duration-300">
          <Plus className="mr-2 h-4 w-4" />
          Add Stage
        </Button>
      </div>
      
      {projectStages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-slate-50 rounded-lg border border-dashed border-slate-200">
          <div className="p-3 rounded-full bg-slate-100">
            <Clock className="h-6 w-6 text-slate-400" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-slate-900">No Stages Found</h3>
          <p className="mt-1 text-sm text-slate-500 text-center max-w-sm">
            This project doesn't have any stages yet. Add your first stage to start tracking progress.
          </p>
          <Button onClick={handleAddStage} className="mt-6">
            <Plus className="mr-2 h-4 w-4" />
            Add First Stage
          </Button>
        </div>
      ) : (
        <div className="grid gap-6">
          {projectStages.map((stage) => {
            const stageStatus = statusConfig[stage.status as keyof typeof statusConfig];
            const StageStatusIcon = stageStatus.icon;
            const isExpanded = expandedStages.includes(stage.id);
            
            return (
              <Card 
                key={stage.id} 
                className={cn(
                  "shadow-sm border border-slate-200 overflow-hidden transition-all duration-300",
                  isExpanded && "ring-1 ring-violet-200"
                )}
              >
                <div 
                  className={cn(
                    "flex flex-col md:flex-row md:items-center justify-between px-5 py-4 cursor-pointer transition-colors",
                    isExpanded ? "bg-slate-50" : "hover:bg-slate-50"
                  )}
                  onClick={() => toggleStage(stage.id)}
                >
                  <div className="flex items-center gap-3 mb-2 md:mb-0">
                    <div className={cn(
                      "p-2 rounded-full",
                      stage.status === 'completed' ? "bg-green-50" : 
                      stage.status === 'in-progress' ? "bg-blue-50" :
                      stage.status === 'delayed' ? "bg-red-50" : "bg-gray-50"
                    )}>
                      <StageStatusIcon 
                        className={cn(
                          "h-5 w-5",
                          stage.status === 'completed' ? "text-green-500" : 
                          stage.status === 'in-progress' ? "text-blue-500" :
                          stage.status === 'delayed' ? "text-red-500" : "text-gray-400"
                        )} 
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base">{stage.name}</h3>
                      {stage.nameAr && <p className="text-sm text-gray-500">{stage.nameAr}</p>}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 md:gap-6">
                    <div className="hidden md:block">
                      <Badge className={cn("px-3 py-1 font-medium text-xs", stageStatus.className)}>
                        {stageStatus.label}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-1 items-center gap-2 md:w-48">
                      <div className="h-2 flex-1 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full transition-all duration-300 ease-out",
                            stage.progress === 100 ? "bg-green-500" : 
                            stage.progress > 50 ? "bg-blue-500" : 
                            stage.progress > 0 ? "bg-amber-500" : "bg-gray-300"
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
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditStage(stage.id); }}>
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
                            onClick={(e) => { e.stopPropagation(); handleDeleteStage(stage.id); }}
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
                  <div className="p-5 border-t bg-white">
                    <div className="py-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 bg-slate-50 p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-50 rounded-full">
                            <User className="h-3.5 w-3.5 text-indigo-500" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Assignee</p>
                            <p className="text-sm font-medium">{stage.assignee || 'Not assigned'}</p>
                          </div>
                        </div>
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
                            <p className="text-sm font-medium">{formatDate(stage.endDate)}</p>
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
                            Tasks ({stage.tasks ? stage.tasks.length : 0})
                            <Badge className="mr-2 h-5 w-5 text-center ml-2 rounded-full bg-indigo-100 text-indigo-700 font-medium">
                              {stage.tasks ? stage.tasks.length : 0}
                            </Badge>
                          </h4>
                          <Button size="sm" onClick={(e) => { e.stopPropagation(); handleAddTask(stage.id); }}
                            className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 hover:text-indigo-800">
                            <Plus className="mr-1 h-3.5 w-3.5" />
                            Add Task
                          </Button>
                        </div>
                        
                        {stage.tasks && stage.tasks.length > 0 ? (
                          <div className="space-y-4">
                            {stage.tasks.map((task) => {
                              const taskStatus = statusConfig[task.status as keyof typeof statusConfig] || statusConfig['not-started'];
                              const TaskStatusIcon = taskStatus.icon;
                              const overdueDays = calculateOverdueDays(task.endDate);
                              const isCompleted = completedTasks.includes(task.id);
                              
                              return (
                                <Card key={task.id} className={cn(
                                  "border rounded-lg overflow-hidden transition-all",
                                  isCompleted && "bg-slate-50 border-slate-200"
                                )}>
                                  <div className="p-4">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                      <div className="flex items-start gap-3">
                                        <div className={cn(
                                          "p-1.5 rounded-full mt-0.5",
                                          task.status === 'completed' ? "bg-green-50" : 
                                          task.status === 'in-progress' ? "bg-blue-50" :
                                          task.status === 'delayed' ? "bg-red-50" : "bg-gray-50"
                                        )}>
                                          <TaskStatusIcon 
                                            className={cn(
                                              "h-3.5 w-3.5",
                                              task.status === 'completed' ? "text-green-500" : 
                                              task.status === 'in-progress' ? "text-blue-500" :
                                              task.status === 'delayed' ? "text-red-500" : "text-gray-400"
                                            )} 
                                          />
                                        </div>
                                        <div>
                                          <div className="flex items-center">
                                            <p className={cn(
                                              "font-medium",
                                              isCompleted && "line-through text-gray-500"
                                            )}>{task.name}</p>
                                            <Badge className={cn("ml-2", taskStatus.className)}>
                                              {taskStatus.label}
                                            </Badge>
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
                                        
                                        {overdueDays > 0 && task.status !== 'completed' && (
                                          <Badge variant="destructive" className="h-6 px-2 text-xs">
                                            متأخر {overdueDays} يوم
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                    
                                    <div className="mt-3 flex justify-between items-center">
                                      <div className="flex gap-6">
                                        <div className="flex items-center gap-1.5">
                                          <Calendar className="h-3.5 w-3.5 text-gray-400" />
                                          <span className="text-xs text-gray-500">
                                            {formatDate(task.startDate)} - {formatDate(task.endDate)}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                          <User className="h-3.5 w-3.5 text-gray-400" />
                                          <span className="text-xs text-gray-500">{task.assignee || 'Unassigned'}</span>
                                        </div>
                                      </div>
                                      
                                      <div className="flex items-center gap-2">
                                        <Checkbox
                                          id={`task-${task.id}`}
                                          checked={isCompleted}
                                          onCheckedChange={() => toggleTaskCompletion(task.id)}
                                          className="h-4 w-4 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500"
                                        />
                                        
                                        <Button 
                                          variant="ghost" 
                                          size="icon" 
                                          className="h-7 w-7 text-slate-500 hover:bg-slate-100" 
                                          onClick={() => handleViewTaskDetails(task.id)}
                                        >
                                          <Info className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button 
                                          variant="ghost" 
                                          size="icon" 
                                          className="h-7 w-7 text-slate-500 hover:bg-slate-100" 
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
