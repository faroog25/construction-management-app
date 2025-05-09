import { useEffect, useState } from 'react';
import { getClients, deleteClient, updateClient } from '../services/clientService';
import { Client, ClientType } from '@/types/client';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Skeleton } from './ui/skeleton';
import { Alert, AlertDescription } from './ui/alert';
import { ErrorBoundary } from './ErrorBoundary';
import { Button } from './ui/button';
import { Plus, Search, Building2, User, Users, ArrowUpDown, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { NewClientModal } from './NewClientModal';
import { Input } from './ui/input';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from './ui/pagination';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const getClientTypeLabel = (type: ClientType, t: (key: string) => string): string => {
  switch (type) {
    case ClientType.Individual:
      return t('client.individual');
    case ClientType.Company:
      return t('client.company');
    default:
      return t('client.unknown');
  }
};

export function ClientMembers() {
  const { t, isRtl } = useLanguage();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const [editFormData, setEditFormData] = useState({
    id: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    clientType: ClientType.Individual
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getClients();

      // Validate the data structure
      if (!Array.isArray(data)) {
        throw new Error('Invalid data structure received from API');
      }

      // Validate each client object
      const validClients = data.filter(client => {
        return (
          client &&
          typeof client === 'object' &&
          'id' in client &&
          'fullName' in client &&
          'email' in client &&
          'phoneNumber' in client &&
          'clientType' in client
        );
      });

      setClients(validClients as Client[]);
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError(err instanceof Error ? err.message : t('search.no_clients'));
      toast.error(t('search.no_clients'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleSort = (column: string) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleDelete = async (client: Client) => {
    setClientToDelete(client);
  };

  const confirmDelete = async () => {
    if (!clientToDelete) return;

    try {
      await deleteClient(clientToDelete.id);
      toast.success('Client deleted successfully');
      // Remove the deleted client from the state
      setClients(clients.filter(client => client.id !== clientToDelete.id));
    } catch (error) {
      toast.error('Failed to delete client');
      console.error('Error deleting client:', error);
    } finally {
      setClientToDelete(null);
    }
  };

  const handleEdit = (client: Client) => {
    setClientToEdit(client);
    setEditFormData({
      id: client.id,
      fullName: client.fullName,
      email: client.email,
      phoneNumber: client.phoneNumber,
      clientType:client.clientType
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientToEdit) return;

    try {
      // Validate form data
      if (!editFormData.fullName || !editFormData.email || !editFormData.phoneNumber) {
        toast.error(t('client.validation_error'));
        return;
      }

      // Prepare the update data
      const updateData = {
        fullName: editFormData.fullName,
        email: editFormData.email,
        phoneNumber: editFormData.phoneNumber,
        clientType: editFormData.clientType
      };

      console.log('Sending update data:', updateData);

      const updatedClient = await updateClient(clientToEdit.id, updateData);
      
      // Update the clients list with the new data
      setClients(prevClients => 
        prevClients.map(client => 
          client.id === clientToEdit.id ? { ...client, ...updatedClient } : client
        )
      );
      
      toast.success(t('client.update_success'));
      setClientToEdit(null);
    } catch (error) {
      console.error('Error updating client:', error);
      toast.error(t('client.update_error'));
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTypeChange = (value: string) => {
    console.log('Selected client type:', value);
    setEditFormData(prev => ({
      ...prev,
      clientType: value as ClientType
    }));
  };

  // Filter clients based on search query
  const filteredClients = clients.filter(client => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (client.fullName?.toLowerCase() || '').includes(searchLower) ||
      (client.email?.toLowerCase() || '').includes(searchLower) ||
      (client.phoneNumber?.toLowerCase() || '').includes(searchLower)
    );
  });

  // Sort filtered clients
  const sortedClients = [...filteredClients].sort((a, b) => {
    const direction = sortDirection === 'asc' ? 1 : -1;
    
    switch (sortColumn) {
      case 'name':
        return direction * ((a.fullName || '').localeCompare(b.fullName || ''));
      case 'email':
        return direction * ((a.email || '').localeCompare(b.email || ''));
      case 'phone':
        return direction * ((a.phoneNumber || '').localeCompare(b.phoneNumber || ''));
      case 'type':
        return direction * (a.clientType === b.clientType ? 0 : a.clientType === ClientType.Individual ? -1 : 1);
      default:
        return 0;
    }
  });
  
  // Pagination logic
  const totalPages = Math.ceil(sortedClients.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentClients = sortedClients.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Generate page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <ErrorBoundary>
      <Card className="border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between bg-muted/10 pb-2">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Users className="h-5 w-5 text-primary" />
            {t('team.clients')}
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className={`absolute ${isRtl ? 'right-2.5' : 'left-2.5'} top-2.5 h-4 w-4 text-muted-foreground`} />
              <Input 
                placeholder={t('search.clients')}
                className={`${isRtl ? 'pr-9' : 'pl-9'} h-9 w-full`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button size="sm" className="gap-1" onClick={() => setIsAddModalOpen(true)}>
              <Plus className="h-4 w-4" />
              {t('table.add')}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table dir={isRtl ? "rtl" : "ltr"}>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead 
                  className={`font-medium cursor-pointer ${isRtl ? 'text-right' : 'text-left'}`}
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    {t('table.name')}
                    <ArrowUpDown className={`${isRtl ? 'mr-2' : 'ml-2'} h-4 w-4`} />
                  </div>
                </TableHead>
                <TableHead 
                  className={`font-medium cursor-pointer ${isRtl ? 'text-right' : 'text-left'}`}
                  onClick={() => handleSort('email')}
                >
                  <div className="flex items-center">
                    {t('table.email')}
                    <ArrowUpDown className={`${isRtl ? 'mr-2' : 'ml-2'} h-4 w-4`} />
                  </div>
                </TableHead>
                <TableHead 
                  className={`font-medium cursor-pointer ${isRtl ? 'text-right' : 'text-left'}`}
                  onClick={() => handleSort('phone')}
                >
                  <div className="flex items-center">
                    {t('table.phone')}
                    <ArrowUpDown className={`${isRtl ? 'mr-2' : 'ml-2'} h-4 w-4`} />
                  </div>
                </TableHead>
                <TableHead 
                  className={`font-medium cursor-pointer ${isRtl ? 'text-right' : 'text-left'}`}
                  onClick={() => handleSort('type')}
                >
                  <div className="flex items-center">
                    {t('table.type')}
                    <ArrowUpDown className={`${isRtl ? 'mr-2' : 'ml-2'} h-4 w-4`} />
                  </div>
                </TableHead>
                <TableHead className={`font-medium ${isRtl ? 'text-right' : 'text-left'}`}>{t('table.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                    <TableCell className={`${isRtl ? 'text-right' : 'text-left'}`}>
                      <Skeleton className={`h-8 w-[100px] ${isRtl ? 'ml-auto' : 'mr-auto'}`} />
                    </TableCell>
                  </TableRow>
                ))
              ) : currentClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-32">
                    {searchQuery ? 
                      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <Search className="h-8 w-8 opacity-30" />
                        <p>{t('search.no_results')} "{searchQuery}"</p>
                        <Button variant="link" onClick={() => setSearchQuery('')}>{t('search.clear')}</Button>
                      </div>
                      : 
                      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <Users className="h-8 w-8 opacity-30" />
                        <p>{t('search.no_clients')}</p>
                        <Button variant="outline" size="sm" onClick={() => setIsAddModalOpen(true)}>
                          <Plus className={`${isRtl ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                          {t('search.add_first_client')}
                        </Button>
                      </div>
                    }
                  </TableCell>
                </TableRow>
              ) : (
                currentClients.map((client) => (
                  <TableRow key={client.id} className="group">
                    <TableCell className="font-medium">{client.fullName}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.phoneNumber}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {client.clientType === 'فرد' ? (
                          <>
                            <User className="h-4 w-4 text-blue-600" />
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {t('client.individual')}
                            </span>
                          </>
                        ) : (
                          <>
                            <Building2 className="h-4 w-4 text-purple-600" />
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {t('client.company')}
                            </span>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className={`${isRtl ? 'text-right' : 'text-left'}`}>
                      <div className={`flex items-center ${isRtl ? 'justify-start' : 'justify-end'} gap-2 opacity-0 group-hover:opacity-100 transition-opacity`}>
                        <Button variant="outline" size="xs" onClick={() => handleEdit(client)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="xs"
                          onClick={() => handleDelete(client)}
                        >
                          {t('table.delete')}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          
          {!loading && filteredClients.length > 0 && (
            <div className="py-4 px-2">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)} 
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      aria-disabled={currentPage === 1} 
                    />
                  </PaginationItem>
                  
                  {pageNumbers.map(number => (
                    <PaginationItem key={number}>
                      <PaginationLink 
                        isActive={number === currentPage}
                        onClick={() => handlePageChange(number)}
                        className="cursor-pointer"
                      >
                        {number}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      aria-disabled={currentPage === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
      <NewClientModal
        isOpen={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onClientCreated={fetchClients}
      />

      <AlertDialog open={!!clientToDelete} onOpenChange={() => setClientToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the client
              {clientToDelete && ` "${clientToDelete.fullName}"`}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!clientToEdit} onOpenChange={() => setClientToEdit(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
            <DialogDescription>
              Make changes to the client information here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                value={editFormData.fullName}
                onChange={handleEditChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={editFormData.email}
                onChange={handleEditChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={editFormData.phoneNumber}
                onChange={handleEditChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientType">Client Type</Label>
              <Select
                value={editFormData.clientType}
                onValueChange={handleTypeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select client type">
                    {editFormData.clientType === ClientType.Individual ? t('client.individual') : t('client.company')}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ClientType.Individual}>
                    {t('client.individual')}
                  </SelectItem>
                  <SelectItem value={ClientType.Company}>
                    {t('client.company')}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setClientToEdit(null)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </ErrorBoundary>
  );
}
