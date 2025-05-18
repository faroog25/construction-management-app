
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save } from 'lucide-react';
import { getEquipmentById, updateEquipment, UpdateEquipmentRequest } from '@/services/equipmentService';
import { format, parse } from 'date-fns';

interface EditEquipmentDialogProps {
  equipmentId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditEquipmentDialog({
  equipmentId,
  isOpen,
  onClose,
  onSuccess
}: EditEquipmentDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [formData, setFormData] = useState<UpdateEquipmentRequest>({
    id: 0,
    name: '',
    model: '',
    serialNumber: '',
    purchaseDate: '',
    notes: ''
  });
  const { toast } = useToast();

  // Fetch equipment details when dialog opens
  useEffect(() => {
    async function fetchEquipmentDetails() {
      if (!equipmentId) return;
      
      try {
        setIsFetching(true);
        const response = await getEquipmentById(equipmentId);
        
        if (response.success && response.data) {
          // Format date string to be compatible with the input field
          let formattedDate = '';
          if (response.data.purchaseDate) {
            try {
              formattedDate = format(new Date(response.data.purchaseDate), 'yyyy-MM-dd');
            } catch (e) {
              console.error('Error formatting date:', e);
            }
          }
          
          setFormData({
            id: response.data.id,
            name: response.data.name || '',
            model: response.data.model || '',
            serialNumber: response.data.serialNumber || '',
            purchaseDate: formattedDate,
            notes: response.data.notes || ''
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to load equipment details",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error fetching equipment details:', error);
        toast({
          title: "Error",
          description: "An error occurred while loading equipment details",
          variant: "destructive",
        });
      } finally {
        setIsFetching(false);
      }
    }
    
    if (isOpen && equipmentId) {
      fetchEquipmentDetails();
    }
  }, [equipmentId, isOpen, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      // Make sure date is in the correct format for the API
      let apiDate = formData.purchaseDate;
      if (formData.purchaseDate) {
        try {
          const parsedDate = parse(formData.purchaseDate, 'yyyy-MM-dd', new Date());
          apiDate = parsedDate.toISOString();
        } catch (e) {
          console.error('Error parsing date:', e);
        }
      }
      
      const updateData: UpdateEquipmentRequest = {
        ...formData,
        purchaseDate: apiDate
      };
      
      const response = await updateEquipment(updateData);
      
      if (response.success) {
        toast({
          title: "Success",
          description: "Equipment updated successfully",
        });
        onSuccess();
        onClose();
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to update equipment",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error updating equipment:', error);
      toast({
        title: "Error",
        description: "An error occurred while updating equipment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit Equipment</DialogTitle>
          <DialogDescription>
            Update the equipment details and save to apply changes.
          </DialogDescription>
        </DialogHeader>
        
        {isFetching ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading equipment details...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Equipment Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter equipment name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  placeholder="Enter model"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="serialNumber">Serial Number</Label>
                <Input
                  id="serialNumber"
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleInputChange}
                  placeholder="Enter serial number"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="purchaseDate">Purchase Date</Label>
                <Input
                  id="purchaseDate"
                  name="purchaseDate"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={handleInputChange}
                  max={format(new Date(), 'yyyy-MM-dd')}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Enter any notes or additional information"
                rows={4}
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isLoading}
                className="gap-2"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isLoading ? 'Updating...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
