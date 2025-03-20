
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface TimelineProps {
  className?: string;
}

const ProjectTimeline = ({ className }: TimelineProps) => {
  const data = [
    { name: 'Jan', completed: 55, planned: 65 },
    { name: 'Feb', completed: 78, planned: 75 },
    { name: 'Mar', completed: 62, planned: 80 },
    { name: 'Apr', completed: 83, planned: 85 },
    { name: 'May', completed: 72, planned: 90 },
    { name: 'Jun', completed: 91, planned: 95 },
    { name: 'Jul', completed: 67, planned: 100 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border rounded-lg shadow-md">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-primary">
            Completed: {payload[0].value}%
          </p>
          <p className="text-sm text-muted-foreground">
            Planned: {payload[1].value}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={className}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Project Completion</h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary"></div>
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-muted-foreground/30"></div>
            <span>Planned</span>
          </div>
        </div>
      </div>
      <div className="h-[300px] w-full transition-all animate-in">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            barGap={8}
          >
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              hide={false}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={false}
            />
            <Bar 
              dataKey="completed" 
              radius={[4, 4, 0, 0]} 
              maxBarSize={40}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill="hsl(var(--primary))" 
                />
              ))}
            </Bar>
            <Bar 
              dataKey="planned" 
              radius={[4, 4, 0, 0]} 
              maxBarSize={40}
              fillOpacity={0.3}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill="hsl(var(--muted-foreground))" 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProjectTimeline;
