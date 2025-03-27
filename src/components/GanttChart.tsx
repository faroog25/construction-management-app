
import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  Legend
} from 'recharts';
import { Project } from '@/services/projectService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CalendarDays, 
  ChartGantt, 
  Clock, 
  Calendar, 
  AlertCircle,
  CircleHelp,
  Circle,
  CheckCircle,
  Filter
} from 'lucide-react';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle
} from '@/components/ui/resizable';
import { cn } from '@/lib/utils';
import { formatProjectDate } from '@/utils/projectUtils';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface GanttChartProps {
  project: Project;
}

interface GanttTask {
  id: number;
  name: string;
  nameAr: string;
  start: number; // timestamp
  end: number; // timestamp
  progress: number;
  dependencies?: number[];
  color?: string;
  type: 'task' | 'milestone' | 'subgroup';
  responsible?: string;
  status: 'not-started' | 'in-progress' | 'delayed' | 'completed';
  actualStart?: number; // actual start timestamp
  actualEnd?: number; // actual end timestamp
  estimatedStart?: number; // estimated start timestamp
  estimatedEnd?: number; // estimated end timestamp
}

const statusColors = {
  'not-started': 'bg-gray-200 text-gray-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  'delayed': 'bg-red-100 text-red-800',
  'completed': 'bg-green-100 text-green-800',
};

// Icons for progress indicators
const getProgressIcon = (progress: number) => {
  if (progress === 0) return <Circle className="h-4 w-4 text-gray-400" />;
  if (progress < 50) return <CircleHelp className="h-4 w-4 text-blue-500" />;
  if (progress < 100) return <Clock className="h-4 w-4 text-amber-500" />;
  return <CheckCircle className="h-4 w-4 text-green-500" />;
};

