import { useEffect, useState } from 'react';
import { 
  Worker, 
  WorkersListResponse, 
  deleteWorker, 
  getPaginatedWorkers 
} from '../services/workerService';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Skeleton } from './ui/skeleton';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { Search, Plus, User, ArrowUpDown, Pencil, Trash2, Briefcase } from 'lucide-react';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { NewWorkerModal } from './NewWorkerModal';
import { EditWorkerModal } from './EditWorkerModal';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext,
  PaginationPrevious 
} from './ui/pagination';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "./ui/alert-dialog";

export function Workers() {
  const navigate = useNavigate();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<string>('fullName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isNewWorkerModalOpen, setIsNewWorkerModalOpen] = useState(false);
  const [isEditWorkerModalOpen, setIsEditWorkerModalOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [workerToDelete, setWorkerToDelete] = useState<Worker | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response: WorkersListResponse = await getPaginatedWorkers(
        currentPage, 
        itemsPerPage, 
        searchQuery, 
        sortColumn, 
        sortDirection
      );
      
      setWorkers(response.data.items);
      setTotalPages(response.data.totalPages);
      setTotalItems(response.data.totalItems);
      
    } catch (err) {
      console.error('Error fetching workers:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch workers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
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
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const handleDeleteClick = (worker: Worker, e: React.MouseEvent) => {
    e.stopPropagation();
    setWorkerToDelete(worker);
  };

  const handleDeleteConfirm = async () => {
    if (!workerToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteWorker(workerToDelete.id);
      toast.success('Worker deleted successfully');
      fetchWorkers();
    } catch (error) {
      console.error('Error deleting worker:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete worker');
    } finally {
      setIsDeleting(false);
      setWorkerToDelete(null);
    }
  };

  const handleEditWorker = (worker: Worker, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedWorker(worker);
    setIsEditWorkerModalOpen(true);
  };

  const handleWorkerClick = (workerId: number) => {
    navigate(`/team/workers/${workerId}`);
  };

  const handleGoToSpecialties = () => {
    navigate('/worker-specialties');
  };

  const pageNumbers = [];
  const maxPageButtons = 5;
  
  if (totalPages <= maxPageButtons) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    let startPage = Math.max(currentPage - Math.floor(maxPageButtons / 2), 1);
    let endPage = Math.min(startPage + maxPageButtons - 1, totalPages);
    
    if (endPage === totalPages) {
      startPage = Math.max(totalPages - maxPageButtons + 1, 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Workers
          </CardTitle>
          
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search workers..." 
                className="pl-9 h-9 w-full"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            
            <Button variant="outline" size="sm" onClick={handleGoToSpecialties} className="flex items-center gap-1">
              <Briefcase className="h-4 w-4" />
              Specialties
            </Button>
            
            <Button size="sm" onClick={() => setIsNewWorkerModalOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => handleSort('fullName')} className="cursor-pointer">
                  <div className="flex items-center">
                    Full Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort('email')} className="cursor-pointer">
                  <div className="flex items-center">
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort('phoneNumber')} className="cursor-pointer">
                  <div className="flex items-center">
                    Phone Number
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort('specialty')} className="cursor-pointer">
                  <div className="flex items-center">
                    Specialty
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Skeleton className="h-8 w-[60px]" />
                        <Skeleton className="h-8 w-[60px]" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : workers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    {searchQuery ? 
                      <div className="flex flex-col items-center justify-center p-4">
                        <Search className="h-8 w-8 opacity-30 mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">
                          No workers found matching "{searchQuery}"
                        </p>
                        <Button variant="ghost" size="sm" onClick={() => setSearchQuery('')}>Clear Search</Button>
                      </div>
                      : 
                      <div className="flex flex-col items-center justify-center p-4">
                        <User className="h-8 w-8 opacity-30 mb-2" />
                        <p className="text-sm text-muted-foreground mb-3">
                          No workers
                        </p>
                        <Button size="sm" onClick={() => setIsNewWorkerModalOpen(true)}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add First Worker
                        </Button>
                      </div>
                    }
                  </TableCell>
                </TableRow>
              ) : (
                workers.map((worker) => (
                  <TableRow 
                    key={worker.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleWorkerClick(worker.id)}
                  >
                    <TableCell>{worker.fullName || '-'}</TableCell>
                    <TableCell>{worker.email || '-'}</TableCell>
                    <TableCell>{worker.phoneNumber || '-'}</TableCell>
                    <TableCell>{worker.specialty || '-'}</TableCell>
                    <TableCell>
                      <div 
                        className="flex space-x-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => handleEditWorker(worker, e)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Pencil className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => handleDeleteClick(worker, e)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          
          {!loading && workers.length > 0 && (
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
              <div className="text-sm text-muted-foreground mt-2 text-center">
                Total Workers: {totalItems}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <NewWorkerModal
        isOpen={isNewWorkerModalOpen}
        onClose={() => setIsNewWorkerModalOpen(false)}
        onWorkerCreated={fetchWorkers}
      />

      {isEditWorkerModalOpen && selectedWorker && (
        <EditWorkerModal
          isOpen={isEditWorkerModalOpen}
          onClose={() => setIsEditWorkerModalOpen(false)}
          onWorkerUpdated={fetchWorkers}
          worker={selectedWorker}
        />
      )}

      <AlertDialog 
        open={!!workerToDelete}
        onOpenChange={() => setWorkerToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this worker?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all worker data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
