
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import ProjectDetailsInfo from '@/components/ProjectDetailsInfo';
import ProjectStages from '@/components/ProjectStages';
import GanttChart from '@/components/GanttChart';
import ProjectTimeline from '@/components/ProjectTimeline';
import ProjectEquipment from '@/components/project/ProjectEquipment';
import ProjectDocuments from '@/components/ProjectDocuments';
import { Project } from '@/types/project';

interface ProjectTabsContentProps {
  project: Project;
  projectId: number;
}

const ProjectTabsContent = ({ project, projectId }: ProjectTabsContentProps) => {
  return (
    <>
      <TabsContent value="details" className="space-y-6 animate-in fade-in-50">
        <ProjectDetailsInfo project={project} />
        <ProjectTimeline />
      </TabsContent>
      
      <TabsContent value="stages" className="space-y-6 animate-in fade-in-50">
        <ProjectStages project={project} />
      </TabsContent>
      
      <TabsContent value="gantt" className="space-y-6 animate-in fade-in-50">
        <GanttChart project={project} />
      </TabsContent>
      
      <TabsContent value="equipment" className="space-y-6 animate-in fade-in-50">
        <ProjectEquipment project={project} />
      </TabsContent>

      <TabsContent value="documents" className="space-y-6 animate-in fade-in-50">
        <ProjectDocuments project={{ id: projectId, projectName: project.projectName }} />
      </TabsContent>
    </>
  );
};

export default ProjectTabsContent;
