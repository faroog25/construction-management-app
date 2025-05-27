
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
        title: "Error",
        description: "No specialty selected for deletion"
      });
      return;
    }

    console.log('Deleting specialty with ID:', specialty.id);
    console.log('Specialty object:', specialty);

    try {
      await deleteSpecialty(specialty.id);
      toast({
        variant: "default",
        title: "Success",
        description: "Specialty deleted successfully"
      });
      setIsOpen(false);
      onSuccess();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete specialty"
      });
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this specialty?</AlertDialogTitle>
          <AlertDialogDescription>
            {specialty ? `The specialty "${specialty.name}" will be permanently deleted and this action cannot be undone.` : 'The specialty will be permanently deleted and this action cannot be undone.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Confirm Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
