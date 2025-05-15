
import React, { useState, useEffect } from 'react';
import { Worker, getAllWorkers } from '@/services/workerService';
import { WorkerMultiSelect } from './WorkerMultiSelect';
import { useTaskWorkers } from '@/hooks/useTaskWorkers';
import { getTaskById } from '@/services/taskService';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface TaskAssignWorkersProps {
  taskId: number;
  onWorkersAssigned?: () => void;
}

export function TaskAssignWorkers({ taskId, onWorkersAssigned }: TaskAssignWorkersProps) {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [selectedWorkers, setSelectedWorkers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { 
    handleWorkerAssignment, 
    isAssigning, 
    assignedWorkers, 
    setAssignedWorkers, 
    removeWorker 
  } = useTaskWorkers(taskId);

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
          setAssignedWorkers(taskDetails.data.workers);
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
  }, [taskId, setAssignedWorkers]);

  // Handle worker selection change and update assignment
  const handleSelectionChange = async (selectedWorkers: any[]) => {
    try {
      const success = await handleWorkerAssignment(selectedWorkers);
      if (success) {
        setSelectedWorkers(selectedWorkers);
        if (onWorkersAssigned) {
          onWorkersAssigned();
        }
      }
    } catch (error) {
      console.error('Error in worker assignment:', error);
    }
  };

  // Handle worker removal
  const handleRemoveWorker = async (workerId: number) => {
    try {
      const success = await removeWorker(workerId);
      if (success) {
        // Update local selected workers state
        const updatedWorkers = selectedWorkers.filter(worker => worker.id !== workerId);
        setSelectedWorkers(updatedWorkers);
        
        if (onWorkersAssigned) {
          onWorkersAssigned();
        }
      }
    } catch (error) {
      console.error('Error removing worker:', error);
    }
  };

  return (
    <div className="space-y-4">
      <WorkerMultiSelect
        workers={workers}
        selectedWorkers={selectedWorkers}
        onSelectionChange={handleSelectionChange}
        placeholder="تعيين العمال..."
        className="w-full"
        disabled={isAssigning}
        isLoading={isLoading}
      />

      {/* Assigned workers display with remove option */}
      {assignedWorkers && assignedWorkers.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">العمال المعينون:</h4>
          <div className="flex flex-wrap gap-2">
            {assignedWorkers.map((worker) => (
              <Badge 
                key={worker.id} 
                variant="secondary"
                className="flex items-center gap-1 py-1 px-2"
              >
                {worker.fullName}
                <button
                  onClick={() => handleRemoveWorker(worker.id)}
                  className="ml-1 text-muted-foreground hover:text-foreground transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={isAssigning}
                  aria-label={`إزالة ${worker.fullName}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
