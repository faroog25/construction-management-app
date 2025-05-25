
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
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "لم يتم تحديد تخصص للحذف"
      });
      return;
    }

    try {
      await deleteSpecialty(specialty.id);
      toast({
        variant: "default",
        title: "نجح",
        description: "تم حذف التخصص بنجاح"
      });
      setIsOpen(false);
      onSuccess();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: error instanceof Error ? error.message : "فشل في حذف التخصص"
      });
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>هل أنت متأكد من حذف هذا التخصص؟</AlertDialogTitle>
          <AlertDialogDescription>
            {specialty ? `سيتم حذف التخصص "${specialty.name}" نهائياً ولا يمكن التراجع عن هذا الإجراء.` : 'سيتم حذف التخصص نهائياً ولا يمكن التراجع عن هذا الإجراء.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>إلغاء</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            تأكيد الحذف
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
