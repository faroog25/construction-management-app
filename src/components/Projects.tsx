import React from 'react';
import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
} from "@/components/ui/alert-dialog"
import { toast } from 'sonner';
import { Edit, Plus, Pencil, Trash2, Layers, ListTodo } from 'lucide-react';
import { Project } from '@/types/project';
import { getAllProjects, deleteProject, Client, getClients } from '@/services/projectService';
import { useLanguage } from '@/hooks/useLanguage';
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const Projects = () => {
  const { t, isRtl } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] useState<string>('name');
  const [sortDirection, setSortDirection] useState<'asc' | 'desc'>('asc');
  const [projectToDelete, setProjectToDelete] useState<Project | null>(null);
  const [projectToEdit, setProjectToEdit] useState<Project | null>(null);
  const [isLoadingClients, setIsLoadingClients] = useState(true);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);

  // Initialize form data
  const [addFormData, setAddFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: 0,
    status: 'active',
    clientId: 0
  });

  // Update the clients query to handle paginated response
  const { data: clientsResponse, isLoading: isLoadingClients } = useQuery({
    queryKey: ['clients'],
    queryFn: getClients,
  });

  // Get the clients array from the response
  const clients = clientsResponse?.items || [];

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const projectsData = await getAllProjects();
        setProjects(Array.isArray(projectsData) ? projectsData : []);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleEditProject = (project: Project) => {
    setProjectToEdit(project);
  };

  const handleDeleteProject = (projectId: number) => {
    setProjectToDelete({ id: projectId } as Project);
  };

  const confirmDeleteProject = async () => {
    if (projectToDelete) {
      try {
        await deleteProject(projectToDelete.id);
        setProjects(projects.filter(project => project.id !== projectToDelete.id));
        toast.success(t('projects.deleteSuccess'));
      } catch (error) {
        console.error('Error deleting project:', error);
        toast.error(t('projects.deleteError'));
      } finally {
        setProjectToDelete(null);
      }
    }
  };

  const cancelDeleteProject = () => {
    setProjectToDelete(null);
  };

  const handleViewStages = (projectId: number) => {
    toast.info(`View stages for project ${projectId}`);
  };

  const handleViewTasks = (projectId: number) => {
    toast.info(`View tasks for project ${projectId}`);
  };

  const formSchema = z.object({
    name: z.string().min(2, {
      message: "Project name must be at least 2 characters.",
    }),
    description: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    budget: z.number().optional(),
    status: z.string().optional(),
    clientId: z.number({
      required_error: "Please select a client.",
    }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      budget: 0,
      status: "active",
      clientId: 0,
    },
  })

  const [formErrors, setFormErrors] = useState({});

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <div>
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteProject(project.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          حذف
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewStages(project.id)}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <Layers className="h-3 w-3 mr-1" />
                          المراحل
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewTasks(project.id)}
                          className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                        >
                          <ListTodo className="h-3 w-3 mr-1" />
                          المهام
                        </Button>
                      </div>
                    </TableCell>
    </div>
  );
};

export default Projects;
