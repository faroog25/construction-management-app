import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { createProject } from '@/services/projectService';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema, type ProjectFormValues } from '@/lib/validations/project';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from 'sonner';

interface NewProjectModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectCreated?: () => void;
}

export function NewProjectModal({ isOpen, onOpenChange, onProjectCreated }: NewProjectModalProps) {
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      projectName: '',
      siteAddress: '',
      clientName: '',
      projectStatus: 'Active',
      description: '',
    },
  });

  const onSubmit = async (data: ProjectFormValues) => {
    try {
      const project = {
        ...data,
        startDate: format(data.startDate, 'yyyy-MM-dd'),
        expectedEndDate: format(data.expectedEndDate, 'yyyy-MM-dd'),
        actualEndDate: null,
        status: 1, // Active
        orderId: null,
        siteEngineerId: null,
        clientId: null,
        stageId: null,
      };

      await createProject(project);
      toast.success('تم إنشاء المشروع بنجاح');
      onOpenChange(false);
      onProjectCreated?.();
      form.reset();
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('فشل إنشاء المشروع. الرجاء المحاولة مرة أخرى.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>إنشاء مشروع جديد</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="projectName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم المشروع</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل اسم المشروع" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="siteAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>عنوان الموقع</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل عنوان الموقع" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="clientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم العميل</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل اسم العميل" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="projectStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>حالة المشروع</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر حالة المشروع" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Active">نشط</SelectItem>
                      <SelectItem value="Completed">مكتمل</SelectItem>
                      <SelectItem value="Pending">معلق</SelectItem>
                      <SelectItem value="Delayed">متأخر</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الوصف</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل وصف المشروع" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>تاريخ البدء</FormLabel>
                    <FormControl>
              <Calendar
                mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                className="rounded-md border"
              />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            
              <FormField
                control={form.control}
                name="expectedEndDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>تاريخ الانتهاء المتوقع</FormLabel>
                    <FormControl>
              <Calendar
                mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                className="rounded-md border"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                إلغاء
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'جاري الإنشاء...' : 'إنشاء'}
            </Button>
          </div>
        </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
