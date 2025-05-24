
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProjectCard from '@/components/ProjectCard';
import UpcomingTasks from '@/components/UpcomingTasks';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, Search, SlidersHorizontal, ChevronDown, Loader2, X, Check, AlertCircle } from 'lucide-react';
import { getProjects, Project, createProject, getClients, getSiteEngineers, Client, SiteEngineer, getStatusFromCode, getArabicStatus } from '@/services/projectService';
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
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [selectedEngineerId, setSelectedEngineerId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); 
  const [newProject, setNewProject] = useState({
    projectName: '',
    siteAddress: '',
    clientName: '',
    projectStatus: 'active',
    description: '',
    startDate: '',
    expectedEndDate: '',
    status: 0,
    clientId: 0,
    geographicalCoordinates: '',
    siteEngineerId: 0
  });
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
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
  
  const { data: client, isLoading: isLoadingClients } = useQuery({
    queryKey: ['clients'],
    queryFn: getClients,
  });

  const clients = client?.items || [];

  const { data: siteEngineer = [], isLoading: isLoadingEngineers } = useQuery({
    queryKey: ['siteEngineers'],
    queryFn: getSiteEngineers,
  });
  const siteEngineers = siteEngineer?.items || [];
  
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
        status: 0,
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
      status: 0
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

  // When tab changes, return to first page
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

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
      toast.error("Failed to create project");
    }
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
            <h1 className="text-3xl font-bold tracking-tight">المشاريع</h1>
            <p className="text-muted-foreground mt-1">إدارة ومراقبة جميع مشاريع البناء الخاصة بك</p>
          </div>
          <div className="mt-4 lg:mt-0">
            <Button 
              className="rounded-lg"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              مشروع جديد
            </Button>
          </div>
        </div>

        {/* إضافة UpcomingTasks */}
        <div className="mb-8">
          <UpcomingTasks />
        </div>
        
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="بحث في المشاريع..."
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
                      <span>ترتيب</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSortOption('newest')}>
                      الأحدث أولاً
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOption('progress')}>
                      حسب التقدم
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOption('dueDate')}>
                      حسب تاريخ الاستحقاق
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab} value={activeTab}>
          <TabsList>
            <TabsTrigger value="all">الكل</TabsTrigger>
            <TabsTrigger value="active">قيد التنفيذ</TabsTrigger>
            <TabsTrigger value="pending">معلق</TabsTrigger>
            <TabsTrigger value="completed">مكتمل</TabsTrigger>
            <TabsTrigger value="canceled">ملغي</TabsTrigger>
          </TabsList>
          
          {isLoading && (
            <div className="flex flex-col justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="mt-4 text-lg text-muted-foreground">جاري تحميل المشاريع...</span>
            </div>
          )}
          
          {isError && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="flex items-center text-destructive">
                <AlertCircle className="w-5 h-5 mr-2" />
                <p>فشل في تحميل المشاريع</p>
              </div>
              <Button variant="outline" onClick={() => queryClient.invalidateQueries({ queryKey: ['projects'] })}>
                حاول مرة أخرى
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
                  <p className="text-muted-foreground">لا توجد مشاريع</p>
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
                    عرض الصفحة {currentPage} من {totalPages} ({totalItems} مشروع)
                  </div>
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
        
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">مشروع جديد</h2>
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
                  <label className="block text-sm font-medium mb-1">اسم المشروع</label>
                  <Input
                    {...form.register("projectName")}
                    placeholder="أدخل اسم المشروع"
                  />
                  {formErrors.projectName && (
                    <p className="text-sm text-red-500 mt-1">{formErrors.projectName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">الوصف</label>
                  <textarea
                    {...form.register("description")}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="أدخل وصف المشروع"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">عنوان الموقع</label>
                  <Input
                    {...form.register("siteAddress")}
                    placeholder="أدخل عنوان الموقع"
                  />
                  {formErrors.siteAddress && (
                    <p className="text-sm text-red-500 mt-1">{formErrors.siteAddress}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">الإحداثيات الجغرافية</label>
                  <Input
                    {...form.register("geographicalCoordinates")}
                    placeholder="أدخل الإحداثيات (مثال: 34.0522, -118.2437)"
                  />
                  {formErrors.geographicalCoordinates && (
                    <p className="text-sm text-red-500 mt-1">{formErrors.geographicalCoordinates}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">العميل</label>
                  <Select
                    onValueChange={(value) => {
                      const id = parseInt(value);
                      setSelectedClientId(id);
                      form.setValue("clientId", id);
                    }}
                    value={selectedClientId?.toString()}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="اختر العميل" />
                    </SelectTrigger>
                     <SelectContent>
                      {isLoadingClients ? (
                        <div className="p-2 flex items-center">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          <span>جاري تحميل العملاء...</span>
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
                  <label className="block text-sm font-medium mb-1">مهندس الموقع</label>
                  <Select
                    onValueChange={(value) => {
                      const id = parseInt(value);
                      setSelectedEngineerId(id);
                      form.setValue("siteEngineerId", id);
                    }}
                    value={selectedEngineerId?.toString()}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="اختر مهندس الموقع" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingEngineers ? (
                        <div className="p-2 flex items-center">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          <span>جاري تحميل مهندسي الموقع...</span>
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
                    <label className="block text-sm font-medium mb-1">تاريخ البدء</label>
                    <Input
                      type="date"
                      {...form.register("startDate")}
                    />
                    {formErrors.startDate && (
                      <p className="text-sm text-red-500 mt-1">{formErrors.startDate}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">تاريخ الانتهاء المتوقع</label>
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
                    إلغاء
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
                    إنشاء
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
