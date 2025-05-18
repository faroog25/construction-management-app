
import React from 'react';
import { Project } from '@/types/project';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Clock, 
  Users, 
  UserCircle, 
  Building, 
  MapPin, 
  CheckCircle,
  BarChart2,
  Map,
  CalendarRange,
  CalendarCheck,
  CalendarClock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import GanttChart from '@/components/GanttChart';

// Status configuration same as in ProjectCard for consistency
const statusConfig = {
  0: { label: 'قيد التنفيذ', className: 'bg-blue-100 text-blue-800 border-blue-200' },
  1: { label: 'معلق', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  2: { label: 'مكتمل', className: 'bg-green-100 text-green-800 border-green-200' },
  3: { label: 'ملغي', className: 'bg-red-100 text-red-800 border-red-200' },
  4: { label: 'متأخر', className: 'bg-orange-100 text-orange-800 border-orange-200' },
};

interface ProjectDetailsProps {
  project: Project;
}

const ProjectDetails = ({ project }: ProjectDetailsProps) => {
  // Helper function to format dates
  const formatDate = (dateString: string | Date | null | undefined) => {
    if (!dateString) return 'غير محدد';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Get progress from project or default to 0
  const projectProgress = project.progress || project.orderId || 0;
  
  // Get status info based on project status
  const statusInfo = statusConfig[project.status as keyof typeof statusConfig] || statusConfig[0];
  const projectName = project.projectName || project.name || 'مشروع بدون اسم';

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{projectName}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className={cn(statusInfo.className, "font-medium", "border")}>
              {statusInfo.label}
            </Badge>
            <p className="text-muted-foreground">رقم المشروع: {project.id}</p>
          </div>
        </div>
      </div>

      {project.description && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium">الوصف</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{project.description}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-md font-medium">
              <BarChart2 className="h-5 w-5 text-primary" />
              التقدم
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">{projectProgress}% مكتمل</span>
            </div>
            <Progress value={projectProgress} className="h-2" />
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-1">
                <p className="text-sm flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  تاريخ البدء
                </p>
                <p className="font-medium">{formatDate(project.startDate || null)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm flex items-center gap-2 text-muted-foreground">
                  <CalendarRange className="h-4 w-4" />
                  تاريخ الانتهاء المتوقع
                </p>
                <p className="font-medium">{formatDate(project.expectedEndDate || project.endDate || null)}</p>
              </div>
              {project.completionDate && (
                <div className="space-y-1">
                  <p className="text-sm flex items-center gap-2 text-muted-foreground">
                    <CalendarCheck className="h-4 w-4" />
                    تاريخ الاكتمال الفعلي
                  </p>
                  <p className="font-medium">{formatDate(project.completionDate)}</p>
                </div>
              )}
              {project.handoverDate && (
                <div className="space-y-1">
                  <p className="text-sm flex items-center gap-2 text-muted-foreground">
                    <CalendarClock className="h-4 w-4" />
                    تاريخ التسليم
                  </p>
                  <p className="font-medium">{formatDate(project.handoverDate)}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium">تفاصيل المشروع</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">العميل</p>
                  <p className="font-medium">{project.clientName || 'لم يتم تعيين عميل'}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <UserCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">مهندس الموقع</p>
                  <p className="font-medium">{project.siteEngineerName || `معرف المهندس: ${project.siteEngineerId || 'غير محدد'}`}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">عنوان الموقع</p>
                  <p className="font-medium">{project.siteAddress || 'غير محدد'}</p>
                </div>
              </div>
              
              {project.geographicalCoordinates && (
                <div className="flex items-start gap-3">
                  <Map className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">الإحداثيات الجغرافية</p>
                    <p className="font-medium">{project.geographicalCoordinates}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectDetails;
