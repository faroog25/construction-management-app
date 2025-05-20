import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { uploadTaskDocument } from '@/services/documentService';
import { toast } from 'sonner';
import { FileUp, Loader2, File, X, CheckCircle2 } from 'lucide-react';

interface UploadDocumentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: number;
  projectId: number;
  onUploadSuccess: () => void;
}

export function UploadDocumentDialog({ 
  isOpen, 
  onClose, 
  taskId, 
  projectId,
  onUploadSuccess 
}: UploadDocumentDialogProps) {
  const [documentName, setDocumentName] = useState('');
  const [documentDescription, setDocumentDescription] = useState('');
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setDocumentFile(file);
      
      // If no name is provided, use the file name without extension
      if (!documentName) {
        // Get filename without extension
        const fileName = file.name.split('.').slice(0, -1).join('.');
        setDocumentName(fileName || file.name);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!documentFile) {
      setError('يرجى اختيار ملف للرفع');
      return;
    }

    if (!documentName.trim()) {
      setError('يرجى إدخال اسم للمستند');
      return;
    }

    // Validate projectId
    if (!projectId || projectId === 0) {
      setError('معرف المشروع غير صالح');
      console.error("Invalid project ID:", projectId);
      return;
    }

    setIsUploading(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('File', documentFile);
      formData.append('Name', documentName);
      formData.append('Description', documentDescription);
      formData.append('TaskId', taskId.toString());
      formData.append('ProjectId', projectId.toString());
      
      // Log what we're sending (for debugging)
      console.log("Uploading document with:", {
        fileName: documentFile.name, 
        documentName,
        taskId,
        projectId
      });
      
      const result = await uploadTaskDocument(formData);
      
      if (result.success) {
        toast.success('تم رفع المستند بنجاح');
        onUploadSuccess();
        resetForm();
        onClose();
      } else {
        setError(result.message || 'فشل في رفع المستند');
        toast.error(result.message || 'فشل في رفع المستند');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'حدث خطأ أثناء رفع المستند';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setDocumentName('');
    setDocumentDescription('');
    setDocumentFile(null);
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileUp className="h-5 w-5" />
            رفع مستند جديد
          </DialogTitle>
          <DialogDescription>
            قم برفع مستند جديد لهذه المهمة
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md border border-destructive/20">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="document-name" className="required">اسم المستند</Label>
            <Input 
              id="document-name"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              placeholder="أدخل اسم المستند"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="document-description">وصف المستند (اختياري)</Label>
            <Textarea 
              id="document-description"
              value={documentDescription}
              onChange={(e) => setDocumentDescription(e.target.value)}
              placeholder="أدخل وصفًا مختصرًا للمستند"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="document-file" className="required">الملف</Label>
            <div className="flex flex-col items-center justify-center w-full">
              <label htmlFor="document-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer bg-background border-primary/20 hover:bg-primary/5 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {documentFile ? (
                    <div className="flex flex-col items-center gap-2">
                      <CheckCircle2 className="w-8 h-8 text-primary" />
                      <p className="text-sm text-primary font-medium">
                        تم اختيار الملف
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {documentFile.name} ({(documentFile.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    </div>
                  ) : (
                    <>
                      <FileUp className="w-10 h-10 mb-3 text-primary/60" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">اضغط للاختيار</span> أو اسحب الملف هنا
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PDF, DOC, DOCX, PNG, JPG
                      </p>
                    </>
                  )}
                </div>
                <Input 
                  id="document-file" 
                  type="file" 
                  className="hidden" 
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                />
              </label>
            </div>
          </div>
          
          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isUploading}
              className="mt-3 sm:mt-0 sm:ml-3"
            >
              إلغاء
            </Button>
            <Button 
              type="submit" 
              disabled={isUploading || !documentFile}
              className="w-full sm:w-auto"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جاري الرفع...
                </>
              ) : (
                <>
                  <FileUp className="mr-2 h-4 w-4" />
                  رفع المستند
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
