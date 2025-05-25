
import React from 'react';

interface GanttItem {
  id: string;
  name: string;
  start: Date;
  end: Date;
  progress?: number;
  dependencies?: string;
  type?: 'task' | 'milestone' | 'project';
}

interface GanttChartProps {
  data: GanttItem[];
}

const GanttChart: React.FC<GanttChartProps> = ({ data }) => {
  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[800px] p-4">
        <h3 className="text-lg font-semibold mb-4">Project Timeline</h3>
        {data.length === 0 ? (
          <p className="text-muted-foreground">No timeline data available</p>
        ) : (
          <div className="space-y-2">
            {data.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 p-2 border rounded">
                <div className="w-48 truncate font-medium">{item.name}</div>
                <div className="flex-1 bg-muted rounded-full h-6 relative">
                  <div 
                    className="bg-primary h-full rounded-full" 
                    style={{ width: `${item.progress || 0}%` }}
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  {item.start.toLocaleDateString()} - {item.end.toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GanttChart;
