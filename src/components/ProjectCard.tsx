
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  1: { label: 'Active', className: 'bg-green-100 text-green-800' },
  2: { label: 'Completed', className: 'bg-blue-100 text-blue-800' },
  3: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
  4: { label: 'Delayed', className: 'bg-red-100 text-red-800' },
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

  const handleClick = () => {
    navigate(`/projects/${id}`);
  };

  const statusInfo = statusConfig[status as keyof typeof statusConfig] || statusConfig[1];

  return (
    <Card className={`flex flex-col overflow-hidden h-full ${className}`} style={style}>
      <CardContent className="flex-1 p-5">
        <div className="flex justify-between items-start mb-3">
          <Badge variant="outline" className={statusInfo.className}>{statusInfo.label}</Badge>
          <span className="text-sm text-muted-foreground">ID: {id}</span>
        </div>
        
        <h3 className="font-medium text-lg mb-2 line-clamp-2">{name}</h3>
        <p className="text-sm text-muted-foreground mb-4">{client_name}</p>
        
        <div className="space-y-4 mt-auto">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Due: {formatDate(expected_end_date)}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 px-5 pb-5">
        <Button variant="outline" className="w-full" onClick={handleClick}>
          View Details
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
