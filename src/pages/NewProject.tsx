
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { createProject } from '@/services/projectService';
import { getEngineerNames, SiteEngineerName } from '@/services/engineerService';
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
import { CalendarIcon, ArrowRight } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function NewProject() {
  const navigate = useNavigate();
  const [engineers, setEngineers] = useState<SiteEngineerName[]>([]);
  const [isLoadingEngineers, setIsLoadingEngineers] = useState(false);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      projectName: '',
      siteAddress: '',
      clientName: '',
      projectStatus: 'Active',
      description: '',
      status: 1,
      startDate: '',
      expectedEndDate: '',
      siteEngineerId: ''
    },
  });

  useEffect(() => {
    loadEngineers();
  }, []);

  const loadEngineers = async () => {
    setIsLoadingEngineers(true);
    try {
      const engineerNames = await getEngineerNames();
      setEngineers(engineerNames);
    } catch (error) {
      console.error('Error loading engineers:', error);
      toast.error('فشل في جلب قائمة المهندسين');
    } finally {
      setIsLoadingEngineers(false);
    }
  };

  const onSubmit = async (data: ProjectFormValues) => {
    try {
      console.log('Form data before submission:', data);
      
      const project = {
        id: 0,
        projectName: data.projectName,
        siteAddress: data.siteAddress,
        clientName: data.clientName,
        projectStatus: data.projectStatus,
        description: data.description || '',
        startDate: data.startDate || '',
        expectedEndDate: data.expectedEndDate || '',
        actualEndDate: null,
        status: data.status || 1,
        orderId: null,
        siteEngineerId: data.siteEngineerId ? parseInt(data.siteEngineerId) : null,
        clientId: data.clientId || null,
        stageId: null,
      };

      console.log('Project data being sent to API:', project);
      
      await createProject(project);
      toast.success('تم إنشاء المشروع بنجاح');
      navigate('/projects');
      form.reset();
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('فشل إنشاء المشروع. الرجاء المحاولة مرة أخرى.');
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
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/projects')}
          className="mb-4"
        >
          <ArrowRight className="h-4 w-4 ml-2" />
          العودة إلى المشاريع
        </Button>
        <h1 className="text-3xl font-bold">إنشاء مشروع جديد</h1>
        <p className="text-muted-foreground mt-2">أدخل تفاصيل المشروع الجديد</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>معلومات المشروع</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              </div>

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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="siteEngineerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>مهندس الموقع</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={isLoadingEngineers}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={
                              isLoadingEngineers ? "جاري التحميل..." : "اختر مهندس الموقع (اختياري)"
                            } />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {engineers.map((engineer) => (
                            <SelectItem 
                              key={engineer.id} 
                              value={engineer.id.toString()}
                            >
                              {engineer.name}
                            </SelectItem>
                          ))}
                          {engineers.length === 0 && !isLoadingEngineers && (
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
              </div>

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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>تاريخ البدء</FormLabel>
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
                              console.log('Selected start date:', date);
                              field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                            }}
                            className="rounded-md border pointer-events-auto"
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
                      <FormLabel>تاريخ الانتهاء المتوقع</FormLabel>
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
                              console.log('Selected end date:', date);
                              field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                            }}
                            className="rounded-md border pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/projects')}
                >
                  إلغاء
                </Button>
                <Button 
                  type="submit" 
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? 'جاري الإنشاء...' : 'إنشاء المشروع'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
