
import React from 'react';
import { Project, getStatusFromCode } from '@/services/projectService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, Users, UserCircle, Building, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

// Status configuration same as in ProjectCard for consistency
const statusConfig = {
  active: { label: 'Active', className: 'bg-green-100 text-green-800' },
  completed: { label: 'Completed', className: 'bg-blue-100 text-blue-800' },
  pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
  delayed: { label: 'Delayed', className: 'bg-red-100 text-red-800' },
};

interface ProjectDetailsInfoProps {
  project: Project;
}

const ProjectDetailsInfo = ({ project }: ProjectDetailsInfoProps) => {
  // Helper function to format dates
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Using the shared utility function to get status type
  const statusType = getStatusFromCode(project.status || 1);
  const statusInfo = statusConfig[statusType];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Badge variant="outline" className={cn(statusInfo.className, "font-medium")}>
          {statusInfo.label}
        </Badge>
      </div>

      {project.description && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{project.description}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium">Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">{project.orderId || 0}% Complete</span>
            </div>
            <Progress value={project.orderId || 0} className="h-2" />
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Started</p>
                <p className="font-medium">{formatDate(project.startDate || null)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Expected Completion</p>
                <p className="font-medium">{formatDate(project.expectedEndDate || null)}</p>
              </div>
              {project.actualEndDate && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Actual Completion</p>
                  <p className="font-medium">{formatDate(project.actualEndDate)}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium">Project Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Client</p>
                  <p className="font-medium">{project.clientName || 'Not assigned'}</p>
                </div>
              </div>
              
              {project.siteEngineerId && (
                <div className="flex items-start gap-3">
                  <UserCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Site Engineer</p>
                    <p className="font-medium">Engineer ID: {project.siteEngineerId}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Site Address</p>
                  <p className="font-medium">{project.siteAddress || 'Not set'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectDetailsInfo;
