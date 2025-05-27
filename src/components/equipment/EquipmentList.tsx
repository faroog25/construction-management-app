import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EquipmentItem } from '@/types/equipment';
import { getEquipment, mapApiEquipmentToEquipmentItem } from '@/services/equipmentService';
import { Loader2, Info, PlusCircle } from 'lucide-react';
import EquipmentDetailsDialog from './EquipmentDetailsDialog';
import { useToast } from '@/hooks/use-toast';

interface EquipmentListProps {
  onSelectEquipment: (equipment: EquipmentItem) => void;
  onRefresh: () => void;
  onAddEquipment?: () => void;
}

const EquipmentList: React.FC<EquipmentListProps> = ({ onSelectEquipment, onRefresh, onAddEquipment }) => {
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<number | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [is404Error, setIs404Error] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<number | undefined>(undefined);
  const { toast } = useToast();

  useEffect(() => {
    fetchEquipment();
  }, [currentPage, statusFilter]);

  const fetchEquipment = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setIs404Error(false);
      
      const response = await getEquipment(currentPage, 10, statusFilter);
      
      if (response.success && response.data) {
        const mappedEquipment = response.data.items.map(item => 
          mapApiEquipmentToEquipmentItem(item)
        );
        
        setEquipment(mappedEquipment);
        setTotalPages(response.data.totalPages);
      } else {
        // Check if it's a 404 error (no equipment found)
        if (response.message?.includes('404') || equipment.length === 0) {
          setIs404Error(true);
        } else {
          setError('Failed to load equipment list');
        }
      }
    } catch (error: any) {
      console.error('Error fetching equipment:', error);
      
      // Check if it's a 404 error
      if (error.message?.includes('404') || error.status === 404) {
        setIs404Error(true);
      } else {
        setError('An error occurred while loading equipment');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (equipmentId: string) => {
    setSelectedEquipmentId(Number(equipmentId));
    setIsDetailsDialogOpen(true);
  };

  const handleCloseDetailsDialog = () => {
    setIsDetailsDialogOpen(false);
    setSelectedEquipmentId(null);
  };

  const handleEquipmentDeleted = () => {
    fetchEquipment();
    onRefresh();
  };

  const handleEquipmentUpdated = () => {
    fetchEquipment();
    onRefresh();
    toast({
      title: "Equipment Updated",
      description: "Equipment details have been updated successfully.",
    });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Available':
        return <Badge className="bg-green-500 hover:bg-green-600">{status}</Badge>;
      case 'Reserved':
        return <Badge className="bg-red-500 hover:bg-red-600">{status}</Badge>;
      case 'Maintenance':
        return <Badge className="bg-amber-500 hover:bg-amber-600">{status}</Badge>;
      case 'Out of Service':
        return <Badge className="bg-red-500 hover:bg-red-600">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (isLoading && equipment.length === 0) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-lg text-muted-foreground">Loading equipment...</span>
      </div>
    );
  }

  // Handle 404 - No equipment found
  if (is404Error || (equipment.length === 0 && !isLoading && !error)) {
    return (
      <div className="text-center py-16">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Equipment</h3>
          <p className="text-muted-foreground">No equipment found in the system</p>
        </div>
        {onAddEquipment && (
          <Button 
            onClick={onAddEquipment}
            className="bg-primary hover:bg-primary/90 gap-2"
          >
            <PlusCircle className="h-5 w-5" />
            Add New Equipment
          </Button>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 text-destructive">
        <p className="text-lg font-medium">{error}</p>
        <Button 
          onClick={fetchEquipment} 
          variant="outline"
          className="mt-4"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {equipment.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-lg line-clamp-2">{item.name}</h3>
                {getStatusBadge(item.status)}
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                {item.category}
              </p>
              
              {item.purchaseDate && (
                <p className="text-xs text-muted-foreground mb-4 flex items-center">
                  <span className="mr-1">Purchase Date:</span>
                  {new Date(item.purchaseDate).toLocaleDateString()}
                </p>
              )}
            </CardContent>
            
            <CardFooter className="bg-muted px-6 py-3 border-t flex justify-between">
              <Button 
                variant="ghost"
                size="sm"
                className="text-xs gap-1"
                onClick={() => handleViewDetails(item.id)}
              >
                <Info className="h-3.5 w-3.5" />
                Details
              </Button>
              
              <Button
                variant="default"
                size="sm"
                className="text-xs"
                onClick={() => onSelectEquipment(item)}
                disabled={item.status !== 'Available'}
              >
                {item.status === 'Available' ? 'Book Now' : 'Unavailable'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="join">
            <Button
              variant="outline"
              className="mx-1"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                className="mx-1"
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}
            
            <Button
              variant="outline"
              className="mx-1"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
      
      {/* Equipment Details Dialog */}
      <EquipmentDetailsDialog
        equipmentId={selectedEquipmentId}
        isOpen={isDetailsDialogOpen}
        onClose={handleCloseDetailsDialog}
        onEquipmentDeleted={handleEquipmentDeleted}
        onEquipmentUpdated={handleEquipmentUpdated}
      />
    </>
  );
};

export default EquipmentList;
