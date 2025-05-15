
import React, { useState, useEffect } from 'react';
import { Worker, getAllWorkers } from '@/services/workerService';
import { WorkerMultiSelect } from './WorkerMultiSelect';
import { useTaskWorkers } from '@/hooks/useTaskWorkers';
import { getTaskById } from '@/services/taskService';
import { toast } from '@/hooks/use-toast';

interface TaskAssignWorkersProps {
  taskId: number;
  onWorkersAssigned?: () => void;
}

export function TaskAssignWorkers({ taskId, onWorkersAssigned }: TaskAssignWorkersProps) {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [selectedWorkers, setSelectedWorkers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { handleWorkerAssignment, isAssigning } = useTaskWorkers(taskId);

  // Load all available workers and current task workers
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all available workers
        const workersData = await getAllWorkers();
        setWorkers(workersData);
        
        // Fetch the task details to get currently assigned workers
        const taskDetails = await getTaskById(taskId);
        if (taskDetails.success && taskDetails.data.workers) {
          setSelectedWorkers(taskDetails.data.workers);
        }
      } catch (error) {
        console.error('Error loading workers data:', error);
        toast({
          title: "خطأ",
          description: "فشل في تحميل بيانات العمال",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (taskId) {
      loadData();
    }
  }, [taskId]);

  // Handle worker selection change and update assignment
  const handleSelectionChange = async (selectedWorkers: any[]) => {
    try {
      const success = await handleWorkerAssignment(selectedWorkers);
      if (success && onWorkersAssigned) {
        onWorkersAssigned();
      }
    } catch (error) {
      console.error('Error in worker assignment:', error);
    }
  };

  return (
    <WorkerMultiSelect
      workers={workers}
      selectedWorkers={selectedWorkers}
      onSelectionChange={handleSelectionChange}
      placeholder="Assign workers..."
      className="w-full"
      disabled={isAssigning}
      isLoading={isLoading}
    />
  );
}
