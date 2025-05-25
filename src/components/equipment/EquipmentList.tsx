
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  RefreshCw, 
  Calendar, 
  Package, 
  AlertCircle,
  Loader2,
  Settings,
  Edit,
  Trash2
} from 'lucide-react';
import { getEquipment, mapApiEquipmentToEquipmentItem, deleteEquipment, setEquipmentStatus } from '@/services/equipmentService';
import { EquipmentItem } from '@/types/equipment';
import { EquipmentDetailsDialog } from './EquipmentDetailsDialog';
import { EditEquipmentDialog } from './EditEquipmentDialog';
import { useToast } from '@/hooks/use-toast';
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

interface EquipmentListProps {
  onSelectEquipment: (equipment: EquipmentItem) => void;
  onRefresh?: () => void;
  onError?: (error: string) => void;
}

const EquipmentList: React.FC<EquipmentListProps> = ({ 
  onSelectEquipment, 
  onRefresh,
  onError 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentItem | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [equipmentToDelete, setEquipmentToDelete] = useState<EquipmentItem | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const pageSize = 12;

  // Determine status parameter for API call
  const getStatusParam = (filter: string): number | undefined => {
    switch (filter) {
      case 'available': return 0;
      case 'reserved': return 1;
      default: return undefined;
    }
  };

  const { data: apiResponse, isLoading, error, refetch } = useQuery({
    queryKey: ['equipment', currentPage, pageSize, statusFilter],
    queryFn: () => getEquipment(currentPage, pageSize, getStatusParam(statusFilter)),
    retry: false, // Don't retry on failure so we can handle 404 properly
  });

  // Handle errors and notify parent component
  useEffect(() => {
    if (error) {
      console.error('Equipment fetch error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Check if it's a 404 error
      if (errorMessage.includes('404') || errorMessage.includes('HTTP error! status: 404')) {
        if (onError) {
          onError('404: No equipment found');
        }
      } else {
        // For other errors, show a toast
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء تحميل المعدات",
          variant: "destructive",
        });
        if (onError) {
          onError(errorMessage);
        }
      }
    }
  }, [error, onError, toast]);

  const equipments = apiResponse?.data?.items ? 
    apiResponse.data.items.map(mapApiEquipmentToEquipmentItem) : [];

  const totalPages = apiResponse?.data?.totalPages || 1;

  // Filter equipments based on search term
  const filteredEquipments = equipments.filter(equipment =>
    equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipment.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRefresh = () => {
    refetch();
    if (onRefresh) {
      onRefresh();
    }
  };

  const handleBookEquipment = (equipment: EquipmentItem) => {
    onSelectEquipment(equipment);
  };

  const handleViewDetails = (equipment: EquipmentItem) => {
    setSelectedEquipment(equipment);
    setIsDetailsDialogOpen(true);
  };

  const handleEditEquipment = (equipment: EquipmentItem) => {
    setSelectedEquipment(equipment);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (equipment: EquipmentItem) => {
    setEquipmentToDelete(equipment);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!equipmentToDelete) return;

    try {
      setIsDeleting(true);
      await deleteEquipment(parseInt(equipmentToDelete.id));
      
      toast({
        title: "تم الحذف",
        description: "تم حذف المعدة بنجاح",
      });
      
      setIsDeleteDialogOpen(false);
      setEquipmentToDelete(null);
      handleRefresh();
    } catch (error) {
      console.error('Error deleting equipment:', error);
      toast({
        title: "خطأ",
        description: "فشل في حذف المعدة",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (equipmentId: string, newStatus: number) => {
    try {
      await setEquipmentStatus(parseInt(equipmentId), newStatus);
      
      toast({
        title: "تم التحديث",
        description: "تم تحديث حالة المعدة بنجاح",
      });
      
      handleRefresh();
    } catch (error) {
      console.error('Error updating equipment status:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحديث حالة المعدة",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Available':
        return <Badge className="bg-green-500 hover:bg-green-600">Available</Badge>;
      case 'Reserved':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Reserved</Badge>;
      case 'Maintenance':
        return <Badge className="bg-amber-500 hover:bg-amber-600">Maintenance</Badge>;
      case 'Out of Service':
        return <Badge variant="destructive">Out of Service</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleEquipmentUpdate = () => {
    setIsEditDialogOpen(false);
    setSelectedEquipment(null);
    handleRefresh();
  };

  // Don't render the main content if we have a 404 error
  if (error && (error.message.includes('404') || error.message.includes('HTTP error! status: 404'))) {
    return null; // Let the parent component handle the 404 display
  }

  if (isLoading) {
    return (
      <Card className="shadow-lg border-muted">
        <CardContent className="pt-6">
          <div className="flex flex-col justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">جاري تحميل المعدات...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error && !error.message.includes('404')) {
    return (
      <Card className="shadow-lg border-muted">
        <CardContent className="pt-6">
          <div className="flex flex-col justify-center items-center py-12">
            <div className="flex items-center text-destructive mb-4">
              <AlertCircle className="h-8 w-8 mr-2" />
              <p className="text-lg">فشل في تحميل المعدات</p>
            </div>
            <Button onClick={handleRefresh} variant="outline">
              إعادة المحاولة
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="shadow-lg border-muted">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-6 w-6" />
              Equipment Inventory
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search equipment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Equipment</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="reserved">Reserved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Equipment Grid */}
          {filteredEquipments.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Equipment Found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'No equipment matches your search criteria.' : 'No equipment available at the moment.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredEquipments.map((equipment) => (
                <Card key={equipment.id} className="group hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg font-semibold line-clamp-2">
                        {equipment.name}
                      </CardTitle>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditEquipment(equipment)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(equipment)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {equipment.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Category:</span>
                        <span className="text-sm text-muted-foreground">{equipment.category}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Status:</span>
                        {getStatusBadge(equipment.status)}
                      </div>
                      {equipment.purchaseDate && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Purchase Date:</span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(equipment.purchaseDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => handleViewDetails(equipment)}
                        variant="outline"
                        className="w-full"
                      >
                        View Details
                      </Button>
                      {equipment.status === 'Available' && (
                        <Button
                          onClick={() => handleBookEquipment(equipment)}
                          className="w-full bg-primary hover:bg-primary/90 gap-2"
                        >
                          <Calendar className="h-4 w-4" />
                          Book Equipment
                        </Button>
                      )}
                      <Select onValueChange={(value) => handleStatusChange(equipment.id, parseInt(value))}>
                        <SelectTrigger className="w-full">
                          <Settings className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="Change Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Set Available</SelectItem>
                          <SelectItem value="1">Set Reserved</SelectItem>
                          <SelectItem value="2">Set Under Maintenance</SelectItem>
                          <SelectItem value="3">Set Out of Service</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-4">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Equipment Details Dialog */}
      {selectedEquipment && (
        <EquipmentDetailsDialog
          equipment={selectedEquipment}
          isOpen={isDetailsDialogOpen}
          onClose={() => {
            setIsDetailsDialogOpen(false);
            setSelectedEquipment(null);
          }}
          onBook={handleBookEquipment}
        />
      )}

      {/* Edit Equipment Dialog */}
      {selectedEquipment && (
        <EditEquipmentDialog
          equipment={selectedEquipment}
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setSelectedEquipment(null);
          }}
          onSuccess={handleEquipmentUpdate}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف المعدة</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من رغبتك في حذف المعدة "{equipmentToDelete?.name}"؟
              هذا الإجراء لا يمكن التراجع عنه.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جاري الحذف...
                </>
              ) : (
                'حذف'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EquipmentList;
