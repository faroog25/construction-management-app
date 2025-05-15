
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { ApiStage, UpdateStageRequest } from '@/services/stageService';
import { toast } from '@/hooks/use-toast';

interface EditStageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateStageRequest) => Promise<void>;
  isLoading: boolean;
  stage: ApiStage | null;
}

const EditStageModal: React.FC<EditStageModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  stage
}) => {
  const [formData, setFormData] = React.useState<UpdateStageRequest>({
    id: 0,
    name: '',
    description: '',
  });
  
  // Update form data when the stage changes
  useEffect(() => {
    if (stage) {
      setFormData({
        id: stage.id,
        name: stage.name || '',
        description: stage.description || '',
      });
    }
  }, [stage]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error("Stage name is required");
      return;
    }
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Error updating stage:", error);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Stage</DialogTitle>
          <DialogDescription>
            Update the stage details. Fill in the fields below.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="name">Stage Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter stage name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter stage description"
                value={formData.description}
                onChange={handleChange}
                className="min-h-[100px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Stage"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditStageModal;
