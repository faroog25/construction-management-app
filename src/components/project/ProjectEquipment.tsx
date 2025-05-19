
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Calendar, Package, AlertCircle, X, Check, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { 
  getProjectEquipment, 
  cancelReservation,
  ReservationStatus,
  ProjectEquipment as ProjectEquipmentType
} from '@/services/equipmentAssignmentService';
import { Project } from '@/types/project';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ProjectEquipmentProps {
  project: Project;
}

const ProjectEquipment: React.FC<ProjectEquipmentProps> = ({ project }) => {
  const projectId = typeof project.id === 'string' ? parseInt(project.id) : project.id;
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [equipmentToCancel, setEquipmentToCancel] = useState<ProjectEquipmentType | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: equipments, isLoading, error, refetch } = useQuery({
    queryKey: ['projectEquipment', projectId],
    queryFn: () => getProjectEquipment(projectId),
    enabled: !!projectId,
  });

  const cancelMutation = useMutation({
    mutationFn: cancelReservation,
    onSuccess: () => {
      toast({
        title: "تم الإلغاء",
        description: "تم إلغاء حجز المعدة بنجاح",
      });
      setCancelDialogOpen(false);
      setEquipmentToCancel(null);
      queryClient.invalidateQueries({ queryKey: ['projectEquipment', projectId] });
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء إلغاء الحجز",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsCancelling(false);
    }
  });

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '—';
    return format(new Date(dateString), 'dd MMM yyyy');
  };

  const handleCancelReservation = async () => {
    if (!equipmentToCancel) return;
    
    try {
      setIsCancelling(true);
      await cancelMutation.mutateAsync(equipmentToCancel.id);
    } catch (error) {
      console.error('Failed to cancel reservation:', error);
      setIsCancelling(false);
    }
  };

  const openCancelDialog = (equipment: ProjectEquipmentType) => {
    setEquipmentToCancel(equipment);
    setCancelDialogOpen(true);
  };

  const getStatusBadge = (status: ReservationStatus | undefined) => {
    switch (status) {
      case ReservationStatus.NotStarted:
        return (
          <Badge variant="outline" className="bg-blue-500 text-white">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Not Started</span>
            </div>
          </Badge>
        );
      case ReservationStatus.Started:
        return (
          <Badge variant="outline" className="bg-amber-500 text-white">
            <div className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              <span>Started</span>
            </div>
          </Badge>
        );
      case ReservationStatus.Completed:
        return (
          <Badge variant="default" className="bg-green-500 text-white">
            <div className="flex items-center gap-1">
              <Check className="h-3 w-3" />
              <span>Completed</span>
            </div>
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <div className="flex items-center gap-1">
              <X className="h-3 w-3" />
              <span>Unknown</span>
            </div>
          </Badge>
        );
    }
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
        <Button variant="outline" size="sm" onClick={() => refetch()}>
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
                  <th className="px-4 py-3 text-start text-sm font-medium text-muted-foreground">تاريخ البدء</th>
                  <th className="px-4 py-3 text-start text-sm font-medium text-muted-foreground">تاريخ الانتهاء</th>
                  <th className="px-4 py-3 text-start text-sm font-medium text-muted-foreground">الحالة</th>
                  <th className="px-4 py-3 text-start text-sm font-medium text-muted-foreground">الإجراءات</th>
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
                        <span>{formatDate(equipment.startDate)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {formatDate(equipment.endDate)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {equipment.reservationStatus !== undefined ? 
                        getStatusBadge(equipment.reservationStatus) : 
                        <span className="text-muted-foreground">—</span>
                      }
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {(equipment.reservationStatus === ReservationStatus.NotStarted || 
                        equipment.reservationStatus === ReservationStatus.Started) && (
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => openCancelDialog(equipment)}
                        >
                          إلغاء الحجز
                        </Button>
                      )}
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

      {/* Cancel Reservation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>إلغاء الحجز</AlertDialogTitle>
            <AlertDialogDescription>
              {equipmentToCancel ? (
                <>
                  هل أنت متأكد من رغبتك بإلغاء حجز <span className="font-medium">{equipmentToCancel.equipmentName}</span>؟
                  هذا الإجراء لا يمكن التراجع عنه.
                </>
              ) : (
                'هل أنت متأكد من رغبتك بإلغاء هذا الحجز؟ هذا الإجراء لا يمكن التراجع عنه.'
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCancelling}>إلغاء</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleCancelReservation();
              }}
              disabled={isCancelling}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isCancelling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جاري الإلغاء...
                </>
              ) : (
                'نعم، إلغاء الحجز'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProjectEquipment;
