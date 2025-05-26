
import React, { useState } from 'react';
import { Project, getStatusFromCode } from '@/services/projectService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  Users, 
  UserCircle, 
  Building, 
  MapPin, 
  Edit,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Timer,
  DollarSign,
  Briefcase,
  FileText,
  Calendar as CalendarIcon,
  XCircle,
  CheckCircle,
  AlertOctagon,
  Loader2,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import ProjectEditForm from './ProjectEditForm';
import { generateProjectReport } from '@/services/reportService';

// Status configuration same as in ProjectCard for consistency
const statusConfig = {
  active: { label: 'نشط', className: 'bg-green-100 text-green-800', icon: CheckCircle2 },
  completed: { label: 'مكتمل', className: 'bg-blue-100 text-blue-800', icon: CheckCircle2 },
  pending: { label: 'معلق', className: 'bg-yellow-100 text-yellow-800', icon: Clock3 },
  delayed: { label: 'متأخر', className: 'bg-red-100 text-red-800', icon: AlertTriangle },
  cancelled: { label: 'ملغي', className: 'bg-gray-100 text-gray-800', icon: XCircle },
};

interface ProjectDetailsInfoProps {
  project: Project;
}

const ProjectDetailsInfo = ({ project }: ProjectDetailsInfoProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  
  // Helper function to format dates
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'غير محدد';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Calculate days remaining or overdue
  const calculateDaysRemaining = () => {
    if (!project.expectedEndDate) return { days: 0, isOverdue: false };
    
    const currentDate = new Date();
    const expectedEndDate = new Date(project.expectedEndDate);
    const timeDiff = expectedEndDate.getTime() - currentDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    return {
      days: Math.abs(daysDiff),
      isOverdue: daysDiff < 0
    };
  };

  const { days, isOverdue } = calculateDaysRemaining();

  // Using the shared utility function to get status type
  const statusType = getStatusFromCode(project.status || 1);
  const statusInfo = statusConfig[statusType as keyof typeof statusConfig] || statusConfig.active;
  const StatusIcon = statusInfo.icon;

  // Define progress thresholds and colors
  const getProgressColor = (progress: number) => {
    if (progress < 25) return 'bg-red-500';
    if (progress < 50) return 'bg-orange-500';
    if (progress < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // Fix: Directly use the progress value from the API response
  const progressValue = typeof project.progress === 'number' ? project.progress : 0;
  const progressColor = getProgressColor(progressValue);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveSuccess = () => {
    setIsEditing(false);
  };

  // معالج لتوليد وتنزيل التقرير
  const handleGenerateReport = async () => {
    try {
      setIsGeneratingReport(true);
      toast.info("جاري تحميل التقرير، يرجى الانتظار...");
      
      await generateProjectReport(project);
      
      toast.success("تم تحميل التقرير بنجاح");
    } catch (error) {
      console.error('خطأ أثناء تحميل التقرير:', error);
      toast.error("فشل تحميل التقرير، الرجاء المحاولة مرة أخرى");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  // If in edit mode, show the edit form
  if (isEditing) {
    return (
      <div className="space-y-6">
        <Card className="shadow-sm border overflow-hidden">
          <CardHeader className="bg-muted/20 pb-3">
            <CardTitle className="text-xl font-bold">تعديل المشروع</CardTitle>
            <CardDescription>تحديث معلومات المشروع</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ProjectEditForm 
              project={project} 
              onSuccess={handleSaveSuccess} 
              onCancel={handleCancelEdit} 
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm border overflow-hidden">
          <CardHeader className="bg-muted/20 pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl font-bold">نظرة عامة على المشروع</CardTitle>
                <CardDescription>المعلومات الأساسية حول هذا المشروع</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="mb-6 pb-6 border-b">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">الوصف</h3>
              <p className="text-base">
                {project.description || 
                  "هذا المشروع الإنشائي يتضمن تطوير وتنفيذ خطة بناء شاملة. يشمل المشروع التصميم المعماري المفصل والهندسة الإنشائية وإدارة البناء لضمان النتائج عالية الجودة. فريقنا ملتزم بتسليم المشروع في الوقت المحدد وضمن الميزانية مع الحفاظ على أعلى معايير السلامة والجودة."}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              <div className="flex items-start gap-3">
                <Building className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">العميل</p>
                  <p className="font-medium">{project.clientName || 'غير مُعيَّن'}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">عنوان الموقع</p>
                  <p className="font-medium">{project.siteAddress || 'غير محدد'}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <UserCircle className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">مهندس الموقع</p>
                  <p className="font-medium">
                    {project.siteEngineerName || (project.siteEngineerId ? 
                      `مهندس #${project.siteEngineerId}` : 
                      'لم يتم التعيين بعد')}
                  </p>
                  {(project.siteEngineerId || project.siteEngineerName) && (
                    <p className="text-xs text-muted-foreground mt-1">
                      مسؤول عن الإشراف على الموقع ومراقبة الجودة
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">تاريخ البدء</p>
                  <p className="font-medium">{formatDate(project.startDate?.toString())}</p>
                </div>
              </div>

              {project.geographicalCoordinates && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">الإحداثيات الجغرافية</p>
                    <p className="font-medium">{project.geographicalCoordinates}</p>
                  </div>
                </div>
              )}

              {project.completionDate && (
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">تاريخ الإنجاز</p>
                    <p className="font-medium">{formatDate(project.completionDate)}</p>
                  </div>
                </div>
              )}
              
              {project.handoverDate && (
                <div className="flex items-start gap-3">
                  <Briefcase className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">تاريخ التسليم</p>
                    <p className="font-medium">{formatDate(project.handoverDate)}</p>
                  </div>
                </div>
              )}
              
              {project.cancellationDate && (
                <div className="flex items-start gap-3">
                  <AlertOctagon className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">تاريخ الإلغاء</p>
                    <p className="font-medium">{formatDate(project.cancellationDate)}</p>
                    {project.cancellationReason && (
                      <p className="text-sm text-muted-foreground mt-1">السبب: {project.cancellationReason}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border overflow-hidden">
          <CardHeader className="bg-muted/20 pb-3">
            <CardTitle className="text-lg font-bold">حالة المشروع</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StatusIcon className="h-5 w-5" style={{ color: progressColor }} />
                <span className="font-medium">{project.projectStatus || statusInfo.label}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">التقدم</span>
                <span className="font-medium">{progressValue}%</span>
              </div>
              <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${progressColor} transition-all duration-300`}
                  style={{ width: `${progressValue}%` }}
                ></div>
              </div>
            </div>
            
            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm text-muted-foreground">الإنجاز المتوقع</span>
                <span className="font-medium">{formatDate(project.expectedEndDate?.toString())}</span>
              </div>
              
              {isOverdue ? (
                <div className="flex items-center justify-between text-red-600 font-medium">
                  <div className="flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1.5" />
                    <span>متأخر</span>
                  </div>
                  <span>{days} يوم</span>
                </div>
              ) : (
                <div className="flex items-center justify-between text-blue-600 font-medium">
                  <div className="flex items-center">
                    <Timer className="h-4 w-4 mr-1.5" />
                    <span>متبقي</span>
                  </div>
                  <span>{days} يوم</span>
                </div>
              )}
              
              {project.completionDate && (
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm text-muted-foreground">الإنجاز الفعلي</span>
                  <span className="font-medium">{formatDate(project.completionDate?.toString())}</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t">
              <Button 
                variant="outline" 
                className="w-full gap-2" 
                onClick={handleGenerateReport}
                disabled={isGeneratingReport}
              >
                {isGeneratingReport ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    جاري تحميل التقرير...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4" />
                    إنشاء التقرير
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectDetailsInfo;
