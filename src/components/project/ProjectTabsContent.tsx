
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import ProjectDetailsInfo from '@/components/ProjectDetailsInfo';
import ProjectStages from '@/components/ProjectStages';
import GanttChart from '@/components/GanttChart';
import ProjectTimeline from '@/components/ProjectTimeline';
import ProjectEquipment from '@/components/project/ProjectEquipment';
import ProjectDocuments from '@/components/ProjectDocuments';
import { Project, isProjectEditable } from '@/services/projectService';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ProjectTabsContentProps {
  project: Project;
  projectId: number;
}

const ProjectTabsContent = ({ project, projectId }: ProjectTabsContentProps) => {
  const isEditable = isProjectEditable(project);
  
  // Create a message for non-editable projects
  const NonEditableAlert = () => {
    if (isEditable) return null;
    
    return (
      <Alert variant="warning" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          هذا المشروع {project.projectStatus?.toLowerCase() === 'ملغي' ? 'ملغي' : 'معلق'} ولا يمكن إجراء تعديلات عليه. يمكنك فقط عرض البيانات.
        </AlertDescription>
      </Alert>
    );
  };

  return (
    <>
      <TabsContent value="details" className="space-y-6 animate-in fade-in-50">
        <ProjectDetailsInfo project={project} />
        <ProjectTimeline />
      </TabsContent>
      
      <TabsContent value="stages" className="space-y-6 animate-in fade-in-50">
        <NonEditableAlert />
        <ProjectStages project={project} readOnly={!isEditable} />
      </TabsContent>
      
      <TabsContent value="gantt" className="space-y-6 animate-in fade-in-50">
        <GanttChart project={project} />
      </TabsContent>
      
      <TabsContent value="equipment" className="space-y-6 animate-in fade-in-50">
        <NonEditableAlert />
        <ProjectEquipment project={project} readOnly={!isEditable} />
      </TabsContent>

      <TabsContent value="documents" className="space-y-6 animate-in fade-in-50">
        <NonEditableAlert />
        <ProjectDocuments 
          project={{ id: projectId, projectName: project.projectName }} 
          readOnly={!isEditable}
        />
      </TabsContent>
    </>
  );
};

export default ProjectTabsContent;
