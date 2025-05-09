import { useEffect, useState } from 'react';
import { Worker, getAllWorkers, deleteWorker } from '../services/workerService';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Skeleton } from './ui/skeleton';
import { Alert, AlertDescription } from './ui/alert';
import { ErrorBoundary } from './ErrorBoundary';
import { Button } from './ui/button';
import { CheckCircle2, XCircle, Search, Plus, UserCog, ArrowUpDown, Pencil, Trash2 } from 'lucide-react';
import { Input } from './ui/input';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from './ui/pagination';
import { useLanguage } from '@/contexts/LanguageContext';
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

export function TeamMembers() {
  const { t, isRtl } = useLanguage();
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

      // Validate the data structure
      if (!Array.isArray(data)) {
        throw new Error('Invalid data structure received from API');
      }

      // Validate each worker object
      const validWorkers = data.filter(worker => {
        return (
          worker &&
          typeof worker === 'object' &&
          'id' in worker &&
          'fullName' in worker &&
          'specialty' in worker &&
          'isAvailable' in worker
        );
      });

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

  // Filter workers based on search query
  const filteredWorkers = workers.filter(worker => 
    worker.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    worker.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort filtered workers
  const sortedWorkers = [...filteredWorkers].sort((a, b) => {
    const direction = sortDirection === 'asc' ? 1 : -1;
    
    switch (sortColumn) {
      case 'name':
        return direction * a.fullName.localeCompare(b.fullName);
      case 'specialty':
        return direction * a.specialty.localeCompare(b.specialty);
      case 'status':
        return direction * (a.isAvailable === b.isAvailable ? 0 : a.isAvailable ? -1 : 1);
      default:
        return 0;
    }
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedWorkers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentWorkers = sortedWorkers.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Generate page numbers for pagination
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
      toast.success('تم حذف العامل بنجاح');
      await fetchWorkers(); // Refresh the list
    } catch (error) {
      console.error('Error deleting worker:', error);
      toast.error(error instanceof Error ? error.message : 'فشل في حذف العامل');
    } finally {
      setLoading(false);
      setWorkerToDelete(null);
    }
  };

  const handleEditWorker = (worker: Worker) => {
    setWorkerToEdit(worker);
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
            {t('team.workers')}
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className={`absolute ${isRtl ? 'right-2.5' : 'left-2.5'} top-2.5 h-4 w-4 text-muted-foreground`} />
              <Input 
                placeholder={t('table.search')}
                className={`${isRtl ? 'pr-9' : 'pl-9'} h-9 w-full`}
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
              {t('table.add')}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table dir={isRtl ? "rtl" : "ltr"}>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className={`${isRtl ? 'text-right' : 'text-left'}`}>الاسم</TableHead>
                <TableHead className={`${isRtl ? 'text-right' : 'text-left'}`}>التخصص</TableHead>
                <TableHead className={`${isRtl ? 'text-right' : 'text-left'}`}>الحالة</TableHead>
                <TableHead className={`${isRtl ? 'text-right' : 'text-left'}`}>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                // Loading skeleton rows
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                    <TableCell className={`${isRtl ? 'text-right' : 'text-left'}`}>
                      <Skeleton className={`h-8 w-[100px] ${isRtl ? 'ml-auto' : 'mr-auto'}`} />
                    </TableCell>
                  </TableRow>
                ))
              ) : currentWorkers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-32">
                    {searchQuery ? 
                      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <Search className="h-8 w-8 opacity-30" />
                        <p>{t('search.no_results')} "{searchQuery}"</p>
                        <Button variant="link" onClick={() => setSearchQuery('')}>{t('search.clear')}</Button>
                      </div>
                      : 
                      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <UserCog className="h-8 w-8 opacity-30" />
                        <p>{t('search.no_workers')}</p>
                        <Button variant="outline" size="sm">
                          <Plus className={`${isRtl ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                          {t('search.add_first_worker')}
                        </Button>
                      </div>
                    }
                  </TableCell>
                </TableRow>
              ) : (
                currentWorkers.map((worker) => (
                  <TableRow key={worker.id} className="group">
                    <TableCell className="font-medium">{worker.fullName}</TableCell>
                    <TableCell>{worker.specialty}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {worker.isAvailable ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <span className="text-green-700 text-sm font-medium">متوفر</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 text-red-600" />
                            <span className="text-red-700 text-sm font-medium">غير متوفر</span>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className={`${isRtl ? 'text-right' : 'text-left'}`}>
                      <div className={`flex items-center ${isRtl ? 'justify-start' : 'justify-end'} gap-2 opacity-0 group-hover:opacity-100 transition-opacity`}>
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
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف العامل {workerToDelete?.fullName}؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>إلغاء</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={loading}
            >
              {loading ? 'جاري الحذف...' : 'حذف'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ErrorBoundary>
  );
}
