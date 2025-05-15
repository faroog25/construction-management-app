import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, ArrowUpDown, Wrench, RotateCcw, Box, Tag, Loader2, Info } from 'lucide-react';
import { EquipmentItem } from '@/types/equipment';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { getEquipment, mapApiEquipmentToEquipmentItem } from '@/services/equipmentService';
import { useToast } from '@/hooks/use-toast';
import EquipmentDetailsDialog from './EquipmentDetailsDialog';

interface EquipmentListProps {
  onSelectEquipment: (equipment: EquipmentItem) => void;
}

const EquipmentList: React.FC<EquipmentListProps> = ({ onSelectEquipment }) => {
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof EquipmentItem>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  
  // Equipment details dialog state
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<number | null>(null);
  
  const { toast } = useToast();

  // Fetch equipment data from API
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await getEquipment(currentPage, pageSize);
        
        // Map API equipment to our internal format
        const mappedEquipment = response.data.items.map(mapApiEquipmentToEquipmentItem);
        
        // Update state with API data
        setEquipment(mappedEquipment);
        setTotalPages(response.data.totalPages);
        setTotalItems(response.data.totalItems);
        setCurrentPage(response.data.currentPage);
        setHasNextPage(response.data.hasNextPage);
        setHasPrevPage(response.data.hasPreveiosPage);
      } catch (error) {
        console.error('Failed to fetch equipment:', error);
        setError('Failed to load equipment data. Please try again later.');
        toast({
          title: 'Error',
          description: 'Failed to load equipment data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEquipment();
  }, [currentPage, pageSize, toast]);

  const handleSort = (field: keyof EquipmentItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleMakeAvailable = (id: string) => {
    setEquipment(equipment.map(item => 
      item.id === id ? { ...item, status: 'Available' } : item
    ));
  };

  const handleRestore = (id: string) => {
    setEquipment(equipment.map(item => 
      item.id === id ? { ...item, status: 'Available' } : item
    ));
  };

  // Show equipment details dialog
  const handleViewDetails = (equipmentId: string) => {
    setSelectedEquipmentId(Number(equipmentId));
    setIsDetailsDialogOpen(true);
  };

  // Apply client-side sorting and filtering
  const filteredEquipment = equipment.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedEquipment = [...filteredEquipment].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Show at most 5 page numbers
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    // Adjust if we're at the end
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

  return (
    <Card className="shadow-lg border-muted">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
          <Box className="h-6 w-6" />
          Available Equipment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search equipment by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Tag className="h-4 w-4" />
              Categories
            </Button>
          </div>
        </div>

        <div className="overflow-auto rounded-xl border bg-card">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-lg text-muted-foreground">Loading equipment data...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-destructive">
              <p className="text-lg font-medium">{error}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => handlePageChange(currentPage)} // Retry current page
              >
                Retry
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead 
                    className="cursor-pointer font-semibold"
                    onClick={() => handleSort('name')}
                  >
                    Equipment Name
                    <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer font-semibold"
                    onClick={() => handleSort('category')}
                  >
                    Model
                    <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer font-semibold"
                    onClick={() => handleSort('status')}
                  >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedEquipment.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No equipment found. Try adjusting your search or try a different page.
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedEquipment.map((item) => (
                    <TableRow 
                      key={item.id} 
                      className="hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => handleViewDetails(item.id)}
                    >
                      <TableCell className="font-medium">
                        {item.name}
                        {item.featured && (
                          <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary hover:bg-primary/20">
                            Featured
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={item.status === 'Available' ? 'default' : 'destructive'}
                          className={item.status === 'Available' ? 'bg-green-500 hover:bg-green-600' : ''}
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent row click event
                              handleViewDetails(item.id);
                            }}
                            className="gap-1"
                          >
                            <Info className="h-4 w-4" />
                            Details
                          </Button>
                          {item.status === 'Maintenance' ? (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent row click event
                                handleMakeAvailable(item.id);
                              }}
                              className="gap-1 hover:bg-green-50"
                            >
                              <Wrench className="h-4 w-4" />
                              Mark Available
                            </Button>
                          ) : item.status === 'In Use' ? (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent row click event
                                handleRestore(item.id);
                              }}
                              className="gap-1 hover:bg-blue-50"
                            >
                              <RotateCcw className="h-4 w-4" />
                              Return
                            </Button>
                          ) : (
                            <Button 
                              variant="default"
                              size="sm"
                              disabled={item.status !== 'Available'}
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent row click event
                                onSelectEquipment(item);
                              }}
                              className="bg-primary hover:bg-primary/90"
                            >
                              Book Now
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}

          {/* Pagination */}
          {totalPages > 1 && !isLoading && !error && (
            <div className="py-4 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => handlePageChange(currentPage - 1)} 
                      className={!hasPrevPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {getPageNumbers().map(page => (
                    <PaginationItem key={page}>
                      <PaginationLink 
                        isActive={page === currentPage}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => handlePageChange(currentPage + 1)} 
                      className={!hasNextPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          {/* Page info */}
          {!isLoading && !error && totalItems > 0 && (
            <div className="text-center text-sm text-muted-foreground py-2">
              Showing {filteredEquipment.length} of {totalItems} items | Page {currentPage} of {totalPages}
            </div>
          )}
        </div>
      </CardContent>
      
      {/* Equipment Details Dialog */}
      <EquipmentDetailsDialog
        equipmentId={selectedEquipmentId}
        isOpen={isDetailsDialogOpen}
        onClose={() => setIsDetailsDialogOpen(false)}
      />
    </Card>
  );
};

export default EquipmentList;
