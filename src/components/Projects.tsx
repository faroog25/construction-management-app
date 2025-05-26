import React from 'react';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from '@/hooks/use-toast';
import { Edit, Plus, Pencil, Trash2, Layers, ListTodo } from 'lucide-react';
import { Project } from '@/types/project';
import { getAllProjects, Client, getClients } from '@/services/projectService';
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { API_BASE_URL } from '@/config/api';
import { NewProjectModal } from '@/components/NewProjectModal';

interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  errors?: string[];
  data: {
    items: T[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPreveiosPage: boolean;
  };
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: clientsResponse, isLoading: isLoadingClients } = useQuery({
    queryKey: ['clients'],
    queryFn: getClients,
  });

  const clients = clientsResponse?.data || [];

  const fetchPaginatedProjects = async (page: number, size: number) => {
    try {
      setLoading(true);
      const url = `${API_BASE_URL}/Projects?pageNumber=${page}&pageSize=${size}`;
      console.log('Fetching projects from:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: PaginatedResponse<Project> = await response.json();
      console.log('Paginated API Response:', result);
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch projects');
      }
      
      setProjects(result.data.items);
      setTotalPages(result.data.totalPages);
      setTotalItems(result.data.totalItems);
      setCurrentPage(result.data.currentPage);
      setHasNextPage(result.data.hasNextPage);
      setHasPreviousPage(result.data.hasPreveiosPage);
      
      return result.data.items;
    } catch (err) {
      console.error('Error fetching paginated projects:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaginatedProjects(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const handleEditProject = (project: Project) => {
    setProjectToEdit(project);
  };

  const handleDeleteProject = (projectId: number) => {
    setProjectToDelete({ id: projectId } as Project);
  };

  const confirmDeleteProject = async () => {
    if (projectToDelete) {
      try {
        setProjects(projects.filter(project => project.id !== projectToDelete.id));
        toast({
          description: 'Project deleted successfully',
          variant: 'success'
        });
      } catch (error) {
        console.error('Error deleting project:', error);
        toast({
          description: 'Failed to delete project',
          variant: 'destructive'
        });
      } finally {
        setProjectToDelete(null);
      }
    }
  };

  const cancelDeleteProject = () => {
    setProjectToDelete(null);
  };

  const handleViewStages = (projectId: number) => {
    toast({
      description: `View stages for project ${projectId}`,
    });
  };

  const handleViewTasks = (projectId: number) => {
    toast({
      description: `View tasks for project ${projectId}`,
    });
  };

  const handleAddProject = () => {
    setIsModalOpen(true);
  };

  const handleProjectCreated = () => {
    fetchPaginatedProjects(currentPage, pageSize);
  };

  const filteredProjects = projects
    .filter(project => 
      project.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortColumn === 'name') {
        return sortDirection === 'asc' 
          ? a.projectName.localeCompare(b.projectName) 
          : b.projectName.localeCompare(a.projectName);
      }
      return 0;
    });

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesVisible = 5;
    
    if (totalPages <= maxPagesVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }
    
    pages.push(1);
    
    let startPage = Math.max(currentPage - Math.floor(maxPagesVisible / 2), 2);
    let endPage = Math.min(startPage + maxPagesVisible - 3, totalPages - 1);
    
    if (endPage - startPage < maxPagesVisible - 3) {
      startPage = Math.max(totalPages - maxPagesVisible + 2, 2);
    }
    
    if (startPage > 2) {
      pages.push(-1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    if (endPage < totalPages - 1) {
      pages.push(-2);
    }
    
    pages.push(totalPages);
    
    return pages;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Projects</h1>
      
      <div className="mb-4 flex flex-col sm:flex-row justify-between gap-2">
        <div className="flex items-center">
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64"
          />
        </div>
        <Button onClick={handleAddProject}>
          <Plus className="mr-2 h-4 w-4" /> Add Project
        </Button>
      </div>
      
      {loading && <div className="flex justify-center my-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
      {error && <div className="text-red-500 text-center py-4">{error}</div>}
      {!loading && !error && (
        <div>
          {projects.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto max-w-md">
                <div className="mb-6">
                  <svg
                    className="mx-auto h-24 w-24 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Projects
                </h3>
                <p className="text-gray-500 mb-6">
                  Start by creating your first project to efficiently manage construction work
                </p>
                <Button onClick={handleAddProject} size="lg" className="inline-flex items-center">
                  <Plus className="mr-2 h-5 w-5" />
                  Add New Project
                </Button>
              </div>
            </div>
          ) : (
            <>
              <Table>
                <TableCaption>قائمة المشاريع</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>الاسم</TableHead>
                    <TableHead>الوصف</TableHead>
                    <TableHead>تاريخ البدء</TableHead>
                    <TableHead>تاريخ الانتهاء</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">{project.projectName}</TableCell>
                        <TableCell>{project.description || "لا يوجد وصف"}</TableCell>
                        <TableCell>{project.startDate || "غير محدد"}</TableCell>
                        <TableCell>{project.expectedEndDate || "غير محدد"}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs ${
                            project.projectStatus === "قيد التنفيذ" ? "bg-blue-100 text-blue-800" :
                            project.projectStatus === "مكتمل" ? "bg-green-100 text-green-800" :
                            project.projectStatus === "معلق" ? "bg-yellow-100 text-yellow-800" :
                            project.projectStatus === "ملغي" ? "bg-red-100 text-red-800" :
                            "bg-gray-100 text-gray-800"
                          }`}>
                            {project.projectStatus || "غير محدد"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditProject(project)}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <Pencil className="h-3 w-3 ml-1" />
                              تعديل
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-3 w-3 ml-1" />
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. The project will be permanently deleted.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel onClick={cancelDeleteProject}>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => confirmDeleteProject()} className="bg-red-600">Delete</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewStages(project.id as number)}
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                              <Layers className="h-3 w-3 ml-1" />
                              المراحل
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewTasks(project.id as number)}
                              className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                            >
                              <ListTodo className="h-3 w-3 ml-1" />
                              المهام
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        {searchQuery ? "لا توجد مشاريع تطابق بحثك" : "لا توجد مشاريع متاحة"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              
              {/* Pagination - Enhanced for better display and usability */}
              {totalPages > 1 && (
                <div className="mt-6 border-t pt-4">
                  <Pagination className="my-4">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => hasPreviousPage && handlePageChange(currentPage - 1)}
                          className={!hasPreviousPage ? "opacity-50 pointer-events-none cursor-not-allowed" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      
                      {getPageNumbers().map((pageNum, index) => (
                        pageNum === -1 || pageNum === -2 ? (
                          <PaginationItem key={`ellipsis-${index}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        ) : (
                          <PaginationItem key={pageNum}>
                            <PaginationLink 
                              isActive={currentPage === pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className="cursor-pointer"
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => hasNextPage && handlePageChange(currentPage + 1)}
                          className={!hasNextPage ? "opacity-50 pointer-events-none cursor-not-allowed" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                  
                  {/* Pagination info */}
                  <div className="text-center text-sm text-gray-500 mt-2">
                    صفحة {currentPage} من {totalPages} (إجمالي المشاريع: {totalItems})
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
      
      <NewProjectModal 
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  );
};

export default Projects;
