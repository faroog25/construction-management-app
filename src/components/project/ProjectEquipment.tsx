
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Calendar, Package, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { getProjectEquipment } from '@/services/equipmentAssignmentService';
import { Project } from '@/types/project';

interface ProjectEquipmentProps {
  project: Project;
}

const ProjectEquipment: React.FC<ProjectEquipmentProps> = ({ project }) => {
  const projectId = typeof project.id === 'string' ? parseInt(project.id) : project.id;

  const { data: equipments, isLoading, error } = useQuery({
    queryKey: ['projectEquipment', projectId],
    queryFn: () => getProjectEquipment(projectId),
    enabled: !!projectId,
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    return format(new Date(dateString), 'dd MMM yyyy');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">جاري تحميل بيانات المعدات...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center py-12 space-y-4">
        <div className="flex items-center text-destructive">
          <AlertCircle className="w-5 h-5 mr-2" />
          <p>فشل في تحميل بيانات المعدات</p>
        </div>
        <Button variant="outline" size="sm">
          إعادة المحاولة
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">المعدات المحجوزة للمشروع</h3>
      </div>
      
      {equipments && equipments.length > 0 ? (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-4 py-3 text-start text-sm font-medium text-muted-foreground">المعدة</th>
                  <th className="px-4 py-3 text-start text-sm font-medium text-muted-foreground">تاريخ الحجز</th>
                  <th className="px-4 py-3 text-start text-sm font-medium text-muted-foreground">تاريخ الإعادة المتوقع</th>
                  <th className="px-4 py-3 text-start text-sm font-medium text-muted-foreground">تاريخ الإعادة الفعلي</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {equipments.map((equipment) => (
                  <tr key={equipment.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span>{equipment.equipmentName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center space-x-1 rtl:space-x-reverse">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDate(equipment.bookDate)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {formatDate(equipment.expectedReturnDate)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {equipment.actualReturnDate ? formatDate(equipment.actualReturnDate) : 
                        <span className="text-muted-foreground">لم يتم الإعادة بعد</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-10 border border-dashed rounded-lg bg-muted/20">
          <Package className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-medium mb-1">لا توجد معدات محجوزة</h3>
          <p className="text-muted-foreground text-sm">
            لم يتم حجز أي معدات لهذا المشروع حتى الآن
          </p>
        </div>
      )}
    </div>
  );
};

export default ProjectEquipment;
