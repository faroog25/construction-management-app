
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
import { useLanguage } from '@/contexts/LanguageContext';

interface DeleteSpecialtyDialogProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  specialty: Specialty | null;
  onSuccess: () => void;
}

export function DeleteSpecialtyDialog({ isOpen, setIsOpen, specialty, onSuccess }: DeleteSpecialtyDialogProps) {
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleDelete = async () => {
    if (!specialty) {
      toast.error(t('No specialty selected for deletion'));
      return;
    }

    try {
      await deleteSpecialty(specialty.id);
      toast.success(t('Specialty deleted successfully'));
      setIsOpen(false);
      onSuccess();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('Failed to delete specialty'));
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('Are you sure you want to delete this specialty?')}</AlertDialogTitle>
          <AlertDialogDescription>
            {specialty ? t('This will remove the specialty "{name}" permanently.').replace('{name}', specialty.name) : t('This will remove the specialty permanently.')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('Cancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
            {t('Confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
