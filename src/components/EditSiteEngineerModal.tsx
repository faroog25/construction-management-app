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
import { updateEngineer } from '@/services/engineerService';
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
  engineer: {
    id: number;
    fullName: string;
    phoneNumber: string;
    email?: string;
    address?: string;
    nationalId?: string;
  };
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
      const fullName = [
        data.firstName.trim(),
        data.secondName?.trim(),
        data.thirdName?.trim(),
        data.lastName.trim()
      ].filter(Boolean).join(' ');

      const updatedEngineer = {
        id: engineer.id,
        fullName,
        email: data.email?.trim() || undefined,
        phoneNumber: data.phoneNumber.trim(),
        address: data.address?.trim() || undefined,
      };

      await updateEngineer(engineer.id, updatedEngineer);
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
                  <FormLabel>اسم العائلة</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل اسم العائلة" {...field} />
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