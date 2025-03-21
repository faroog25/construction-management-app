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
import { Plus, Search, Filter, SlidersHorizontal, ChevronDown, Loader2, X, Check } from 'lucide-react';
import { getProjects, Project, getStatusFromCode, createProject } from '@/services/projectService';
import { getClients, Client } from '@/services/clientService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

// Adapter interface to bridge between Project model and ProjectCard component
interface ProjectAdapter {
  id: number;
  name: string;
  client_name: string;
  expected_end_date: string;
  start_date: string;
  progress: number;
  status: number;
}

// Status types mapping
const STATUS_MAP = {
  'all': 0,
  'active': 1,
  'completed': 2,
  'pending': 3,
  'delayed': 4
};

const Projects = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [activeTab, setActiveTab] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [newProject, setNewProject] = useState({
    projectName: '',
    siteAddress: '',
    clientName: '',
    projectStatus: 'active',
    description: '',
    startDate: '',
    expectedEndDate: '',
    status: 1,
    clientId: 0
  });

  const queryClient = useQueryClient();

  // Fetch projects using React Query
  const { data: projectsData = [], isLoading, isError, error } = useQuery({
    queryKey: ['projects'],
    queryFn: () => getProjects(),
    onSuccess: (data) => {
      console.log('Projects data received:', data);
    },
    onError: (error) => {
      console.error('Error fetching projects:', error);
    }
  });

  // Fetch clients using React Query
  const { data: clients = [], isLoading: isLoadingClients } = useQuery({
    queryKey: ['clients'],
    queryFn: () => getClients(),
  });

  // Create project mutation
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
        clientId: 0
      });
      setSelectedClientId(null);
    },
  });

  // Update project with selected client
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
      await createProjectMutation.mutateAsync(newProject);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  // Filter and adapt projects for presentation
  const filteredProjects: ProjectAdapter[] = projectsData
    .filter(project => 
      activeTab === 'all' || getStatusFromCode(project.status || 1) === activeTab
    )
    .filter(project => 
      project.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.clientName && project.clientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .map(project => ({
      id: project.id,
      name: project.projectName,
      client_name: project.clientName || 'Unknown Client',
      expected_end_date: project.expectedEndDate || '',
      start_date: project.startDate || '',
      progress: project.orderId || 0, // Using orderId as progress since it's available in the API
      status: project.status || 1
    }))
    .sort((a, b) => {
      if (sortOption === 'newest') return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
      if (sortOption === 'progress') return b.progress - a.progress;
      if (sortOption === 'dueDate') return new Date(a.expected_end_date).getTime() - new Date(b.expected_end_date).getTime();
      return 0;
    });
  
  console.log('Filtered projects:', filteredProjects);
  
  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-16"></div> {/* Navbar spacer */}
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
            <TabsTrigger value="delayed">Delayed</TabsTrigger>
          </TabsList>
          
          {isLoading && (
            <div className="flex flex-col justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="mt-4 text-lg text-muted-foreground">Loading projects...</span>
            </div>
          )}
          
          {isError && (
            <div className="text-center py-12">
              <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
                <p className="font-medium">Error loading projects</p>
                <p className="text-sm mt-1">{error instanceof Error ? error.message : 'Please try again.'}</p>
              </div>
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
                    status={project.status}
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
            </TabsContent>
          )}
        </Tabs>
        
        {/* New Project Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">New Project</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Project Name</label>
                  <Input
                    value={newProject.projectName}
                    onChange={(e) => setNewProject({ ...newProject, projectName: e.target.value })}
                    placeholder="Enter project name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Site Address</label>
                  <Input
                    value={newProject.siteAddress}
                    onChange={(e) => setNewProject({ ...newProject, siteAddress: e.target.value })}
                    placeholder="Enter site address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Client</label>
                  <Select onValueChange={(value) => setSelectedClientId(Number(value))}>
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
                          <SelectItem key={client.id} value={String(client.id)}>
                            {client.fullName}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {selectedClientId && (
                    <div className="mt-1.5 text-sm flex items-center text-green-600">
                      <Check className="h-3.5 w-3.5 mr-1" />
                      <span>Client selected: {clients.find(c => c.id === selectedClientId)?.fullName}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Client Name
                    <span className="text-xs text-muted-foreground ml-1">(Optional if client is selected above)</span>
                  </label>
                  <Input
                    value={newProject.clientName}
                    onChange={(e) => setNewProject({ ...newProject, clientName: e.target.value })}
                    placeholder="Enter client name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Enter project description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Date</label>
                    <Input
                      type="date"
                      value={newProject.startDate}
                      onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Expected End Date</label>
                    <Input
                      type="date"
                      value={newProject.expectedEndDate}
                      onChange={(e) => setNewProject({ ...newProject, expectedEndDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    type="button"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateProject}
                    disabled={createProjectMutation.isPending}
                    type="button"
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
      </main>
    </div>
  );
};

export default Projects;
