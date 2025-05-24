
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
  name: z.string().min(2, 'الاسم يجب أن يكون أكثر من حرفين'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  phoneNumber: z.string().min(10, 'رقم الهاتف يجب أن يكون 10 أرقام على الأقل'),
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  if (data.password || data.confirmPassword) {
    return data.password === data.confirmPassword;
  }
  return true;
}, {
  message: "كلمة المرور غير متطابقة",
  path: ["confirmPassword"],
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
      email: engineer.email,
      phoneNumber: engineer.phoneNumber,
    }
  });

  useEffect(() => {
    if (isOpen && engineer) {
      reset({
        name: engineer.name,
        email: engineer.email,
        phoneNumber: engineer.phoneNumber,
      });
    }
  }, [isOpen, engineer, reset]);

  const onSubmit = async (data: EditSiteEngineerFormValues) => {
    try {
      const updateData: any = {
        id: engineer.id,
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
      };

      // Only include password if provided
      if (data.password) {
        updateData.password = data.password;
        updateData.confirmPassword = data.confirmPassword;
      }

      await updateEngineer(engineer.id, updateData);
      toast.success('تم تحديث بيانات المهندس بنجاح');
      onEngineerUpdated();
      onOpenChange(false);
      reset();
    } catch (error) {
      console.error('Error updating engineer:', error);
      toast.error(error instanceof Error ? error.message : 'حدث خطأ في تحديث بيانات المهندس');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>تعديل بيانات المهندس</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">الاسم الكامل</Label>
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
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">رقم الهاتف</Label>
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
              <Label htmlFor="password">كلمة المرور الجديدة (اختياري)</Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                className={errors.password ? 'border-red-500' : ''}
                placeholder="اتركه فارغاً إذا كنت لا تريد تغيير كلمة المرور"
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword')}
                className={errors.confirmPassword ? 'border-red-500' : ''}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
