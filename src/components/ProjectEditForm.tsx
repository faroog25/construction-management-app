
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Project, updateProject } from '@/services/projectService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';

const projectFormSchema = z.object({
  projectName: z.string().min(1, { message: 'Project name is required' }),
  description: z.string().optional(),
  siteAddress: z.string().min(1, { message: 'Site address is required' }),
  geographicalCoordinates: z.string().optional(),
  startDate: z.string().min(1, { message: 'Start date is required' }),
  expectedEndDate: z.string().min(1, { message: 'Expected end date is required' }),
  completionDate: z.string().optional(),
  handoverDate: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

interface ProjectEditFormProps {
  project: Project;
  onSuccess: () => void;
  onCancel: () => void;
}

const ProjectEditForm = ({ project, onSuccess, onCancel }: ProjectEditFormProps) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const queryClient = useQueryClient();
  
  // Initialize form with project data
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      projectName: project.projectName || '',
      description: project.description || '',
      siteAddress: project.siteAddress || '',
      geographicalCoordinates: project.geographicalCoordinates || '',
      startDate: project.startDate?.toString() || '',
      expectedEndDate: project.expectedEndDate?.toString() || '',
      completionDate: project.completionDate?.toString() || '',
      handoverDate: project.handoverDate?.toString() || '',
    },
  });

  const onSubmit = async (values: ProjectFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Convert project ID to number if it's a string
      const projectId = typeof project.id === 'string' ? parseInt(project.id, 10) : project.id;
      
      await updateProject(projectId, {
        ...values,
        id: projectId,
        siteEngineerId: project.siteEngineerId,
        clientId: project.clientId,
        status: project.status
      });
      
      // Invalidate project query to fetch updated data
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      
      toast.success('Project details updated successfully');
      onSuccess();
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('Failed to update project details');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Helper function to format dates for the calendar
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'yyyy-MM-dd');
    } catch (e) {
      return '';
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
              <FormLabel>Project Name</FormLabel>
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
              <FormLabel>Description</FormLabel>
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
              <FormLabel>Site Address</FormLabel>
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
              <FormLabel>Geographical Coordinates</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. 24.7136, 46.6753" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="expectedEndDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Expected End Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="completionDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Completion Date (Optional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="handoverDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Handover Date (Optional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProjectEditForm;
