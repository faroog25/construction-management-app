
import { useState, useEffect } from 'react';
import { Worker } from '@/services/workerService';
import { assignWorkersToTask, getWorkersForTask, unassignWorkersFromTask } from '@/services/taskService';
import { toast } from '@/hooks/use-toast';

export function useTaskWorkers(taskId: number) {
  const [isAssigning, setIsAssigning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [assignedWorkers, setAssignedWorkers] = useState<Worker[]>([]);

  // Fetch assigned workers when taskId changes
  useEffect(() => {
    if (!taskId) return;

    const fetchAssignedWorkers = async () => {
      try {
        setIsLoading(true);
        
        // Use the new API endpoint to fetch workers assigned to this task
        const workers = await getWorkersForTask(taskId);
        setAssignedWorkers(workers as unknown as Worker[]);
      } catch (error) {
        console.error('Error fetching assigned workers:', error);
        setAssignedWorkers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignedWorkers();
  }, [taskId]);

  const handleWorkerAssignment = async (selectedWorkers: Worker[]) => {
    if (!taskId) return false;
    
    try {
      setIsAssigning(true);
      
      // Prepare worker IDs for the API request
      const workerIds = selectedWorkers.map(worker => worker.id);
      
      console.log('Assigning workers to task', taskId, 'Worker IDs:', workerIds);
      
      // Make the API request to assign workers
      const result = await assignWorkersToTask({
        taskId,
        workerIds
      });
      
      // Update the local state with the selected workers
      setAssignedWorkers(selectedWorkers);
      
      // Show a success toast
      toast({
        title: "تم تعيين العمال",
        description: result.message || "تم تعيين العمال للمهمة بنجاح",
      });
      
      return true;
    } catch (error) {
      console.error('Error assigning workers:', error);
      // Show an error toast
      toast({
        title: "فشل تعيين العمال",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء تعيين العمال للمهمة",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsAssigning(false);
    }
  };
  
  const removeWorker = async (workerId: number) => {
    if (!taskId) return false;
    
    try {
      setIsAssigning(true);
      
      console.log('Removing worker', workerId, 'from task', taskId);
      
      // استخدام API إلغاء التعيين الجديد
      const result = await unassignWorkersFromTask({
        taskId,
        workerIds: [workerId]
      });
      
      // تحديث الحالة المحلية بإزالة العامل
      const updatedWorkers = assignedWorkers.filter(worker => worker.id !== workerId);
      setAssignedWorkers(updatedWorkers);
      
      // إظهار رسالة نجاح
      toast({
        title: "تم إزالة العامل",
        description: "تم إزالة العامل من المهمة بنجاح",
      });
      
      return true;
    } catch (error) {
      console.error('Error removing worker:', error);
      // إظهار رسالة خطأ
      toast({
        title: "فشل إزالة العامل",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء إزالة العامل من المهمة",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsAssigning(false);
    }
  };

  return {
    isLoading,
    isAssigning,
    assignedWorkers,
    setAssignedWorkers,
    handleWorkerAssignment,
    removeWorker
  };
}
