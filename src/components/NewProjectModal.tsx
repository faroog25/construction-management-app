
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { CalendarIcon, Loader2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/config/api';
import { getClientNames, ClientName } from '@/services/clientService';
import { getSiteEngineerNames, SiteEngineerName } from '@/services/siteEngineerService';

// Schema for the new project form based on the API body
const projectSchema = z.object({
  projectName: z.string().min(1, 'اسم المشروع مطلوب'),
  description: z.string().optional(),
  siteAddress: z.string().min(1, 'عنوان الموقع مطلوب'),
  geographicalCoordinates: z.string().optional(),
  siteEngineerId: z.number().optional(),
  clientId: z.number().optional(),
  startDate: z.string().min(1, 'تاريخ البدء مطلوب'),
  expectedEndDate: z.string().min(1, 'تاريخ الانتهاء المتوقع مطلوب'),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface NewProjectModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectCreated?: () => void;
}

// Helper function to get authentication headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export function NewProjectModal({ isOpen, onOpenChange, onProjectCreated }: NewProjectModalProps) {
  const [clients, setClients] = useState<ClientName[]>([]);
  const [siteEngineers, setSiteEngineers] = useState<SiteEngineerName[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  const [isLoadingSiteEngineers, setIsLoadingSiteEngineers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      projectName: '',
      description: '',
      siteAddress: '',
      geographicalCoordinates: '',
      siteEngineerId: undefined,
      clientId: undefined,
      startDate: '',
      expectedEndDate: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      loadClients();
      loadSiteEngineers();
    }
  }, [isOpen]);

  const loadClients = async () => {
    setIsLoadingClients(true);
    try {
      const clientNames = await getClientNames();
      setClients(clientNames);
    } catch (error) {
      console.error('Error loading clients:', error);
      toast.error('فشل في جلب قائمة العملاء');
    } finally {
      setIsLoadingClients(false);
    }
  };

  const loadSiteEngineers = async () => {
    setIsLoadingSiteEngineers(true);
    try {
      const engineerNames = await getSiteEngineerNames();
      setSiteEngineers(engineerNames);
    } catch (error) {
      console.error('Error loading site engineers:', error);
      toast.error('فشل في جلب قائمة مهندسي الموقع');
    } finally {
      setIsLoadingSiteEngineers(false);
    }
  };

  const onSubmit = async (data: ProjectFormValues) => {
    setIsSubmitting(true);
    try {
      console.log('Form data before submission:', data);
      
      const projectData = {
        projectName: data.projectName,
        description: data.description || '',
        siteAddress: data.siteAddress,
        geographicalCoordinates: data.geographicalCoordinates || '',
        siteEngineerId: data.siteEngineerId,
        clientId: data.clientId,
        startDate: data.startDate,
        expectedEndDate: data.expectedEndDate,
      };

      console.log('Project data being sent to API:', projectData);
      
      const response = await fetch(`${API_BASE_URL}/Projects`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`فشل في إنشاء المشروع. (HTTP ${response.status})`);
      }

      const result = await response.json();
      console.log('Project created successfully:', result);
      
      toast.success('تم إنشاء المشروع بنجاح');
      onOpenChange(false);
      onProjectCreated?.();
      form.reset();
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error(error instanceof Error ? error.message : 'فشل إنشاء المشروع. الرجاء المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted');
    console.log('Form state:', form.formState);
    console.log('Form errors:', form.formState.errors);
    form.handleSubmit(onSubmit)(e);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>إنشاء مشروع جديد</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="projectName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم المشروع *</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل اسم المشروع" {...field} />
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
                    <Input placeholder="أدخل وصف المشروع" {...field} />
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
                  <FormLabel>عنوان الموقع *</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل عنوان الموقع" {...field} />
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
                    <Input placeholder="أدخل الإحداثيات الجغرافية" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>العميل</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)} 
                      value={field.value?.toString() || ''}
                      disabled={isLoadingClients}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={
                            isLoadingClients ? "جاري التحميل..." : "اختر العميل"
                          } />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem 
                            key={client.id} 
                            value={client.id.toString()}
                          >
                            {client.fullName}
                          </SelectItem>
                        ))}
                        {clients.length === 0 && !isLoadingClients && (
                          <SelectItem value="" disabled>
                            لا توجد عملاء متاحين
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="siteEngineerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>مهندس الموقع</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)} 
                      value={field.value?.toString() || ''}
                      disabled={isLoadingSiteEngineers}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={
                            isLoadingSiteEngineers ? "جاري التحميل..." : "اختر مهندس الموقع"
                          } />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {siteEngineers.map((engineer) => (
                          <SelectItem 
                            key={engineer.id} 
                            value={engineer.id.toString()}
                          >
                            {engineer.name}
                          </SelectItem>
                        ))}
                        {siteEngineers.length === 0 && !isLoadingSiteEngineers && (
                          <SelectItem value="" disabled>
                            لا توجد مهندسين متاحين
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>تاريخ البدء *</FormLabel>
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
                              format(new Date(field.value), "dd/MM/yyyy")
                            ) : (
                              <span>اختر التاريخ</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => {
                            field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                          }}
                          className="rounded-md border"
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
                    <FormLabel>تاريخ الانتهاء المتوقع *</FormLabel>
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
                              format(new Date(field.value), "dd/MM/yyyy")
                            ) : (
                              <span>اختر التاريخ</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => {
                            field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                          }}
                          className="rounded-md border"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  onOpenChange(false);
                  form.reset();
                }}
                disabled={isSubmitting}
              >
                إلغاء
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    جاري الإنشاء...
                  </>
                ) : (
                  'إنشاء المشروع'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
