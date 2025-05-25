
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
  const enhancedProject: Project = {
    ...project
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
