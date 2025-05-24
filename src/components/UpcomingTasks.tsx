
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock, Plus, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getUpcomingTasks } from '@/services/taskService';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

const UpcomingTasks = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ['upcomingTasks'],
    queryFn: () => getUpcomingTasks(60),
  });

  const handleAddTask = () => {
    // Navigate to tasks page or open task creation modal
    navigate('/tasks');
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {t('upcomingTasks')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {t('upcomingTasks')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">حدث خطأ في تحميل المهام</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              حاول مرة أخرى
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          {t('upcomingTasks')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Clock className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">لا توجد مهام قادمة</h3>
            <p className="text-muted-foreground mb-4">لم يتم العثور على أي مهام قادمة خلال الـ 60 يوم القادمة</p>
            <Button onClick={handleAddTask} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              إضافة مهمة جديدة
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.slice(0, 5).map((task) => (
              <div key={task.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{task.name}</h4>
                    <Badge variant={task.isCompleted ? "secondary" : "outline"}>
                      {task.isCompleted ? "مكتملة" : "قيد التنفيذ"}
                    </Badge>
                  </div>
                  {task.description && (
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{task.projectName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>المرحلة: {task.stageName}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {new Date(task.expectedEndDate).toLocaleDateString('ar-SA')}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    التاريخ المتوقع للانتهاء
                  </div>
                </div>
              </div>
            ))}
            {tasks.length > 5 && (
              <div className="text-center">
                <Button variant="outline" onClick={() => navigate('/tasks')}>
                  عرض جميع المهام ({tasks.length})
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingTasks;
