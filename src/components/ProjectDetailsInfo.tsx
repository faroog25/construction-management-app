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
  AlertOctagon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import ProjectEditForm from './ProjectEditForm';

// Status configuration same as in ProjectCard for consistency
const statusConfig = {
  active: { label: 'Active', className: 'bg-green-100 text-green-800', icon: CheckCircle2 },
  completed: { label: 'Completed', className: 'bg-blue-100 text-blue-800', icon: CheckCircle2 },
  pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800', icon: Clock3 },
  delayed: { label: 'Delayed', className: 'bg-red-100 text-red-800', icon: AlertTriangle },
  cancelled: { label: 'Cancelled', className: 'bg-gray-100 text-gray-800', icon: XCircle },
};

interface ProjectDetailsInfoProps {
  project: Project;
}

const ProjectDetailsInfo = ({ project }: ProjectDetailsInfoProps) => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Helper function to format dates
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
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
  const statusType = getStatusFromCode(typeof project.status === 'number' ? project.status : 1);
  const statusInfo = statusConfig[statusType as keyof typeof statusConfig] || statusConfig.active;
  const StatusIcon = statusInfo.icon;

  // Define progress thresholds and colors
  const getProgressColor = (progress: number) => {
    if (progress < 25) return 'bg-red-500';
    if (progress < 50) return 'bg-orange-500';
    if (progress < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const progressValue = project.progress || 0;
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

  // If in edit mode, show the edit form
  if (isEditing) {
    return (
      <div className="space-y-6">
        <Card className="shadow-sm border overflow-hidden">
          <CardHeader className="bg-muted/20 pb-3">
            <CardTitle className="text-xl font-bold">Edit Project</CardTitle>
            <CardDescription>Update project information</CardDescription>
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
                <CardTitle className="text-xl font-bold">Project Overview</CardTitle>
                <CardDescription>Key information about this project</CardDescription>
              </div>
              <Button size="sm" variant="outline" className="gap-1" onClick={handleEdit}>
                <Edit className="h-3.5 w-3.5" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="mb-6 pb-6 border-b">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
              <p className="text-base">
                {project.description || 
                  "This construction project involves the development and implementation of a comprehensive building plan. The project includes detailed architectural design, structural engineering, and construction management to ensure high-quality results. Our team is committed to delivering the project on time and within budget while maintaining the highest standards of safety and quality."}
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
                  <p className="font-medium">{project.siteAddress || 'Not set'}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <UserCircle className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Site Engineer</p>
                  <p className="font-medium">
                    {project.siteEngineerName || (project.siteEngineerId ? 
                      `Engineer #${project.siteEngineerId}` : 
                      'Not assigned yet')}
                  </p>
                  {(project.siteEngineerId || project.siteEngineerName) && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Responsible for site supervision and quality control
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Started On</p>
                  <p className="font-medium">{formatDate(project.startDate?.toString())}</p>
                </div>
              </div>

              {project.geographicalCoordinates && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Geographical Coordinates</p>
                    <p className="font-medium">{project.geographicalCoordinates}</p>
                  </div>
                </div>
              )}

              {project.completionDate && (
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Completion Date</p>
                    <p className="font-medium">{formatDate(project.completionDate)}</p>
                  </div>
                </div>
              )}
              
              {project.handoverDate && (
                <div className="flex items-start gap-3">
                  <Briefcase className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Handover Date</p>
                    <p className="font-medium">{formatDate(project.handoverDate)}</p>
                  </div>
                </div>
              )}
              
              {project.cancellationDate && (
                <div className="flex items-start gap-3">
                  <AlertOctagon className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Cancellation Date</p>
                    <p className="font-medium">{formatDate(project.cancellationDate)}</p>
                    {project.cancellationReason && (
                      <p className="text-sm text-muted-foreground mt-1">Reason: {project.cancellationReason}</p>
                    )}
                  </div>
                </div>
              )}
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
                <StatusIcon className="h-5 w-5" style={{ color: progressColor }} />
                <span className="font-medium">{project.projectStatus || statusInfo.label}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
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
                <span className="text-sm text-muted-foreground">Expected Completion</span>
                <span className="font-medium">{formatDate(project.expectedEndDate?.toString())}</span>
              </div>
              
              {isOverdue ? (
                <div className="flex items-center justify-between text-red-600 font-medium">
                  <div className="flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1.5" />
                    <span>Overdue</span>
                  </div>
                  <span>{days} days</span>
                </div>
              ) : (
                <div className="flex items-center justify-between text-blue-600 font-medium">
                  <div className="flex items-center">
                    <Timer className="h-4 w-4 mr-1.5" />
                    <span>Remaining</span>
                  </div>
                  <span>{days} days</span>
                </div>
              )}
              
              {project.completionDate && (
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm text-muted-foreground">Actual Completion</span>
                  <span className="font-medium">{formatDate(project.completionDate?.toString())}</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t">
              <Button variant="outline" className="w-full gap-2" onClick={() => toast.info("Report functionality coming soon")}>
                <FileText className="h-4 w-4" />
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectDetailsInfo;
