
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Calendar, Info, Box, Tag, AlertTriangle, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { getEquipmentById, EquipmentDetailResponse, deleteEquipment } from '@/services/equipmentService';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
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

interface EquipmentDetailsDialogProps {
  equipmentId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onEquipmentDeleted?: () => void;
}

interface EquipmentDetails {
  id: number;
  name: string;
  model: string;
  serialNumber: string;
  status: string;
  purchaseDate: string;
  notes: string;
}

const EquipmentDetailsDialog: React.FC<EquipmentDetailsDialogProps> = ({ 
  equipmentId, 
  isOpen, 
  onClose,
  onEquipmentDeleted
}) => {
  const [equipment, setEquipment] = useState<EquipmentDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEquipmentDetails = async () => {
      if (!equipmentId) return;
      
      try {
        setIsLoading(true);
        setError(null);
        const response = await getEquipmentById(equipmentId);
        setEquipment(response.data);
      } catch (error) {
        console.error('Failed to fetch equipment details:', error);
        setError('Failed to load equipment details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && equipmentId) {
      fetchEquipmentDetails();
    }
  }, [equipmentId, isOpen]);

  const handleDelete = async () => {
    if (!equipment) return;
    
    try {
      setIsDeleting(true);
      await deleteEquipment(equipment.id);
      
      toast({
        title: "Equipment Deleted",
        description: `${equipment.name} has been successfully deleted.`,
        variant: "success",
      });
      
      setIsDeleteDialogOpen(false);
      onClose();
      
      // Notify parent component to refresh equipment list
      if (onEquipmentDeleted) {
        onEquipmentDeleted();
      }
    } catch (error) {
      console.error('Failed to delete equipment:', error);
      toast({
        title: "Deletion Failed",
        description: "Unable to delete the equipment. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Determine the badge style based on status
  const getBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'bg-green-500 hover:bg-green-600';
      case 'inuse':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'undermaintenance':
      case 'underholdion':
        return 'bg-amber-500 hover:bg-amber-600';
      case 'outofservice':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return '';
    }
  };

  // Format the status text for display
  const formatStatus = (status: string) => {
    if (!status) return 'Unknown';
    
    // Handle different status formats
    if (status.toLowerCase() === 'inuse') return 'In Use';
    if (status.toLowerCase() === 'undermaintenance') return 'Under Maintenance';
    if (status.toLowerCase() === 'outofservice') return 'Out of Service';
    
    // Capitalize first letter of each word
    return status.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={() => onClose()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Box className="h-5 w-5 text-primary" />
              Equipment Details
            </DialogTitle>
          </DialogHeader>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-lg text-muted-foreground">Loading equipment details...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">
              <p className="text-lg font-medium">{error}</p>
            </div>
          ) : equipment ? (
            <div className="space-y-6 py-2">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-primary">{equipment.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Model: {equipment.model}</span>
                  </div>
                </div>
                <Badge 
                  className={`${getBadgeVariant(equipment.status)} text-white px-3 py-1 text-sm`}
                >
                  {formatStatus(equipment.status)}
                </Badge>
              </div>

              <Separator />

              <Card>
                <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Serial Number</p>
                    <p className="text-base">{equipment.serialNumber || 'Not specified'}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Purchase Date</p>
                    <p className="text-base flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {equipment.purchaseDate ? 
                        format(new Date(equipment.purchaseDate), 'PPP') :
                        'Not specified'
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>

              {equipment.notes && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Info className="h-5 w-5 text-muted-foreground" />
                    Notes
                  </h3>
                  <p className="text-muted-foreground bg-muted p-4 rounded-md">{equipment.notes}</p>
                </div>
              )}
              
              <div className="flex justify-end">
                <Button 
                  variant="destructive" 
                  className="gap-2" 
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Equipment
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No equipment details available</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Equipment</AlertDialogTitle>
            <AlertDialogDescription>
              {equipment ? (
                <>
                  Are you sure you want to delete <span className="font-medium">{equipment.name}</span>?
                  This action cannot be undone.
                </>
              ) : (
                'Are you sure you want to delete this equipment? This action cannot be undone.'
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EquipmentDetailsDialog;
