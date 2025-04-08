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
  Building,
  ChevronRight,
  BarChart2
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
  1: { label: 'Active', className: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle2 },
  2: { label: 'Completed', className: 'bg-blue-100 text-blue-800 border-blue-200', icon: CheckCircle2 },
  3: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock3 },
  4: { label: 'Delayed', className: 'bg-red-100 text-red-800 border-red-200', icon: AlertTriangle },
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
        "group flex flex-col overflow-hidden h-full transition-all duration-300 hover:shadow-xl border-2 border-opacity-40 hover:border-primary/30 relative",
        isOverdue && status !== 2 ? "border-l-red-500 border-l-4" : "",
        className
      )} 
      style={style}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 to-primary/0"></div>
      
      <CardContent className="flex-1 p-6">
        <div className="flex justify-between items-start mb-4">
          <Badge variant="outline" className={cn(
            statusInfo.className, 
            "flex items-center gap-1.5 font-medium px-3 py-1.5 rounded-full border"
          )}>
            <StatusIcon className="h-4 w-4" />
            {statusInfo.label}
          </Badge>
          <span className="text-xs text-muted-foreground font-medium bg-muted/50 px-2.5 py-1 rounded-full">ID: {id}</span>
        </div>
        
        <h3 
          className="font-semibold text-xl mb-3 line-clamp-2 hover:text-primary transition-colors cursor-pointer group-hover:translate-x-1" 
          onClick={handleClick}
        >
          {name}
        </h3>
        
        <div className="flex items-center gap-2 mb-5 text-muted-foreground bg-muted/30 px-3 py-2 rounded-lg">
          <Building className="h-4 w-4" />
          <p className="text-sm font-medium">{client_name}</p>
        </div>
        
        <div className="space-y-5">
          <div className="bg-muted/30 p-3 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Progress</span>
              </div>
              <span className="text-sm font-bold">{progress}%</span>
            </div>
            <div className="h-3 w-full bg-muted/50 rounded-full overflow-hidden">
              <div
                className={`h-full ${progressColor} transition-all duration-700 ease-out`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          
          <div className="space-y-3 bg-muted/30 p-3 rounded-lg">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2 text-primary" />
              <span>Started: {formatDate(start_date)}</span>
            </div>
            
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 mr-2 text-primary" />
              <span className={cn(
                isOverdue && status !== 2 ? "text-red-600 font-medium" : "text-muted-foreground"
              )}>
                {isOverdue && status !== 2 ? `Overdue by ${days} days` : `Due: ${formatDate(expected_end_date)}`}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 px-6 pb-6">
        <Button 
          variant="outline" 
          className="w-full hover:bg-primary hover:text-white transition-all duration-300 group border-2" 
          onClick={handleClick}
        >
          View Details
          <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
