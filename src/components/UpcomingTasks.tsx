
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, ChevronRight, Building, FileText, Calendar } from 'lucide-react';
import { getUpcomingTasks } from '@/services/taskService';
import { useLanguage } from '@/contexts/LanguageContext';
import { format } from 'date-fns';

const UpcomingTasks = () => {
  const { t } = useLanguage();

  const { data: upcomingTasks = [], isLoading } = useQuery({
    queryKey: ['upcoming-tasks'],
    queryFn: () => getUpcomingTasks(60),
  });

  const getTaskIcon = (type: string) => {
    return <FileText className="h-4 w-4 text-blue-500" />;
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd');
    } catch {
      return dateString;
    }
  };

  const getTaskStatus = (task: any) => {
    if (task.isCompleted) {
      return { label: t('status.completed'), variant: 'default' as const };
    }
    
    const today = new Date();
    const taskDate = new Date(task.expectedEndDate);
    const diffTime = taskDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { label: t('statistics.overdue_tasks'), variant: 'destructive' as const };
    } else if (diffDays <= 3) {
      return { label: t('common.urgent'), variant: 'destructive' as const };
    } else {
      return { label: t('status.in_progress'), variant: 'secondary' as const };
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
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
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          {t('dashboard.upcoming_deadlines')}
        </CardTitle>
        <Button variant="ghost" size="sm" className="text-sm">
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
              return (
                <div 
                  key={task.id} 
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border"
                >
                  <div className="mt-0.5">{getTaskIcon('task')}</div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="font-medium text-sm leading-none text-balance">{task.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Building className="h-3 w-3" />
                      <span>{task.projectName}</span>
                      <span>•</span>
                      <span>{task.stageName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{t('forms.expected_end_date')}: {formatDate(task.expectedEndDate)}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant={status.variant} className="text-xs">
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
