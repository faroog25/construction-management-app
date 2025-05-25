
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
import { createSpecialty } from '@/services/specialtyService';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

const specialtySchema = z.object({
  name: z.string().min(1, { message: 'اسم التخصص مطلوب' }),
});

type SpecialtyFormValues = z.infer<typeof specialtySchema>;

interface NewSpecialtyModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onSuccess: () => void;
}

export function NewSpecialtyModal({ isOpen, setIsOpen, onSuccess }: NewSpecialtyModalProps) {
  const { toast } = useToast();
  const { t } = useLanguage();
  const form = useForm<SpecialtyFormValues>({
    resolver: zodResolver(specialtySchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async (data: SpecialtyFormValues) => {
    try {
      await createSpecialty(data.name);
      toast.success(t('Specialty added successfully'));
      form.reset();
      setIsOpen(false);
      onSuccess();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('Failed to add specialty'));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('Add New Specialty')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Specialty Name')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('Enter specialty name')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                {t('Cancel')}
              </Button>
              <Button type="submit">{t('Add')}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
