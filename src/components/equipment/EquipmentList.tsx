import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, Filter, ArrowUpDown, Wrench, RotateCcw, Box, Tag, 
  Loader2, Info, Check, X, Book, CircleCheck, CircleMinus, CircleX, ArrowRight
} from 'lucide-react';
import { EquipmentItem } from '@/types/equipment';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { 
  getEquipment, 
  mapApiEquipmentToEquipmentItem, 
  setEquipmentStatus 
} from '@/services/equipmentService';
import { useToast } from '@/hooks/use-toast';
import EquipmentDetailsDialog from './EquipmentDetailsDialog';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface EquipmentListProps {
  onSelectEquipment: (equipment: EquipmentItem) => void;
  onRefresh?: () => void;
}

// Equipment status mapping constants
const EQUIPMENT_STATUS = {
  AVAILABLE: 0,
  IN_USE: 1,
  UNDER_MAINTENANCE: 2,
  OUT_OF_SERVICE: 3
};

const EQUIPMENT_STATUS_LABELS = {
  [EQUIPMENT_STATUS.AVAILABLE]: 'Available',
  [EQUIPMENT_STATUS.IN_USE]: 'In Use',
  [EQUIPMENT_STATUS.UNDER_MAINTENANCE]: 'Under Maintenance',
  [EQUIPMENT_STATUS.OUT_OF_SERVICE]: 'Out of Service'
};

