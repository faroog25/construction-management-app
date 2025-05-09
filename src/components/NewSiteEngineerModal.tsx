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
      firstName: '',
      secondName: '',
      thirdName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      nationalNumber: '',
      address: '',
      hireDate: '',
    },
    mode: "onTouched"
  });

  const onSubmit = async (data: SiteEngineerFormValues) => {
    try {
      const engineer = {
        firstName: data.firstName.trim(),
        secondName: data.secondName?.trim(),
        thirdName: data.thirdName?.trim(),
        lastName: data.lastName.trim(),
        email: data.email?.trim() || null,
        phoneNumber: data.phoneNumber.trim(),
        nationalNumber: data.nationalNumber?.trim() || null,
        address: data.address?.trim() || null,
        hireDate: data.hireDate || null,
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
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    الاسم الأول
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل الاسم الأول" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs text-destructive" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="secondName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الاسم الثاني</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل الاسم الثاني" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs text-destructive" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="thirdName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الاسم الثالث</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل الاسم الثالث" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs text-destructive" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    الاسم الأخير
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل الاسم الأخير" {...field} />
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
                  <FormLabel>البريد الإلكتروني</FormLabel>
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
              name="nationalNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الرقم الوطني</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل الرقم الوطني" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs text-destructive" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>العنوان</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل العنوان" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs text-destructive" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hireDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>تاريخ التعيين</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
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