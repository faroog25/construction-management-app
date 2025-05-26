
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProjectCard from '@/components/ProjectCard';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, Search, SlidersHorizontal, ChevronDown, Loader2, AlertCircle } from 'lucide-react';
import { getProjects, Project, getClients, getSiteEngineers, Client, SiteEngineer, getStatusFromCode, getArabicStatus } from '@/services/projectService';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import ProjectDetailsModal from '@/components/ProjectDetailsModal';
import { useNavigate } from 'react-router-dom';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { PaginatedResponse } from '@/types/project';
import { NewProjectModal } from '@/components/NewProjectModal';

interface ProjectAdapter {
  id: number;
  name: string;
  client_name: string;
  expected_end_date: string;
  start_date: string;
  progress: number;
  projectStatus: string;
  site_engineer_name?: string;
}

const STATUS_MAP = {
  'all': -1, // -1 means no filter
  'active': 0,
  'pending': 1,
  'completed': 2,
  'canceled': 3
};

const Projects = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [activeTab, setActiveTab] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); 
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const navigate = useNavigate();
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  const queryClient = useQueryClient();

  // Get status code from active tab
  const getStatusCodeFromTab = (tab: string): number | undefined => {
    const statusCode = STATUS_MAP[tab as keyof typeof STATUS_MAP];
    return statusCode === -1 ? undefined : statusCode;
  };

  // Use React Query to fetch projects with pagination parameters
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['projects', currentPage, pageSize, activeTab],
    queryFn: () => getProjects({
      page: currentPage,
      pageSize: pageSize,
      status: getStatusCodeFromTab(activeTab)
    }),
  });

  // Update pagination state when data changes
  useEffect(() => {
    if (data && data.data) {
      setTotalPages(data.data.totalPages);
      setTotalItems(data.data.totalItems);
      setHasNextPage(data.data.hasNextPage);
      setHasPreviousPage(data.data.hasPreveiosPage);
      console.log(`Total pages: ${data.data.totalPages}, Current page: ${data.data.currentPage}`);
    }
  }, [data]);

  const projectsData = data?.data?.items || [];

  // When tab changes, return to first page
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const handleAddProject = () => {
    setIsModalOpen(true);
  };

  const handleProjectCreated = () => {
    // Refresh the projects list after creating a new project
    queryClient.invalidateQueries({ queryKey: ['projects'] });
    setIsModalOpen(false);
  };

  // Convert projects to ProjectAdapter format
  const adaptedProjects: ProjectAdapter[] = projectsData.map(project => ({
    id: project.id as number,
    name: project.projectName,
    client_name: project.clientName || `Client ${project.clientId}`,
    expected_end_date: project.expectedEndDate || '',
    start_date: project.startDate || '',
    progress: project.progress || 0,
    projectStatus: project.projectStatus as string,
    site_engineer_name: project.siteEngineerName || `Engineer ${project.siteEngineerId}`
  }))
  .sort((a, b) => {
    if (sortOption === 'newest') return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
    if (sortOption === 'progress') return b.progress - a.progress;
    if (sortOption === 'dueDate') return new Date(a.expected_end_date).getTime() - new Date(b.expected_end_date).getTime();
    return 0;
  });

  // Filter based on search query
  const filteredProjects = adaptedProjects.filter(project => 
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to top after page change
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  // View project details handler
  const handleViewDetails = (projectId: number) => {
    navigate(`/projects/${projectId}`);
  };

  // Generate pagination items
  const generatePaginationItems = () => {
    const items = [];
    const maxPagesToShow = 5;
    
    // If total pages is less than or equal to max pages to show, show all pages
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={currentPage === i}
              onClick={() => handlePageChange(i)}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
      return items;
    }
    
    // Always show first page
    items.push(
      <PaginationItem key={1}>
        <PaginationLink
          isActive={currentPage === 1}
          onClick={() => handlePageChange(1)}
          className="cursor-pointer"
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    let startPage = Math.max(currentPage - Math.floor(maxPagesToShow / 2), 2);
    let endPage = Math.min(startPage + maxPagesToShow - 3, totalPages - 1);
    
    if (endPage - startPage < maxPagesToShow - 3) {
      startPage = Math.max(totalPages - maxPagesToShow + 2, 2);
    }
    
    // Add ellipsis if first page is not adjacent to next page
    if (startPage > 2) {
      items.push(
        <PaginationItem key="ellipsis1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={currentPage === i}
            onClick={() => handlePageChange(i)}
            className="cursor-pointer"
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Add ellipsis if last page is not adjacent to previous page
    if (endPage < totalPages - 1) {
      items.push(
        <PaginationItem key="ellipsis2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Always show last page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            isActive={currentPage === totalPages}
            onClick={() => handlePageChange(totalPages)}
            className="cursor-pointer"
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-16"></div>
      <main className="flex-1 container mx-auto px-4 py-8 animate-in">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground mt-1">Manage and monitor all your construction projects</p>
          </div>
          <div className="mt-4 lg:mt-0">
            <Button 
              className="rounded-lg"
              onClick={handleAddProject}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </div>
        </div>
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <SlidersHorizontal className="h-4 w-4" />
                      <span>Sort</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSortOption('newest')}>
                      Newest first
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOption('progress')}>
                      By progress
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOption('dueDate')}>
                      By due date
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab} value={activeTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="canceled">Canceled</TabsTrigger>
          </TabsList>
          
          {isLoading && (
            <div className="flex flex-col justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="mt-4 text-lg text-muted-foreground">Loading projects...</span>
            </div>
          )}
          
          {isError && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="flex items-center text-destructive">
                <AlertCircle className="w-5 h-5 mr-2" />
                <p>Failed to load projects</p>
              </div>
              <Button variant="outline" onClick={() => queryClient.invalidateQueries({ queryKey: ['projects'] })}>
                Try again
              </Button>
            </div>
          )}
          
          {!isLoading && !isError && (
            <TabsContent value={activeTab} className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProjects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    id={project.id}
                    name={project.name}
                    client_name={project.client_name}
                    expected_end_date={project.expected_end_date}
                    start_date={project.start_date}
                    progress={project.progress}
                    projectStatus={project.projectStatus}
                    site_engineer_name={project.site_engineer_name}
                    onViewDetails={() => handleViewDetails(project.id)}
                    className="animate-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  />
                ))}
              </div>
              
              {filteredProjects.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No projects found</p>
                </div>
              )}

              {/* Pagination - enhanced for better display */}
              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => hasPreviousPage && handlePageChange(currentPage - 1)}
                          className={!hasPreviousPage ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      
                      {generatePaginationItems()}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => hasNextPage && handlePageChange(currentPage + 1)}
                          className={!hasNextPage ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                  <div className="text-center mt-2 text-sm text-muted-foreground">
                    Showing page {currentPage} of {totalPages} ({totalItems} projects)
                  </div>
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
        
        {/* Use the NewProjectModal component instead of inline modal */}
        <NewProjectModal 
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          onProjectCreated={handleProjectCreated}
        />

        {selectedProject && (
          <ProjectDetailsModal
            project={{
              ...selectedProject,
              status: selectedProject.status ?? 0,
              createdAt: new Date(),
              updatedAt: new Date()
            }}
            isOpen={isDetailsModalOpen}
            onOpenChange={setIsDetailsModalOpen}
          />
        )}
      </main>
    </div>
  );
};

export default Projects;
