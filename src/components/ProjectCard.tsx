
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Clock3, 
  Building,
  ChevronRight,
  BarChart2,
  User,
  XCircle,
  Pause
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ProjectCardProps } from '@/types/project';

// تكوين معلومات الحالة بناءً على رمز الحالة - Updated status configuration
const statusConfig = {
  'قيد التنفيذ': { label: 'قيد التنفيذ', className: 'bg-blue-100 text-blue-800 border-blue-200', icon: Clock3 },
  'معلق': { label: 'معلق', className: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Pause },
  'مكتمل': { label: 'مكتمل', className: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle2 },
  'ملغي': { label: 'ملغي', className: 'bg-red-100 text-red-800 border-red-200', icon: XCircle },
  'متأخر': { label: 'متأخر', className: 'bg-orange-100 text-orange-800 border-orange-200', icon: AlertTriangle },
};

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  name,
  client_name,
  expected_end_date,
  start_date,
  progress,
  projectStatus,
  site_engineer_name,
  onViewDetails,
  className,
  style,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onViewDetails) {
      onViewDetails();
    } else {
      navigate(`/projects/${id}`);
    }
  };

  // استخدام معلومات الحالة من التكوين أو استخدام الإعدادات الافتراضية
  const statusInfo = statusConfig[projectStatus as keyof typeof statusConfig] || statusConfig['قيد التنفيذ'];
  const StatusIcon = statusInfo.icon;

  // الحصول على اللون بناءً على التقدم
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
            {projectStatus}
          </Badge>
          <span className="text-xs text-muted-foreground font-medium bg-muted/50 px-2.5 py-1 rounded-full">ID: {id}</span>
        </div>
        
        <h3 
          className="font-semibold text-xl mb-3 line-clamp-2 hover:text-primary transition-colors cursor-pointer group-hover:translate-x-1" 
          onClick={handleClick}
        >
          {name}
        </h3>
        
        <div className="space-y-2">
          {/* معلومات العميل */}
          <div className="flex items-center gap-2 text-muted-foreground bg-muted/30 px-3 py-2 rounded-lg">
            <Building className="h-4 w-4" />
            <p className="text-sm font-medium">{client_name || 'لم يتم تعيين عميل'}</p>
          </div>
          

        </div>
        
        <div className="mt-5">
          <div className="bg-muted/30 p-3 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">التقدم</span>
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
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 px-6 pb-6">
        <Button 
          variant="outline" 
          className="w-full hover:bg-primary hover:text-white transition-all duration-300 group border-2" 
          onClick={handleClick}
        >
          عرض التفاصيل
          <ChevronRight className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
