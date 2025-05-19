
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
  // أزلنا إضافة القيم الافتراضية التي تسبب أخطاء
  const enhancedProject: Project = {
    ...project
    // لا نضيف createdAt و updatedAt إذا لم تكن موجودة بالفعل
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>تفاصيل المشروع</DialogTitle>
          <DialogDescription>عرض تفاصيل المشروع وبياناته</DialogDescription>
        </DialogHeader>
        <ProjectDetails project={enhancedProject} />
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailsModal;
