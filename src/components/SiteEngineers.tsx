import { useEffect, useState } from 'react';
import { SiteEngineer, getAllEngineers, deleteEngineer } from '../services/engineerService';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Skeleton } from './ui/skeleton';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { CheckCircle2, XCircle, Search, Plus, HardHat, ArrowUpDown, Pencil, Trash2 } from 'lucide-react';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { NewSiteEngineerModal } from './NewSiteEngineerModal';
import { EditSiteEngineerModal } from './EditSiteEngineerModal';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from './ui/pagination';
import { useNavigate } from 'react-router-dom';

export interface BaseEngineer {
  id: number;
  fullName: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  isAvailable?: boolean;
  nationalId?: string;
}

export function SiteEngineers() {
  const [engineers, setEngineers] = useState<BaseEngineer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isNewEngineerModalOpen, setIsNewEngineerModalOpen] = useState(false);
  const [isEditEngineerModalOpen, setIsEditEngineerModalOpen] = useState(false);
  const [selectedEngineer, setSelectedEngineer] = useState<BaseEngineer | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
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
    } catch (err) {
      console.error('Error fetching engineers:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch engineers');
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
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    console.log(currentPage)
  };

  // Generate page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const handleDeleteEngineer = async (id: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المهندس؟')) {
      try {
        await deleteEngineer(id);
        toast.success('تم حذف المهندس بنجاح');
        fetchEngineers();
      } catch (error) {
        console.error('Error deleting engineer:', error);
        toast.error('فشل في حذف المهندس');
      }
    }
  };

  const handleEditEngineer = (engineer: BaseEngineer) => {
    setSelectedEngineer(engineer);
    setIsEditEngineerModalOpen(true);
  };

  const handleEngineerClick = (engineerId: number) => {
    navigate(`/team/site-engineers/${engineerId}`);
  };

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
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort('nationalId')} className="cursor-pointer">
                  <div className="flex items-center">
                    الرقم الوطني
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort('phone')} className="cursor-pointer">
                  <div className="flex items-center">
                    رقم الهاتف
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort('email')} className="cursor-pointer">
                  <div className="flex items-center">
                    البريد الإلكتروني
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort('address')} className="cursor-pointer">
                  <div className="flex items-center">
                    العنوان
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort('status')} className="cursor-pointer">
                  <div className="flex items-center">
                    الحالة
                    <ArrowUpDown className="ml-2 h-4 w-4" />
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
                      <Skeleton className="h-4 w-[180px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[150px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[80px]" />
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
                  <TableCell colSpan={6} className="h-24 text-center">
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
                      {engineer.fullName}
                    </TableCell>
                    <TableCell>{engineer.nationalId || '-'}</TableCell>
                    <TableCell>{engineer.phoneNumber}</TableCell>
                    <TableCell>{engineer.email || '-'}</TableCell>
                    <TableCell>{engineer.address || '-'}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {engineer.isAvailable ? (
                          <div className="flex items-center">
                            <CheckCircle2 className="h-4 w-4 text-green-600 mr-1.5" />
                            <span className="text-green-600 text-sm">
                              متاح
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <XCircle className="h-4 w-4 text-red-600 mr-1.5" />
                            <span className="text-red-600 text-sm">
                              غير متاح
                            </span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div 
                        className="flex space-x-2"
                        onClick={(e) => e.stopPropagation()} // Prevent row click when clicking buttons
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditEngineer(engineer)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Pencil className="h-3 w-3 mr-1" />
                          تعديل
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteEngineer(engineer.id)}
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
    </>
  );
}
