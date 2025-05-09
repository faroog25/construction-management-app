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
import { Plus, Search, Filter, SlidersHorizontal, ChevronDown, Loader2, X, Check, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { getProjects, Project, getStatusFromCode, createProject, getClients, getSiteEngineers, Client, SiteEngineer } from '@/services/projectService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
import { projectSchema, ProjectFormValues } from '@/lib/validations/project';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

interface ProjectAdapter {
  id: number;
  name: string;
  client_name: string;
  expected_end_date: string;
  start_date: string;
  progress: number;
  status: number;
}

const STATUS_MAP = {
  'all': 0,
  'active': 1,
  'completed': 2,
  'pending': 3,
  'canceled': 4
};

const Projects = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [activeTab, setActiveTab] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [selectedEngineerId, setSelectedEngineerId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8); // Number of projects per page
  const [newProject, setNewProject] = useState({
    projectName: '',
    siteAddress: '',
    clientName: '',
    projectStatus: 'active',
    description: '',
    startDate: '',
    expectedEndDate: '',
    status: 1,
    clientId: 0,
    geographicalCoordinates: '',
    siteEngineerId: 0
  });
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const queryClient = useQueryClient();

  const { data: projectsData = [], isLoading, isError, error } = useQuery({
    queryKey: ['projects'],
    queryFn: () => getProjects(),
    staleTime: 1000 * 60 * 5,
    retry: 2
  });

  const { data: clients = [], isLoading: isLoadingClients } = useQuery({
    queryKey: ['clients'],
    queryFn: getClients,
  });

  const { data: siteEngineers = [], isLoading: isLoadingEngineers } = useQuery({
    queryKey: ['siteEngineers'],
    queryFn: getSiteEngineers,
  });

  const createProjectMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setIsModalOpen(false);
      setNewProject({
        projectName: '',
        siteAddress: '',
        clientName: '',
        projectStatus: 'active',
        description: '',
        startDate: '',
        expectedEndDate: '',
        status: 1,
        clientId: 0,
        geographicalCoordinates: '',
        siteEngineerId: 0
      });
      setSelectedClientId(null);
    },
  });

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      projectName: '',
      description: '',
      siteAddress: '',
      geographicalCoordinates: '',
      siteEngineerId: 0,
      clientId: 0,
      startDate: '',
      expectedEndDate: '',
      status: 1
    },
  });

  useEffect(() => {
    if (selectedClientId) {
      const selectedClient = clients.find(client => client.id === selectedClientId);
      if (selectedClient) {
        setNewProject(prev => ({
          ...prev,
          clientName: selectedClient.fullName,
          clientId: selectedClient.id
        }));
      }
    }
  }, [selectedClientId, clients]);

  const handleCreateProject = async () => {
    try {

      const formData = form.getValues();
      const validationResult = projectSchema.safeParse(formData);
      console.log(formData)
      if (!validationResult.success) {
        const errors: Record<string, string> = {};
        validationResult.error.errors.forEach((err) => {
          if (err.path) {
            errors[err.path[0]] = err.message;
          }
        });
        setFormErrors(errors);
        return;
      }

      const projectData: Project = {
        id: 0,
        projectName: formData.projectName,
        description: formData.description,
        siteAddress: formData.siteAddress,
        geographicalCoordinates: formData.geographicalCoordinates,
        siteEngineerId: formData.siteEngineerId,
        clientId: formData.clientId,
        startDate: formData.startDate,
        expectedEndDate: formData.expectedEndDate,
        status: formData.status
      };

      await createProjectMutation.mutateAsync(projectData);
      
      toast.success("Project created successfully");
      setIsModalOpen(false);
      form.reset();
      setFormErrors({});
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error("Failed to create project");
    }
  };

  const filteredProjects: ProjectAdapter[] = projectsData
    .filter(project => 
      activeTab === 'all' || getStatusFromCode(project.status) === activeTab
    )
    .filter(project => 
      project.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .map(project => ({
      id: project.id,
      name: project.projectName,
      client_name: `Client ${project.clientId}`,
      expected_end_date: project.expectedEndDate,
      start_date: project.startDate,
      progress: 0,
      status: project.status
    }))
    .sort((a, b) => {
      if (sortOption === 'newest') return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
      if (sortOption === 'progress') return b.progress - a.progress;
      if (sortOption === 'dueDate') return new Date(a.expected_end_date).getTime() - new Date(b.expected_end_date).getTime();
      return 0;
    });

  // Calculate pagination
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewDetails = async (projectId: number) => {
    try {
      navigate(`/projects/${projectId}`);
    } catch (error) {
      console.error('Error navigating to project details:', error);
      toast.error('Failed to navigate to project details');
    }
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
              onClick={() => setIsModalOpen(true)}
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
                      Newest First
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOption('progress')}>
                      By Progress
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOption('dueDate')}>
                      By Due Date
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
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
                Try Again
              </Button>
            </div>
          )}
          
          {!isLoading && !isError && (
            <TabsContent value={activeTab} className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {currentProjects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    id={project.id}
                    name={project.name}
                    client_name={project.client_name}
                    expected_end_date={project.expected_end_date}
                    start_date={project.start_date}
                    progress={project.progress}
                    status={project.status}
                    onViewDetails={() => handleViewDetails(project.id)}
                    className="animate-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  />
                ))}
              </div>
              {filteredProjects.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No projects found</p>
                </div>
              )}

              {/* Pagination Controls */}
              {filteredProjects.length > 0 && (
                <div className="flex items-center justify-center space-x-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  ))}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
        
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">New Project</h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    form.reset();
                    setFormErrors({});
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleCreateProject(); }}>
                <div>
                  <label className="block text-sm font-medium mb-1">Project Name</label>
                  <Input
                    {...form.register("projectName")}
                    placeholder="Enter project name"
                  />
                  {formErrors.projectName && (
                    <p className="text-sm text-red-500 mt-1">{formErrors.projectName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    {...form.register("description")}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Enter project description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Site Address</label>
                  <Input
                    {...form.register("siteAddress")}
                    placeholder="Enter site address"
                  />
                  {formErrors.siteAddress && (
                    <p className="text-sm text-red-500 mt-1">{formErrors.siteAddress}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Geographical Coordinates</label>
                  <Input
                    {...form.register("geographicalCoordinates")}
                    placeholder="Enter coordinates (e.g., 34.0522, -118.2437)"
                  />
                  {formErrors.geographicalCoordinates && (
                    <p className="text-sm text-red-500 mt-1">{formErrors.geographicalCoordinates}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Client</label>
                  <Select
                    onValueChange={(value) => {
                      const id = parseInt(value);
                      setSelectedClientId(id);
                      form.setValue("clientId", id);
                    }}
                    value={selectedClientId?.toString()}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingClients ? (
                        <div className="p-2 flex items-center">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          <span>Loading clients...</span>
                        </div>
                      ) : (
                        clients.map((client) => (
                          <SelectItem key={client.id} value={client.id.toString()}>
                            {client.fullName}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {formErrors.clientId && (
                    <p className="text-sm text-red-500 mt-1">{formErrors.clientId}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Site Engineer</label>
                  <Select
                    onValueChange={(value) => {
                      const id = parseInt(value);
                      setSelectedEngineerId(id);
                      form.setValue("siteEngineerId", id);
                    }}
                    value={selectedEngineerId?.toString()}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a site engineer" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingEngineers ? (
                        <div className="p-2 flex items-center">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          <span>Loading site engineers...</span>
                        </div>
                      ) : (
                        siteEngineers.map((engineer) => (
                          <SelectItem key={engineer.id} value={engineer.id.toString()}>
                            {engineer.fullName}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {formErrors.siteEngineerId && (
                    <p className="text-sm text-red-500 mt-1">{formErrors.siteEngineerId}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Date</label>
                    <Input
                      type="date"
                      {...form.register("startDate")}
                    />
                    {formErrors.startDate && (
                      <p className="text-sm text-red-500 mt-1">{formErrors.startDate}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Expected End Date</label>
                    <Input
                      type="date"
                      {...form.register("expectedEndDate")}
                    />
                    {formErrors.expectedEndDate && (
                      <p className="text-sm text-red-500 mt-1">{formErrors.expectedEndDate}</p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsModalOpen(false);
                      form.reset();
                      setFormErrors({});
                    }}
                    type="button"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createProjectMutation.isPending}
                  >
                    {createProjectMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="mr-2 h-4 w-4" />
                    )}
                    Create
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {selectedProject && (
          <ProjectDetailsModal
            project={{
              ...selectedProject,
              status: selectedProject.status ?? 1,
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
