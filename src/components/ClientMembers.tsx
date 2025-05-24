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
  const [itemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      const response = await getClients(currentPage, itemsPerPage, searchQuery, sortColumn, sortDirection);
      setClients(response.items);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalItems);
    } catch (err) {
      console.error('Error fetching clients:', err);
      // Only set error for actual unexpected errors, not for "no data" scenarios
      if (err instanceof Error && !err.message.includes('404')) {
        setError(err.message);
        toast.error('حدث خطأ في جلب بيانات العملاء');
      } else {
        // For 404 or "no data" scenarios, just set empty state
        setClients([]);
        setTotalPages(1);
        setTotalItems(0);
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
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  // Generate page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

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
            {t('team.clients')}
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className={`absolute ${isRtl ? 'right-2.5' : 'left-2.5'} top-2.5 h-4 w-4 text-muted-foreground`} />
              <Input 
                placeholder={t('table.search')}
                className={`${isRtl ? 'pr-9' : 'pl-9'} h-9 w-full`}
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <Button size="sm" className="gap-1" onClick={() => setIsAddModalOpen(true)}>
              <Plus className="h-4 w-4" />
              إضافة عميل
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
                لا يوجد عملاء
              </h3>
              <p className="text-gray-500 mb-6 max-w-md">
                {searchQuery 
                  ? `لم يتم العثور على عملاء مطابقين لـ "${searchQuery}"`
                  : "ابدأ بإضافة عملائك لإدارة المشاريع بكفاءة أكبر"
                }
              </p>
              {searchQuery ? (
                <Button variant="outline" onClick={() => setSearchQuery('')}>
                  مسح البحث
                </Button>
              ) : (
                <Button onClick={() => setIsAddModalOpen(true)} className="gap-2" size="lg">
                  <Plus className="h-5 w-5" />
                  إضافة أول عميل
                </Button>
              )}
            </div>
          ) : (
            <Table dir={isRtl ? "rtl" : "ltr"}>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead 
                    className={`font-medium cursor-pointer ${isRtl ? 'text-right' : 'text-left'}`}
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      الاسم
                      <ArrowUpDown className={`${isRtl ? 'mr-2' : 'ml-2'} h-4 w-4`} />
                    </div>
                  </TableHead>
                  <TableHead 
                    className={`font-medium cursor-pointer ${isRtl ? 'text-right' : 'text-left'}`}
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center">
                      البريد الإلكتروني
                      <ArrowUpDown className={`${isRtl ? 'mr-2' : 'ml-2'} h-4 w-4`} />
                    </div>
                  </TableHead>
                  <TableHead 
                    className={`font-medium cursor-pointer ${isRtl ? 'text-right' : 'text-left'}`}
                    onClick={() => handleSort('phone')}
                  >
                    <div className="flex items-center">
                      رقم الهاتف
                      <ArrowUpDown className={`${isRtl ? 'mr-2' : 'ml-2'} h-4 w-4`} />
                    </div>
                  </TableHead>
                  <TableHead 
                    className={`font-medium cursor-pointer ${isRtl ? 'text-right' : 'text-left'}`}
                    onClick={() => handleSort('type')}
                  >
                    <div className="flex items-center">
                      النوع
                      <ArrowUpDown className={`${isRtl ? 'mr-2' : 'ml-2'} h-4 w-4`} />
                    </div>
                  </TableHead>
                  <TableHead className={`font-medium ${isRtl ? 'text-right' : 'text-left'}`}>الإجراءات</TableHead>
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
                        {client.clientType === 'فرد' ? (
                          <>
                            <User className="h-4 w-4 text-blue-600" />
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              فرد
                            </span>
                          </>
                        ) : (
                          <>
                            <Building2 className="h-4 w-4 text-purple-600" />
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              شركة
                            </span>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className={`${isRtl ? 'text-right' : 'text-left'}`}>
                      <div 
                        className={`flex items-center ${isRtl ? 'justify-start' : 'justify-end'} gap-2 opacity-0 group-hover:opacity-100 transition-opacity`}
                        onClick={(e) => e.stopPropagation()} // Prevent row click when clicking buttons
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
          
          {!loading && clients.length > 0 && (
            <div className="py-4 px-2">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => handlePageChange(currentPage - 1)} 
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
                      onClick={() => handlePageChange(currentPage + 1)}
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
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
              لا يمكن التراجع عن هذا الإجراء. سيتم حذف العميل
              {clientToDelete && ` "${clientToDelete.fullName}"`} نهائياً.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!clientToEdit} onOpenChange={() => setClientToEdit(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل العميل</DialogTitle>
            <DialogDescription>
              قم بتعديل معلومات العميل هنا. انقر على حفظ عند الانتهاء.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">الاسم الكامل</Label>
              <Input
                id="fullName"
                name="fullName"
                value={editFormData.fullName}
                onChange={handleEditChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
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
              <Label htmlFor="phoneNumber">رقم الهاتف</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={editFormData.phoneNumber}
                onChange={handleEditChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientType">نوع العميل</Label>
              <Select
                value={editFormData.clientType}
                onValueChange={handleTypeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع العميل">
                    {editFormData.clientType === ClientType.Individual ? 'فرد' : 'شركة'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ClientType.Individual}>
                    فرد
                  </SelectItem>
                  <SelectItem value={ClientType.Company}>
                    شركة
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setClientToEdit(null)}>
                إلغاء
              </Button>
              <Button type="submit">حفظ التغييرات</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </ErrorBoundary>
  );
}
