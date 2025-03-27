
import { Project, ProjectWithClient } from '@/services/projectService';

// Interface for project with client data
export interface ProjectWithClientData {
  id: number;
  name: string;
  client_name: string;
  expected_end_date: string;
  start_date: string;
  progress: number;
  status: number;
}

// Calculate days remaining until project due date
export const calculateDaysRemaining = (dueDate: string): number => {
  const due = new Date(dueDate);
  const today = new Date();
  
  // Reset time component for accurate day calculation
  due.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  const differenceInTime = due.getTime() - today.getTime();
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
  
  return differenceInDays;
};

// Format status for display
export const formatProjectStatus = (statusCode: number): string => {
  switch (statusCode) {
    case 1:
      return 'Active';
    case 2:
      return 'Completed';
    case 3:
      return 'Pending';
    case 4:
      return 'Delayed';
    default:
      return 'Unknown';
  }
};

// Format date to readable string
export const formatProjectDate = (dateString: string, format: 'short' | 'medium' | 'long' = 'medium'): string => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  
  switch (format) {
    case 'short':
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    case 'medium':
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    case 'long':
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    default:
      return date.toLocaleDateString();
  }
};

// Calculate project health based on progress and days remaining
export const calculateProjectHealth = (project: ProjectWithClient): 'good' | 'warning' | 'critical' => {
  // If completed, health is always good
  if (project.status === 2) return 'good';
  
  // If delayed, health is always critical
  if (project.status === 4) return 'critical';
  
  const daysRemaining = calculateDaysRemaining(project.expected_end_date);
  const totalDays = Math.ceil((new Date(project.expected_end_date).getTime() - new Date(project.start_date).getTime()) / (1000 * 3600 * 24));
  const daysElapsed = totalDays - daysRemaining;
  
  // Calculate expected progress based on elapsed time
  const expectedProgress = Math.min(100, Math.max(0, Math.round((daysElapsed / totalDays) * 100)));
  
  // Compare actual progress with expected progress
  const progressDifference = project.progress - expectedProgress;
  
  if (progressDifference < -20) return 'critical';
  if (progressDifference < -10) return 'warning';
  return 'good';
};
