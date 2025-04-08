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
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'completed' | 'on_hold';
  startDate: Date;
  endDate?: Date;
  stages: Stage[];
  tasks: Task[];
  createdAt: Date;
  updatedAt: Date;
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
