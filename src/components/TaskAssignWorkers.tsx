
import React, { useState, useEffect } from 'react';
import { Worker, getAllWorkers } from '@/services/workerService';
import { WorkerMultiSelect } from './WorkerMultiSelect';
import { useTaskWorkers } from '@/hooks/useTaskWorkers';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface TaskAssignWorkersProps {
  taskId: number;
  onWorkersAssigned?: () => void;
}

export function TaskAssignWorkers({ taskId, onWorkersAssigned }: TaskAssignWorkersProps) {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [selectedWorkers, setSelectedWorkers] = useState<Worker[]>([]);
  const [isLoadingWorkers, setIsLoadingWorkers] = useState(true);
  
  const { 
    handleWorkerAssignment, 
    isAssigning, 
    isLoading: isLoadingAssignedWorkers,
    assignedWorkers,
    removeWorker 
  } = useTaskWorkers(taskId);

  // Load all available workers
  useEffect(() => {
    const loadWorkers = async () => {
      try {
        setIsLoadingWorkers(true);
        
        // Fetch all available workers
        const workersData = await getAllWorkers();
        setWorkers(workersData);
      } catch (error) {
        console.error('Error loading workers data:', error);
        toast({
          title: "خطأ",
          description: "فشل في تحميل بيانات العمال",
          variant: "destructive"
        });
      } finally {
        setIsLoadingWorkers(false);
      }
    };
    
    if (taskId) {
      loadWorkers();
    }
  }, [taskId]);

  // Update selected workers whenever assigned workers change
  useEffect(() => {
    setSelectedWorkers(assignedWorkers);
  }, [assignedWorkers]);

  // Handle worker selection change and update assignment
  const handleSelectionChange = async (workers: Worker[]) => {
    try {
      const success = await handleWorkerAssignment(workers);
      if (success && onWorkersAssigned) {
        onWorkersAssigned();
      }
    } catch (error) {
      console.error('Error in worker assignment:', error);
    }
  };

  // Handle worker removal
  const handleRemoveWorker = async (workerId: number) => {
    try {
      const success = await removeWorker(workerId);
      if (success && onWorkersAssigned) {
        onWorkersAssigned();
      }
    } catch (error) {
      console.error('Error removing worker:', error);
    }
  };

  const isLoading = isLoadingWorkers || isLoadingAssignedWorkers;

  // Helper function to get worker name safely
  const getWorkerName = (worker: Worker): string => {
    // Try to use fullName if available
    if ('fullName' in worker && worker.fullName) {
      return worker.fullName;
    }
    
    // If we have individual name parts, construct the full name
    if ('firstName' in worker && worker.firstName) {
      const nameParts = [
        worker.firstName,
        worker.secondName,
        worker.thirdName,
        worker.lastName
      ].filter(Boolean);
      return nameParts.join(' ');
    }
    
    // Last resort fallback
    return `Worker #${worker.id}`;
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
                {getWorkerName(worker)}
                <button
                  onClick={() => handleRemoveWorker(worker.id)}
                  className="ml-1 text-muted-foreground hover:text-foreground transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={isAssigning}
                  aria-label={`إزالة ${getWorkerName(worker)}`}
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
