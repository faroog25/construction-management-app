
import React from 'react';
import { cn } from '@/lib/utils';
import { Calendar, Users, Clock, MoreVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type ProjectStatus = 'active' | 'completed' | 'pending' | 'delayed';

interface ProjectCardProps {
  title: string;
  client: string;
  dueDate: string;
  teamSize: number;
  progress: number;
  status: ProjectStatus;
  className?: string;
}

const statusConfig = {
  active: { label: 'Active', className: 'bg-green-100 text-green-800' },
  completed: { label: 'Completed', className: 'bg-blue-100 text-blue-800' },
  pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
  delayed: { label: 'Delayed', className: 'bg-red-100 text-red-800' },
};

const ProjectCard = ({
  title,
  client,
  dueDate,
  teamSize,
  progress,
  status,
  className,
}: ProjectCardProps) => {
  const statusInfo = statusConfig[status];
  
  return (
    <div 
      className={cn(
        "bg-card rounded-xl overflow-hidden shadow-sm border card-hover animate-in transition-all",
        className
      )}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-lg mb-1 text-balance">{title}</h3>
            <p className="text-muted-foreground text-sm">{client}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className={cn(statusInfo.className, "font-medium")}>
              {statusInfo.label}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View Details</DropdownMenuItem>
                <DropdownMenuItem>Edit Project</DropdownMenuItem>
                <DropdownMenuItem>Generate Report</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="mt-4 space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>Due {dueDate}</span>
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              <span>{teamSize} members</span>
            </div>
          </div>
          
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