const EquipmentList: React.FC<EquipmentListProps> = ({ onSelectEquipment, onRefresh }) => {
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof EquipmentItem>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  
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

  useEffect(() => {
    fetchEquipment();
  }, [currentPage, pageSize]);

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

  // Handle equipment deletion
  const handleEquipmentDeleted = () => {
    // Refresh equipment list
    fetchEquipment();
    
    // Call parent refresh if provided
    if (onRefresh) {
      onRefresh();
    }
    
    // Notify user
    toast({
      title: "Equipment List Updated",
      description: "The equipment list has been refreshed after deletion.",
      variant: "default",
    });
  };

  // Show equipment details dialog
  const handleViewDetails = (equipmentId: string) => {
    setSelectedEquipmentId(Number(equipmentId));
    setIsDetailsDialogOpen(true);
  };

  // Convert API status string to our status numbers
  const getStatusNumber = (statusString: string): number => {
    if (!statusString) return EQUIPMENT_STATUS.AVAILABLE;
    
    const lowerStatus = statusString.toLowerCase();
    
    if (lowerStatus === 'available') return EQUIPMENT_STATUS.AVAILABLE;
    if (lowerStatus === 'inuse' || lowerStatus === 'in use') return EQUIPMENT_STATUS.IN_USE;
    if (lowerStatus === 'undermaintenance' || lowerStatus === 'under maintenance' || 
        lowerStatus === 'maintenance') return EQUIPMENT_STATUS.UNDER_MAINTENANCE;
    if (lowerStatus === 'outofservice' || lowerStatus === 'out of service') return EQUIPMENT_STATUS.OUT_OF_SERVICE;
    
    // Try to parse numeric status
    const numericStatus = parseInt(lowerStatus, 10);
    if (!isNaN(numericStatus) && numericStatus >= 0 && numericStatus <= 3) {
      return numericStatus;
    }
    
    return EQUIPMENT_STATUS.AVAILABLE; // Default
  };

  // Get the user-friendly status label from a status string
  const getStatusLabel = (statusString: string): string => {
    const statusNumber = getStatusNumber(statusString);
    return EQUIPMENT_STATUS_LABELS[statusNumber];
  };

  // Handle changing equipment status
  const handleSetStatus = async (equipmentId: string, newStatus: number) => {
    try {
      setUpdatingStatus(equipmentId);
      
      await setEquipmentStatus(Number(equipmentId), newStatus);
      
      // Update local state immediately for better UX
      setEquipment(equipment.map(item => {
        if (item.id === equipmentId) {
          return {
            ...item,
            status: newStatus === EQUIPMENT_STATUS.AVAILABLE ? 'Available' : 
                   newStatus === EQUIPMENT_STATUS.IN_USE ? 'In Use' : 'Maintenance'
          };
        }
        return item;
      }));
      
      // Show success message
      toast({
        title: "Status Updated",
        description: `Equipment status changed to ${EQUIPMENT_STATUS_LABELS[newStatus]}`,
        variant: "default",
      });
      
      // Refresh equipment list to get the latest data from server
      fetchEquipment();
      
      // Call parent refresh if provided
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Failed to update equipment status:', error);
      toast({
        title: "Status Update Failed",
        description: "Could not update equipment status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(null);
    }
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

  // Get status icon based on equipment status
  const getStatusIcon = (status: string) => {
    const statusNum = getStatusNumber(status);
    switch (statusNum) {
      case EQUIPMENT_STATUS.AVAILABLE:
        return <CircleCheck className="h-4 w-4 text-green-600" />;
      case EQUIPMENT_STATUS.IN_USE:
        return <Book className="h-4 w-4 text-blue-500" />;
      case EQUIPMENT_STATUS.UNDER_MAINTENANCE:
        return <CircleMinus className="h-4 w-4 text-amber-500" />;
      case EQUIPMENT_STATUS.OUT_OF_SERVICE:
        return <CircleX className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  // Determine the badge style based on status
  const getStatusBadgeClass = (status: string) => {
    const statusNum = getStatusNumber(status);
    switch (statusNum) {
      case EQUIPMENT_STATUS.AVAILABLE:
        return 'bg-green-500 hover:bg-green-600';
      case EQUIPMENT_STATUS.IN_USE:
        return 'bg-blue-500 hover:bg-blue-600';
      case EQUIPMENT_STATUS.UNDER_MAINTENANCE:
        return 'bg-amber-500 hover:bg-amber-600';
      case EQUIPMENT_STATUS.OUT_OF_SERVICE:
        return 'bg-red-500 hover:bg-red-600';
      default:
        return '';
    }
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
                  sortedEquipment.map((item) => {
                    // Get numerical status for comparing
                    const statusNum = getStatusNumber(item.status);
                    // Check if equipment is available for booking
                    const isAvailable = statusNum === EQUIPMENT_STATUS.AVAILABLE;
                    // Check if equipment is under maintenance or out of service
                    const isMaintenanceOrOutOfService = 
                      statusNum === EQUIPMENT_STATUS.UNDER_MAINTENANCE || 
                      statusNum === EQUIPMENT_STATUS.OUT_OF_SERVICE;
                    
                    return (
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
                            className={`flex items-center gap-1.5 ${getStatusBadgeClass(item.status)} text-white`}
                          >
                            {getStatusIcon(item.status)}
                            {getStatusLabel(item.status)}
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
                            
                            {/* Status Change Button - Available for all statuses */}
                            {isAvailable ? (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="gap-1 hover:bg-muted"
                                    disabled={updatingStatus === item.id}
                                  >
                                    {updatingStatus === item.id ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <ArrowRight className="h-4 w-4" />
                                    )}
                                    Set Status
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem 
                                    onClick={() => handleSetStatus(item.id, EQUIPMENT_STATUS.UNDER_MAINTENANCE)}
                                    className="gap-2 cursor-pointer"
                                  >
                                    <Wrench className="h-4 w-4 text-amber-500" />
                                    Under Maintenance
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleSetStatus(item.id, EQUIPMENT_STATUS.OUT_OF_SERVICE)}
                                    className="gap-2 cursor-pointer"
                                  >
                                    <X className="h-4 w-4 text-red-500" />
                                    Out of Service
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            ) : (
                              // For non-available equipment, only show a button to mark as available
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleSetStatus(item.id, EQUIPMENT_STATUS.AVAILABLE)}
                                className="gap-1 hover:bg-green-50"
                                disabled={updatingStatus === item.id || statusNum === EQUIPMENT_STATUS.IN_USE}
                              >
                                {updatingStatus === item.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Check className="h-4 w-4 text-green-500" />
                                )}
                                {statusNum === EQUIPMENT_STATUS.IN_USE ? 
                                  'In Use' : 
                                  'Mark Available'}
                              </Button>
                            )}
                            
                            {/* Book Now Button - Only available for Available equipment */}
                            <Button 
                              variant="default"
                              size="sm"
                              disabled={!isAvailable || updatingStatus === item.id}
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent row click event
                                onSelectEquipment(item);
                              }}
                              className={`gap-1 ${isAvailable ? 'bg-primary hover:bg-primary/90' : 'bg-muted text-muted-foreground'}`}
                            >
                              <Book className="h-4 w-4" />
                              Book Now
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
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
        onEquipmentDeleted={handleEquipmentDeleted}
      />
    </Card>
  );
};

export default EquipmentList;
