import { useEffect, useState } from 'react';
import { getAllEngineers } from '../services/engineerService';
import { SiteEngineer } from '@/types/siteEngineer';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Skeleton } from './ui/skeleton';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { Search, Plus, HardHat, ArrowUpDown, Pencil, Trash2 } from 'lucide-react';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { NewSiteEngineerModal } from './NewSiteEngineerModal';
import { EditSiteEngineerModal } from './EditSiteEngineerModal';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from './ui/pagination';
import { useNavigate } from 'react-router-dom';
import { deleteEngineer } from '@/services/engineerService';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from './ui/alert-dialog';

export function SiteEngineers() {
  const [engineers, setEngineers] = useState<SiteEngineer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isNewEngineerModalOpen, setIsNewEngineerModalOpen] = useState(false);
  const [isEditEngineerModalOpen, setIsEditEngineerModalOpen] = useState(false);
  const [selectedEngineer, setSelectedEngineer] = useState<SiteEngineer | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [engineerToDelete, setEngineerToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const navigate = useNavigate();

  const fetchEngineers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllEngineers(currentPage, itemsPerPage, searchQuery, sortColumn, sortDirection);
      setEngineers(response.items);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalItems);
      setCurrentPage(response.pageNumber);
    } catch (err) {
      console.error('Error fetching engineers:', err);
      // Only set error for actual unexpected errors, not for "no data" scenarios
      if (err instanceof Error && !err.message.includes('404')) {
        setError(err.message);
        toast.error('حدث خطأ في جلب بيانات المهندسين');
      } else {
        // For 404 or "no data" scenarios, just set empty state
        setEngineers([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEngineers();
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

  const handleDeleteClick = (id: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setEngineerToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (engineerToDelete !== null) {
      try {
        setIsDeleting(true);
        await deleteEngineer(engineerToDelete);
        toast.success('تم حذف المهندس بنجاح');
        setIsDeleteDialogOpen(false);
        setEngineerToDelete(null);
        await fetchEngineers();
      } catch (error) {
        console.error('Error deleting engineer:', error);
        toast.error(error instanceof Error ? error.message : 'فشل في حذف المهندس');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleEditEngineer = (engineer: SiteEngineer, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedEngineer(engineer);
    setIsEditEngineerModalOpen(true);
  };

  const handleEngineerClick = (engineerId: number) => {
    navigate(`/team/site-engineers/${engineerId}`);
  };

  if (error && !error.includes('404')) {
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
            <HardHat className="h-5 w-5 text-primary" />
            المهندسين
          </CardTitle>
          
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="بحث عن مهندس..." 
                className="pl-9 h-9 w-full"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            
            <Button size="sm" onClick={() => setIsNewEngineerModalOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              إضافة
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => handleSort('name')} className="cursor-pointer">
                  <div className="flex items-center">
                    الاسم
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort('userName')} className="cursor-pointer">
                  <div className="flex items-center">
                    اسم المستخدم
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort('phoneNumber')} className="cursor-pointer">
                  <div className="flex items-center">
                    رقم الهاتف
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort('email')} className="cursor-pointer">
                  <div className="flex items-center">
                    البريد الإلكتروني
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    <TableCell>
                      <Skeleton className="h-4 w-[150px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[120px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[120px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[180px]" />
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Skeleton className="h-8 w-[60px]" />
                        <Skeleton className="h-8 w-[60px]" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : engineers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    {searchQuery ? 
                      <div className="flex flex-col items-center justify-center p-4">
                        <Search className="h-8 w-8 opacity-30 mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">
                          لم يتم العثور على مهندسين مطابقين لـ "{searchQuery}"
                        </p>
                        <Button variant="ghost" size="sm" onClick={() => setSearchQuery('')}>مسح البحث</Button>
                      </div>
                      : 
                      <div className="flex flex-col items-center justify-center p-4">
                        <HardHat className="h-8 w-8 opacity-30 mb-2" />
                        <p className="text-sm text-muted-foreground mb-3">
                          لا يوجد مهندسين
                        </p>
                        <Button size="sm" onClick={() => setIsNewEngineerModalOpen(true)}>
                          <Plus className="mr-2 h-4 w-4" />
                          إضافة أول مهندس
                        </Button>
                      </div>
                    }
                  </TableCell>
                </TableRow>
              ) : (
                engineers.map((engineer) => (
                  <TableRow 
                    key={engineer.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleEngineerClick(engineer.id)}
                  >
                    <TableCell>
                      {engineer.name}
                    </TableCell>
                    <TableCell>{engineer.userName}</TableCell>
                    <TableCell>{engineer.phoneNumber}</TableCell>
                    <TableCell>{engineer.email || '-'}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => handleEditEngineer(engineer, e)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Pencil className="h-3 w-3 mr-1" />
                          تعديل
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => handleDeleteClick(engineer.id, e)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          حذف
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          
          {!loading && engineers.length > 0 && (
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
                إجمالي المهندسين: {totalItems}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <NewSiteEngineerModal
        isOpen={isNewEngineerModalOpen}
        onOpenChange={setIsNewEngineerModalOpen}
        onEngineerCreated={fetchEngineers}
      />

      {isEditEngineerModalOpen && selectedEngineer && (
        <EditSiteEngineerModal
          isOpen={isEditEngineerModalOpen}
          onOpenChange={setIsEditEngineerModalOpen}
          onEngineerUpdated={fetchEngineers}
          engineer={selectedEngineer}
        />
      )}

      <AlertDialog 
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف هذا المهندس؟</AlertDialogTitle>
            <AlertDialogDescription>
              هذا الإجراء لا يمكن التراجع عنه. سيؤدي هذا إلى حذف جميع بيانات المهندس بشكل دائم.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>إلغاء</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? 'جاري الحذف...' : 'حذف'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
