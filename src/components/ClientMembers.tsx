import { useEffect, useState } from 'react';
import { getClients, deleteClient, updateClient, Client } from '../services/clientService';
import { ClientType } from '@/types/client';
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
import { useNavigate } from 'react-router-dom';
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

const getClientTypeLabel = (type: ClientType): string => {
  switch (type) {
    case ClientType.Individual:
      return 'Individual';
    case ClientType.Company:
      return 'Company';
    default:
      return 'Unknown';
  }
};

export function ClientMembers() {
  const navigate = useNavigate();
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
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching clients with pagination:', {
        pageNumber: currentPage,
        pageSize: itemsPerPage,
        searchTerm: searchQuery,
        sortBy: sortColumn,
        sortDirection
      });

      const response = await getClients(currentPage, itemsPerPage, searchQuery, sortColumn, sortDirection);
      console.log('API Response:', response);
      
      setClients(response.items);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalItems);
      setHasNextPage(response.hasNextPage || false);
      setHasPreviousPage(response.hasPreviousPage || false);
    } catch (err) {
      console.error('Error fetching clients:', err);
      if (err instanceof Error && !err.message.includes('404')) {
        setError(err.message);
        toast.error('Error fetching clients');
      } else {
        setClients([]);
        setTotalPages(1);
        setTotalItems(0);
        setHasNextPage(false);
        setHasPreviousPage(false);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [currentPage, searchQuery, sortColumn, sortDirection]);

  const handleSort = (column: string) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber: number) => {
    console.log('Page change requested:', pageNumber);
    if (pageNumber < 1 || pageNumber > totalPages) {
      console.log('Invalid page number:', pageNumber, 'totalPages:', totalPages);
      return;
    }
    setCurrentPage(pageNumber);
  };

  const getVisiblePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const halfVisible = Math.floor(maxVisiblePages / 2);
      let start = Math.max(1, currentPage - halfVisible);
      let end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  const pageNumbers = getVisiblePageNumbers();

  const handleDelete = async (client: Client) => {
    setClientToDelete(client);
  };

  const confirmDelete = async () => {
    if (!clientToDelete) return;

    try {
      await deleteClient(clientToDelete.id);
      toast.success('Client deleted successfully');
      setClients(clients.filter(client => client.id !== clientToDelete.id));
      setTotalItems(totalItems - 1);
      // Refresh the data to get updated pagination
      fetchClients();
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
      clientType: client.clientType
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientToEdit) return;

    try {
      if (!editFormData.fullName || !editFormData.email || !editFormData.phoneNumber) {
        toast.error('Please fill in all required fields');
        return;
      }

      const updateData = {
        fullName: editFormData.fullName,
        email: editFormData.email,
        phoneNumber: editFormData.phoneNumber,
        clientType: editFormData.clientType
      };

      console.log('Sending update data:', updateData);

      const updatedClient = await updateClient(clientToEdit.id, updateData);
      
      setClients(prevClients => 
        prevClients.map(client => 
          client.id === clientToEdit.id ? { ...client, ...updatedClient } : client
        )
      );
      
      toast.success('Client updated successfully');
      setClientToEdit(null);
    } catch (error) {
      console.error('Error updating client:', error);
      toast.error('Failed to update client');
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

  const handleClientClick = (clientId: string) => {
    navigate(`/team/clients/${clientId}`);
  };

  if (error && !error.includes('404')) {
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
            Clients
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search..."
                className="pl-9 h-9 w-full"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <Button size="sm" className="gap-1" onClick={() => setIsAddModalOpen(true)}>
              <Plus className="h-4 w-4" />
              Add Client
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4">
              <Skeleton className="h-8 w-full mb-2" />
              <Skeleton className="h-8 w-full mb-2" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : clients.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 text-center">
              <div className="bg-gray-50 rounded-full p-6 mb-4">
                <Users className="h-16 w-16 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Clients
              </h3>
              <p className="text-gray-500 mb-6 max-w-md">
                {searchQuery 
                  ? `No clients found matching "${searchQuery}"`
                  : "Start by adding your clients to manage projects more efficiently"
                }
              </p>
              {searchQuery ? (
                <Button variant="outline" onClick={() => setSearchQuery('')}>
                  Clear Search
                </Button>
              ) : (
                <Button onClick={() => setIsAddModalOpen(true)} className="gap-2" size="lg">
                  <Plus className="h-5 w-5" />
                  Add First Client
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead 
                    className="font-medium cursor-pointer text-left"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Name
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="font-medium cursor-pointer text-left"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center">
                      Email
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="font-medium cursor-pointer text-left"
                    onClick={() => handleSort('phone')}
                  >
                    <div className="flex items-center">
                      Phone
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="font-medium cursor-pointer text-left"
                    onClick={() => handleSort('type')}
                  >
                    <div className="flex items-center">
                      Type
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="font-medium text-left">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow 
                    key={client.id} 
                    className="group cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleClientClick(client.id)}
                  >
                    <TableCell className="font-medium">
                      {client.fullName}
                    </TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.phoneNumber}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {client.clientType === ClientType.Individual ? (
                          <>
                            <User className="h-4 w-4 text-blue-600" />
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Individual
                            </span>
                          </>
                        ) : (
                          <>
                            <Building2 className="h-4 w-4 text-purple-600" />
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              Company
                            </span>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-left">
                      <div 
                        className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button variant="outline" size="xs" onClick={() => handleEdit(client)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="xs"
                          onClick={() => handleDelete(client)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          
          {!loading && clients.length > 0 && totalPages > 1 && (
            <div className="py-4 px-2">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
                </div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => handlePageChange(currentPage - 1)} 
                        className={!hasPreviousPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
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
                        onClick={() => handlePageChange(currentPage + 1)}
                        className={!hasNextPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
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
              Edit the client information here. Click save when you're done.
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
                    {editFormData.clientType === ClientType.Individual ? 'Individual' : 'Company'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ClientType.Individual}>
                    Individual
                  </SelectItem>
                  <SelectItem value={ClientType.Company}>
                    Company
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
