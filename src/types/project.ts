
import { Worker } from '@/services/workerService';

export interface Stage {
  id: string;
  name: string;
  description?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  stageId: string;
  assignedTo?: string;
  assignedWorkers?: Worker[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string | number;
  projectName: string;
  name?: string; // For backward compatibility
  description?: string;
  status: 'active' | 'completed' | 'on_hold' | number;
  startDate?: Date | string;
  endDate?: Date | string;
  expectedEndDate?: string;
  clientName?: string;
  siteAddress?: string;
  siteEngineerId?: number;
  orderId?: number;
  actualEndDate?: string;
  stages?: Stage[];
  tasks?: Task[];
  createdAt: Date | string;
  updatedAt: Date | string;
  clientId?: number;
  geographicalCoordinates?: string;
}

export interface GanttTask {
  id: number | string;
  name: string;
  nameAr?: string;
  start: number; // timestamp
  end: number; // timestamp
  progress: number;
  dependencies?: (number | string)[];
  color?: string;
  type: 'task' | 'milestone' | 'subgroup';
  responsible?: string;
  status: 'not-started' | 'in-progress' | 'delayed' | 'completed';
  actualStart?: number; // actual start timestamp
  actualEnd?: number; // actual end timestamp
  estimatedStart?: number; // estimated start timestamp
  estimatedEnd?: number; // estimated end timestamp
  wbs?: string; // Work Breakdown Structure code
  indent?: number; // Indentation level for hierarchy
}

// This interface aligns with what ProjectCard expects
export interface ProjectCardProps {
  id: number;
  name: string;
  client_name: string;
  expected_end_date?: string;
  start_date?: string;
  progress: number;
  status: number;
  onViewDetails?: () => void;
  className?: string;
  style?: React.CSSProperties;
}
