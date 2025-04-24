
import React, { useState, useEffect } from 'react';
import { Project } from '@/services/projectService';
import { Worker, getAllWorkers } from '@/services/workerService';
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

// Mock data for stages and tasks
const projectStages = [
  {
    id: 1,
    name: "Planning Phase",
    nameAr: "مرحلة التخطيط",
    description: "Initial planning and requirements gathering",
    progress: 100,
    status: 'completed',
    assignee: "John Smith",
    startDate: "2023-10-01",
    endDate: "2023-10-15",
    tasks: [
      { 
        id: 101, 
        name: "Requirement Analysis", 
        nameAr: "تحليل المتطلبات", 
        progress: 100, 
        status: 'completed', 
        assignee: "Jane Doe", 
        startDate: "2023-10-01", 
        endDate: "2023-10-05",
        assignedWorkers: [] 
      },
      { 
        id: 102, 
        name: "Site Survey", 
        nameAr: "مسح الموقع", 
        progress: 100, 
        status: 'completed', 
        assignee: "Ahmed Hassan", 
        startDate: "2023-10-06", 
        endDate: "2023-10-10",
        assignedWorkers: [] 
      },
      { 
        id: 103, 
        name: "Initial Design", 
        nameAr: "التصميم الأولي", 
        progress: 100, 
        status: 'completed', 
        assignee: "Sarah Johnson", 
        startDate: "2023-10-11", 
        endDate: "2023-10-15",
        assignedWorkers: [] 
      }
    ]
  },
  {
    id: 2,
    name: "Foundation Work",
    nameAr: "أعمال الأساسات",
    description: "Excavation and foundation preparation",
    progress: 100,
    status: 'completed',
    assignee: "Michael Brown",
    startDate: "2023-10-16",
    endDate: "2023-11-05",
    tasks: [
      { id: 201, name: "Excavation", nameAr: "الحفر", progress: 100, status: 'completed', assignee: "Robert Chen", startDate: "2023-10-16", endDate: "2023-10-22", assignedWorkers: [] },
      { id: 202, name: "Foundation Layout", nameAr: "تخطيط الأساس", progress: 100, status: 'completed', assignee: "Ali Mohammed", startDate: "2023-10-23", endDate: "2023-10-29", assignedWorkers: [] },
      { id: 203, name: "Concrete Pouring", nameAr: "صب الخرسانة", progress: 100, status: 'completed', assignee: "David Wilson", startDate: "2023-10-30", endDate: "2023-11-02", assignedWorkers: [] },
      { id: 204, name: "Curing", nameAr: "المعالجة", progress: 100, status: 'completed', assignee: "Liam Harris", startDate: "2023-11-03", endDate: "2023-11-05", assignedWorkers: [] }
    ]
  },
  {
    id: 3,
    name: "Main Structure",
    nameAr: "الهيكل الرئيسي", 
    description: "Construction of the main building structure",
    progress: 75,
    status: 'in-progress',
    assignee: "Emma Johnson",
    startDate: "2023-11-06",
    endDate: "2023-12-15",
    tasks: [
      { id: 301, name: "Framing", nameAr: "هيكلة", progress: 100, status: 'completed', assignee: "Sophia Martinez", startDate: "2023-11-06", endDate: "2023-11-20", assignedWorkers: [] },
      { id: 302, name: "Wall Construction", nameAr: "بناء الجدران", progress: 100, status: 'completed', assignee: "Omar Khan", startDate: "2023-11-21", endDate: "2023-12-05", assignedWorkers: [] },
      { id: 303, name: "Roofing", nameAr: "السقف", progress: 30, status: 'delayed', assignee: "Noah Williams", startDate: "2023-12-06", endDate: "2023-12-15", assignedWorkers: [] },
      { id: 304, name: "Structural Inspection", nameAr: "فحص الهيكل", progress: 0, status: 'not-started', assignee: "Isabella Taylor", startDate: "2023-12-16", endDate: "2023-12-18", assignedWorkers: [] }
    ]
  },
  {
    id: 4,
    name: "Interior Finishing",
    nameAr: "التشطيبات الداخلية",
    description: "Interior work and finishes",
    progress: 0,
    status: 'not-started',
    assignee: "Mason Garcia",
    startDate: "2023-12-19",
    endDate: "2024-01-30",
    tasks: [
      { id: 401, name: "Plumbing", nameAr: "السباكة", progress: 0, status: 'not-started', assignee: "Ethan Clark", startDate: "2023-12-19", endDate: "2023-12-30", assignedWorkers: [] },
      { id: 402, name: "Electrical", nameAr: "الكهرباء", progress: 0, status: 'not-started', assignee: "Aisha Rahman", startDate: "2023-12-31", endDate: "2024-01-10", assignedWorkers: [] },
      { id: 403, name: "Drywall", nameAr: "الجدران الجافة", progress: 0, status: 'not-started', assignee: "William Rodriguez", startDate: "2024-01-11", endDate: "2024-01-20", assignedWorkers: [] },
      { id: 404, name: "Flooring", nameAr: "الأرضيات", progress: 0, status: 'not-started', assignee: "Olivia Lewis", startDate: "2024-01-21", endDate: "2024-01-25", assignedWorkers: [] },
      { id: 405, name: "Painting", nameAr: "الدهان", progress: 0, status: 'not-started', assignee: "James Martin", startDate: "2024-01-26", endDate: "2024-01-30", assignedWorkers: [] }
    ]
  },
  {
    id: 5,
    name: "Exterior Finishing",
    nameAr: "التشطيبات الخارجية",
    description: "External finishing work",
    progress: 0,
    status: 'not-started',
    assignee: "Benjamin Lee",
    startDate: "2024-02-01",
    endDate: "2024-02-20",
    tasks: [
      { id: 501, name: "Facade", nameAr: "الواجهة", progress: 0, status: 'not-started', assignee: "Charlotte Walker", startDate: "2024-02-01", endDate: "2024-02-10", assignedWorkers: [] },
      { id: 502, name: "Landscaping", nameAr: "تنسيق الحدائق", progress: 0, status: 'not-started', assignee: "Mohammad Ahmad", startDate: "2024-02-11", endDate: "2024-02-16", assignedWorkers: [] },
      { id: 503, name: "Final Inspection", nameAr: "الفحص النهائي", progress: 0, status: 'not-started', assignee: "Alexander Thompson", startDate: "2024-02-17", endDate: "2024-02-20", assignedWorkers: [] }
    ]
  }
];

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

