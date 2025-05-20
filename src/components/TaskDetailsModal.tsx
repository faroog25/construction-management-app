
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
  Upload, Download, FileUp, Plus, Loader2 
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { EditTaskModal } from './EditTaskModal';
import { Document } from '@/types/document';
import { Badge } from '@/components/ui/badge';
import { getDocumentsByTask } from '@/services/documentService';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

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
  const [assignedWorkers, setAssignedWorkers] = useState<any[]>([]); // Changed type to any[] to resolve TypeScript error
  const [loading, setLoading] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [loadingWorkers, setLoadingWorkers] = useState(false);
  const [taskDocuments, setTaskDocuments] = useState<Document[]>([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState('');
  const [documentDescription, setDocumentDescription] = useState('');

  const fetchTaskDetails = async () => {
    if (!taskId) return;
    
    try {
      setLoading(true);
      const data = await getTaskById(taskId);
      setTaskData(data);
      
      // Fetch assigned workers separately using the new API endpoint
      await fetchAssignedWorkers(taskId);
      await fetchTaskDocuments(taskId);
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
  
  const fetchAssignedWorkers = async (taskId: number) => {
    try {
      setLoadingWorkers(true);
      const workers = await getWorkersForTask(taskId);
      setAssignedWorkers(workers); // Using any[] type to avoid type mismatch
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

  // Handler when workers are successfully assigned
  const handleWorkersAssigned = () => {
    if (taskId) {
      fetchAssignedWorkers(taskId);
    }
  };

  // Handler when task is successfully edited
  const handleTaskUpdated = () => {
    fetchTaskDetails();
  };

  // Handle task completion or unchecking
  const handleToggleTaskCompletion = async () => {
    if (!taskId || !taskData) return;
    
    setIsCompleting(true);
    
    try {
      // Determine if we need to complete or uncheck the task
      const isTaskCompleted = taskData.data.isCompleted;
      
      let result;
      if (isTaskCompleted) {
        // Task is already completed, uncheck it
        result = await uncheckTask(taskId);
      } else {
        // Task is not completed, complete it
        result = await completeTask(taskId);
      }
      
      if (result.success) {
        toast({
          title: "تم بنجاح",
          description: isTaskCompleted ? "تم إلغاء اكتمال المهمة بنجاح" : "تم إكمال المهمة بنجاح"
        });
        
        // Update the local state to show the task as completed/uncompleted
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
          title: "خطأ",
          description: result.message || (isTaskCompleted ? "فشل في إلغاء اكتمال المهمة" : "فشل في إكمال المهمة"),
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error toggling task completion:', error);
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "فشل في تغيير حالة المهمة",
        variant: "destructive"
      });
    } finally {
      setIsCompleting(false);
    }
  };

  // Handle document file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setDocumentFile(file);
      // If no name is provided, use the file name
      if (!documentName) {
        setDocumentName(file.name);
      }
    }
  };

  // Handle document upload
  const handleDocumentUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!taskId || !documentFile) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار ملف للرفع",
        variant: "destructive"
      });
      return;
    }

    setUploadingDocument(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', documentFile);
      formData.append('name', documentName || documentFile.name);
      formData.append('description', documentDescription || '');
      formData.append('taskId', taskId.toString());
      
      // Simulate API call for document upload (replace with actual API)
      // This is a placeholder - you'll need to implement the actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "تم بنجاح",
        description: "تم رفع المستند بنجاح"
      });

      // Reset form
      setDocumentFile(null);
      setDocumentName('');
      setDocumentDescription('');
      
      // Refresh documents list
      fetchTaskDocuments(taskId);
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: "خطأ",
        description: "فشل في رفع المستند",
        variant: "destructive"
      });
    } finally {
      setUploadingDocument(false);
    }
  };

  if (!taskId) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold">تفاصيل المهمة</DialogTitle>
              <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <DialogDescription className="text-base">
              عرض تفاصيل المهمة، العمال والمستندات
            </DialogDescription>
          </DialogHeader>

          {loading ? (
            <div className="py-12 flex justify-center items-center">
              <div className="h-12 w-12 border-4 border-t-primary animate-spin rounded-full"></div>
            </div>
          ) : taskData?.data ? (
            <Tabs defaultValue="details" className="w-full mt-6">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="details" className="text-sm">تفاصيل المهمة</TabsTrigger>
                <TabsTrigger value="workers" className="text-sm">العمال</TabsTrigger>
                <TabsTrigger value="documents" className="text-sm">المستندات</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-8">
                <Card className="overflow-hidden border shadow-sm">
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-2xl font-semibold">{taskData.data.name}</h3>
                          <Badge variant={taskData.data.isCompleted ? "success" : "warning"} className="text-sm py-1 px-3">
                            {taskData.data.isCompleted ? "مكتملة" : "جارية"}
                          </Badge>
                        </div>
                        <p className="text-gray-600">
                          {taskData.data.description || 'لا يوجد وصف لهذه المهمة'}
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
                          تعديل المهمة
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
                              {taskData.data.isCompleted ? "إلغاء الاكتمال" : "إكمال المهمة"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-5">
                        <h4 className="font-medium text-lg text-gray-700">معلومات المهمة</h4>
                        <div className="space-y-4">
                          <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                            <div className="bg-blue-100 p-3 rounded-lg">
                              <Calendar className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">تاريخ البدء</p>
                              <p className="text-base font-medium">{formatDate(taskData.data.startDate)}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
                            <div className="bg-amber-100 p-3 rounded-lg">
                              <CalendarClock className="h-6 w-6 text-amber-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">تاريخ الانتهاء المتوقع</p>
                              <p className="text-base font-medium">{formatDate(taskData.data.endDate || taskData.data.expectedEndDate || '')}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-5">
                        <h4 className="font-medium text-lg text-gray-700">العمال المعينون</h4>
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
                            <p className="text-gray-500">لم يتم تعيين أي عمال لهذه المهمة</p>
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
                      <Users className="mr-3 h-6 w-6 text-primary" /> تعيين العمال للمهمة
                    </h4>
                    <p className="text-gray-600 mb-8">اختر العمال الذين سيعملون على هذه المهمة من القائمة أدناه</p>
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
                    <div className="flex flex-col lg:flex-row gap-10">
                      {/* Upload Document Form */}
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold mb-6 flex items-center text-gray-800">
                          <Upload className="mr-3 h-6 w-6 text-primary" /> رفع مستند جديد
                        </h4>
                        
                        <form onSubmit={handleDocumentUpload} className="space-y-5 p-6 bg-gray-50 rounded-xl border border-gray-100">
                          <div className="space-y-2">
                            <Label htmlFor="document-name">اسم المستند</Label>
                            <Input 
                              id="document-name"
                              placeholder="أدخل اسم المستند" 
                              value={documentName}
                              onChange={e => setDocumentName(e.target.value)}
                              className="bg-white"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="document-description">وصف المستند (اختياري)</Label>
                            <Textarea 
                              id="document-description"
                              placeholder="أدخل وصفًا مختصرًا للمستند" 
                              value={documentDescription}
                              onChange={e => setDocumentDescription(e.target.value)}
                              rows={3}
                              className="bg-white"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="document-file">اختر الملف</Label>
                            <div className="flex items-center justify-center w-full">
                              <label htmlFor="document-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-white border-blue-100 hover:bg-blue-50 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  <FileUp className="w-10 h-10 mb-3 text-blue-400" />
                                  <p className="mb-2 text-sm text-blue-500">
                                    <span className="font-semibold">اضغط للاختيار</span> أو اسحب الملف هنا
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    PDF, DOC, DOCX, PNG, JPG
                                  </p>
                                </div>
                                <Input 
                                  id="document-file" 
                                  type="file" 
                                  className="hidden" 
                                  onChange={handleFileChange}
                                />
                              </label>
                            </div>
                            {documentFile && (
                              <p className="text-sm text-green-600 flex items-center gap-2 mt-2">
                                <CheckCircle className="h-4 w-4" />
                                {documentFile.name}
                              </p>
                            )}
                          </div>
                          
                          <Button 
                            type="submit" 
                            className="w-full" 
                            disabled={!documentFile || uploadingDocument}
                          >
                            {uploadingDocument ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                جاري الرفع...
                              </>
                            ) : (
                              <>
                                <Upload className="mr-2 h-4 w-4" />
                                رفع المستند
                              </>
                            )}
                          </Button>
                        </form>
                      </div>

                      {/* Documents List */}
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold mb-6 flex items-center text-gray-800">
                          <FileText className="mr-3 h-6 w-6 text-primary" /> مستندات المهمة
                        </h4>
                        
                        {loadingDocuments ? (
                          <div className="flex justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          </div>
                        ) : taskDocuments.length > 0 ? (
                          <div className="grid grid-cols-1 gap-4">
                            {taskDocuments.map((document) => (
                              <div 
                                key={document.id} 
                                className="border rounded-xl p-5 hover:border-primary/50 hover:bg-blue-50/30 transition-colors cursor-pointer relative group"
                              >
                                <div className="flex items-start gap-4">
                                  <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <FileText className="h-6 w-6 text-blue-600" />
                                  </div>
                                  <div className="flex-1">
                                    <h5 className="font-semibold text-base mb-1">{document.name}</h5>
                                    <p className="text-sm text-gray-500 mb-2">
                                      {document.description || 'لا يوجد وصف'}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                      تاريخ الرفع: {new Date(document.createdDate).toLocaleDateString('ar-SA')}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full">
                                    <Download className="h-4 w-4 text-gray-500" />
                                    <span className="sr-only">تحميل المستند</span>
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="py-12 text-center bg-gray-50 rounded-xl border border-dashed">
                            <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500 font-medium">لا توجد مستندات مرتبطة بهذه المهمة</p>
                            <p className="text-sm text-gray-400 mt-2">قم برفع المستندات باستخدام النموذج المجاور</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-500">لا توجد بيانات متاحة</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
    </>
  );
}
