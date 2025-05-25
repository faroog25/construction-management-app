
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateSpecialty, Specialty } from '@/services/specialtyService';
import { useToast } from '@/hooks/use-toast';

const specialtySchema = z.object({
  name: z.string().min(1, { message: 'اسم التخصص مطلوب' }),
});

type SpecialtyFormValues = z.infer<typeof specialtySchema>;

interface EditSpecialtyModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  specialty: Specialty | null;
  onSuccess: () => void;
}

export function EditSpecialtyModal({ isOpen, setIsOpen, specialty, onSuccess }: EditSpecialtyModalProps) {
  const { toast } = useToast();
  const form = useForm<SpecialtyFormValues>({
    resolver: zodResolver(specialtySchema),
    defaultValues: {
      name: specialty?.name || '',
    },
  });

  React.useEffect(() => {
    if (specialty) {
      form.setValue('name', specialty.name);
    }
  }, [specialty, form]);

  const onSubmit = async (data: SpecialtyFormValues) => {
    if (!specialty) {
      toast({
        title: 'لم يتم تحديد التخصص للتعديل',
        variant: "destructive"
      });
      return;
    }
    
    try {
      await updateSpecialty(specialty.id, data.name);
      toast({
        title: 'تم تعديل التخصص بنجاح',
        variant: "default"
      });
      form.reset();
      setIsOpen(false);
      onSuccess();
    } catch (error) {
      toast({
        title: error instanceof Error ? error.message : 'حدث خطأ أثناء تعديل التخصص',
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>تعديل التخصص</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم التخصص</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل اسم التخصص" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                إلغاء
              </Button>
              <Button type="submit">حفظ التعديل</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
