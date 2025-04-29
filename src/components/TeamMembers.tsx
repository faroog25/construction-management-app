
import { useEffect, useState } from 'react';
import { Worker, getAllWorkers } from '../services/workerService';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Skeleton } from './ui/skeleton';
import { Alert, AlertDescription } from './ui/alert';
import { ErrorBoundary } from './ErrorBoundary';
import { Button } from './ui/button';
import { CheckCircle2, XCircle, Search, Plus, UserCog, ArrowUpDown } from 'lucide-react';
import { Input } from './ui/input';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from './ui/pagination';

export function TeamMembers() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
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
            Workers
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search workers..." 
                className="pl-9 h-9 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead 
                  className="font-medium cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="font-medium cursor-pointer"
                  onClick={() => handleSort('specialty')}
                >
                  <div className="flex items-center">
                    Specialty
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="font-medium cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center">
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="font-medium text-right">Actions</TableHead>
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
                    <TableCell className="text-right"><Skeleton className="h-8 w-[100px] ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : currentWorkers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-32">
                    {searchQuery ? 
                      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <Search className="h-8 w-8 opacity-30" />
                        <p>No workers found matching "{searchQuery}"</p>
                        <Button variant="link" onClick={() => setSearchQuery('')}>Clear search</Button>
                      </div>
                      : 
                      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <UserCog className="h-8 w-8 opacity-30" />
                        <p>No workers found</p>
                        <Button variant="outline" size="sm">
                          <Plus className="mr-2 h-4 w-4" />
                          Add your first worker
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
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="outline" size="xs">Edit</Button>
                        <Button variant="destructive" size="xs">Delete</Button>
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
    </ErrorBoundary>
  );
}
