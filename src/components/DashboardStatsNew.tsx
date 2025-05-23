
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowUpRight, ArrowDownRight, Activity, Clock, Users, FileText, Briefcase, HardHat } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  getTeamStatistics,
  getProjectStatistics,
  getTaskStatistics,
  getEquipmentStatistics,
  getDocumentStatistics
} from '@/services/dashboardService';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
  };
  icon: React.ReactNode;
  className?: string;
  isLoading?: boolean;
}

const StatCard = ({ title, value, change, icon, className, isLoading }: StatCardProps) => {
  return (
    <div className={cn(
      "bg-card rounded-xl p-5 shadow-sm border animate-in transition-all",
      className
    )}>
      <div className="flex justify-between items-start">
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {isLoading ? (
            <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
          ) : (
            <p className="text-2xl font-semibold tracking-tight">{value}</p>
          )}
          {change && !isLoading && (
            <div className="flex items-center text-sm">
              {change.isPositive ? (
                <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
              ) : (
                <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />
              )}
              <span className={change.isPositive ? "text-green-500" : "text-red-500"}>
                {change.value}%
              </span>
              <span className="text-muted-foreground ml-1">from last month</span>
            </div>
          )}
        </div>
        <div className="rounded-full p-2 bg-primary/10">
          {icon}
        </div>
      </div>
    </div>
  );
};

const DashboardStatsNew = () => {
  const { data: teamStats, isLoading: teamLoading } = useQuery({
    queryKey: ['team-statistics'],
    queryFn: getTeamStatistics,
  });

  const { data: projectStats, isLoading: projectLoading } = useQuery({
    queryKey: ['project-statistics'],
    queryFn: getProjectStatistics,
  });

  const { data: taskStats, isLoading: taskLoading } = useQuery({
    queryKey: ['task-statistics'],
    queryFn: getTaskStatistics,
  });

  const { data: equipmentStats, isLoading: equipmentLoading } = useQuery({
    queryKey: ['equipment-statistics'],
    queryFn: getEquipmentStatistics,
  });

  const { data: documentStats, isLoading: documentLoading } = useQuery({
    queryKey: ['document-statistics'],
    queryFn: getDocumentStatistics,
  });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Active Projects"
        value={projectStats?.activeProjects || 0}
        icon={<Activity className="h-5 w-5 text-primary" />}
        isLoading={projectLoading}
      />
      <StatCard
        title="Active Tasks"
        value={taskStats?.activeTasks || 0}
        icon={<Clock className="h-5 w-5 text-amber-500" />}
        isLoading={taskLoading}
      />
      <StatCard
        title="Total Workers"
        value={teamStats?.totalWorkers || 0}
        icon={<Users className="h-5 w-5 text-indigo-500" />}
        isLoading={teamLoading}
      />
      <StatCard
        title="Total Documents"
        value={documentStats?.totalDocuments || 0}
        icon={<FileText className="h-5 w-5 text-emerald-500" />}
        isLoading={documentLoading}
      />
      
      {/* Second Row */}
      <StatCard
        title="Total Projects"
        value={projectStats?.totalProjects || 0}
        icon={<Briefcase className="h-5 w-5 text-blue-500" />}
        isLoading={projectLoading}
      />
      <StatCard
        title="Completed Projects"
        value={projectStats?.completedProjects || 0}
        icon={<Activity className="h-5 w-5 text-green-500" />}
        isLoading={projectLoading}
      />
      <StatCard
        title="Site Engineers"
        value={teamStats?.totalSiteEngineers || 0}
        icon={<HardHat className="h-5 w-5 text-orange-500" />}
        isLoading={teamLoading}
      />
      <StatCard
        title="Available Equipment"
        value={equipmentStats?.availabeEquipments || 0}
        icon={<Activity className="h-5 w-5 text-purple-500" />}
        isLoading={equipmentLoading}
      />
    </div>
  );
};

export default DashboardStatsNew;
