
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getEngineerNames, SiteEngineerName } from '@/services/engineerService';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const assignmentSchema = z.object({
  engineerId: z.string().min(1, { message: 'اختيار المهندس مطلوب' }),
});

type AssignmentFormValues = z.infer<typeof assignmentSchema>;

interface NewSiteEngineerAssignmentModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAssignmentCreated?: () => void;
}

export function NewSiteEngineerAssignmentModal({ 
  isOpen, 
  onOpenChange, 
  onAssignmentCreated 
}: NewSiteEngineerAssignmentModalProps) {
  const [engineers, setEngineers] = useState<SiteEngineerName[]>([]);
  const [isLoadingEngineers, setIsLoadingEngineers] = useState(false);

  const form = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      engineerId: '',
    },
    mode: "onTouched"
  });

  useEffect(() => {
    if (isOpen) {
      loadEngineers();
    }
  }, [isOpen]);

  const loadEngineers = async () => {
    setIsLoadingEngineers(true);
    try {
      const engineerNames = await getEngineerNames();
      setEngineers(engineerNames);
    } catch (error) {
      console.error('Error loading engineers:', error);
      toast.error('فشل في جلب قائمة المهندسين');
    } finally {
      setIsLoadingEngineers(false);
    }
  };

  const onSubmit = async (data: AssignmentFormValues) => {
    try {
      // Here you would typically call an API to create the assignment
      console.log('Assignment data:', data);
      
      toast.success('تم تعيين المهندس بنجاح');
      onOpenChange(false);
      onAssignmentCreated?.();
      form.reset();
    } catch (error: unknown) {
      console.error('Error creating assignment:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('فشل في تعيين المهندس. الرجاء المحاولة مرة أخرى');
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>تعيين مهندس موقع</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="engineerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    اختر المهندس
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={isLoadingEngineers}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={
                          isLoadingEngineers ? "جاري التحميل..." : "اختر مهندس"
                        } />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {engineers.map((engineer) => (
                        <SelectItem 
                          key={engineer.id} 
                          value={engineer.id.toString()}
                        >
                          {engineer.name}
                        </SelectItem>
                      ))}
                      {engineers.length === 0 && !isLoadingEngineers && (
                        <SelectItem value="" disabled>
                          لا توجد مهندسين متاحين
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs text-destructive" />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                إلغاء
              </Button>
              <Button 
                type="submit" 
                disabled={form.formState.isSubmitting || isLoadingEngineers}
              >
                {form.formState.isSubmitting ? 'جاري التعيين...' : 'تعيين المهندس'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
