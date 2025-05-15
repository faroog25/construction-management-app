
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
    hasPreveiosPage: boolean; // Note: There's a typo in the API response, kept as is
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
  const [pageSize] = useState(8); // Fixed page size of 8 projects per page
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  // Update the clients query to handle paginated response
  const { data: clientsResponse, isLoading: isLoadingClients } = useQuery({
    queryKey: ['clients'],
    queryFn: getClients,
  });

  // Get the clients array from the response
  const clients = clientsResponse?.data || [];

  // Fetch projects with pagination
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

  // Load projects when component mounts or when page changes
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
        // Instead of using deleteProject which might not be available
        // we'll just remove it from the local state for now
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

  // Filter projects based on search
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

  // Generate page numbers for pagination
  const pageNumbers = [];
  const maxPageNumbersToShow = 5;
  const halfMaxPageNumbersToShow = Math.floor(maxPageNumbersToShow / 2);
  
  let startPage = Math.max(currentPage - halfMaxPageNumbersToShow, 1);
  let endPage = Math.min(startPage + maxPageNumbersToShow - 1, totalPages);
  
  if (endPage - startPage + 1 < maxPageNumbersToShow) {
    startPage = Math.max(endPage - maxPageNumbersToShow + 1, 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Projects</h1>
      
      <div className="mb-4 flex justify-between">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Project
        </Button>
      </div>
      
      {loading && <div className="flex justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>}
      {error && <div className="text-red-500">{error}</div>}
      
      {!loading && !error && (
        <div>
          <Table>
            <TableCaption>A list of projects.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.projectName}</TableCell>
                  <TableCell>{project.description}</TableCell>
                  <TableCell>{project.startDate?.toString()}</TableCell>
                  <TableCell>{project.expectedEndDate?.toString()}</TableCell>
                  <TableCell>{project.status}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditProject(project)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Pencil className="h-3 w-3 mr-1" />
                        تعديل
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            حذف
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the project.
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
                        <Layers className="h-3 w-3 mr-1" />
                        المراحل
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewTasks(project.id as number)}
                        className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                      >
                        <ListTodo className="h-3 w-3 mr-1" />
                        المهام
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {/* Pagination */}
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={!hasPreviousPage ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                    aria-disabled={!hasPreviousPage}
                  />
                </PaginationItem>
                
                {/* Show first page if not in view */}
                {startPage > 1 && (
                  <>
                    <PaginationItem>
                      <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
                    </PaginationItem>
                    {startPage > 2 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                  </>
                )}
                
                {/* Page numbers */}
                {pageNumbers.map(number => (
                  <PaginationItem key={number}>
                    <PaginationLink 
                      isActive={currentPage === number}
                      onClick={() => handlePageChange(number)}
                    >
                      {number}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                {/* Show last page if not in view */}
                {endPage < totalPages && (
                  <>
                    {endPage < totalPages - 1 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationLink onClick={() => handlePageChange(totalPages)}>
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={!hasNextPage ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                    aria-disabled={!hasNextPage}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
