
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Project } from '@/services/projectService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface GanttChartProps {
  project: Project;
}

interface GanttTask {
  id: number;
  name: string;
  nameAr: string; // Arabic name
  start: number; // timestamp
  end: number; // timestamp
  progress: number;
  dependencies?: number[];
  color?: string;
}

const GanttChart = ({ project }: GanttChartProps) => {
  // Parse dates from project
  const startDate = project.startDate ? new Date(project.startDate) : new Date();
  const endDate = project.expectedEndDate ? new Date(project.expectedEndDate) : new Date();
  
  // Set today's date for reference
  const today = new Date();
  
  // Dummy data for tasks with Arabic content
  const tasks: GanttTask[] = [
    {
      id: 1,
      name: "Project Planning",
      nameAr: "تخطيط المشروع",
      start: new Date('2023-09-01').getTime(),
      end: new Date('2023-10-15').getTime(),
      progress: 100,
      color: "#4CAF50"
    },
    {
      id: 2,
      name: "Foundation Work",
      nameAr: "أعمال الأساسات",
      start: new Date('2023-10-16').getTime(),
      end: new Date('2023-11-30').getTime(),
      progress: 100,
      dependencies: [1],
      color: "#2196F3"
    },
    {
      id: 3,
      name: "Main Structure",
      nameAr: "الهيكل الرئيسي",
      start: new Date('2023-12-01').getTime(),
      end: new Date('2024-02-28').getTime(),
      progress: 65,
      dependencies: [2],
      color: "#FFC107"
    },
    {
      id: 4,
      name: "Interior Finishing",
      nameAr: "التشطيبات الداخلية",
      start: new Date('2024-03-01').getTime(),
      end: new Date('2024-05-15').getTime(),
      progress: 0,
      dependencies: [3],
      color: "#9C27B0"
    },
    {
      id: 5,
      name: "Exterior Finishing",
      nameAr: "التشطيبات الخارجية",
      start: new Date('2024-05-16').getTime(),
      end: new Date('2024-06-30').getTime(),
      progress: 0,
      dependencies: [4],
      color: "#E91E63"
    }
  ];
  
  // CustomTooltip component for the Gantt chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const task = payload[0].payload;
      
      return (
        <div className="bg-background border rounded-md p-2 shadow-md text-sm">
          <p className="font-medium">{task.nameAr}</p>
          <p>البداية: {new Date(task.start).toLocaleDateString('ar-SA')}</p>
          <p>النهاية: {new Date(task.end).toLocaleDateString('ar-SA')}</p>
          <p>التقدم: {task.progress}%</p>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">مخطط جانت للمشروع</h2>
        <div className="flex gap-2 items-center text-sm">
          <span className="flex items-center">
            <div className="w-3 h-3 bg-primary mr-1 rounded-sm"></div>
            تم الإنجاز
          </span>
          <span className="flex items-center">
            <div className="w-3 h-3 bg-muted-foreground/30 mr-1 rounded-sm"></div>
            المخطط
          </span>
        </div>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <ScrollArea className="h-[500px] w-full">
            <div className="min-w-[800px] pr-4">
              <ChartContainer 
                config={{
                  progress: { label: 'Progress', color: 'hsl(var(--primary))' },
                  planned: { label: 'Planned', color: 'hsl(var(--muted-foreground)/0.3)' }
                }}
                className="h-[400px] w-full"
              >
                <BarChart
                  data={tasks}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 150, bottom: 20 }}
                  barSize={30}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis 
                    type="number" 
                    domain={[
                      Math.min(...tasks.map(t => t.start)), 
                      Math.max(...tasks.map(t => t.end))
                    ]}
                    tickFormatter={(time) => new Date(time).toLocaleDateString('ar-SA', { month: 'short', year: 'numeric' })}
                    scale="time"
                    dataKey="start"
                  />
                  <YAxis 
                    dataKey="nameAr" 
                    type="category" 
                    width={140}
                    tick={{ fill: 'hsl(var(--foreground))' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="end" 
                    fill="hsl(var(--muted-foreground)/0.3)" 
                    shape={(props: any) => {
                      const { x, y, width, height, fill } = props;
                      const taskData = props.payload;
                      const startPos = x - width; // Adjusted x position based on start date
                      const endPos = x; // End position is x
                      const barWidth = endPos - startPos;
                      
                      return (
                        <g>
                          {/* Full bar (planned) */}
                          <rect x={startPos} y={y} width={barWidth} height={height} fill={fill} rx={3} />
                          
                          {/* Progress bar */}
                          <rect 
                            x={startPos} 
                            y={y} 
                            width={barWidth * (taskData.progress / 100)} 
                            height={height} 
                            fill={taskData.color || "hsl(var(--primary))"} 
                            rx={3} 
                          />
                          
                          {/* Today marker if within range */}
                          {today >= new Date(taskData.start) && today <= new Date(taskData.end) && (
                            <line 
                              x1={(today.getTime() - taskData.start) / (taskData.end - taskData.start) * barWidth + startPos}
                              y1={y - 5}
                              x2={(today.getTime() - taskData.start) / (taskData.end - taskData.start) * barWidth + startPos}
                              y2={y + height + 5}
                              stroke="red"
                              strokeWidth={2}
                              strokeDasharray="3 3"
                            />
                          )}
                        </g>
                      );
                    }}
                  />
                </BarChart>
              </ChartContainer>
              
              {/* Dependencies visualization would go here in a more complex chart */}
              
              <div className="flex justify-end mt-4 text-sm text-muted-foreground">
                <span>تم التحديث: {new Date().toLocaleDateString('ar-SA')}</span>
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default GanttChart;
