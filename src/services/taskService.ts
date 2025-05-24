
import { API_BASE_URL } from '@/config/api';

export interface Task {
  id: number;
  name: string;
  description: string;
  startDate: string;
  expectedEndDate: string;
  stageName: string;
  projectName: string;
  isCompleted: boolean;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const getUpcomingTasks = async (daysAhead: number = 60): Promise<Task[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/Tasks/upcoming?daysAhead=${daysAhead}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch upcoming tasks');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching upcoming tasks:', error);
    throw error;
  }
};
