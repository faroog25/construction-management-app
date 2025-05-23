import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, ChevronRight, Building, FileText, Calendar, AlertCircle, CheckCircle2, CalendarRange } from 'lucide-react';
import { getUpcomingTasks } from '@/services/taskService';
import { useLanguage } from '@/contexts/LanguageContext';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Task {
  id: number;
  name: string;
  projectName: string;
  stageName: string;
  startDate: string;
  expectedEndDate: string;
  isCompleted: boolean;
}

const UpcomingTasks = () => {
  const { t } = useLanguage();

  const { data: upcomingTasks = [], isLoading } = useQuery({
    queryKey: ['upcoming-tasks'],
    queryFn: () => getUpcomingTasks(60),
  });

  const getTaskIcon = (task: Task) => {
    if (task.isCompleted) {
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    }
    return <FileText className="h-4 w-4 text-blue-500" />;
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd');
    } catch {
      return dateString;
    }
  };

  const getTaskStatus = (task: Task) => {
    if (task.isCompleted) {
      return { 
        label: t('status.completed'), 
        variant: 'default' as const,
        icon: <CheckCircle2 className="h-3 w-3 mr-1" />
      };
    }
    
    const today = new Date();
    const taskDate = new Date(task.expectedEndDate);
    const diffTime = taskDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { 
        label: t('statistics.overdue_tasks'), 
        variant: 'destructive' as const,
        icon: <AlertCircle className="h-3 w-3 mr-1" />
      };
    } else if (diffDays <= 3) {
      return { 
        label: t('common.urgent'), 
        variant: 'destructive' as const,
        icon: <AlertCircle className="h-3 w-3 mr-1" />
      };
    } else {
      return { 
        label: t('status.in_progress'), 
        variant: 'secondary' as const,
        icon: <Clock className="h-3 w-3 mr-1" />
      };
    }
  };

  if (isLoading) {
    return (
      <Card className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            {t('dashboard.upcoming_deadlines')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            {t('common.loading')}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-500" />
          {t('dashboard.upcoming_deadlines')}
        </CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors"
        >
          {t('dashboard.view_all')}
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {upcomingTasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {t('dashboard.no_upcoming_tasks')}
            </div>
          ) : (
            upcomingTasks.slice(0, 5).map((task) => {
              const status = getTaskStatus(task);
              const isOverdue = status.variant === 'destructive';
              const isCompleted = task.isCompleted;
              
              return (
                <div 
                  key={task.id} 
                  className={cn(
                    "group flex items-start gap-3 p-4 rounded-lg transition-all duration-200",
                    "hover:bg-slate-50/80 hover:shadow-sm border border-slate-200/50",
                    isOverdue && "bg-red-50/50 hover:bg-red-50/80",
                    isCompleted && "bg-green-50/50 hover:bg-green-50/80"
                  )}
                >
                  <div className={cn(
                    "mt-0.5 p-2 rounded-md transition-colors duration-200",
                    isOverdue ? "bg-red-100" : 
                    isCompleted ? "bg-green-100" : 
                    "bg-blue-50 group-hover:bg-blue-100"
                  )}>
                    {getTaskIcon(task)}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <p className={cn(
                      "font-medium text-sm leading-none text-balance",
                      isOverdue && "text-red-700",
                      isCompleted && "text-green-700"
                    )}>
                      {task.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Building className="h-3 w-3" />
                      <span>{task.projectName}</span>
                      <span className="text-slate-300">•</span>
                      <span>{task.stageName}</span>
                    </div>
                    <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        <span>{t('forms.start_date')}: {formatDate(task.startDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarRange className="h-3 w-3" />
                        <span>{t('forms.expected_end_date')}: {formatDate(task.expectedEndDate)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge 
                      variant={status.variant} 
                      className={cn(
                        "text-xs px-2 py-1 transition-colors duration-200 flex items-center",
                        isOverdue && "bg-red-100 text-red-700 hover:bg-red-200",
                        isCompleted && "bg-green-100 text-green-700 hover:bg-green-200"
                      )}
                    >
                      {status.icon}
                      {status.label}
                    </Badge>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingTasks;
