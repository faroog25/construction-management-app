
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProjectById, Project } from '@/services/projectService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProjectDetailsInfo from '@/components/ProjectDetailsInfo';
import ProjectStages from '@/components/ProjectStages';
import GanttChart from '@/components/GanttChart';
import { Loader2, AlertCircle, Calendar, Clock, Users } from 'lucide-react';

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const projectId = parseInt(id || '0', 10);

  const { data: project, isLoading, error } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => getProjectById(projectId),
    enabled: !!projectId,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="mt-4 text-lg text-muted-foreground">Loading project details...</span>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="flex items-center text-destructive">
          <AlertCircle className="w-5 h-5 mr-2" />
          <p>Failed to load project details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-16"></div> {/* Navbar spacer */}
      <main className="flex-1 container mx-auto px-4 py-8 animate-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">{project.projectName}</h1>
          <div className="flex flex-wrap gap-4 mt-2">
            <p className="text-muted-foreground flex items-center">
              <Calendar className="w-4 h-4 mr-1" /> 
              Project ID: {project.id}
            </p>
            {project.startDate && (
              <p className="text-muted-foreground flex items-center">
                <Clock className="w-4 h-4 mr-1" /> 
                Started: {new Date(project.startDate).toLocaleDateString()}
              </p>
            )}
            {project.clientName && (
              <p className="text-muted-foreground flex items-center">
                <Users className="w-4 h-4 mr-1" /> 
                Client: {project.clientName}
              </p>
            )}
          </div>
        </div>

        <Tabs defaultValue="details" className="space-y-4">
          <TabsList className="w-full max-w-md grid grid-cols-3">
            <TabsTrigger value="details">Project Details</TabsTrigger>
            <TabsTrigger value="stages">Stages & Tasks</TabsTrigger>
            <TabsTrigger value="gantt">Gantt Chart</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4">
            <ProjectDetailsInfo project={project} />
          </TabsContent>
          
          <TabsContent value="stages" className="space-y-4">
            <ProjectStages project={project} />
          </TabsContent>
          
          <TabsContent value="gantt" className="space-y-4">
            <GanttChart project={project} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ProjectDetails;
