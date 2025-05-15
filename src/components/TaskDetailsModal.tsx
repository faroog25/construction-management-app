
import React, { useState, useEffect } from 'react';
import { getTaskById, TaskDetailResponse } from '@/services/taskService';
import { toast } from '@/components/ui/use-toast';
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
import { Calendar, Clock, CalendarClock, ListTodo, Users } from 'lucide-react';

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
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">{taskData.data.name}</h3>
                <p className="text-gray-600 text-sm">{taskData.data.description || 'لا يوجد وصف'}</p>
                
                <Separator className="my-4" />
                
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
                  
                  <div className="flex items-center gap-2">
                    <ListTodo className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">الحالة</p>
                      <p className="text-sm font-medium">
                        {taskData.data.isCompleted ? 'مكتملة' : 'قيد التنفيذ'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <Users className="mr-1 h-4 w-4" /> تعيين العمال
              </h4>
              <TaskAssignWorkers 
                taskId={taskId} 
                onWorkersAssigned={handleWorkersAssigned} 
              />
            </div>
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-gray-500">لا توجد بيانات متاحة</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
