
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

const GanttChart = ({ project }: GanttChartProps) => {
  // Parse dates from project
  const startDate = project.startDate ? new Date(project.startDate) : new Date();
  const endDate = project.expectedEndDate ? new Date(project.expectedEndDate) : new Date();
  
  // Set today's date for reference
  const today = new Date();
  
  // Calculate total project duration in days
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Generate months for the timeline
  const generateMonths = () => {
    const months = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      months.push({
        name: currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        start: new Date(currentDate).getTime(),
        actualStart: currentDate <= today ? new Date(currentDate).getTime() : null,
        today: currentDate.getMonth() === today.getMonth() && 
               currentDate.getFullYear() === today.getFullYear() ? 
               today.getTime() : null
      });
      
      // Move to next month
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    return months;
  };
  
  // Generate tasks data
  const generateTasks = () => {
    // Base task (the entire project)
    const tasks = [
      {
        task: project.projectName,
        start: startDate.getTime(),
        end: endDate.getTime(),
        completed: Math.min((today.getTime() - startDate.getTime()) / (endDate.getTime() - startDate.getTime()) * 100, 100),
        progress: project.orderId || 0
      }
    ];
    
    // For a more detailed Gantt chart, we would add more tasks from the project here
    // This is a simplified version showing just the overall project timeline
    
    return tasks;
  };
  
  const months = generateMonths();
  const tasks = generateTasks();
  
  // CustomTooltip component for the Gantt chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const task = payload[0].payload;
      
      return (
        <div className="bg-background border rounded-md p-2 shadow-md text-sm">
          <p className="font-medium">{task.task}</p>
          <p>Start: {new Date(task.start).toLocaleDateString()}</p>
          <p>End: {new Date(task.end).toLocaleDateString()}</p>
          <p>Progress: {task.progress}%</p>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <Card className="mt-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-medium">Project Timeline (Gantt Chart)</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] w-full">
          <div className="min-w-[600px] pr-4">
            <ChartContainer 
              config={{
                progress: { label: 'Progress', color: 'hsl(var(--primary))' },
                planned: { label: 'Planned', color: 'hsl(var(--muted-foreground)/0.3)' }
              }}
              className="h-[250px] w-full"
            >
              <BarChart
                data={tasks}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                barSize={20}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis 
                  type="number" 
                  domain={[startDate.getTime(), endDate.getTime()]}
                  tickFormatter={(time) => new Date(time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  scale="time"
                  dataKey="start"
                />
                <YAxis 
                  dataKey="task" 
                  type="category" 
                  width={80}
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
                          fill="hsl(var(--primary))" 
                          rx={3} 
                        />
                        
                        {/* Today marker if within range */}
                        {today >= startDate && today <= endDate && (
                          <line 
                            x1={(today.getTime() - startDate.getTime()) / (endDate.getTime() - startDate.getTime()) * barWidth + startPos}
                            y1={y - 5}
                            x2={(today.getTime() - startDate.getTime()) / (endDate.getTime() - startDate.getTime()) * barWidth + startPos}
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
            
            <div className="flex justify-between items-center px-12 mt-2">
              <div className="flex space-x-4 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-primary mr-2 rounded-sm"></div>
                  <span>Progress</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-muted-foreground/30 mr-2 rounded-sm"></div>
                  <span>Planned</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 border border-red-500 mr-2 rounded-sm"></div>
                  <span>Today</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default GanttChart;