const GanttChart = ({ project }: GanttChartProps) => {
  const [selectedView, setSelectedView] = useState<'week' | 'month' | 'quarter'>('month');
  const [showCriticalPath, setShowCriticalPath] = useState(false);
  const [showBaseline, setShowBaseline] = useState(true);
  const [filteredStatus, setFilteredStatus] = useState<string | null>(null);
  const [showLabels, setShowLabels] = useState(true);
  
  // Parse dates from project
  const startDate = project.startDate ? new Date(project.startDate) : new Date();
  const endDate = project.expectedEndDate ? new Date(project.expectedEndDate) : new Date();
  
  // Set today's date for reference
  const today = new Date();
  
  // More realistic data for tasks with Arabic content - now with baseline data
  const tasks: GanttTask[] = [
    {
      id: 1,
      name: "Project Initiation",
      nameAr: "بدء المشروع",
      start: new Date('2023-09-01').getTime(),
      end: new Date('2023-09-15').getTime(),
      progress: 100,
      color: "#4CAF50",
      type: 'task',
      status: 'completed',
      responsible: 'Ahmed',
      actualStart: new Date('2023-09-01').getTime(),
      actualEnd: new Date('2023-09-17').getTime(),
      estimatedStart: new Date('2023-09-01').getTime(),
      estimatedEnd: new Date('2023-09-15').getTime()
    },
    {
      id: 2,
      name: "Requirements Analysis",
      nameAr: "تحليل المتطلبات",
      start: new Date('2023-09-16').getTime(),
      end: new Date('2023-10-05').getTime(),
      progress: 100,
      dependencies: [1],
      color: "#4CAF50",
      type: 'task',
      status: 'completed',
      responsible: 'Sara',
      actualStart: new Date('2023-09-18').getTime(),
      actualEnd: new Date('2023-10-08').getTime(),
      estimatedStart: new Date('2023-09-16').getTime(),
      estimatedEnd: new Date('2023-10-05').getTime()
    },
    {
      id: 3,
      name: "Design Approval",
      nameAr: "الموافقة على التصميم",
      start: new Date('2023-10-06').getTime(),
      end: new Date('2023-10-06').getTime(),
      progress: 100,
      dependencies: [2],
      color: "#9C27B0",
      type: 'milestone',
      status: 'completed',
      responsible: 'Mohammed',
      actualStart: new Date('2023-10-09').getTime(),
      actualEnd: new Date('2023-10-09').getTime(),
      estimatedStart: new Date('2023-10-06').getTime(),
      estimatedEnd: new Date('2023-10-06').getTime()
    },
    {
      id: 4,
      name: "Foundation Work",
      nameAr: "أعمال الأساسات",
      start: new Date('2023-10-07').getTime(),
      end: new Date('2023-11-20').getTime(),
      progress: 100,
      dependencies: [3],
      color: "#2196F3",
      type: 'subgroup',
      status: 'completed',
      responsible: 'Team A',
      actualStart: new Date('2023-10-10').getTime(),
      actualEnd: new Date('2023-11-25').getTime(),
      estimatedStart: new Date('2023-10-07').getTime(),
      estimatedEnd: new Date('2023-11-20').getTime()
    },
    {
      id: 5,
      name: "Excavation",
      nameAr: "الحفر",
      start: new Date('2023-10-07').getTime(),
      end: new Date('2023-10-20').getTime(),
      progress: 100,
      dependencies: [3],
      color: "#2196F3",
      type: 'task',
      status: 'completed',
      responsible: 'Khalid',
      actualStart: new Date('2023-10-10').getTime(),
      actualEnd: new Date('2023-10-23').getTime(),
      estimatedStart: new Date('2023-10-07').getTime(),
      estimatedEnd: new Date('2023-10-20').getTime()
    },
    {
      id: 6,
      name: "Concrete Pouring",
      nameAr: "صب الخرسانة",
      start: new Date('2023-10-21').getTime(),
      end: new Date('2023-11-10').getTime(),
      progress: 100,
      dependencies: [5],
      color: "#2196F3",
      type: 'task',
      status: 'completed',
      responsible: 'Yusuf',
      actualStart: new Date('2023-10-24').getTime(),
      actualEnd: new Date('2023-11-13').getTime(),
      estimatedStart: new Date('2023-10-21').getTime(),
      estimatedEnd: new Date('2023-11-10').getTime()
    },
    {
      id: 7,
      name: "Curing",
      nameAr: "المعالجة",
      start: new Date('2023-11-11').getTime(),
      end: new Date('2023-11-20').getTime(),
      progress: 100,
      dependencies: [6],
      color: "#2196F3",
      type: 'task',
      status: 'completed',
      responsible: 'Team A',
      actualStart: new Date('2023-11-14').getTime(),
      actualEnd: new Date('2023-11-25').getTime(),
      estimatedStart: new Date('2023-11-11').getTime(),
      estimatedEnd: new Date('2023-11-20').getTime()
    },
    {
      id: 8,
      name: "Foundation Inspection",
      nameAr: "فحص الأساسات",
      start: new Date('2023-11-21').getTime(),
      end: new Date('2023-11-21').getTime(),
      progress: 100,
      dependencies: [7],
      color: "#9C27B0",
      type: 'milestone',
      status: 'completed',
      responsible: 'Inspector',
      actualStart: new Date('2023-11-26').getTime(),
      actualEnd: new Date('2023-11-26').getTime(),
      estimatedStart: new Date('2023-11-21').getTime(),
      estimatedEnd: new Date('2023-11-21').getTime()
    },
    {
      id: 9,
      name: "Main Structure",
      nameAr: "الهيكل الرئيسي",
      start: new Date('2023-11-22').getTime(),
      end: new Date('2024-02-28').getTime(),
      progress: 75,
      dependencies: [8],
      color: "#FFC107",
      type: 'subgroup',
      status: 'in-progress',
      responsible: 'Team B',
      actualStart: new Date('2023-11-27').getTime(),
      actualEnd: null,
      estimatedStart: new Date('2023-11-22').getTime(),
      estimatedEnd: new Date('2024-02-28').getTime()
    },
    {
      id: 10,
      name: "Framing",
      nameAr: "هيكلة",
      start: new Date('2023-11-22').getTime(),
      end: new Date('2023-12-31').getTime(),
      progress: 100,
      dependencies: [8],
      color: "#FFC107",
      type: 'task',
      status: 'completed',
      responsible: 'Omar',
      actualStart: new Date('2023-11-27').getTime(),
      actualEnd: new Date('2024-01-05').getTime(),
      estimatedStart: new Date('2023-11-22').getTime(),
      estimatedEnd: new Date('2023-12-31').getTime()
    },
    {
      id: 11,
      name: "Walls Construction",
      nameAr: "بناء الجدران",
      start: new Date('2024-01-01').getTime(),
      end: new Date('2024-01-31').getTime(),
      progress: 100,
      dependencies: [10],
      color: "#FFC107",
      type: 'task',
      status: 'completed',
      responsible: 'Team C',
      actualStart: new Date('2024-01-06').getTime(),
      actualEnd: new Date('2024-02-05').getTime(),
      estimatedStart: new Date('2024-01-01').getTime(),
      estimatedEnd: new Date('2024-01-31').getTime()
    },
    {
      id: 12,
      name: "Roofing",
      nameAr: "السقف",
      start: new Date('2024-02-01').getTime(),
      end: new Date('2024-02-28').getTime(),
      progress: 30,
      dependencies: [11],
      color: "#FFC107",
      type: 'task',
      status: 'delayed',
      responsible: 'Layla',
      actualStart: new Date('2024-02-06').getTime(),
      actualEnd: null,
      estimatedStart: new Date('2024-02-01').getTime(),
      estimatedEnd: new Date('2024-02-28').getTime()
    },
    {
      id: 13,
      name: "Structure Inspection",
      nameAr: "فحص الهيكل",
      start: new Date('2024-03-01').getTime(),
      end: new Date('2024-03-01').getTime(),
      progress: 0,
      dependencies: [12],
      color: "#9C27B0",
      type: 'milestone',
      status: 'not-started',
      responsible: 'Inspector',
      actualStart: null,
      actualEnd: null,
      estimatedStart: new Date('2024-03-01').getTime(),
      estimatedEnd: new Date('2024-03-01').getTime()
    },
    {
      id: 14,
      name: "Interior Finishing",
      nameAr: "التشطيبات الداخلية",
      start: new Date('2024-03-02').getTime(),
      end: new Date('2024-05-15').getTime(),
      progress: 0,
      dependencies: [13],
      color: "#9C27B0",
      type: 'subgroup',
      status: 'not-started',
      responsible: 'Team D',
      actualStart: null,
      actualEnd: null,
      estimatedStart: new Date('2024-03-02').getTime(),
      estimatedEnd: new Date('2024-05-15').getTime()
    },
    {
      id: 15,
      name: "Exterior Finishing",
      nameAr: "التشطيبات الخارجية",
      start: new Date('2024-05-16').getTime(),
      end: new Date('2024-06-30').getTime(),
      progress: 0,
      dependencies: [14],
      color: "#E91E63",
      type: 'subgroup',
      status: 'not-started',
      responsible: 'Team E',
      actualStart: null,
      actualEnd: null,
      estimatedStart: new Date('2024-05-16').getTime(),
      estimatedEnd: new Date('2024-06-30').getTime()
    }
  ];

  // Filter tasks based on selected status if any
  const filteredTasks = filteredStatus 
    ? tasks.filter(task => task.status === filteredStatus) 
    : tasks;
  
  // Calculate project timeline
  const projectStart = Math.min(...tasks.map(t => t.start));
  const projectEnd = Math.max(...tasks.map(t => t.end));
  
  // Format date for axis
  const formatAxisDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: selectedView === 'week' ? '2-digit' : 'short', 
      year: selectedView === 'month' || selectedView === 'quarter' ? 'numeric' : undefined,
      day: selectedView === 'week' ? '2-digit' : undefined
    });
  };
  
  // CustomTooltip component for the Gantt chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const task = payload[0].payload;
      
      // Calculate duration in days
      const estimatedDuration = Math.ceil((task.estimatedEnd - task.estimatedStart) / (1000 * 60 * 60 * 24));
      
      // Calculate actual duration if available
      let actualDuration = null;
      if (task.actualStart && task.actualEnd) {
        actualDuration = Math.ceil((task.actualEnd - task.actualStart) / (1000 * 60 * 60 * 24));
      }
      
      // Calculate variance
      let variance = null;
      if (actualDuration) {
        variance = actualDuration - estimatedDuration;
      }
      
      return (
        <div className="bg-background border rounded-md p-3 shadow-md text-sm">
          <p className="font-medium mb-1">{task.name}</p>
          <p className="text-muted-foreground">{task.nameAr}</p>
          <div className="my-2 border-t pt-2">
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              <p className="flex items-center gap-1 font-medium text-primary">
                <Calendar className="h-3 w-3" /> Planned Start:
              </p>
              <p>{new Date(task.estimatedStart).toLocaleDateString()}</p>
              
              <p className="flex items-center gap-1 font-medium text-primary">
                <Calendar className="h-3 w-3" /> Planned End:
              </p>
              <p>{new Date(task.estimatedEnd).toLocaleDateString()}</p>
              
              {task.actualStart && (
                <>
                  <p className="flex items-center gap-1 font-medium text-blue-600">
                    <Calendar className="h-3 w-3" /> Actual Start:
                  </p>
                  <p>{new Date(task.actualStart).toLocaleDateString()}</p>
                </>
              )}
              
              {task.actualEnd && (
                <>
                  <p className="flex items-center gap-1 font-medium text-blue-600">
                    <Calendar className="h-3 w-3" /> Actual End:
                  </p>
                  <p>{new Date(task.actualEnd).toLocaleDateString()}</p>
                </>
              )}
              
              <p className="flex items-center gap-1 font-medium">
                <Clock className="h-3 w-3" /> Planned Duration:
              </p>
              <p>{estimatedDuration} days</p>
              
              {actualDuration && (
                <>
                  <p className="flex items-center gap-1 font-medium">
                    <Clock className="h-3 w-3" /> Actual Duration:
                  </p>
                  <p>{actualDuration} days</p>
                </>
              )}
              
              {variance !== null && (
                <>
                  <p className="flex items-center gap-1 font-medium">
                    Variance:
                  </p>
                  <p className={variance > 0 ? 'text-red-500' : variance < 0 ? 'text-green-500' : 'text-gray-500'}>
                    {variance > 0 ? `+${variance}` : variance} days
                  </p>
                </>
              )}
            </div>
            
            <div className="flex flex-col gap-1 mt-3">
              <div className="flex justify-between items-center text-xs">
                <p className="font-medium">Progress:</p>
                <p className="font-medium">{task.progress}%</p>
              </div>
              <Progress value={task.progress} className="h-2" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <Badge className={statusColors[task.status]}>
              {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('-', ' ')}
            </Badge>
            {task.responsible && (
              <p className="text-xs text-muted-foreground">Assigned: {task.responsible}</p>
            )}
          </div>
        </div>
      );
    }
    
    return null;
  };

  const getBarFill = (task: GanttTask) => {
    if (task.type === 'milestone') return task.color || "#9C27B0";
    
    switch (task.status) {
      case 'completed': return "#4CAF50";
      case 'in-progress': return "#2196F3";
      case 'delayed': return "#E91E63";
      case 'not-started': return "#9E9E9E";
      default: return task.color || "#2196F3";
    }
  };

  const getBaselineFill = (task: GanttTask) => {
    return "rgba(0, 0, 0, 0.15)";
  };

  // Calculate task critical path (simple implementation)
  const criticalPath = showCriticalPath ? 
    tasks
      .filter(task => {
        // For this example, we'll consider a task critical if it has dependencies and is delayed or in progress
        const hasDependencies = task.dependencies && task.dependencies.length > 0;
        const isDelayedOrInProgress = task.status === 'delayed' || task.status === 'in-progress';
        const isHighProgress = task.progress > 75;
        return hasDependencies && (isDelayedOrInProgress || isHighProgress);
      })
      .map(task => task.id) : [];
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <ChartGantt className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-bold">Project Timeline</h2>
        </div>
        
        <div className="flex gap-3 items-center">
          <div className="flex border rounded-md overflow-hidden">
            <button 
              className={cn(
                "px-3 py-1.5 text-sm font-medium", 
                selectedView === 'week' 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-muted"
              )}
              onClick={() => setSelectedView('week')}
            >
              Week
            </button>
            <button 
              className={cn(
                "px-3 py-1.5 text-sm font-medium", 
                selectedView === 'month' 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-muted"
              )}
              onClick={() => setSelectedView('month')}
            >
              Month
            </button>
            <button 
              className={cn(
                "px-3 py-1.5 text-sm font-medium", 
                selectedView === 'quarter' 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-muted"
              )}
              onClick={() => setSelectedView('quarter')}
            >
              Quarter
            </button>
          </div>
          
          <Select 
            onValueChange={(value) => setFilteredStatus(value === 'all' ? null : value)}
            defaultValue="all"
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="delayed">Delayed</SelectItem>
              <SelectItem value="not-started">Not Started</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="p-4 rounded-lg border bg-muted/20">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch 
                id="baseline"
                checked={showBaseline}
                onCheckedChange={setShowBaseline}
              />
              <Label htmlFor="baseline">Show Baseline</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="critical"
                checked={showCriticalPath}
                onCheckedChange={setShowCriticalPath}
              />
              <Label htmlFor="critical">Show Critical Path</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="labels"
                checked={showLabels}
                onCheckedChange={setShowLabels}
              />
              <Label htmlFor="labels">Show Progress Labels</Label>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <span>
              {filteredTasks.length} tasks displayed out of {tasks.length} total
            </span>
          </div>
        </div>
      </div>

      <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
        <ResizablePanel defaultSize={20} minSize={15}>
          <div className="h-[calc(100vh-300px)] p-2">
            <div className="space-y-1 p-2">
              <h3 className="text-sm font-medium">Task List</h3>
              <p className="text-xs text-muted-foreground">
                {filteredTasks.length} tasks in view
              </p>
            </div>
            <ScrollArea className="h-[calc(100%-50px)]">
              <div className="space-y-1 p-2">
                {filteredTasks.map((task) => (
                  <div 
                    key={task.id} 
                    className={cn(
                      "flex justify-between items-center rounded-md px-3 py-2 text-sm",
                      task.type === 'subgroup' && "font-medium",
                      task.type === 'milestone' && "bg-purple-50",
                      criticalPath.includes(task.id) && "border-l-4 border-orange-500 pl-2"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {task.type === 'milestone' ? (
                        <div className="h-2.5 w-2.5 rounded-full bg-purple-500"></div>
                      ) : (
                        <div 
                          className="h-2.5 w-2.5 rounded-sm" 
                          style={{ backgroundColor: getBarFill(task) }}
                        ></div>
                      )}
                      <span className={cn(
                        task.type === 'subgroup' && "font-medium",
                        task.type !== 'subgroup' && task.type !== 'milestone' && "ml-4"
                      )}>
                        {task.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {getProgressIcon(task.progress)}
                      <Badge className={statusColors[task.status]} variant="outline">
                        {task.progress}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={80}>
          <Card className="border-0 rounded-none">
            <CardContent className="p-0">
              <div className="h-[calc(100vh-300px)]">
                <ScrollArea className="h-full">
                  <div className="p-6 min-w-[800px]">
                    <ChartContainer 
                      config={{
                        actual: { label: 'Actual', color: 'hsl(var(--primary))' },
                        baseline: { label: 'Baseline', color: 'rgba(0, 0, 0, 0.15)' },
                        critical: { label: 'Critical Path', color: 'hsl(25, 95%, 53%)' }
                      }}
                      className="h-[600px] w-full"
                    >
                      <BarChart
                        data={filteredTasks}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 180, bottom: 20 }}
                        barSize={20}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis 
                          type="number" 
                          domain={[
                            projectStart, 
                            projectEnd
                          ]}
                          tickFormatter={formatAxisDate}
                          scale="time"
                          dataKey="start"
                          allowDataOverflow
                        />
                        <YAxis 
                          dataKey="name" 
                          type="category" 
                          width={170}
                          tick={(props) => {
                            const { x, y, payload } = props;
                            const task = filteredTasks.find(t => t.name === payload.value);
                            if (!task) return null;
                            
                            return (
                              <g transform={`translate(${x},${y})`}>
                                <text 
                                  x={-3} 
                                  y={0} 
                                  dy={4} 
                                  textAnchor="end" 
                                  fill="currentColor"
                                  className={cn(
                                    "text-xs",
                                    task.type === 'subgroup' && "font-medium",
                                    task.type !== 'subgroup' && task.type !== 'milestone' && "translate-x-4",
                                    criticalPath.includes(task.id) && "font-bold text-orange-500"
                                  )}
                                >
                                  {task.name}
                                </text>
                              </g>
                            );
                          }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <ReferenceLine x={today.getTime()} stroke="red" strokeWidth={2} strokeDasharray="3 3" label={{ position: 'top', value: 'Today', fill: 'red' }} />
                        
                        {/* Baseline Bars (if enabled) */}
                        {showBaseline && (
                          <Bar 
                            dataKey={(dataItem: GanttTask) => {
                              return dataItem.estimatedEnd;
                            }}
                            name="Baseline"
                            fill="rgba(0, 0, 0, 0.15)" 
                            shape={(props: any) => {
                              const { fill, index } = props;
                              const taskData = filteredTasks[index];
                              
                              const width = props.width || 0;
                              const height = props.height || 20;
                              
                              const timeSpan = projectEnd - projectStart;
                              const pixelsPerTime = width / timeSpan;
                              
                              const startPos = ((taskData.estimatedStart - projectStart) * pixelsPerTime);
                              const endPos = ((taskData.estimatedEnd - projectStart) * pixelsPerTime);
                              const barWidth = endPos - startPos;
                              
                              if (taskData.type === 'milestone') {
                                const centerX = startPos + (barWidth / 2);
                                const centerY = props.y + (height / 2);
                                const diamondSize = 8;
                                
                                return (
                                  <g>
                                    <polygon
                                      points={`
                                        ${centerX},${centerY-diamondSize} 
                                        ${centerX+diamondSize},${centerY} 
                                        ${centerX},${centerY+diamondSize} 
                                        ${centerX-diamondSize},${centerY}
                                      `}
                                      fill="rgba(0, 0, 0, 0.15)"
                                    />
                                  </g>
                                );
                              }
                              
                              const barHeight = taskData.type === 'subgroup' ? height * 1.2 : height;
                              const barY = taskData.type === 'subgroup' ? props.y - (height * 0.1) : props.y;
                              
                              return (
                                <g>
                                  <rect 
                                    x={startPos} 
                                    y={barY} 
                                    width={barWidth} 
                                    height={barHeight} 
                                    fill={fill} 
                                    rx={3} 
                                  />
                                </g>
                              );
                            }}
                          />
                        )}
                        
                        {/* Actual Bars */}
                        <Bar 
                          dataKey={(dataItem: GanttTask) => {
                            return dataItem.end;
                          }}
                          name="Actual"
                          fill="hsl(var(--primary))" 
                          shape={(props: any) => {
                            const { fill, index } = props;
                            const taskData = filteredTasks[index];
                            
                            const width = props.width || 0;
                            const height = props.height || 20;
                            
                            const timeSpan = projectEnd - projectStart;
                            const pixelsPerTime = width / timeSpan;
                            
                            // Use actual start/end if available, otherwise use planned values
                            const actualStart = taskData.actualStart || taskData.start;
                            const actualEnd = taskData.actualEnd || taskData.end;
                            
                            const startPos = ((actualStart - projectStart) * pixelsPerTime);
                            const endPos = ((actualEnd - projectStart) * pixelsPerTime);
                            const barWidth = endPos - startPos;
                            
                            if (taskData.type === 'milestone') {
                              const centerX = startPos + (barWidth / 2);
                              const centerY = props.y + (height / 2);
                              const diamondSize = 10;
                              
                              return (
                                <g>
                                  <polygon
                                    points={`
                                      ${centerX},${centerY-diamondSize} 
                                      ${centerX+diamondSize},${centerY} 
                                      ${centerX},${centerY+diamondSize} 
                                      ${centerX-diamondSize},${centerY}
                                    `}
                                    fill={taskData.color || "#9C27B0"}
                                    stroke={criticalPath.includes(taskData.id) ? "hsl(25, 95%, 53%)" : "transparent"}
                                    strokeWidth={criticalPath.includes(taskData.id) ? 2 : 0}
                                  />
                                </g>
                              );
                            }
                            
                            const barHeight = taskData.type === 'subgroup' ? height * 1.2 : height;
                            const barY = taskData.type === 'subgroup' ? props.y - (height * 0.1) : props.y;
                            
                            const barFill = getBarFill(taskData);
                            
                            return (
                              <g>
                                {/* Main task bar */}
                                <rect 
                                  x={startPos} 
                                  y={barY} 
                                  width={barWidth} 
                                  height={barHeight} 
                                  fill={barFill} 
                                  fillOpacity={0.3}
                                  rx={3}
                                  stroke={criticalPath.includes(taskData.id) ? "hsl(25, 95%, 53%)" : "transparent"}
                                  strokeWidth={criticalPath.includes(taskData.id) ? 2 : 0}
                                />
                                
                                {/* Progress bar */}
                                <rect 
                                  x={startPos} 
                                  y={barY} 
                                  width={barWidth * (taskData.progress / 100)} 
                                  height={barHeight} 
                                  fill={barFill} 
                                  rx={3} 
                                  stroke={criticalPath.includes(taskData.id) ? "hsl(25, 95%, 53%)" : "transparent"}
                                  strokeWidth={criticalPath.includes(taskData.id) ? 2 : 0}
                                />
                                
                                {/* Progress percentage text */}
                                {showLabels && taskData.progress > 15 && (
                                  <text
                                    x={startPos + (barWidth * (taskData.progress / 100)) - 20}
                                    y={barY + (barHeight / 2) + 5}
                                    fill="white"
                                    fontSize={10}
                                    fontWeight="bold"
                                    textAnchor="end"
                                    dominantBaseline="middle"
                                    style={{ pointerEvents: 'none' }}
                                  >
                                    {taskData.progress}%
                                  </text>
                                )}
                                
                                {/* Subgroup Arabic name */}
                                {taskData.type === 'subgroup' && (
                                  <text
                                    x={startPos + 8}
                                    y={barY + (barHeight / 2) + 5}
                                    fill="white"
                                    fontSize={10}
                                    fontWeight="bold"
                                  >
                                    {taskData.nameAr}
                                  </text>
                                )}
                                
                                {/* Date markers */}
                                {showLabels && taskData.type !== 'milestone' && barWidth > 80 && (
                                  <>
                                    <text
                                      x={startPos + 5}
                                      y={barY - 5}
                                      fill="currentColor"
                                      fontSize={8}
                                      opacity={0.7}
                                    >
                                      {new Date(actualStart).toLocaleDateString()}
                                    </text>
                                    <text
                                      x={endPos - 5}
                                      y={barY - 5}
                                      fill="currentColor"
                                      fontSize={8}
                                      textAnchor="end"
                                      opacity={0.7}
                                    >
                                      {taskData.actualEnd || taskData.status === 'completed' 
                                        ? new Date(actualEnd).toLocaleDateString() 
                                        : `Est. ${new Date(taskData.end).toLocaleDateString()}`}
                                    </text>
                                  </>
                                )}
                              </g>
                            );
                          }}
                        />
                      </BarChart>
                    </ChartContainer>
                    
                    <div className="flex justify-between mt-6 text-sm">
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 bg-green-500 rounded-sm"></div>
                          <span>Completed</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 bg-blue-500 rounded-sm"></div>
                          <span>In Progress</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 bg-red-500 rounded-sm"></div>
                          <span>Delayed</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 bg-gray-400 rounded-sm"></div>
                          <span>Not Started</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 bg-purple-500 transform rotate-45"></div>
                          <span>Milestone</span>
                        </div>
                        {showCriticalPath && (
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 border-2 border-orange-500"></div>
                            <span>Critical Path</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center">
                        <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Project Duration: {formatProjectDate(project.startDate || '', 'medium')} - {formatProjectDate(project.expectedEndDate || '', 'medium')}
                        </span>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </ResizablePanel>
      </ResizablePanelGroup>
      
      <div className="flex justify-start text-xs text-muted-foreground">
        <AlertCircle className="h-3.5 w-3.5 mr-1" />
        <span>This is a visualization based on project schedule. Real-time tracking requires integration with project management tools.</span>
      </div>
    </div>
  );
};

export default GanttChart;
