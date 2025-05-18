
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteSpecialty, Specialty } from '@/services/specialtyService';
import { useToast } from '@/hooks/use-toast';

interface DeleteSpecialtyDialogProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  specialty: Specialty | null;
  onSuccess: () => void;
}

export function DeleteSpecialtyDialog({ isOpen, setIsOpen, specialty, onSuccess }: DeleteSpecialtyDialogProps) {
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!specialty) {
      toast.error('لم يتم تحديد التخصص للحذف');
      return;
    }

    try {
      await deleteSpecialty(specialty.id);
      toast.success('تم حذف التخصص بنجاح');
      setIsOpen(false);
      onSuccess();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'حدث خطأ أثناء حذف التخصص');
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>هل أنت متأكد من حذف هذا التخصص؟</AlertDialogTitle>
          <AlertDialogDescription>
            سيتم حذف التخصص "{specialty?.name}" نهائياً. هذا الإجراء لا يمكن التراجع عنه.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>إلغاء</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
            تأكيد الحذف
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
