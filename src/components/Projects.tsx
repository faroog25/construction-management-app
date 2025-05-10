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

              <div className="grid gap-2">
                <Label htmlFor="client">{t('projects.client')}</Label>
                <Select
                  onValueChange={(value) => {
                    const id = parseInt(value);
                    setSelectedClientId(id);
                    form.setValue("clientId", id);
                  }}
                  value={form.watch("clientId")?.toString() || ""}
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
                    ) : clients.length > 0 ? (
                      clients.map((client) => (
                        <SelectItem key={client.id} value={client.id.toString()}>
                          {client.fullName || client.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="" disabled>
                        No clients available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {formErrors.clientId && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.clientId}</p>
                )}
              </div> 

  const { t, isRtl } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
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