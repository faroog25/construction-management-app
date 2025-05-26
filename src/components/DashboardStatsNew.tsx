import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
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

const DashboardStatsNew = () => {
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

  const stats = [
    {
      title: 'Total Workers',
      value: teamStats?.totalWorkers || 0,
      icon: Users,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
    },
    {
      title: 'Active Projects',
      value: projectStats?.activeProjects || 0,
      icon: Building2,
      color: 'text-green-500',
      bg: 'bg-green-50',
    },
    {
      title: 'Completed Tasks',
      value: taskStats?.completedTasks || 0,
      icon: CheckSquare,
      color: 'text-purple-500',
      bg: 'bg-purple-50',
    },
    {
      title: 'Available Equipments',
      value: equipmentStats?.availabeEquipments || 0,
      icon: Truck,
      color: 'text-orange-500',
      bg: 'bg-orange-50',
    },
    {
      title: 'Total Documents',
      value: documentStats?.totalDocuments || 0,
      icon: FileText,
      color: 'text-indigo-500',
      bg: 'bg-indigo-50',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.bg} p-3 rounded-full`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardStatsNew;
