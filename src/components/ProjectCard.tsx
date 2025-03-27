
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Clock3, 
  Users,
  Building
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  id: number;
  name: string;
  client_name: string;
  expected_end_date: string;
  start_date: string;
  progress: number;
  status: number;
  onViewDetails?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const statusConfig = {
  1: { label: 'Active', className: 'bg-green-100 text-green-800', icon: CheckCircle2 },
  2: { label: 'Completed', className: 'bg-blue-100 text-blue-800', icon: CheckCircle2 },
  3: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800', icon: Clock3 },
  4: { label: 'Delayed', className: 'bg-red-100 text-red-800', icon: AlertTriangle },
};

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  name,
  client_name,
  expected_end_date,
  start_date,
  progress,
  status,
  onViewDetails,
  className,
  style,
}) => {
  const navigate = useNavigate();
  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const calculateDaysRemaining = () => {
    if (!expected_end_date) return { days: 0, isOverdue: false };
    
    const currentDate = new Date();
    const dueDate = new Date(expected_end_date);
    const timeDiff = dueDate.getTime() - currentDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    return {
      days: Math.abs(daysDiff),
      isOverdue: daysDiff < 0
    };
  };

  const { days, isOverdue } = calculateDaysRemaining();

  const handleClick = () => {
    navigate(`/projects/${id}`);
  };

  const statusInfo = statusConfig[status as keyof typeof statusConfig] || statusConfig[1];
  const StatusIcon = statusInfo.icon;

  // Get color based on progress
  const getProgressColor = (progress: number) => {
    if (progress < 25) return 'bg-red-500';
    if (progress < 50) return 'bg-orange-500';
    if (progress < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const progressColor = getProgressColor(progress);

  return (
    <Card 
      className={cn(
        "flex flex-col overflow-hidden h-full transition-all duration-200 hover:shadow-md border border-opacity-40",
        isOverdue && status !== 2 ? "border-l-red-500 border-l-4" : "",
        className
      )} 
      style={style}
    >
      <CardContent className="flex-1 p-5">
        <div className="flex justify-between items-start mb-3">
          <Badge variant="outline" className={cn(statusInfo.className, "flex items-center gap-1 font-medium")}>
            <StatusIcon className="h-3 w-3" />
            {statusInfo.label}
          </Badge>
          <span className="text-sm text-muted-foreground font-medium">ID: {id}</span>
        </div>
        
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary transition-colors cursor-pointer" onClick={handleClick}>{name}</h3>
        
        <div className="flex items-center gap-1 mb-4">
          <Building className="h-3.5 w-3.5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{client_name}</p>
        </div>
        
        <div className="space-y-4 mt-auto">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full ${progressColor} transition-all duration-300`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 mr-1.5" />
              <span>Started: {formatDate(start_date)}</span>
            </div>
            
            <div className="flex items-center text-sm">
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              <span className={cn(
                isOverdue && status !== 2 ? "text-red-600 font-medium" : "text-muted-foreground"
              )}>
                {isOverdue && status !== 2 ? `Overdue by ${days} days` : `Due: ${formatDate(expected_end_date)}`}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 px-5 pb-5">
        <Button 
          variant="outline" 
          className="w-full hover:bg-primary hover:text-white transition-colors group" 
          onClick={handleClick}
        >
          View Details
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
