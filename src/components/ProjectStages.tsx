import React, { useState } from 'react';
import { Project } from '@/services/projectService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
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
  User
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
      { id: 101, name: "Requirement Analysis", nameAr: "تحليل المتطلبات", progress: 100, status: 'completed', assignee: "Jane Doe", startDate: "2023-10-01", endDate: "2023-10-05" },
      { id: 102, name: "Site Survey", nameAr: "مسح الموقع", progress: 100, status: 'completed', assignee: "Ahmed Hassan", startDate: "2023-10-06", endDate: "2023-10-10" },
      { id: 103, name: "Initial Design", nameAr: "التصميم الأولي", progress: 100, status: 'completed', assignee: "Sarah Johnson", startDate: "2023-10-11", endDate: "2023-10-15" }
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
      { id: 201, name: "Excavation", nameAr: "الحفر", progress: 100, status: 'completed', assignee: "Robert Chen", startDate: "2023-10-16", endDate: "2023-10-22" },
      { id: 202, name: "Foundation Layout", nameAr: "تخطيط الأساس", progress: 100, status: 'completed', assignee: "Ali Mohammed", startDate: "2023-10-23", endDate: "2023-10-29" },
      { id: 203, name: "Concrete Pouring", nameAr: "صب الخرسانة", progress: 100, status: 'completed', assignee: "David Wilson", startDate: "2023-10-30", endDate: "2023-11-02" },
      { id: 204, name: "Curing", nameAr: "المعالجة", progress: 100, status: 'completed', assignee: "Liam Harris", startDate: "2023-11-03", endDate: "2023-11-05" }
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
      { id: 301, name: "Framing", nameAr: "هيكلة", progress: 100, status: 'completed', assignee: "Sophia Martinez", startDate: "2023-11-06", endDate: "2023-11-20" },
      { id: 302, name: "Wall Construction", nameAr: "بناء الجدران", progress: 100, status: 'completed', assignee: "Omar Khan", startDate: "2023-11-21", endDate: "2023-12-05" },
      { id: 303, name: "Roofing", nameAr: "السقف", progress: 30, status: 'delayed', assignee: "Noah Williams", startDate: "2023-12-06", endDate: "2023-12-15" },
      { id: 304, name: "Structural Inspection", nameAr: "فحص الهيكل", progress: 0, status: 'not-started', assignee: "Isabella Taylor", startDate: "2023-12-16", endDate: "2023-12-18" }
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
      { id: 401, name: "Plumbing", nameAr: "السباكة", progress: 0, status: 'not-started', assignee: "Ethan Clark", startDate: "2023-12-19", endDate: "2023-12-30" },
      { id: 402, name: "Electrical", nameAr: "الكهرباء", progress: 0, status: 'not-started', assignee: "Aisha Rahman", startDate: "2023-12-31", endDate: "2024-01-10" },
      { id: 403, name: "Drywall", nameAr: "الجدران الجافة", progress: 0, status: 'not-started', assignee: "William Rodriguez", startDate: "2024-01-11", endDate: "2024-01-20" },
      { id: 404, name: "Flooring", nameAr: "الأرضيات", progress: 0, status: 'not-started', assignee: "Olivia Lewis", startDate: "2024-01-21", endDate: "2024-01-25" },
      { id: 405, name: "Painting", nameAr: "الدهان", progress: 0, status: 'not-started', assignee: "James Martin", startDate: "2024-01-26", endDate: "2024-01-30" }
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
      { id: 501, name: "Facade", nameAr: "الواجهة", progress: 0, status: 'not-started', assignee: "Charlotte Walker", startDate: "2024-02-01", endDate: "2024-02-10" },
      { id: 502, name: "Landscaping", nameAr: "تنسيق الحدائق", progress: 0, status: 'not-started', assignee: "Mohammad Ahmad", startDate: "2024-02-11", endDate: "2024-02-16" },
      { id: 503, name: "Final Inspection", nameAr: "الفحص النهائي", progress: 0, status: 'not-started', assignee: "Alexander Thompson", startDate: "2024-02-17", endDate: "2024-02-20" }
    ]
  }
];

// Status configuration
const statusConfig = {
  'completed': { label: 'Completed', className: 'bg-green-100 text-green-800', icon: CheckCircle },
  'in-progress': { label: 'In Progress', className: 'bg-blue-100 text-blue-800', icon: PlayCircle },
  'delayed': { label: 'Delayed', className: 'bg-red-100 text-red-800', icon: AlertCircle },
  'not-started': { label: 'Not Started', className: 'bg-gray-100 text-gray-800', icon: Clock },
  'paused': { label: 'Paused', className: 'bg-amber-100 text-amber-800', icon: PauseCircle },
};

