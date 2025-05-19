
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Share2, ChevronLeft, Edit, Download, Printer, MoreHorizontal, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Project } from '@/types/project';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ProjectHeaderProps {
  project: Project;
  onEdit: () => void;
}

const ProjectHeader = ({ project, onEdit }: ProjectHeaderProps) => {
  const navigate = useNavigate();

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('تم نسخ رابط المشروع إلى الحافظة');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    toast.success('تم تصدير بيانات المشروع');
  };

  const handleGoBack = () => {
    navigate('/projects');
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
      <div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground" 
            onClick={handleGoBack}
          >
            <ChevronLeft className="h-4 w-4 ml-1" />
            المشاريع
          </Button>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mt-2">{project?.projectName}</h1>
        <div className="flex flex-wrap gap-4 mt-2">
          <p className="text-muted-foreground flex items-center">
            <span className="w-4 h-4 ml-1" /> 
            معرف المشروع: {project?.id}
          </p>
          {project?.startDate && (
            <p className="text-muted-foreground flex items-center">
              <span className="w-4 h-4 ml-1" /> 
              تاريخ البدء: {new Date(project?.startDate).toLocaleDateString('ar-SA')}
            </p>
          )}
          {project?.clientName && (
            <p className="text-muted-foreground flex items-center">
              <span className="w-4 h-4 ml-1" /> 
              العميل: {project?.clientName}
            </p>
          )}
        </div>
      </div>
      
      <div className="flex gap-2 print:hidden sm:mt-0 mt-4 w-full sm:w-auto">
        <Button variant="outline" size="sm" onClick={handleShare} className="flex-1 sm:flex-none">
          <Share2 className="h-4 w-4 ml-1.5" />
          مشاركة
        </Button>
        <Button variant="outline" size="sm" onClick={onEdit} className="flex-1 sm:flex-none">
          <Edit className="h-4 w-4 ml-1.5" />
          تعديل
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleExport}>
              <Download className="h-4 w-4 ml-2" />
              تصدير
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handlePrint}>
              <Printer className="h-4 w-4 ml-2" />
              طباعة
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => toast.info("سيتم توفير ميزة الأرشفة قريبًا")}>
              أرشفة المشروع
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button className="flex-1 sm:flex-none">
          <Plus className="h-4 w-4 ml-1.5" />
          إضافة مهمة
        </Button>
      </div>
    </div>
  );
};

export default ProjectHeader;
