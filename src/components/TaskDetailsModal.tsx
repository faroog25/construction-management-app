
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getTaskById, TaskDetailResponse } from '@/services/taskService';
import { Calendar, CheckCircle, Clock, Info, User, AlertCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: number | null;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  isOpen,
  onClose,
  taskId,
}) => {
  const [loading, setLoading] = useState(false);
  const [taskDetails, setTaskDetails] = useState<TaskDetailResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && taskId) {
      setLoading(true);
      setError(null);
      
      getTaskById(taskId)
        .then((response) => {
          setTaskDetails(response);
        })
        .catch((err) => {
          setError(err.message || 'Failed to load task details');
          toast({
            title: "Error",
            description: "Could not load task details. Please try again.",
            variant: "destructive",
          });
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setTaskDetails(null);
    }
  }, [isOpen, taskId, toast]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Calculate overdue days
  const calculateOverdueDays = (endDate: string) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = today.getTime() - end.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Determine task status based on completion and dates
  const getTaskStatus = (isCompleted: boolean, startDate: string, endDate: string) => {
    if (isCompleted) {
      return { status: 'completed', label: 'Completed', className: 'bg-green-100 text-green-800', icon: CheckCircle };
    }
    
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now > end) {
      return { status: 'delayed', label: 'Delayed', className: 'bg-red-100 text-red-800', icon: AlertCircle };
    } else if (now >= start) {
      return { status: 'in-progress', label: 'In Progress', className: 'bg-blue-100 text-blue-800', icon: Clock };
    } else {
      return { status: 'not-started', label: 'Not Started', className: 'bg-gray-100 text-gray-800', icon: Info };
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="h-8 w-8 border-4 border-t-primary animate-spin rounded-full"></div>
          </div>
        ) : error ? (
          <div className="text-center py-6">
            <XCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
            <DialogTitle className="text-red-600">Error Loading Task</DialogTitle>
            <DialogDescription className="mt-2">{error}</DialogDescription>
          </div>
        ) : taskDetails?.data ? (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl font-bold">{taskDetails.data.name}</DialogTitle>
                {(() => {
                  const status = getTaskStatus(
                    taskDetails.data.isCompleted,
                    taskDetails.data.startDate,
                    taskDetails.data.endDate
                  );
                  const StatusIcon = status.icon;
                  return (
                    <Badge className={cn(status.className, "px-3 py-1")}>
                      <StatusIcon className="h-3.5 w-3.5 mr-1" />
                      {status.label}
                    </Badge>
                  );
                })()}
              </div>
              <DialogDescription className="mt-2 text-base">
                {taskDetails.data.description || 'No description provided'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 bg-slate-50">
                  <div className="flex items-start space-x-2">
                    <Calendar className="h-5 w-5 text-slate-500 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-slate-700">Start Date</h4>
                      <p className="text-sm">{formatDate(taskDetails.data.startDate)}</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4 bg-slate-50">
                  <div className="flex items-start space-x-2">
                    <Calendar className="h-5 w-5 text-slate-500 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-slate-700">End Date</h4>
                      <p className="text-sm">{formatDate(taskDetails.data.endDate)}</p>
                      {calculateOverdueDays(taskDetails.data.endDate) > 0 && !taskDetails.data.isCompleted && (
                        <Badge variant="destructive" className="mt-1 text-xs">
                          Overdue by {calculateOverdueDays(taskDetails.data.endDate)} days
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
              
              <Card className="p-4">
                <h3 className="text-sm font-medium mb-3 flex items-center">
                  <User className="h-4 w-4 mr-1.5 text-slate-500" />
                  Assigned Workers
                </h3>
                
                {taskDetails.data.workers && taskDetails.data.workers.length > 0 ? (
                  <div className="space-y-2">
                    {taskDetails.data.workers.map((worker) => (
                      <div key={worker.id} className="flex items-center space-x-2 p-2 bg-slate-50 rounded-md">
                        <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
                          <User className="h-4 w-4 text-slate-500" />
                        </div>
                        <span>{worker.fullName}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">No workers assigned to this task</p>
                )}
              </Card>
              
              <div className="flex items-center">
                <div className="flex-1 h-px bg-slate-200"></div>
                <span className="px-3 text-xs text-slate-500">Task #{taskDetails.data.id}</span>
                <div className="flex-1 h-px bg-slate-200"></div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <Info className="h-10 w-10 text-blue-500 mx-auto mb-2" />
            <DialogTitle>No Task Selected</DialogTitle>
            <DialogDescription className="mt-2">
              Please select a task to view its details.
            </DialogDescription>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailsModal;
