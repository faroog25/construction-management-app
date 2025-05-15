
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CalendarIcon, Loader2, Box, Save, X } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { createEquipment } from '@/services/equipmentService';

interface AddEquipmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddEquipmentDialog({ isOpen, onClose, onSuccess }: AddEquipmentDialogProps) {
  const [name, setName] = useState('');
  const [model, setModel] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [purchaseDate, setPurchaseDate] = useState<Date | undefined>(new Date());
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!name.trim()) errors.name = "Equipment name is required";
    if (!model.trim()) errors.model = "Model information is required";
    if (!serialNumber.trim()) errors.serialNumber = "Serial number is required";
    if (!purchaseDate) errors.purchaseDate = "Purchase date is required";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      
      await createEquipment({
        name,
        model,
        serialNumber,
        purchaseDate: purchaseDate ? purchaseDate.toISOString() : new Date().toISOString(),
        notes
      });
      
      // Reset form
      setName('');
      setModel('');
      setSerialNumber('');
      setPurchaseDate(new Date());
      setNotes('');
      setFormErrors({});
      
      // Close dialog and notify parent component
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Failed to add equipment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset form state
    setName('');
    setModel('');
    setSerialNumber('');
    setPurchaseDate(new Date());
    setNotes('');
    setFormErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Box className="h-6 w-6 text-primary" />
            Add New Equipment
          </DialogTitle>
          <DialogDescription>
            Fill out the form below to add new equipment to the inventory.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className={formErrors.name ? "text-destructive" : ""}>
                Equipment Name *
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={formErrors.name ? "border-destructive focus-visible:ring-destructive" : ""}
                placeholder="Enter equipment name"
              />
              {formErrors.name && (
                <p className="text-sm text-destructive">{formErrors.name}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="model" className={formErrors.model ? "text-destructive" : ""}>
                Model *
              </Label>
              <Input
                id="model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className={formErrors.model ? "border-destructive focus-visible:ring-destructive" : ""}
                placeholder="Enter model details"
              />
              {formErrors.model && (
                <p className="text-sm text-destructive">{formErrors.model}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="serialNumber" className={formErrors.serialNumber ? "text-destructive" : ""}>
                Serial Number *
              </Label>
              <Input
                id="serialNumber"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                className={formErrors.serialNumber ? "border-destructive focus-visible:ring-destructive" : ""}
                placeholder="Enter serial number"
              />
              {formErrors.serialNumber && (
                <p className="text-sm text-destructive">{formErrors.serialNumber}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label className={formErrors.purchaseDate ? "text-destructive" : ""}>
                Purchase Date *
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !purchaseDate && "text-muted-foreground",
                      formErrors.purchaseDate && "border-destructive focus-visible:ring-destructive"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {purchaseDate ? format(purchaseDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={purchaseDate}
                    onSelect={setPurchaseDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {formErrors.purchaseDate && (
                <p className="text-sm text-destructive">{formErrors.purchaseDate}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional notes"
                className="min-h-[100px]"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Equipment
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