const ProjectStages = ({ project }: ProjectStagesProps) => {
  const [expandedStages, setExpandedStages] = useState<number[]>([]);
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        setLoading(true);
        const data = await getAllWorkers();
        if (Array.isArray(data)) {
          setWorkers(data);
        } else {
          console.error('Invalid workers data:', data);
          setWorkers([]);
        }
      } catch (err) {
        console.error('Error fetching workers:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch workers');
        setWorkers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkers();
  }, []);
  
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
    const updatedStages = projectStages.map(stage => ({
      ...stage,
      tasks: stage.tasks.map(task => 
        task.id === taskId 
          ? { ...task, assignedWorkers: selectedWorkers }
          : task
      )
    }));
    // TODO: Update the backend with the new worker assignments
    console.log('Updated worker assignments:', updatedStages);
  };

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
                    <p className="text-sm text-gray-500">{stage.nameAr}</p>
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
                          <p className="text-sm font-medium">{stage.assignee}</p>
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
                          Tasks ({stage.tasks.length})
                          <Badge className="mr-2 h-5 w-5 text-center ml-2 rounded-full bg-indigo-100 text-indigo-700 font-medium">
                            {stage.tasks.length}
                          </Badge>
                        </h4>
                        <Button size="sm" onClick={(e) => { e.stopPropagation(); handleAddTask(stage.id); }}
                          className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 hover:text-indigo-800">
                          <Plus className="mr-1 h-3.5 w-3.5" />
                          Add Task
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        {stage.tasks.map((task) => {
                          const taskStatus = statusConfig[task.status as keyof typeof statusConfig];
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
                                      <p className="text-xs text-gray-500 mt-0.5">{task.nameAr}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-3 w-full md:w-auto">
                                    {!loading && (
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
                                      <span className="text-xs text-gray-500">{formatDate(task.startDate)} - {formatDate(task.endDate)}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <User className="h-3.5 w-3.5 text-gray-400" />
                                      <span className="text-xs text-gray-500">{task.assignee}</span>
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
                    </div>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectStages;
