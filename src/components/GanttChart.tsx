
import React from 'react';
import { Project } from '@/services/projectService';

interface GanttChartProps {
  project: Project;
}

const GanttChart: React.FC<GanttChartProps> = ({ project }) => {
  // Mock data for demonstration - this should be replaced with actual project data
  const mockTasks = [
    {
      id: '1',
      name: 'Foundation Work',
      start: new Date(2024, 0, 1),
      end: new Date(2024, 1, 15),
      progress: 75,
      type: 'task' as const
    },
    {
      id: '2', 
      name: 'Structure Building',
      start: new Date(2024, 1, 10),
      end: new Date(2024, 3, 20),
      progress: 45,
      type: 'task' as const
    },
    {
      id: '3',
      name: 'Finishing Works',
      start: new Date(2024, 3, 15),
      end: new Date(2024, 5, 30),
      progress: 20,
      type: 'task' as const
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Project Timeline</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Interactive Gantt chart showing project tasks and their progress over time.
        </p>
        
        <div className="space-y-4">
          {mockTasks.map((task) => (
            <div key={task.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{task.name}</span>
                <span className="text-sm text-muted-foreground">{task.progress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${task.progress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{task.start.toLocaleDateString()}</span>
                <span>{task.end.toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
