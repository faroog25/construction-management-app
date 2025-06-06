import React, { useState, useEffect } from 'react';
import { getTaskById, TaskDetailResponse, completeTask, uncheckTask, getWorkersForTask } from '@/services/taskService';
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
import { 
  Calendar, Clock, CalendarClock, ListTodo, Users, 
  CheckCircle, AlertCircle, X, Pencil, FileText, 
  Upload, FileUp, Plus, Loader2 
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { EditTaskModal } from './EditTaskModal';
import { Document } from '@/types/document';
import { Badge } from '@/components/ui/badge';
import { getDocumentsByTask } from '@/services/documentService';
import { TaskDocumentList } from '@/components/documents/TaskDocumentList';
import { UploadDocumentDialog } from '@/components/documents/UploadDocumentDialog';

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: number | null;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ar-SA', { month: 'short', day: 'numeric', year: 'numeric' });
};

export default function TaskDetailsModal({ isOpen, onClose, taskId }: TaskDetailsModalProps) {
  const [taskData, setTaskData] = useState<TaskDetailResponse | null>(null);
  const [assignedWorkers, setAssignedWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [loadingWorkers, setLoadingWorkers] = useState(false);
  const [taskDocuments, setTaskDocuments] = useState<Document[]>([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const fetchTaskDetails = async () => {
    if (!taskId) return;
    
    try {
      setLoading(true);
      const data = await getTaskById(taskId);
      setTaskData(data);
      
      await fetchAssignedWorkers(taskId);
      await fetchTaskDocuments(taskId);
    } catch (error) {
      console.error('Error fetching task details:', error);
      toast({
        title: "Error",
        description: "Failed to load task details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const fetchAssignedWorkers = async (taskId: number) => {
    try {
      setLoadingWorkers(true);
      const workers = await getWorkersForTask(taskId);
      setAssignedWorkers(workers);
    } catch (error) {
      console.error('Error fetching assigned workers:', error);
      setAssignedWorkers([]);
    } finally {
      setLoadingWorkers(false);
    }
  };

  const fetchTaskDocuments = async (taskId: number) => {
    try {
      setLoadingDocuments(true);
      const documents = await getDocumentsByTask(taskId);
      setTaskDocuments(documents);
    } catch (error) {
      console.error('Error fetching task documents:', error);
      setTaskDocuments([]);
    } finally {
      setLoadingDocuments(false);
    }
  };

  useEffect(() => {
    if (isOpen && taskId) {
      fetchTaskDetails();
    }
  }, [isOpen, taskId]);

  const handleWorkersAssigned = () => {
    if (taskId) {
      fetchAssignedWorkers(taskId);
    }
  };

  const handleTaskUpdated = () => {
    fetchTaskDetails();
  };

  const handleDocumentUploaded = () => {
    if (taskId) {
      fetchTaskDocuments(taskId);
    }
  };

  const handleDocumentUpdated = () => {
    if (taskId) {
      fetchTaskDocuments(taskId);
    }
  };

  const handleToggleTaskCompletion = async () => {
    if (!taskId || !taskData) return;
    
    setIsCompleting(true);
    
    try {
      const isTaskCompleted = taskData.data.isCompleted;
      
      let result;
      if (isTaskCompleted) {
        result = await uncheckTask(taskId);
      } else {
        result = await completeTask(taskId);
      }
      
      if (result.success) {
        toast({
          title: "Success",
          description: isTaskCompleted ? "Task uncompleted successfully" : "Task completed successfully"
        });
        
        setTaskData(prev => {
          if (!prev) return null;
          return {
            ...prev,
            data: {
              ...prev.data,
              isCompleted: !isTaskCompleted
            }
          };
        });
      } else {
        toast({
          title: "Error",
          description: result.message || (isTaskCompleted ? "Failed to uncomplete task" : "Failed to complete task"),
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error toggling task completion:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to change task status",
        variant: "destructive"
      });
    } finally {
      setIsCompleting(false);
    }
  };

  if (!taskId) return null;

  const projectId = taskData?.data?.projectId || 0;
  
  console.log("Task Details - Project ID:", projectId);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold">Task Details</DialogTitle>
              <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <DialogDescription className="text-base">
              View task details, workers and documents
            </DialogDescription>
          </DialogHeader>

          {loading ? (
            <div className="py-12 flex justify-center items-center">
              <div className="h-12 w-12 border-4 border-t-primary animate-spin rounded-full"></div>
            </div>
          ) : taskData?.data ? (
            <Tabs defaultValue="details" className="w-full mt-6">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="details" className="text-sm">Task Details</TabsTrigger>
                <TabsTrigger value="workers" className="text-sm">Workers</TabsTrigger>
                <TabsTrigger value="documents" className="text-sm">Documents</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-8">
                <Card className="overflow-hidden border shadow-sm">
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-2xl font-semibold">{taskData.data.name}</h3>
                          <Badge variant={taskData.data.isCompleted ? "success" : "warning"} className="text-sm py-1 px-3">
                            {taskData.data.isCompleted ? "Completed" : "In Progress"}
                          </Badge>
                        </div>
                        <p className="text-gray-600">
                          {taskData.data.description || 'No description available for this task'}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setEditModalOpen(true)}
                          className="h-10 px-4 flex items-center gap-2"
                        >
                          <Pencil className="h-4 w-4" />
                          Edit Task
                        </Button>

                        <div className="flex items-center gap-3 bg-gray-50 p-2 px-4 rounded-lg border">
                          <Checkbox
                            id="complete-task"
                            checked={taskData.data.isCompleted}
                            onCheckedChange={handleToggleTaskCompletion}
                            disabled={isCompleting}
                            className={cn(
                              "h-6 w-6 rounded-md transition-all duration-200 border-2",
                              "data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500",
                              "focus-visible:ring-2 focus-visible:ring-green-200"
                            )}
                          />
                          {isCompleting ? (
                            <div className="h-5 w-5 border-2 border-t-transparent border-green-600 rounded-full animate-spin"></div>
                          ) : (
                            <span className="text-sm text-green-700 font-medium">
                              {taskData.data.isCompleted ? "Cancel Completion" : "Complete Task"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-5">
                        <h4 className="font-medium text-lg text-gray-700">Task Information</h4>
                        <div className="space-y-4">
                          <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                            <div className="bg-blue-100 p-3 rounded-lg">
                              <Calendar className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Start Date</p>
                              <p className="text-base font-medium">{formatDate(taskData.data.startDate)}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
                            <div className="bg-amber-100 p-3 rounded-lg">
                              <CalendarClock className="h-6 w-6 text-amber-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Expected End Date</p>
                              <p className="text-base font-medium">{formatDate(taskData.data.endDate || taskData.data.expectedEndDate || '')}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-5">
                        <h4 className="font-medium text-lg text-gray-700">Assigned Workers</h4>
                        {loadingWorkers ? (
                          <div className="flex justify-center py-6">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                          </div>
                        ) : assignedWorkers && assignedWorkers.length > 0 ? (
                          <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                            <div className="flex flex-col gap-3">
                              {assignedWorkers.map((worker) => (
                                <div key={worker.id} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm border border-green-50">
                                  <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                                      <Users className="h-5 w-5 text-green-600" />
                                    </div>
                                    <span className="text-base font-medium">{worker.fullName}</span>
                                  </div>
                                  {worker.specialty && (
                                    <Badge variant="outline" className="text-xs bg-green-50">
                                      {worker.specialty}
                                    </Badge>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="p-6 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-center">
                            <Users className="h-10 w-10 mx-auto text-gray-400 mb-3" />
                            <p className="text-gray-500">No workers assigned to this task</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="workers">
                <Card className="border shadow-sm">
                  <CardContent className="p-8">
                    <h4 className="text-xl font-semibold mb-6 flex items-center text-gray-800">
                      <Users className="mr-3 h-6 w-6 text-primary" /> Assign Workers to Task
                    </h4>
                    <p className="text-gray-600 mb-8">Select workers who will work on this task from the list below</p>
                    <TaskAssignWorkers 
                      taskId={taskId} 
                      onWorkersAssigned={handleWorkersAssigned} 
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="documents" className="space-y-6">
                <Card className="border shadow-sm">
                  <CardContent className="p-8">
                    <div className="flex flex-col space-y-6">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <h4 className="text-xl font-semibold flex items-center text-gray-800">
                          <FileText className="mr-3 h-6 w-6 text-primary" /> Task Documents
                        </h4>
                        
                        <Button 
                          onClick={() => setUploadDialogOpen(true)}
                          className="bg-primary hover:bg-primary/90"
                        >
                          <FileUp className="mr-2 h-4 w-4" />
                          Upload New Document
                        </Button>
                      </div>
                      
                      <Separator className="my-2" />
                      
                      <TaskDocumentList 
                        documents={taskDocuments}
                        isLoading={loadingDocuments}
                        onDocumentUpdated={handleDocumentUpdated}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-500">No data available</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Task Modal */}
      {taskData && (
        <EditTaskModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onTaskUpdated={handleTaskUpdated}
          task={{
            id: taskData.data.id,
            name: taskData.data.name,
            description: taskData.data.description || '',
          }}
        />
      )}

      {/* Upload Document Dialog */}
      {taskId && (
        <UploadDocumentDialog
          isOpen={uploadDialogOpen}
          onClose={() => setUploadDialogOpen(false)}
          taskId={taskId}
          projectId={projectId}
          onUploadSuccess={handleDocumentUploaded}
        />
      )}
    </>
  );
}
