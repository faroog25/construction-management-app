
import React, { useState } from 'react';
import { editTask, EditTaskRequest } from '@/services/taskService';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskUpdated: () => void;
  task: {
    id: number;
    name: string;
    description: string;
  };
}

export function EditTaskModal({ isOpen, onClose, onTaskUpdated, task }: EditTaskModalProps) {
  const [formData, setFormData] = useState<EditTaskRequest>({
    id: task.id,
    name: task.name,
    description: task.description || '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate form data
      if (!formData.name.trim()) {
        setError('اسم المهمة مطلوب');
        setIsSubmitting(false);
        return;
      }

      const result = await editTask(formData);
      
      if (result.success) {
        toast({
          title: "تم بنجاح",
          description: "تم تحديث المهمة بنجاح",
        });
        onTaskUpdated();
        onClose();
      } else {
        setError(result.message || 'فشل في تحديث المهمة');
        toast({
          title: "خطأ",
          description: result.message || 'فشل في تحديث المهمة',
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Error updating task:', err);
      const errorMessage = err instanceof Error ? err.message : 'حدث خطأ أثناء تحديث المهمة';
      setError(errorMessage);
      toast({
        title: "خطأ",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>تعديل المهمة</DialogTitle>
          <DialogDescription>
            قم بتعديل تفاصيل المهمة هنا
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="name" className="required">اسم المهمة</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="description">وصف المهمة</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
            />
          </div>
          
          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                'حفظ التغييرات'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
