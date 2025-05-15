
import React, { useState, useEffect } from 'react';
import { getTaskById, TaskDetailResponse } from '@/services/taskService';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TaskAssignWorkers } from './TaskAssignWorkers';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, CalendarClock, ListTodo, Users, CheckCircle, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: number | null;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export default function TaskDetailsModal({ isOpen, onClose, taskId }: TaskDetailsModalProps) {
  const [taskData, setTaskData] = useState<TaskDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchTaskDetails = async () => {
    if (!taskId) return;
    
    try {
      setLoading(true);
      const data = await getTaskById(taskId);
      setTaskData(data);
    } catch (error) {
      console.error('Error fetching task details:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل تفاصيل المهمة",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && taskId) {
      fetchTaskDetails();
    }
  }, [isOpen, taskId]);

  // Handler when workers are successfully assigned
  const handleWorkersAssigned = () => {
    fetchTaskDetails();
  };

  if (!taskId) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">تفاصيل المهمة</DialogTitle>
          <DialogDescription>
            عرض تفاصيل المهمة وتعيين العمال
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-8 flex justify-center">
            <div className="h-8 w-8 border-4 border-t-primary animate-spin rounded-full"></div>
          </div>
        ) : taskData?.data ? (
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="details">تفاصيل المهمة</TabsTrigger>
              <TabsTrigger value="workers">تعيين العمال</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{taskData.data.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        {taskData.data.isCompleted ? (
                          <span className="flex items-center gap-1">
                            <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                            مكتملة
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                            قيد التنفيذ
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-3" />
                  
                  <div className="text-sm text-gray-700 mb-4">
                    {taskData.data.description || 'لا يوجد وصف'}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">تاريخ البدء</p>
                        <p className="text-sm font-medium">{formatDate(taskData.data.startDate)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <CalendarClock className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">تاريخ الانتهاء</p>
                        <p className="text-sm font-medium">{formatDate(taskData.data.endDate)}</p>
                      </div>
                    </div>
                  </div>
                  
                  {taskData.data.workers && taskData.data.workers.length > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <p className="text-xs text-gray-500">العمال المعينون</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {taskData.data.workers.map((worker) => (
                          <span key={worker.id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {worker.fullName}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="workers">
              <Card>
                <CardContent className="pt-6">
                  <h4 className="text-sm font-medium mb-3 flex items-center">
                    <Users className="mr-1 h-4 w-4" /> تعيين العمال للمهمة
                  </h4>
                  <p className="text-xs text-gray-500 mb-3">اختر العمال الذين سيعملون على هذه المهمة</p>
                  <TaskAssignWorkers 
                    taskId={taskId} 
                    onWorkersAssigned={handleWorkersAssigned} 
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="py-8 text-center">
            <p className="text-gray-500">لا توجد بيانات متاحة</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
