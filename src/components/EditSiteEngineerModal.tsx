
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { updateEngineer } from '@/services/engineerService';
import { SiteEngineer } from '@/services/engineerService';

const editSiteEngineerSchema = z.object({
  name: z.string().min(2, 'Name must be more than 2 characters'),
  phoneNumber: z.string().min(9, 'Phone number must be at least 9 digits'),
});

type EditSiteEngineerFormValues = z.infer<typeof editSiteEngineerSchema>;

interface EditSiteEngineerModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onEngineerUpdated: () => void;
  engineer: SiteEngineer;
}

export function EditSiteEngineerModal({
  isOpen,
  onOpenChange,
  onEngineerUpdated,
  engineer
}: EditSiteEngineerModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<EditSiteEngineerFormValues>({
    resolver: zodResolver(editSiteEngineerSchema),
    defaultValues: {
      name: engineer.name,
      phoneNumber: engineer.phoneNumber,
    }
  });

  useEffect(() => {
    if (isOpen && engineer) {
      reset({
        name: engineer.name,
        phoneNumber: engineer.phoneNumber,
      });
    }
  }, [isOpen, engineer, reset]);

  const onSubmit = async (data: EditSiteEngineerFormValues) => {
    try {
      await updateEngineer(engineer.id, data);
      toast.success('Engineer information updated successfully');
      onEngineerUpdated();
      onOpenChange(false);
      reset();
    } catch (error) {
      console.error('Error updating engineer:', error);
      toast.error(error instanceof Error ? error.message : 'Error updating engineer information');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Engineer Information</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                {...register('name')}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                {...register('phoneNumber')}
                className={errors.phoneNumber ? 'border-red-500' : ''}
              />
              {errors.phoneNumber && (
                <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={engineer.email}
                disabled
                className="bg-gray-100 cursor-not-allowed"
                placeholder="Email cannot be modified"
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be modified
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="userName">Username</Label>
              <Input
                id="userName"
                type="text"
                value={engineer.userName}
                disabled
                className="bg-gray-100 cursor-not-allowed"
                placeholder="Username cannot be modified"
              />
              <p className="text-xs text-muted-foreground">
                Username cannot be modified
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
