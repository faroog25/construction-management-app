
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { editTask } from '@/services/taskService';

export interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: number;
  taskName: string;
  taskDescription: string;
  onTaskUpdated: () => void;
}

const EditTaskModal = ({ 
  isOpen, 
  onClose, 
  taskId, 
  taskName, 
  taskDescription, 
  onTaskUpdated 
}: EditTaskModalProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      setName(taskName);
      setDescription(taskDescription || '');
    }
  }, [isOpen, taskName, taskDescription]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast({ 
        title: "خطأ",
        description: "اسم المهمة مطلوب",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await editTask({
        id: taskId,
        name,
        description
      });
      
      if (result.success) {
        toast({
          title: "تم بنجاح",
          description: "تم تحديث المهمة بنجاح"
        });
        onTaskUpdated();
        handleClose();
      } else {
        toast({
          title: "خطأ",
          description: result.message || "فشل في تحديث المهمة",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "فشل في تحديث المهمة",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>تعديل المهمة</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid w-full gap-2">
            <Label htmlFor="name">اسم المهمة</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="أدخل اسم المهمة"
              required
            />
          </div>
          
          <div className="grid w-full gap-2">
            <Label htmlFor="description">الوصف</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="أدخل وصف المهمة"
              className="min-h-20"
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              إلغاء
            </Button>
            <Button type="submit" disabled={isLoading || !name}>
              {isLoading ? (
                <>
                  <span className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></span>
                  جاري التحديث...
                </>
              ) : (
                "تحديث المهمة"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTaskModal;
