
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
import { Project, GanttTask } from '@/types/project';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CalendarDays, 
  ChevronDown,
  ChevronRight,
  Clock, 
  Calendar, 
  AlertCircle,
  CircleCheck,
  Circle,
  CheckCircle,
  Filter,
  List,
  ArrowDown,
  ArrowUp,
  Search,
  Settings
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
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { addDays, format, differenceInDays } from 'date-fns';

interface GanttChartProps {
  project: Project;
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
  if (progress < 50) return <Circle className="h-4 w-4 text-blue-500" />;
  if (progress < 100) return <Clock className="h-4 w-4 text-amber-500" />;
  return <CircleCheck className="h-4 w-4 text-green-500" />;
};

const GanttChart = ({ project }: GanttChartProps) => {
  const [selectedView, setSelectedView] = useState<'day' | 'week' | 'month' | 'quarter'>('week');
  const [showCriticalPath, setShowCriticalPath] = useState(false);
  const [showBaseline, setShowBaseline] = useState(true);
  const [filteredStatus, setFilteredStatus] = useState<string | null>(null);
  const [showLabels, setShowLabels] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Set<number | string>>(new Set([4, 9, 14, 15]));
  const [showGrid, setShowGrid] = useState(true);
  const [showDependencies, setShowDependencies] = useState(true);
  
  // Parse dates from project
  const startDate = project.startDate ? new Date(project.startDate) : new Date();
  const endDate = project.endDate ? new Date(project.endDate) : addDays(new Date(), 180);
  
  // Set today's date for reference
  const today = new Date();
  
  // Generate MS Project-like data with WBS codes and indentation
  const generateTasks = (): GanttTask[] => {
    return [
      {
        id: 1,
        name: "Project Initiation",
        nameAr: "بدء المشروع",
        start: new Date('2023-09-01').getTime(),
        end: new Date('2023-09-15').getTime(),
        progress: 100,
        color: "#4CAF50",
        type: 'subgroup',
        status: 'completed',
        responsible: 'Ahmed',
        actualStart: new Date('2023-09-01').getTime(),
        actualEnd: new Date('2023-09-17').getTime(),
        estimatedStart: new Date('2023-09-01').getTime(),
        estimatedEnd: new Date('2023-09-15').getTime(),
        wbs: '1',
        indent: 0
      },
      {
        id: "1.1",
        name: "Project Charter",
        nameAr: "ميثاق المشروع",
        start: new Date('2023-09-01').getTime(),
        end: new Date('2023-09-05').getTime(),
        progress: 100,
        dependencies: [1],
        color: "#4CAF50",
        type: 'task',
        status: 'completed',
        responsible: 'Ahmed',
        actualStart: new Date('2023-09-01').getTime(),
        actualEnd: new Date('2023-09-05').getTime(),
        estimatedStart: new Date('2023-09-01').getTime(),
        estimatedEnd: new Date('2023-09-05').getTime(),
        wbs: '1.1',
        indent: 1
      },
      {
        id: "1.2",
        name: "Stakeholder Analysis",
        nameAr: "تحليل أصحاب المصلحة",
        start: new Date('2023-09-06').getTime(),
        end: new Date('2023-09-10').getTime(),
        progress: 100,
        dependencies: ["1.1"],
        color: "#4CAF50",
        type: 'task',
        status: 'completed',
        responsible: 'Sara',
        actualStart: new Date('2023-09-06').getTime(),
        actualEnd: new Date('2023-09-10').getTime(),
        estimatedStart: new Date('2023-09-06').getTime(),
        estimatedEnd: new Date('2023-09-10').getTime(),
        wbs: '1.2',
        indent: 1
      },
      {
        id: "1.3",
        name: "Project Kickoff",
        nameAr: "إطلاق المشروع",
        start: new Date('2023-09-15').getTime(),
        end: new Date('2023-09-15').getTime(),
        progress: 100,
        dependencies: ["1.2"],
        color: "#9C27B0",
        type: 'milestone',
        status: 'completed',
        responsible: 'Project Team',
        actualStart: new Date('2023-09-15').getTime(),
        actualEnd: new Date('2023-09-15').getTime(),
        estimatedStart: new Date('2023-09-15').getTime(),
        estimatedEnd: new Date('2023-09-15').getTime(),
        wbs: '1.3',
        indent: 1
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
        type: 'subgroup',
        status: 'completed',
        responsible: 'Sara',
        actualStart: new Date('2023-09-18').getTime(),
        actualEnd: new Date('2023-10-08').getTime(),
        estimatedStart: new Date('2023-09-16').getTime(),
        estimatedEnd: new Date('2023-10-05').getTime(),
        wbs: '2',
        indent: 0
      },
      {
        id: "2.1",
        name: "Gather Requirements",
        nameAr: "جمع المتطلبات",
        start: new Date('2023-09-16').getTime(),
        end: new Date('2023-09-25').getTime(),
        progress: 100,
        dependencies: ["1.3"],
        color: "#4CAF50",
        type: 'task',
        status: 'completed',
        responsible: 'Sara',
        actualStart: new Date('2023-09-18').getTime(),
        actualEnd: new Date('2023-09-27').getTime(),
        estimatedStart: new Date('2023-09-16').getTime(),
        estimatedEnd: new Date('2023-09-25').getTime(),
        wbs: '2.1',
        indent: 1
      },
      {
        id: "2.2",
        name: "Analyze Requirements",
        nameAr: "تحليل المتطلبات",
        start: new Date('2023-09-26').getTime(),
        end: new Date('2023-10-05').getTime(),
        progress: 100,
        dependencies: ["2.1"],
        color: "#4CAF50",
        type: 'task',
        status: 'completed',
        responsible: 'Analysis Team',
        actualStart: new Date('2023-09-28').getTime(),
        actualEnd: new Date('2023-10-08').getTime(),
        estimatedStart: new Date('2023-09-26').getTime(),
        estimatedEnd: new Date('2023-10-05').getTime(),
        wbs: '2.2',
        indent: 1
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
        estimatedEnd: new Date('2023-10-06').getTime(),
        wbs: '3',
        indent: 0
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
        estimatedEnd: new Date('2023-11-20').getTime(),
        wbs: '4',
        indent: 0
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
        estimatedEnd: new Date('2023-10-20').getTime(),
        wbs: '4.1',
        indent: 1
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
        estimatedEnd: new Date('2023-11-10').getTime(),
        wbs: '4.2',
        indent: 1
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
        estimatedEnd: new Date('2023-11-20').getTime(),
        wbs: '4.3',
        indent: 1
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
        estimatedEnd: new Date('2023-11-21').getTime(),
        wbs: '5',
        indent: 0
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
        estimatedEnd: new Date('2024-02-28').getTime(),
        wbs: '6',
        indent: 0
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
        estimatedEnd: new Date('2023-12-31').getTime(),
        wbs: '6.1',
        indent: 1
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
        estimatedEnd: new Date('2024-01-31').getTime(),
        wbs: '6.2',
        indent: 1
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
        estimatedEnd: new Date('2024-02-28').getTime(),
        wbs: '6.3',
        indent: 1
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
        estimatedEnd: new Date('2024-03-01').getTime(),
        wbs: '7',
        indent: 0
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
        estimatedEnd: new Date('2024-05-15').getTime(),
        wbs: '8',
        indent: 0
      },
      {
        id: "14.1",
        name: "Electrical Work",
        nameAr: "الأعمال الكهربائية",
        start: new Date('2024-03-02').getTime(),
        end: new Date('2024-03-20').getTime(),
        progress: 0,
        dependencies: [13],
        color: "#9C27B0",
        type: 'task',
        status: 'not-started',
        responsible: 'Electrical Team',
        actualStart: null,
        actualEnd: null,
        estimatedStart: new Date('2024-03-02').getTime(),
        estimatedEnd: new Date('2024-03-20').getTime(),
        wbs: '8.1',
        indent: 1
      },
      {
        id: "14.2",
        name: "Plumbing",
        nameAr: "السباكة",
        start: new Date('2024-03-02').getTime(),
        end: new Date('2024-03-20').getTime(),
        progress: 0,
        dependencies: [13],
        color: "#9C27B0",
        type: 'task',
        status: 'not-started',
        responsible: 'Plumbing Team',
        actualStart: null,
        actualEnd: null,
        estimatedStart: new Date('2024-03-02').getTime(),
        estimatedEnd: new Date('2024-03-20').getTime(),
        wbs: '8.2',
        indent: 1
      },
      {
        id: "14.3",
        name: "Drywall",
        nameAr: "الحوائط الجافة",
        start: new Date('2024-03-21').getTime(),
        end: new Date('2024-04-10').getTime(),
        progress: 0,
        dependencies: ["14.1", "14.2"],
        color: "#9C27B0",
        type: 'task',
        status: 'not-started',
        responsible: 'Drywall Team',
        actualStart: null,
        actualEnd: null,
        estimatedStart: new Date('2024-03-21').getTime(),
        estimatedEnd: new Date('2024-04-10').getTime(),
        wbs: '8.3',
        indent: 1
      },
      {
        id: "14.4",
        name: "Painting",
        nameAr: "الدهان",
        start: new Date('2024-04-11').getTime(),
        end: new Date('2024-04-30').getTime(),
        progress: 0,
        dependencies: ["14.3"],
        color: "#9C27B0",
        type: 'task',
        status: 'not-started',
        responsible: 'Painting Team',
        actualStart: null,
        actualEnd: null,
        estimatedStart: new Date('2024-04-11').getTime(),
        estimatedEnd: new Date('2024-04-30').getTime(),
        wbs: '8.4',
        indent: 1
      },
      {
        id: "14.5",
        name: "Flooring",
        nameAr: "الأرضيات",
        start: new Date('2024-05-01').getTime(),
        end: new Date('2024-05-15').getTime(),
        progress: 0,
        dependencies: ["14.4"],
        color: "#9C27B0",
        type: 'task',
        status: 'not-started',
        responsible: 'Flooring Team',
        actualStart: null,
        actualEnd: null,
        estimatedStart: new Date('2024-05-01').getTime(),
        estimatedEnd: new Date('2024-05-15').getTime(),
        wbs: '8.5',
        indent: 1
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
        estimatedEnd: new Date('2024-06-30').getTime(),
        wbs: '9',
        indent: 0
      },
      {
        id: "15.1",
        name: "Exterior Cladding",
        nameAr: "التكسية الخارجية",
        start: new Date('2024-05-16').getTime(),
        end: new Date('2024-06-05').getTime(),
        progress: 0,
        dependencies: ["14.5"],
        color: "#E91E63",
        type: 'task',
        status: 'not-started',
        responsible: 'Cladding Team',
        actualStart: null,
        actualEnd: null,
        estimatedStart: new Date('2024-05-16').getTime(),
        estimatedEnd: new Date('2024-06-05').getTime(),
        wbs: '9.1',
        indent: 1
      },
      {
        id: "15.2",
        name: "Landscaping",
        nameAr: "تنسيق الحدائق",
        start: new Date('2024-06-06').getTime(),
        end: new Date('2024-06-30').getTime(),
        progress: 0,
        dependencies: ["15.1"],
        color: "#E91E63",
        type: 'task',
        status: 'not-started',
        responsible: 'Landscaping Team',
        actualStart: null,
        actualEnd: null,
        estimatedStart: new Date('2024-06-06').getTime(),
        estimatedEnd: new Date('2024-06-30').getTime(),
        wbs: '9.2',
        indent: 1
      },
      {
        id: 16,
        name: "Project Completion",
        nameAr: "إكمال المشروع",
        start: new Date('2024-07-01').getTime(),
        end: new Date('2024-07-01').getTime(),
        progress: 0,
        dependencies: [15],
        color: "#9C27B0",
        type: 'milestone',
        status: 'not-started',
        responsible: 'Project Manager',
        actualStart: null,
        actualEnd: null,
        estimatedStart: new Date('2024-07-01').getTime(),
        estimatedEnd: new Date('2024-07-01').getTime(),
        wbs: '10',
        indent: 0
      }
    ];
  };

  const tasks: GanttTask[] = generateTasks();
  
  // Toggle task group expansion
  const toggleGroupExpansion = (groupId: number | string) => {
    const newExpandedGroups = new Set(expandedGroups);
    if (newExpandedGroups.has(groupId)) {
      newExpandedGroups.delete(groupId);
    } else {
      newExpandedGroups.add(groupId);
    }
    setExpandedGroups(newExpandedGroups);
  };
  
  // Filter tasks based on search term and status
  const getFilteredTasks = () => {
    // First filter by status if specified
    let filtered = filteredStatus 
      ? tasks.filter(task => task.status === filteredStatus) 
      : tasks;
    
    // Then filter by search term if specified
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(task => 
        task.name.toLowerCase().includes(term) || 
        (task.nameAr && task.nameAr.includes(term)) ||
        (task.responsible && task.responsible.toLowerCase().includes(term)) ||
        (task.wbs && task.wbs.includes(term))
      );
    }

    // Filter child tasks based on expanded groups
    return filtered.filter(task => {
      if (task.type === 'subgroup' || task.type === 'milestone' || task.indent === 0) {
        return true;
      }
      
      // For child tasks, check if their parent is expanded
      const parentId = typeof task.id === 'string' && task.id.includes('.') 
        ? Number(task.id.split('.')[0]) 
        : null;
        
      return parentId ? expandedGroups.has(parentId) : true;
    });
  };
  
  const filteredTasks = getFilteredTasks();
  
  // Calculate project timeline
  const projectStart = Math.min(...tasks.map(t => t.start));
  const projectEnd = Math.max(...tasks.map(t => t.end));
  
  // Format date for axis
  const formatAxisDate = (timestamp: number) => {
    const date = new Date(timestamp);
    
    switch (selectedView) {
      case 'day':
        return format(date, 'MM/dd');
      case 'week':
        return format(date, 'MMM d');
      case 'month':
        return format(date, 'MMM yyyy');
      case 'quarter':
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        return `Q${quarter} ${date.getFullYear()}`;
      default:
        return format(date, 'MM/dd/yyyy');
    }
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
      
      // Calculate remaining work
      const remainingWork = task.status !== 'completed' 
        ? Math.ceil((task.end - today.getTime()) / (1000 * 60 * 60 * 24))
        : 0;
        
      // Format dates
      const estimatedStartDate = format(new Date(task.estimatedStart), 'MMM d, yyyy');
      const estimatedEndDate = format(new Date(task.estimatedEnd), 'MMM d, yyyy');
      const actualStartDate = task.actualStart ? format(new Date(task.actualStart), 'MMM d, yyyy') : '-';
      const actualEndDate = task.actualEnd ? format(new Date(task.actualEnd), 'MMM d, yyyy') : '-';
      
      return (
        <div className="bg-background border rounded-md p-4 shadow-md text-sm w-80">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {task.wbs && (
                <Badge variant="outline" className="font-mono">
                  {task.wbs}
                </Badge>
              )}
              <h3 className="font-semibold text-base">{task.name}</h3>
            </div>
            <Badge className={statusColors[task.status]}>
              {task.status.replace('-', ' ')}
            </Badge>
          </div>
          
          {task.nameAr && (
            <p className="text-muted-foreground mb-2 text-right">{task.nameAr}</p>
          )}
          
          <Separator className="my-2" />
          
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
            <div className="col-span-2 flex justify-between items-center mb-1">
              <p className="font-medium">Progress:</p>
              <span className="font-semibold">{task.progress}%</span>
            </div>
            <div className="col-span-2 mb-2">
              <Progress value={task.progress} className="h-2" />
            </div>
            
            <p className="font-medium text-primary">Planned Start:</p>
            <p>{estimatedStartDate}</p>
            
            <p className="font-medium text-primary">Planned End:</p>
            <p>{estimatedEndDate}</p>
            
            <p className="font-medium">Planned Duration:</p>
            <p>{estimatedDuration} days</p>
            
            {task.actualStart && (
              <>
                <p className="font-medium text-blue-600">Actual Start:</p>
                <p>{actualStartDate}</p>
              </>
            )}
            
            {task.actualEnd && (
              <>
                <p className="font-medium text-blue-600">Actual End:</p>
                <p>{actualEndDate}</p>
              </>
            )}
            
            {actualDuration && (
              <>
                <p className="font-medium">Actual Duration:</p>
                <p>{actualDuration} days</p>
              </>
            )}
            
            {variance !== null && (
              <>
                <p className="font-medium">Variance:</p>
                <p className={variance > 0 ? 'text-red-500' : variance < 0 ? 'text-green-500' : 'text-gray-500'}>
                  {variance > 0 ? `+${variance}` : variance} days
                </p>
              </>
            )}
            
            {remainingWork > 0 && (
              <>
                <p className="font-medium">Remaining Work:</p>
                <p>{remainingWork} days</p>
              </>
            )}
          </div>
          
          <Separator className="my-2" />
          
          <div className="flex justify-between items-center mt-2 text-xs">
            {task.responsible && (
              <p className="text-muted-foreground">
                <span className="font-medium">Assigned to:</span> {task.responsible}
              </p>
            )}
            
            {task.dependencies && task.dependencies.length > 0 && (
              <p className="text-muted-foreground">
                <span className="font-medium">Dependencies:</span> {task.dependencies.join(', ')}
              </p>
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

  // Calculate task critical path
  const criticalPath = showCriticalPath ? 
    tasks
      .filter(task => {
        // Consider a task critical if it has dependencies and is delayed or in progress
        const hasDependencies = task.dependencies && task.dependencies.length > 0;
        const isDelayedOrInProgress = task.status === 'delayed' || task.status === 'in-progress';
        const isHighProgress = task.progress > 75;
        return hasDependencies && (isDelayedOrInProgress || isHighProgress);
      })
      .map(task => task.id) : [];
      
  // Generate time grid lines based on selected view
  const generateTimeGridLines = () => {
    const lines = [];
    let current = new Date(projectStart);
    const end = new Date(projectEnd);
    
    let increment;
    switch (selectedView) {
      case 'day':
        increment = { days: 1 };
        break;
      case 'week':
        increment = { days: 7 };
        break;
      case 'month':
        increment = { months: 1 };
        break;
      case 'quarter':
        increment = { months: 3 };
        break;
      default:
        increment = { days: 7 };
    }
    
    while (current <= end) {
      lines.push(current.getTime());
      
      // Add the increment
      if (increment.days) {
        current = addDays(current, increment.days);
      } else if (increment.months) {
        current = new Date(current);
        current.setMonth(current.getMonth() + increment.months);
      }
    }
    
    return lines;
  };
  
  const timeGridLines = generateTimeGridLines();
  
  // Format date range for display
  const formatDateRange = (start: Date, end: Date) => {
    return `${format(start, 'MMM d, yyyy')} - ${format(end, 'MMM d, yyyy')}`;
  };
  
  // Calculate project completion percentage
  const calculateProjectCompletion = () => {
    if (!tasks.length) return 0;
    
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    return Math.round((completedTasks / totalTasks) * 100);
  };
  
  const projectCompletion = calculateProjectCompletion();
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-bold">Project Timeline</h2>
          </div>
          
          <div className="flex gap-3 items-center">
            <div className="flex border rounded-md overflow-hidden">
              <button 
                className={cn(
                  "px-2.5 py-1.5 text-sm font-medium", 
                  selectedView === 'day' 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-muted"
                )}
                onClick={() => setSelectedView('day')}
              >
                Day
              </button>
              <button 
                className={cn(
                  "px-2.5 py-1.5 text-sm font-medium", 
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
                  "px-2.5 py-1.5 text-sm font-medium", 
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
                  "px-2.5 py-1.5 text-sm font-medium", 
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
            
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Project Duration:</span>
            <Badge variant="outline" className="font-mono">
              {formatDateRange(new Date(projectStart), new Date(projectEnd))}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Days Elapsed:</span>
            <Badge variant="outline" className="font-mono">
              {differenceInDays(today, new Date(projectStart))} days
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Completion:</span>
            <div className="flex items-center gap-2 w-36">
              <Progress value={projectCompletion} className="h-2 flex-1" />
              <span className="text-xs font-medium">{projectCompletion}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-lg border bg-muted/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tasks..."
                className="w-full pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        
          <div className="flex flex-wrap gap-4 items-center justify-center">
            <div className="flex items-center space-x-2">
              <Switch 
                id="baseline"
                checked={showBaseline}
                onCheckedChange={setShowBaseline}
              />
              <Label htmlFor="baseline">Baseline</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="critical"
                checked={showCriticalPath}
                onCheckedChange={setShowCriticalPath}
              />
              <Label htmlFor="critical">Critical Path</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="grid"
                checked={showGrid}
                onCheckedChange={setShowGrid}
              />
              <Label htmlFor="grid">Grid</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="dependencies"
                checked={showDependencies}
                onCheckedChange={setShowDependencies}
              />
              <Label htmlFor="dependencies">Dependencies</Label>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground flex items-center gap-2 justify-end">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <span>
              {filteredTasks.length} of {tasks.length} tasks visible
            </span>
          </div>
        </div>
      </div>

      <ResizablePanelGroup direction="horizontal" className="rounded-lg border bg-card">
        <ResizablePanel defaultSize={25} minSize={20}>
          <div className="h-[calc(100vh-300px)]">
            <div className="flex items-center justify-between p-2 border-b bg-muted/30">
              <h3 className="text-sm font-medium px-2">Task Name</h3>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Filter className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <List className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            <ScrollArea className="h-[calc(100%-42px)]">
              <div className="space-y-0.5 p-1">
                {filteredTasks.map((task) => (
                  <div 
                    key={task.id} 
                    className={cn(
                      "flex items-center rounded-sm px-2 py-1.5 text-sm hover:bg-muted/50 cursor-pointer",
                      criticalPath.includes(task.id) && "border-l-2 border-orange-500 bg-orange-50/30"
                    )}
                    style={{ 
                      paddingLeft: `${(task.indent || 0) * 1.5 + 0.5}rem`,
                    }}
                  >
                    <div className="flex items-center flex-1 min-w-0">
                      {task.type === 'subgroup' && (
                        <button 
                          className="mr-1 p-0.5 rounded hover:bg-muted"
                          onClick={() => toggleGroupExpansion(task.id)}
                        >
                          {expandedGroups.has(task.id) ? (
                            <ChevronDown className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronRight className="h-3.5 w-3.5" />
                          )}
                        </button>
                      )}
                      
                      {/* Milestone diamond or task rectangle */}
                      {task.type === 'milestone' ? (
                        <div className="h-3 w-3 flex-shrink-0 transform rotate-45 bg-purple-500 mx-1.5"></div>
                      ) : (
                        <div 
                          className={cn("h-3 w-3 flex-shrink-0 rounded-sm mx-1.5")}
                          style={{ backgroundColor: getBarFill(task) }}
                        ></div>
                      )}
                      
                      {/* Task WBS code */}
                      {task.wbs && (
                        <span className="text-xs text-muted-foreground font-mono mr-2 flex-shrink-0 w-10">
                          {task.wbs}
                        </span>
                      )}
                      
                      {/* Task name */}
                      <span className={cn(
                        "truncate",
                        task.type === 'subgroup' && "font-medium",
                      )}>
                        {task.name}
                      </span>
                    </div>
                    
                    {/* Progress and status */}
                    <div className="flex items-center gap-1.5 flex-shrink-0 ml-1">
                      {getProgressIcon(task.progress)}
                      <span className={cn(
                        "text-xs px-1.5 py-0.5 rounded-sm",
                        statusColors[task.status]
                      )}>
                        {task.progress}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={75}>
          <Card className="border-0 rounded-none">
            <CardContent className="p-0">
              <div className="h-[calc(100vh-300px)]">
                <ScrollArea className="h-full">
                  <div className="p-4 min-w-[800px]">
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
                        margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
                        barSize={16}
                        barGap={0}
                        barCategoryGap={2}
                      >
                        {showGrid && (
                          <CartesianGrid 
                            strokeDasharray="3 3" 
                            horizontal={false} 
                            vertical={true}
                            verticalPoints={timeGridLines.map(time => time)}
                            stroke="rgba(0,0,0,0.1)"
                          />
                        )}
                        
                        <XAxis 
                          type="number" 
                          domain={[projectStart, projectEnd]}
                          tickFormatter={formatAxisDate}
                          scale="time"
                          ticks={timeGridLines}
                          allowDataOverflow
                          height={30}
                          tickMargin={5}
                          minTickGap={30}
                          tickSize={8}
                          style={{
                            fontSize: '0.75rem',
                            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
                          }}
                        />
                        
                        <YAxis 
                          dataKey="name" 
                          type="category" 
                          width={10}
                          axisLine={false}
                          tickLine={false}
                          tick={false}
                        />
                        
                        <Tooltip content={<CustomTooltip />} />
                        
                        <Legend />
                        
                        <ReferenceLine 
                          x={today.getTime()} 
                          stroke="red" 
                          strokeWidth={2} 
                          label={{ 
                            position: 'top', 
                            value: 'Today', 
                            fill: 'red',
                            fontSize: 12
                          }} 
                        />
                        
                        {/* Baseline Bars (if enabled) */}
                        {showBaseline && (
                          <Bar 
                            dataKey="estimatedEnd"
                            name="Baseline"
                            fill="rgba(0, 0, 0, 0.15)" 
                            shape={(props: any) => {
                              const { fill, index } = props;
                              const taskData = filteredTasks[index];
                              
                              const width = props.width || 0;
                              const height = props.height || 16;
                              
                              const timeSpan = projectEnd - projectStart;
                              const pixelsPerTime = width / timeSpan;
                              
                              const startPos = ((taskData.estimatedStart - projectStart) * pixelsPerTime);
                              const endPos = ((taskData.estimatedEnd - projectStart) * pixelsPerTime);
                              const barWidth = endPos - startPos;
                              
                              if (taskData.type === 'milestone') {
                                const centerX = startPos + (barWidth / 2);
                                const centerY = props.y + (height / 2);
                                const diamondSize = 5;
                                
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
                              
                              const barHeight = taskData.type === 'subgroup' ? height * 1.1 : height * 0.8;
                              const barY = taskData.type === 'subgroup' 
                                ? props.y - (height * 0.05) 
                                : props.y + (height * 0.1);
                              
                              return (
                                <g>
                                  <rect 
                                    x={startPos} 
                                    y={barY} 
                                    width={barWidth} 
                                    height={barHeight} 
                                    fill={fill} 
                                    rx={2} 
                                  />
                                </g>
                              );
                            }}
                          />
                        )}
                        
                        {/* Actual Bars */}
                        <Bar 
                          dataKey="end"
                          name="Actual"
                          fill="hsl(var(--primary))" 
                          shape={(props: any) => {
                            const { fill, index } = props;
                            const taskData = filteredTasks[index];
                            
                            const width = props.width || 0;
                            const height = props.height || 16;
                            
                            const timeSpan = projectEnd - projectStart;
                            const pixelsPerTime = width / timeSpan;
                            
                            // Use actual start/end if available, otherwise use planned values
                            const actualStart = taskData.actualStart || taskData.start;
                            const actualEnd = taskData.actualEnd || taskData.end;
                            
                            const startPos = ((actualStart - projectStart) * pixelsPerTime);
                            const endPos = ((actualEnd - projectStart) * pixelsPerTime);
                            const barWidth = endPos - startPos;
                            
                            // Draw milestone as diamond
                            if (taskData.type === 'milestone') {
                              const centerX = startPos;
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
                                    fill={taskData.color || "#9C27B0"}
                                    stroke={criticalPath.includes(taskData.id) ? "hsl(25, 95%, 53%)" : "transparent"}
                                    strokeWidth={criticalPath.includes(taskData.id) ? 2 : 0}
                                  />
                                </g>
                              );
                            }
                            
                            // Draw different bar styles for different task types
                            const barHeight = taskData.type === 'subgroup' ? height * 1.1 : height * 0.8;
                            const barY = taskData.type === 'subgroup' 
                              ? props.y - (height * 0.05) 
                              : props.y + (height * 0.1);
                            
                            const barFill = getBarFill(taskData);
                            
                            // For subgroups, add a double-line style
                            if (taskData.type === 'subgroup') {
                              return (
                                <g>
                                  {/* Main bar - full width but less height */}
                                  <rect 
                                    x={startPos} 
                                    y={barY} 
                                    width={barWidth} 
                                    height={barHeight / 3} 
                                    fill={barFill} 
                                    stroke={criticalPath.includes(taskData.id) ? "hsl(25, 95%, 53%)" : "transparent"}
                                    strokeWidth={criticalPath.includes(taskData.id) ? 2 : 0}
                                  />
                                  
                                  {/* Bottom bar - full width but less height, positioned at bottom */}
                                  <rect 
                                    x={startPos} 
                                    y={barY + (barHeight * 2/3)} 
                                    width={barWidth} 
                                    height={barHeight / 3} 
                                    fill={barFill} 
                                    stroke={criticalPath.includes(taskData.id) ? "hsl(25, 95%, 53%)" : "transparent"}
                                    strokeWidth={criticalPath.includes(taskData.id) ? 2 : 0}
                                  />
                                  
                                  {/* Progress indicator */}
                                  <rect 
                                    x={startPos} 
                                    y={barY} 
                                    width={barWidth * (taskData.progress / 100)} 
                                    height={barHeight / 3} 
                                    fill={barFill} 
                                    opacity={1} 
                                  />
                                  
                                  {/* Progress indicator on bottom bar */}
                                  <rect 
                                    x={startPos} 
                                    y={barY + (barHeight * 2/3)} 
                                    width={barWidth * (taskData.progress / 100)} 
                                    height={barHeight / 3} 
                                    fill={barFill} 
                                    opacity={1} 
                                  />
                                  
                                  {/* Add label */}
                                  {showLabels && barWidth > 70 && (
                                    <text
                                      x={startPos + 4}
                                      y={barY + barHeight / 2 + 2}
                                      fill="white"
                                      fontSize={9}
                                      fontWeight="bold"
                                      dominantBaseline="middle"
                                    >
                                      {taskData.nameAr || `${taskData.progress}%`}
                                    </text>
                                  )}
                                </g>
                              );
                            }
                            
                            // Regular task bar
                            return (
                              <g>
                                {/* Background bar */}
                                <rect 
                                  x={startPos} 
                                  y={barY} 
                                  width={barWidth} 
                                  height={barHeight} 
                                  fill={barFill} 
                                  fillOpacity={0.3}
                                  rx={2}
                                  stroke={criticalPath.includes(taskData.id) ? "hsl(25, 95%, 53%)" : barFill}
                                  strokeWidth={1}
                                />
                                
                                {/* Progress bar */}
                                <rect 
                                  x={startPos} 
                                  y={barY} 
                                  width={barWidth * (taskData.progress / 100)} 
                                  height={barHeight} 
                                  fill={barFill} 
                                  rx={2} 
                                  strokeWidth={0}
                                />
                                
                                {/* Progress percentage */}
                                {showLabels && taskData.progress > 0 && barWidth > 40 && (
                                  <text
                                    x={startPos + Math.min(barWidth * (taskData.progress / 100) - 5, barWidth - 20)}
                                    y={barY + (barHeight / 2) + 1}
                                    fill="white"
                                    fontSize={8}
                                    textAnchor="end"
                                    dominantBaseline="middle"
                                  >
                                    {taskData.progress}%
                                  </text>
                                )}
                                
                                {/* Task dependencies arrows */}
                                {showDependencies && taskData.dependencies && taskData.dependencies.length > 0 && (
                                  <line 
                                    x1={startPos} 
                                    y1={barY + barHeight / 2}
                                    x2={startPos - 3} 
                                    y2={barY + barHeight / 2}
                                    stroke="#666"
                                    strokeWidth={1}
                                    markerEnd="url(#arrow)"
                                  />
                                )}
                                
                                {/* Date labels */}
                                {barWidth > 60 && (
                                  <g>
                                    <text
                                      x={startPos + 3}
                                      y={barY - 3}
                                      fill="currentColor"
                                      fontSize={8}
                                      opacity={0.7}
                                    >
                                      {new Date(actualStart).getDate()}/{new Date(actualStart).getMonth() + 1}
                                    </text>
                                    <text
                                      x={startPos + barWidth - 3}
                                      y={barY - 3}
                                      fill="currentColor"
                                      fontSize={8}
                                      textAnchor="end"
                                      opacity={0.7}
                                    >
                                      {new Date(actualEnd).getDate()}/{new Date(actualEnd).getMonth() + 1}
                                    </text>
                                  </g>
                                )}
                              </g>
                            );
                          }}
                        />
                        
                        {/* Dependency arrow marker definition */}
                        <defs>
                          <marker
                            id="arrow"
                            viewBox="0 0 10 10"
                            refX="5"
                            refY="5"
                            markerWidth="4"
                            markerHeight="4"
                            orient="auto-start-reverse"
                          >
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#666"/>
                          </marker>
                        </defs>
                      </BarChart>
                    </ChartContainer>
                    
                    <div className="flex justify-between items-center mt-4 text-sm">
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
                      
                      <div className="text-xs text-muted-foreground">
                        Last updated: {format(new Date(), 'MMM d, yyyy')}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </ResizablePanel>
      </ResizablePanelGroup>
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <div className="flex items-center">
          <AlertCircle className="h-3.5 w-3.5 mr-1" />
          <span>Double-click a task to view details. Right-click for additional options.</span>
        </div>
        <div>
          © MS Project-style Gantt Chart
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
