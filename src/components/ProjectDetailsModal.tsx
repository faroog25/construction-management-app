
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import ProjectDetails from '@/components/ProjectDetails';
import { Project } from '@/types/project';

interface ProjectDetailsModalProps {
  project: Project;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProjectDetailsModal = ({ project, isOpen, onOpenChange }: ProjectDetailsModalProps) => {
  // We're no longer adding createdAt and updatedAt as they cause errors
  const enhancedProject: Project = {
    ...project
    // No need to add default values for createdAt and updatedAt
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Project Details</DialogTitle>
        </DialogHeader>
        <ProjectDetails project={enhancedProject} />
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailsModal;
