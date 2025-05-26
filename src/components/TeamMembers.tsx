import { useEffect, useState } from 'react';
import { Worker, getAllWorkers, deleteWorker } from '../services/workerService';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Skeleton } from './ui/skeleton';
import { Alert, AlertDescription } from './ui/alert';
import { ErrorBoundary } from './ErrorBoundary';
import { Button } from './ui/button';
import { CheckCircle2, XCircle, Search, Plus, UserCog, ArrowUpDown, Pencil, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { Input } from './ui/input';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from './ui/pagination';
import { toast } from 'sonner';
import { NewWorkerModal } from './NewWorkerModal';
import { EditWorkerModal } from './EditWorkerModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { useNavigate } from 'react-router-dom';

export function TeamMembers() {
  const navigate = useNavigate();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [workerToDelete, setWorkerToDelete] = useState<Worker | null>(null);
  const [isNewWorkerModalOpen, setIsNewWorkerModalOpen] = useState(false);
  const [workerToEdit, setWorkerToEdit] = useState<Worker | null>(null);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllWorkers();

      if (!Array.isArray(data)) {
        throw new Error('Invalid data structure received from API');
      }

      const validWorkers = data.map(worker => ({
        ...worker,
        isAvailable: worker.isAvailable ?? true
      }));

      setWorkers(validWorkers);
    } catch (err) {
      console.error('Error fetching workers:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch workers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const handleSort = (column: string) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const filteredWorkers = workers.filter(worker => {
    return worker.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           (worker.specialty && worker.specialty.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const sortedWorkers = [...filteredWorkers].sort((a, b) => {
    const direction = sortDirection === 'asc' ? 1 : -1;
    
    switch (sortColumn) {
      case 'name':
        return direction * (a.fullName || '').localeCompare(b.fullName || '');
      case 'specialty':
        return direction * (a.specialty || '').localeCompare(b.specialty || '');
      case 'status':
        return direction * ((a.isAvailable === b.isAvailable) ? 0 : (a.isAvailable ? -1 : 1));
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedWorkers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentWorkers = sortedWorkers.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const handleDeleteWorker = async (worker: Worker) => {
    setWorkerToDelete(worker);
  };

  const confirmDelete = async () => {
    if (!workerToDelete) return;

    try {
      setLoading(true);
      await deleteWorker(workerToDelete.id);
      toast.success('Worker deleted successfully');
      await fetchWorkers();
    } catch (error) {
      console.error('Error deleting worker:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete worker');
    } finally {
      setLoading(false);
      setWorkerToDelete(null);
    }
  };

  const handleEditWorker = (worker: Worker) => {
    setWorkerToEdit(worker);
  };

  const handleWorkerClick = (workerId: number) => {
    navigate(`/team/workers/${workerId}`);
  };

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
            <UserCog className="h-5 w-5 text-primary" />
            Team Members
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search..."
                className="pl-9 h-9 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              size="sm" 
              className="gap-1" 
              onClick={() => setIsNewWorkerModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead>Name</TableHead>
                <TableHead>Specialty</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-[100px] mr-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : currentWorkers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-32">
                    {searchQuery ? 
                      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <Search className="h-8 w-8 opacity-30" />
                        <p>No results found for "{searchQuery}"</p>
                        <Button variant="link" onClick={() => setSearchQuery('')}>Clear search</Button>
                      </div>
                      : 
                      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <UserCog className="h-8 w-8 opacity-30" />
                        <p>No workers found</p>
                        <Button variant="outline" size="sm">
                          <Plus className="mr-2 h-4 w-4" />
                          Add first worker
                        </Button>
                      </div>
                    }
                  </TableCell>
                </TableRow>
              ) : (
                currentWorkers.map((worker) => (
                  <TableRow 
                    key={worker.id} 
                    className="group cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleWorkerClick(worker.id)}
                  >
                    <TableCell className="font-medium">
                      {worker.fullName}
                    </TableCell>
                    <TableCell>{worker.specialty || '-'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {worker.isAvailable ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <span className="text-green-700 text-sm font-medium">Available</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 text-red-600" />
                            <span className="text-red-700 text-sm font-medium">Unavailable</span>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-left">
                      <div 
                        className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button 
                          variant="outline" 
                          size="xs"
                          onClick={() => handleEditWorker(worker)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="xs"
                          onClick={() => handleDeleteWorker(worker)}
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          
          {!loading && filteredWorkers.length > 0 && (
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

      <NewWorkerModal
        isOpen={isNewWorkerModalOpen}
        onClose={() => setIsNewWorkerModalOpen(false)}
        onWorkerCreated={fetchWorkers}
      />

      <EditWorkerModal
        isOpen={!!workerToEdit}
        onClose={() => setWorkerToEdit(null)}
        onWorkerUpdated={fetchWorkers}
        worker={workerToEdit}
      />

      <AlertDialog open={!!workerToDelete} onOpenChange={() => setWorkerToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {workerToDelete ? workerToDelete.fullName || 'Unknown' : ''}? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ErrorBoundary>
  );
}