// Format date function
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const ProjectStages = ({ project }: ProjectStagesProps) => {
  const [expandedStages, setExpandedStages] = useState<number[]>([]);
  
  const toggleStage = (stageId: number) => {
    setExpandedStages(prev => 
      prev.includes(stageId) 
        ? prev.filter(id => id !== stageId) 
        : [...prev, stageId]
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Project Stages</h2>
        <Button onClick={handleAddStage}>
          <Plus className="mr-2 h-4 w-4" />
          Add Stage
        </Button>
      </div>
      
      <div className="grid gap-4">
        {projectStages.map((stage) => {
          const stageStatus = statusConfig[stage.status as keyof typeof statusConfig];
          const StageStatusIcon = stageStatus.icon;
          const isExpanded = expandedStages.includes(stage.id);
          
          return (
            <Card key={stage.id} className="shadow-sm border overflow-hidden">
              <div 
                className={cn(
                  "flex flex-col md:flex-row md:items-center justify-between p-4 cursor-pointer transition-colors",
                  isExpanded ? "bg-muted/20" : "hover:bg-muted/10"
                )}
                onClick={() => toggleStage(stage.id)}
              >
                <div className="flex items-center gap-3 mb-2 md:mb-0">
                  <StageStatusIcon 
                    className={cn(
                      "h-5 w-5",
                      stage.status === 'completed' ? "text-green-500" : 
                      stage.status === 'in-progress' ? "text-blue-500" :
                      stage.status === 'delayed' ? "text-red-500" : "text-gray-400"
                    )} 
                  />
                  <div>
                    <h3 className="font-medium text-base">{stage.name}</h3>
                    <p className="text-sm text-muted-foreground">{stage.nameAr}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 md:gap-6">
                  <div className="hidden md:block">
                    <Badge className={stageStatus.className}>
                      {stageStatus.label}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-1 items-center gap-2 md:w-48">
                    <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
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
                    <span className="text-xs font-medium w-8 text-right">{stage.progress}%</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
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
                      className="h-8 w-8"
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
                <div className="p-4 pt-1 border-t bg-white">
                  <div className="py-3">
                    <div className="flex flex-wrap gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Assignee</p>
                        <p className="flex items-center gap-1 text-sm font-medium">
                          <User className="h-3.5 w-3.5" />
                          {stage.assignee}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Start Date</p>
                        <p className="text-sm font-medium">{formatDate(stage.startDate)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Expected Date</p>
                        <p className="text-sm font-medium">{formatDate(stage.endDate)}</p>
                      </div>
                    </div>
                    
                    {stage.description && (
                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground mb-1">Description</p>
                        <p className="text-sm">{stage.description}</p>
                      </div>
                    )}
                    
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">Tasks ({stage.tasks.length})</h4>
                        <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); handleAddTask(stage.id); }}>
                          <Plus className="mr-1 h-3.5 w-3.5" />
                          Add Task
                        </Button>
                      </div>
                      
                      <div className="space-y-3">
                        {stage.tasks.map((task) => {
                          const taskStatus = statusConfig[task.status as keyof typeof statusConfig];
                          const TaskStatusIcon = taskStatus.icon;
                          
                          return (
                            <div key={task.id} className="border rounded-md overflow-hidden">
                              <div className="flex flex-col md:flex-row md:items-center justify-between p-3 gap-3">
                                <div className="flex items-center gap-3">
                                  <TaskStatusIcon 
                                    className={cn(
                                      "h-4 w-4",
                                      task.status === 'completed' ? "text-green-500" : 
                                      task.status === 'in-progress' ? "text-blue-500" :
                                      task.status === 'delayed' ? "text-red-500" : "text-gray-400"
                                    )} 
                                  />
                                  <div>
                                    <p className="font-medium">{task.name}</p>
                                    <p className="text-xs text-muted-foreground">{task.nameAr}</p>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
                                  <Badge variant="outline" className="h-6 px-2 text-xs">
                                    <User className="h-3 w-3 mr-1" />
                                    {task.assignee}
                                  </Badge>
                                  
                                  <Badge className={taskStatus.className + " h-6 text-xs"}>
                                    {taskStatus.label}
                                  </Badge>
                                  
                                  <div className="flex items-center gap-2 w-full md:w-32">
                                    <Progress 
                                      value={task.progress} 
                                      className={cn(
                                        "h-2",
                                        task.progress === 100 ? "bg-muted [&>div]:bg-green-500" : 
                                        task.progress > 0 ? "bg-muted [&>div]:bg-blue-500" : 
                                        "bg-muted [&>div]:bg-gray-400"
                                      )} 
                                    />
                                    <span className="text-xs font-medium">{task.progress}%</span>
                                  </div>
                                  
                                  <div className="flex items-center gap-1">
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-7 w-7" 
                                      onClick={() => handleEditTask(task.id)}
                                    >
                                      <Edit className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-7 w-7 text-red-500" 
                                      onClick={() => handleDeleteTask(task.id)}
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex gap-6 px-3 py-1 bg-muted/10 text-xs">
                                <div className="flex items-center">
                                  <span className="text-muted-foreground mr-2">Start:</span>
                                  <span>{formatDate(task.startDate)}</span>
                                </div>
                                <div className="flex items-center">
                                  <span className="text-muted-foreground mr-2">Expected:</span>
                                  <span>{formatDate(task.endDate)}</span>
                                </div>
                              </div>
                            </div>
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
