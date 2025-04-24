import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProjectById } from '@/services/projectService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProjectDetailsInfo from '@/components/ProjectDetailsInfo';
import ProjectStages from '@/components/ProjectStages';
import GanttChart from '@/components/GanttChart';
import ProjectTimeline from '@/components/ProjectTimeline';
import Documents from '@/pages/Documents';
import { 
  Loader2, 
  AlertCircle, 
  Calendar, 
  Clock, 
  Users, 
  ChevronLeft, 
  Share2,
  Download,
  Printer,
  MoreHorizontal,
  Plus,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const projectId = parseInt(id || '0', 10);
  const navigate = useNavigate();

  const { data: project, isLoading, error } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => getProjectById(projectId),
    enabled: !!projectId,
  });

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Project link copied to clipboard');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    toast.success('Project data exported');
  };

  const handleGoBack = () => {
    navigate('/projects');
  };

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
        <Button variant="outline" onClick={handleGoBack}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-16"></div> {/* Navbar spacer */}
      <main className="flex-1 container mx-auto px-4 py-8 animate-in">
        <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground" 
                onClick={handleGoBack}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Projects
              </Button>
            </div>
            <h1 className="text-3xl font-bold tracking-tight mt-2">{project.projectName}</h1>
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
          
          <div className="flex gap-2 print:hidden sm:mt-0 mt-4 w-full sm:w-auto">
            <Button variant="outline" size="sm" onClick={handleShare} className="flex-1 sm:flex-none">
              <Share2 className="h-4 w-4 mr-1.5" />
              Share
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => toast.info("Archive functionality coming soon")}>
                  Archive Project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button className="flex-1 sm:flex-none">
              <Plus className="h-4 w-4 mr-1.5" />
              Add Task
            </Button>
          </div>
        </div>

        <Tabs defaultValue="details" className="space-y-6">
          <TabsList className="w-full max-w-md grid grid-cols-4 p-1 bg-muted/30">
            <TabsTrigger value="details">Project Details</TabsTrigger>
            <TabsTrigger value="stages">Stages & Tasks</TabsTrigger>
            <TabsTrigger value="gantt">Gantt Chart</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
          
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

          <TabsContent value="documents" className="space-y-6 animate-in fade-in-50">
            <Documents projectId={project.id} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ProjectDetails;
