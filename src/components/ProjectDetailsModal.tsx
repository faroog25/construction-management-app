
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ProjectDetails from '@/components/ProjectDetails';
import { Project } from '@/types/project';

interface ProjectDetailsModalProps {
  project: Project;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProjectDetailsModal = ({ project, isOpen, onOpenChange }: ProjectDetailsModalProps) => {
  // Add default values for required properties that might be missing
  const enhancedProject: Project = {
    ...project,
    // Ensure required properties have default values
    createdAt: project.createdAt || new Date().toISOString(),
    updatedAt: project.updatedAt || new Date().toISOString()
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>تفاصيل المشروع</DialogTitle>
        </DialogHeader>
        <ProjectDetails project={enhancedProject} />
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailsModal;
