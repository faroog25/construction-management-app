
import React, { useEffect, useState } from 'react';
import DashboardStatsNew from '@/components/DashboardStatsNew';
import DetailedStatistics from '@/components/DetailedStatistics';
import ProjectCard from '@/components/ProjectCard';
import ProjectTimeline from '@/components/ProjectTimeline';
import UpcomingTasks from '@/components/UpcomingTasks';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ChevronRight } from 'lucide-react';
import { getProjects, Project } from '@/services/projectService';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { NewProjectModal } from '@/components/NewProjectModal';

const Index = () => {
  const { t } = useLanguage();
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  
  const { data: projectsData = { data: { items: [] } }, isLoading, refetch } = useQuery({
    queryKey: ['projects'],
    queryFn: () => getProjects(),
  });

  // Extract projects array from the paginated response
  const projects = projectsData.data?.items || [];
  
  // Take the first 4 projects for the dashboard display
  const recentProjects = projects.slice(0, 4);

  const handleCreateProject = () => {
    setIsNewProjectModalOpen(true);
  };

  const handleProjectCreated = () => {
    // Refresh projects data when a new project is created
    refetch();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-16"></div> {/* Navbar spacer */}
      
      <main className="flex-1 container mx-auto px-4 py-8 animate-in">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.title')}</h1>
            <p className="text-muted-foreground mt-1">
              {t('dashboard.subtitle')}
            </p>
          </div>
          <div className="mt-4 lg:mt-0 flex flex-wrap gap-3">
            <Button className="rounded-lg" onClick={handleCreateProject}>
              <Plus className="mr-2 h-4 w-4" />
              {t('dashboard.create_project')}
            </Button>
          </div>
        </div>
        
        <div className="space-y-8">
          <DashboardStatsNew />
          
          <div className="grid gap-8 lg:grid-cols-3">
            <Card className="lg:col-span-2 animate-in" style={{ animationDelay: "0.1s" }}>
              <CardHeader className="pb-3">
                <CardTitle>{t('dashboard.project_progress')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ProjectTimeline />
              </CardContent>
            </Card>
            
            <div className="animate-in" style={{ animationDelay: "0.2s" }}>
              <UpcomingTasks />
            </div>
          </div>

          <DetailedStatistics />
          
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">{t('dashboard.recent_projects')}</h2>
              <Button variant="ghost" size="sm" asChild>
                <a href="/projects">
                  {t('dashboard.view_all')}
                  <ChevronRight className="ml-1 h-4 w-4" />
                </a>
              </Button>
            </div>
            
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">{t('projects.filter_all')}</TabsTrigger>
                <TabsTrigger value="active">{t('projects.filter_active')}</TabsTrigger>
                <TabsTrigger value="completed">{t('projects.filter_completed')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-4">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {recentProjects.map((project, index) => (
                    <ProjectCard
                      key={project.id}
                      id={project.id}
                      name={project.projectName}
                      client_name={project.clientName}
                      expected_end_date={project.expectedEndDate}
                      start_date={project.startDate}
                      progress={project.progress || 0}
                      status={project.status}
                      className="animate-in"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="active" className="space-y-4">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {recentProjects
                    .filter(p => p.status === 0)
                    .map((project, index) => (
                      <ProjectCard
                        key={project.id}
                        id={project.id}
                        name={project.projectName}
                        client_name={project.clientName}
                        expected_end_date={project.expectedEndDate}
                        start_date={project.startDate}
                        progress={project.progress || 0}
                        status={project.status}
                        className="animate-in"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      />
                    ))}
                </div>
              </TabsContent>
              
              <TabsContent value="completed" className="space-y-4">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {recentProjects
                    .filter(p => p.status === 2)
                    .map((project, index) => (
                      <ProjectCard
                        key={project.id}
                        id={project.id}
                        name={project.projectName}
                        client_name={project.clientName}
                        expected_end_date={project.expectedEndDate}
                        start_date={project.startDate}
                        progress={project.progress || 0}
                        status={project.status}
                        className="animate-in"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      />
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <NewProjectModal 
        isOpen={isNewProjectModalOpen}
        onOpenChange={setIsNewProjectModalOpen}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  );
};

export default Index;
