
import { API_BASE_URL } from '@/config/api';

export interface TeamStatistics {
  totalWorkers: number;
  assignedWorkers: number;
  unAssignedWorkers: number;
  totalSiteEngineers: number;
  totalClients: number;
}

export interface ProjectStatistics {
  totalProjects: number;
  activeProjects: number;
  cancelledProjects: number;
  completedProjects: number;
  pendingProjects: number;
}

export interface TaskStatistics {
  totalTasks: number;
  activeTasks: number;
  completedTasks: number;
  overdueTasks: number;
}

export interface EquipmentStatistics {
  totalEquipments: number;
  reservedEquipments: number;
  availabeEquipments: number;
  totalReservation: number;
}

export interface DocumentStatistics {
  totalDocuments: number;
  totalImages: number;
  totalPdfFiles: number;
  totalWordFiles: number;
  totalExcelFiles: number;
  totalPowerPointFiles: number;
  totalOtherFiles: number;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const getTeamStatistics = async (): Promise<TeamStatistics> => {
  const response = await fetch(`${API_BASE_URL}/Dashboard/team-statistics`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch team statistics');
  }

  return response.json();
};

export const getProjectStatistics = async (): Promise<ProjectStatistics> => {
  const response = await fetch(`${API_BASE_URL}/Dashboard/project-statistics`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch project statistics');
  }

  return response.json();
};

export const getTaskStatistics = async (): Promise<TaskStatistics> => {
  const response = await fetch(`${API_BASE_URL}/Dashboard/task-statistics`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch task statistics');
  }

  return response.json();
};

export const getEquipmentStatistics = async (): Promise<EquipmentStatistics> => {
  const response = await fetch(`${API_BASE_URL}/Dashboard/equipment-statistics`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch equipment statistics');
  }

  return response.json();
};

export const getDocumentStatistics = async (): Promise<DocumentStatistics> => {
  const response = await fetch(`${API_BASE_URL}/Dashboard/documents-statistics`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch document statistics');
  }

  return response.json();
};
