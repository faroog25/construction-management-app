
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ProjectBasicEditForm from '@/components/ProjectBasicEditForm';
import { UpdateProjectBasicInfo } from '@/services/projectService';

interface ProjectBasicEditDialogProps {
  project: UpdateProjectBasicInfo;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const ProjectBasicEditDialog = ({ 
  project, 
  isOpen, 
  onOpenChange,
  onSuccess
}: ProjectBasicEditDialogProps) => {
  const handleSuccess = () => {
    onSuccess?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Edit Project Basic Information</DialogTitle>
        </DialogHeader>
        <ProjectBasicEditForm 
          project={project} 
          onSuccess={handleSuccess} 
          onCancel={() => onOpenChange(false)} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProjectBasicEditDialog;
