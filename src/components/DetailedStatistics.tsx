
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { 
  Users, 
  Building2, 
  CheckSquare, 
  Truck,
  FileText,
  UserCheck,
  UserX,
  Settings,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Pause,
  HardHat,
  Briefcase,
  Image,
  FileTextIcon,
  Sheet,
  Presentation,
  File
} from 'lucide-react';
import { 
  getTeamStatistics, 
  getProjectStatistics, 
  getTaskStatistics, 
  getEquipmentStatistics,
  getDocumentStatistics 
} from '@/services/dashboardService';
import { useLanguage } from '@/contexts/LanguageContext';

const DetailedStatistics = () => {
  const { t } = useLanguage();

  const { data: teamStats } = useQuery({
    queryKey: ['team-statistics'],
    queryFn: getTeamStatistics,
  });

  const { data: projectStats } = useQuery({
    queryKey: ['project-statistics'],
    queryFn: getProjectStatistics,
  });

  const { data: taskStats } = useQuery({
    queryKey: ['task-statistics'],
    queryFn: getTaskStatistics,
  });

  const { data: equipmentStats } = useQuery({
    queryKey: ['equipment-statistics'],
    queryFn: getEquipmentStatistics,
  });

  const { data: documentStats } = useQuery({
    queryKey: ['document-statistics'],
    queryFn: getDocumentStatistics,
  });

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Team Statistics */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('statistics.team_stats')}</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-green-500" />
                <span className="text-sm">{t('statistics.assigned_workers')}</span>
              </div>
              <span className="font-semibold">{teamStats?.assignedWorkers || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserX className="h-4 w-4 text-red-500" />
                <span className="text-sm">{t('statistics.unassigned_workers')}</span>
              </div>
              <span className="font-semibold">{teamStats?.unAssignedWorkers || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardHat className="h-4 w-4 text-blue-500" />
                <span className="text-sm">{t('statistics.total_site_engineers')}</span>
              </div>
              <span className="font-semibold">{teamStats?.totalSiteEngineers || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-purple-500" />
                <span className="text-sm">{t('statistics.total_clients')}</span>
              </div>
              <span className="font-semibold">{teamStats?.totalClients || 0}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Statistics */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('statistics.project_stats')}</CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="text-sm">{t('dashboard.active_projects')}</span>
              </div>
              <span className="font-semibold">{projectStats?.activeProjects || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">{t('dashboard.completed_projects')}</span>
              </div>
              <span className="font-semibold">{projectStats?.completedProjects || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm">{t('statistics.cancelled_projects')}</span>
              </div>
              <span className="font-semibold">{projectStats?.cancelledProjects || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pause className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">{t('statistics.pending_projects')}</span>
              </div>
              <span className="font-semibold">{projectStats?.pendingProjects || 0}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Statistics */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('statistics.task_stats')}</CardTitle>
          <CheckSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="text-sm">{t('statistics.active_tasks')}</span>
              </div>
              <span className="font-semibold">{taskStats?.activeTasks || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">{t('statistics.completed_tasks')}</span>
              </div>
              <span className="font-semibold">{taskStats?.completedTasks || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-sm">{t('statistics.overdue_tasks')}</span>
              </div>
              <span className="font-semibold">{taskStats?.overdueTasks || 0}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Equipment Statistics */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('statistics.equipment_stats')}</CardTitle>
          <Truck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">{t('statistics.available_equipments')}</span>
              </div>
              <span className="font-semibold">{equipmentStats?.availabeEquipments || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="text-sm">{t('statistics.reserved_equipments')}</span>
              </div>
              <span className="font-semibold">{equipmentStats?.reservedEquipments || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-purple-500" />
                <span className="text-sm">{t('statistics.total_reservation')}</span>
              </div>
              <span className="font-semibold">{equipmentStats?.totalReservation || 0}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Statistics */}
      <Card className="md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('statistics.document_stats')}</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image className="h-4 w-4 text-green-500" />
                <span className="text-sm">{t('statistics.total_images')}</span>
              </div>
              <span className="font-semibold">{documentStats?.totalImages || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileTextIcon className="h-4 w-4 text-red-500" />
                <span className="text-sm">{t('statistics.total_pdf_files')}</span>
              </div>
              <span className="font-semibold">{documentStats?.totalPdfFiles || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-500" />
                <span className="text-sm">{t('statistics.total_word_files')}</span>
              </div>
              <span className="font-semibold">{documentStats?.totalWordFiles || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sheet className="h-4 w-4 text-green-600" />
                <span className="text-sm">{t('statistics.total_excel_files')}</span>
              </div>
              <span className="font-semibold">{documentStats?.totalExcelFiles || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Presentation className="h-4 w-4 text-orange-500" />
                <span className="text-sm">{t('statistics.total_powerpoint_files')}</span>
              </div>
              <span className="font-semibold">{documentStats?.totalPowerPointFiles || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <File className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{t('statistics.total_other_files')}</span>
              </div>
              <span className="font-semibold">{documentStats?.totalOtherFiles || 0}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetailedStatistics;
