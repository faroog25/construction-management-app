import React, { useState } from 'react';
import { Project, getStatusFromCode } from '@/services/projectService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, UserCircle, Building, MapPin, Edit, AlertTriangle, CheckCircle2, Clock3, Timer, DollarSign, Briefcase, FileText, Calendar as CalendarIcon, XCircle, CheckCircle, AlertOctagon, Loader2, Download, Pause, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import ProjectEditForm from './ProjectEditForm';
import { generateProjectReport } from '@/services/reportService';
import { pendProject, activateProject } from '@/services/projectService';

// Status configuration same as in ProjectCard for consistency
const statusConfig = {
  active: {
    label: 'Active',
    className: 'bg-green-100 text-green-800',
    icon: CheckCircle2
  },
  completed: {
    label: 'Completed',
    className: 'bg-blue-100 text-blue-800',
    icon: CheckCircle2
  },
  pending: {
    label: 'Pending',
    className: 'bg-yellow-100 text-yellow-800',
    icon: Clock3
  },
  delayed: {
    label: 'Delayed',
    className: 'bg-red-100 text-red-800',
    icon: AlertTriangle
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-gray-100 text-gray-800',
    icon: XCircle
  }
};
interface ProjectDetailsInfoProps {
  project: Project;
  onProjectUpdated?: () => void;
}
const ProjectDetailsInfo = ({
  project,
  onProjectUpdated
}: ProjectDetailsInfoProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isPendingProject, setIsPendingProject] = useState(false);
  const [isActivatingProject, setIsActivatingProject] = useState(false);

  // Helper function to format dates
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate days remaining or overdue
  const calculateDaysRemaining = () => {
    if (!project.expectedEndDate) return {
      days: 0,
      isOverdue: false
    };
    const currentDate = new Date();
    const expectedEndDate = new Date(project.expectedEndDate);
    const timeDiff = expectedEndDate.getTime() - currentDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return {
      days: Math.abs(daysDiff),
      isOverdue: daysDiff < 0
    };
  };
  const {
    days,
    isOverdue
  } = calculateDaysRemaining();

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

  const handlePendProject = async () => {
    try {
      setIsPendingProject(true);
      await pendProject(project.id);
      toast.success("تم تعليق المشروع بنجاح");
      onProjectUpdated?.();
    } catch (error) {
      console.error('Error pending project:', error);
      toast.error("فشل في تعليق المشروع");
    } finally {
      setIsPendingProject(false);
    }
  };

  const handleActivateProject = async () => {
    try {
      setIsActivatingProject(true);
      await activateProject(project.id);
      toast.success("تم تفعيل المشروع بنجاح");
      onProjectUpdated?.();
    } catch (error) {
      console.error('Error activating project:', error);
      toast.error("فشل في تفعيل المشروع");
    } finally {
      setIsActivatingProject(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };
  const handleCancelEdit = () => {
    setIsEditing(false);
  };
  const handleSaveSuccess = () => {
    setIsEditing(false);
  };

  // Handler for generating and downloading the report
  const handleGenerateReport = async () => {
    try {
      setIsGeneratingReport(true);
      toast.info("Loading report, please wait...");
      await generateProjectReport(project);
      toast.success("Report downloaded successfully");
    } catch (error) {
      console.error('Error while downloading report:', error);
      toast.error("Failed to download report, please try again");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  // Determine project status for button visibility
  const isProjectActive = project.projectStatus?.toLowerCase() === 'قيد التنفيذ' || project.projectStatus?.toLowerCase() === 'active' || project.status === 0;
  const isProjectPending = project.projectStatus?.toLowerCase() === 'معلق' || project.projectStatus?.toLowerCase() === 'pending' || project.status === 1;
  const isProjectCompleted = project.projectStatus?.toLowerCase() === 'مكتمل' || project.projectStatus?.toLowerCase() === 'completed' || project.status === 2;
  const isProjectCancelled = project.projectStatus?.toLowerCase() === 'ملغي' || project.projectStatus?.toLowerCase() === 'cancelled' || project.status === 3;

  // If in edit mode, show the edit form
  if (isEditing) {
    return <div className="space-y-6">
        <Card className="shadow-sm border overflow-hidden">
          <CardHeader className="bg-muted/20 pb-3">
            <CardTitle className="text-xl font-bold">Edit Project</CardTitle>
            <CardDescription>Update project information</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ProjectEditForm project={project} onSuccess={handleSaveSuccess} onCancel={handleCancelEdit} />
          </CardContent>
        </Card>
      </div>;
  }
  return <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm border overflow-hidden">
          <CardHeader className="bg-muted/20 pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl font-bold">Project Overview</CardTitle>
                <CardDescription>Basic information about this project</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="mb-6 pb-6 border-b">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
              <p className="text-base">
                {project.description || "This construction project includes the development and implementation of a comprehensive building plan. The project includes detailed architectural design, structural engineering, and construction management to ensure high-quality results. Our team is committed to delivering the project on time and within budget while maintaining the highest standards of safety and quality."}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              <div className="flex items-start gap-3">
                <Building className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Client</p>
                  <p className="font-medium">{project.clientName || 'Not assigned'}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Site Address</p>
                  <p className="font-medium">{project.siteAddress || 'Not specified'}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <UserCircle className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Site Engineer</p>
                  <p className="font-medium">
                    {project.siteEngineerName || (project.siteEngineerId ? `Site Engineer #${project.siteEngineerId}` : 'Not yet assigned')}
                  </p>
                  {(project.siteEngineerId || project.siteEngineerName) && <p className="text-xs text-muted-foreground mt-1">
                      Responsible for site supervision and quality control
                    </p>}
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Start Date</p>
                  <p className="font-medium">{formatDate(project.startDate?.toString())}</p>
                </div>
              </div>

              {project.geographicalCoordinates && <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Geographical Coordinates</p>
                    <p className="font-medium">{project.geographicalCoordinates}</p>
                  </div>
                </div>}

              {project.completionDate && <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Completion Date</p>
                    <p className="font-medium">{formatDate(project.completionDate)}</p>
                  </div>
                </div>}
              
              {project.handoverDate && <div className="flex items-start gap-3">
                  <Briefcase className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Handover Date</p>
                    <p className="font-medium">{formatDate(project.handoverDate)}</p>
                  </div>
                </div>}
              
              {project.cancellationDate && <div className="flex items-start gap-3">
                  <AlertOctagon className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Cancellation Date</p>
                    <p className="font-medium">{formatDate(project.cancellationDate)}</p>
                    {project.cancellationReason && <p className="text-sm text-muted-foreground mt-1">Reason: {project.cancellationReason}</p>}
                  </div>
                </div>}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border overflow-hidden">
          <CardHeader className="bg-muted/20 pb-3">
            <CardTitle className="text-lg font-bold">Project Status</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StatusIcon className="h-5 w-5" style={{
                color: progressColor
              }} />
                <span className="font-medium">{project.projectStatus || statusInfo.label}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{progressValue}%</span>
              </div>
              <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                <div className={`h-full ${progressColor} transition-all duration-300`} style={{
                width: `${progressValue}%`
              }}></div>
              </div>
            </div>
            
            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm text-muted-foreground">Expected Completion Date</span>
                <span className="font-medium">{formatDate(project.expectedEndDate?.toString())}</span>
              </div>
              
              {isOverdue ? <div className="flex items-center justify-between text-red-600 font-medium">
                  <div className="flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1.5" />
                    <span>Delayed</span>
                  </div>
                  <span>{days} Days</span>
                </div> : <div className="flex items-center justify-between text-blue-600 font-medium">
                  <div className="flex items-center">
                    <Timer className="h-4 w-4 mr-1.5" />
                    <span>Remaining</span>
                  </div>
                  <span>{days} Days</span>
                </div>}
              
              {project.completionDate && <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm text-muted-foreground">Actual Completion Date</span>
                  <span className="font-medium">{formatDate(project.completionDate?.toString())}</span>
                </div>}
            </div>

            <div className="mt-4 pt-4 border-t space-y-3">
              <Button variant="outline" onClick={handleGenerateReport} disabled={isGeneratingReport} className="w-full gap-2 bg-blue-700 hover:bg-blue-600 text-zinc-50">
                {isGeneratingReport ? <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating Report...
                  </> : <>
                    <FileText className="h-4 w-4" />
                    Generate Report by AI
                  </>}
              </Button>

              {/* عرض أزرار التحكم فقط للمشاريع التي ليست مكتملة أو ملغية */}
              {isProjectActive && (
                <Button 
                  variant="outline" 
                  onClick={handlePendProject} 
                  disabled={isPendingProject} 
                  className="w-full gap-2 bg-amber-600 hover:bg-amber-700 text-white border-amber-600"
                >
                  {isPendingProject ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Pending Project...
                    </>
                  ) : (
                    <>
                      <Pause className="h-4 w-4" />
                      Suspend Project
                    </>
                  )}
                </Button>
              )}

              {isProjectPending && (
                <Button 
                  variant="outline" 
                  onClick={handleActivateProject} 
                  disabled={isActivatingProject} 
                  className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white border-green-600"
                >
                  {isActivatingProject ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Activating Project...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Activate Project
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default ProjectDetailsInfo;
