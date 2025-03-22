import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ProjectDetails from '@/components/ProjectDetails';
import { Project } from '@/services/projectService';

interface ProjectDetailsModalProps {
  project: Project;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProjectDetailsModal = ({ project, isOpen, onOpenChange }: ProjectDetailsModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Project Details</DialogTitle>
        </DialogHeader>
        <ProjectDetails project={project} />
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailsModal; 