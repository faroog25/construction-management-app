
export interface Project {
  id: number;
  name: string;
  projectName: string;
  description: string;
  client_name: string;
  clientName: string;
  client_id: number;
  site_engineer: string;
  siteEngineerName: string;
  site_engineer_id: number;
  siteEngineerId: number;
  siteAddress: string;
  geographicalCoordinates?: string;
  start_date: string;
  startDate: string;
  expected_end_date: string;
  expectedEndDate: string;
  endDate?: string;
  completionDate?: string;
  handoverDate?: string;
  created_at: string;
  createdAt: string;
  updated_at: string;
  status: 0 | 1 | 2 | 3 | 4;
  projectStatus: 0 | 1 | 2 | 3 | 4;
}

export interface Task {
  id: number;
  stageId: number;
  projectId: number;
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  expectedEndDate?: string;
  isCompleted: boolean;
  workers?: Worker[];
}

export interface Worker {
  id: number;
  name: string;
  specialty: string;
}

export interface Stage {
  id: number;
  name: string;
  description: string;
  projectId: number;
  startDate: string;
  endDate?: string;
  expectedEndDate?: string;
  isCompleted: boolean;
  tasks: Task[];
}

export interface GanttTask {
  id: string;
  name: string;
  start: Date;
  end: Date;
  progress: number;
  type: 'task' | 'milestone' | 'project';
  dependencies?: string[];
}

export interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
}

export interface ProjectApiResponse {
  success: boolean;
  message: string;
  data: Project;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    items: T[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPreveiosPage: boolean;
  };
}
