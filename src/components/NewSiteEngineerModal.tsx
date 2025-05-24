
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { siteEngineerSchema, type SiteEngineerFormValues } from '@/lib/validations/siteEngineer';
import { createEngineer } from '@/services/engineerService';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface NewSiteEngineerModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onEngineerCreated?: () => void;
}

export function NewSiteEngineerModal({ isOpen, onOpenChange, onEngineerCreated }: NewSiteEngineerModalProps) {
  const form = useForm<SiteEngineerFormValues>({
    resolver: zodResolver(siteEngineerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
    },
    mode: "onTouched"
  });

  const onSubmit = async (data: SiteEngineerFormValues) => {
    try {
      const engineer = {
        name: data.name.trim(),
        email: data.email.trim(),
        password: data.password,
        confirmPassword: data.confirmPassword,
        phoneNumber: data.phoneNumber.trim(),
      };

      await createEngineer(engineer);
      toast.success('تمت الإضافة بنجاح');
      onOpenChange(false);
      onEngineerCreated?.();
      form.reset();
    } catch (error: unknown) {
      console.error('Error creating site engineer:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else if (typeof error === 'string') {
        toast.error(error);
      } else {
        toast.error('فشلت الإضافة. الرجاء المحاولة مرة أخرى');
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>إضافة مهندس موقع جديد</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    الاسم
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل الاسم الكامل" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs text-destructive" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    البريد الإلكتروني
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="أدخل البريد الإلكتروني" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs text-destructive" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    رقم الهاتف
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل رقم الهاتف" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs text-destructive" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    كلمة المرور
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="أدخل كلمة المرور" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs text-destructive" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    تأكيد كلمة المرور
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="أعد إدخال كلمة المرور" {...field} />
                  </FormControl>
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
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? 'جاري الإضافة...' : 'إضافة المهندس'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
