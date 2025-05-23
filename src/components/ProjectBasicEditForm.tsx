
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { updateProjectBasicInfo, UpdateProjectBasicInfo } from '@/services/projectService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

const projectBasicFormSchema = z.object({
  projectName: z.string().min(1, { message: 'اسم المشروع مطلوب' }),
  description: z.string().optional(),
  siteAddress: z.string().min(1, { message: 'عنوان الموقع مطلوب' }),
  geographicalCoordinates: z.string().optional(),
});

type ProjectBasicFormValues = z.infer<typeof projectBasicFormSchema>;

interface ProjectBasicEditFormProps {
  project: UpdateProjectBasicInfo;
  onSuccess: () => void;
  onCancel: () => void;
}

const ProjectBasicEditForm = ({ project, onSuccess, onCancel }: ProjectBasicEditFormProps) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const queryClient = useQueryClient();
  
  // Initialize form with project data
  const form = useForm<ProjectBasicFormValues>({
    resolver: zodResolver(projectBasicFormSchema),
    defaultValues: {
      projectName: project.projectName || '',
      description: project.description || '',
      siteAddress: project.siteAddress || '',
      geographicalCoordinates: project.geographicalCoordinates || '',
    },
  });

  const onSubmit = async (values: ProjectBasicFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Convert project ID to number if it's a string
      const projectId = typeof project.id === 'string' ? parseInt(project.id, 10) : project.id;
      
      await updateProjectBasicInfo({
        id: projectId,
        projectName: values.projectName,
        description: values.description,
        siteAddress: values.siteAddress,
        geographicalCoordinates: values.geographicalCoordinates,
      });
      
      // Invalidate project query to fetch updated data
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      
      toast.success('تم تحديث بيانات المشروع بنجاح');
      onSuccess();
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('فشل تحديث بيانات المشروع');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="projectName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>اسم المشروع</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
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
                <Textarea {...field} rows={3} />
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
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="geographicalCoordinates"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الإحداثيات الجغرافية</FormLabel>
              <FormControl>
                <Input {...field} placeholder="مثال: 24.7136, 46.6753" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            إلغاء
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
            حفظ التغييرات
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProjectBasicEditForm;
