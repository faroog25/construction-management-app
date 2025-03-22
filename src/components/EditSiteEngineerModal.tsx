import React, { useEffect } from 'react';
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
import { SiteEngineer, updateSiteEngineer } from '@/services/siteEngineerService';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface EditSiteEngineerModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onEngineerUpdated?: () => void;
  engineer: SiteEngineer | null;
}

export function EditSiteEngineerModal({ 
  isOpen, 
  onOpenChange, 
  onEngineerUpdated,
  engineer 
}: EditSiteEngineerModalProps) {
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
    mode: "onChange"
  });

  useEffect(() => {
    if (engineer) {
      // Split the fullName into parts
      const nameParts = engineer.fullName.split(' ').filter(part => part.trim());
      form.reset({
        firstName: nameParts[0] || '',
        lastName: nameParts[nameParts.length - 1] || '',
        secondName: nameParts.length > 2 ? nameParts[1] : '',
        thirdName: nameParts.length > 3 ? nameParts[2] : '',
        email: engineer.email || '',
        phoneNumber: engineer.phoneNumber || '',
        address: engineer.address || '',
        nationalNumber: '',
        hireDate: '',
      });
    }
  }, [engineer, form]);

  const onSubmit = async (data: SiteEngineerFormValues) => {
    if (!engineer?.id) {
      toast.error('معرف المهندس غير متوفر');
      return;
    }

    try {
      const updatedEngineer = {
        id: engineer.id,
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

      await updateSiteEngineer(engineer.id, updatedEngineer);
      toast.success('تم التحديث بنجاح');
      onOpenChange(false);
      onEngineerUpdated?.();
    } catch (error: unknown) {
      console.error('Error updating site engineer:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else if (typeof error === 'string') {
        toast.error(error);
      } else {
        toast.error('فشل التحديث. الرجاء المحاولة مرة أخرى');
      }
    }
  };

  if (!engineer) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>تعديل بيانات مهندس الموقع</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الاسم الأول</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل الاسم الأول" {...field} />
                  </FormControl>
                  <FormMessage />
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
                  <FormMessage />
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الاسم الأخير</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل الاسم الأخير" {...field} />
                  </FormControl>
                  <FormMessage />
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>رقم الهاتف</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل رقم الهاتف" {...field} />
                  </FormControl>
                  <FormMessage />
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
                  <FormMessage />
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
                  <FormMessage />
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
                  <FormMessage />
                </FormItem>
              )}
            />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
              <Button 
                type="submit" 
                disabled={!form.formState.isValid || form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? 'جاري التحديث...' : 'تحديث البيانات'}
            </Button>
          </DialogFooter>
        </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 