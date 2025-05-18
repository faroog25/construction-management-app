
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
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
import { Skeleton } from './ui/skeleton';
import { getSiteEngineerById } from '@/services/siteEngineerService';

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
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

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
      nationalNumber: '',
    },
    mode: "onChange"
  });

  // جلب بيانات المهندس من API عند فتح النافذة
  useEffect(() => {
    if (isOpen && engineer?.id) {
      const fetchEngineerData = async () => {
        try {
          setLoading(true);
          setApiError(null);
          const engineerData = await getSiteEngineerById(engineer.id.toString());
          
          // استخدام الحقول المباشرة من الـ API بدلاً من تقسيم الاسم الكامل
          form.reset({
            firstName: engineerData.firstName || '',
            secondName: engineerData.secondName || '',
            thirdName: engineerData.thirdName || '',
            lastName: engineerData.lastName || '',
            email: engineerData.email || '',
            phoneNumber: engineerData.phoneNumber || '',
            address: engineerData.address || '',
            hireDate: engineerData.hireDate || '',
            nationalNumber: engineerData.nationalNumber || '',
          });
        } catch (error) {
          console.error('Error fetching engineer data:', error);
          setApiError(error instanceof Error ? error.message : 'حدث خطأ أثناء جلب بيانات المهندس');
          toast.error('فشل في جلب بيانات المهندس');
        } finally {
          setLoading(false);
        }
      };
      
      fetchEngineerData();
    }
  }, [isOpen, engineer?.id, form]);

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
        nationalNumber: data.nationalNumber?.trim() || undefined,
        hireDate: data.hireDate || undefined,
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
          <DialogDescription>
            قم بتعديل بيانات مهندس الموقع واضغط على تحديث البيانات عند الانتهاء
          </DialogDescription>
        </DialogHeader>
        
        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {apiError}
          </div>
        )}
        
        {loading ? (
          <div className="space-y-4 py-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
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
        )}
      </DialogContent>
    </Dialog>
  );
}
