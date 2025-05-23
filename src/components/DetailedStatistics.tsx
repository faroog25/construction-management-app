
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  getTeamStatistics,
  getProjectStatistics,
  getTaskStatistics,
  getEquipmentStatistics,
  getDocumentStatistics
} from '@/services/dashboardService';
import { Users, Activity, Clock, HardHat, FileText } from 'lucide-react';

const DetailedStatistics = () => {
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
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Project Statistics */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Project Statistics</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {projectLoading ? (
            <div className="space-y-3">
              <div className="h-4 bg-muted animate-pulse rounded"></div>
              <div className="h-4 bg-muted animate-pulse rounded"></div>
              <div className="h-4 bg-muted animate-pulse rounded"></div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Active</span>
                <Badge variant="default">{projectStats?.activeProjects || 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Completed</span>
                <Badge variant="secondary">{projectStats?.completedProjects || 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Pending</span>
                <Badge variant="outline">{projectStats?.pendingProjects || 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Cancelled</span>
                <Badge variant="destructive">{projectStats?.cancelledProjects || 0}</Badge>
              </div>
              <div className="pt-2">
                <div className="text-xs text-muted-foreground mb-1">
                  Completion Rate: {projectStats ? Math.round((projectStats.completedProjects / projectStats.totalProjects) * 100) : 0}%
                </div>
                <Progress 
                  value={projectStats ? (projectStats.completedProjects / projectStats.totalProjects) * 100 : 0} 
                  className="h-2" 
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Team Statistics */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Team Statistics</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {teamLoading ? (
            <div className="space-y-3">
              <div className="h-4 bg-muted animate-pulse rounded"></div>
              <div className="h-4 bg-muted animate-pulse rounded"></div>
              <div className="h-4 bg-muted animate-pulse rounded"></div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Workers</span>
                <Badge variant="default">{teamStats?.totalWorkers || 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Assigned</span>
                <Badge variant="secondary">{teamStats?.assignedWorkers || 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Unassigned</span>
                <Badge variant="outline">{teamStats?.unAssignedWorkers || 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Site Engineers</span>
                <Badge variant="default">{teamStats?.totalSiteEngineers || 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Clients</span>
                <Badge variant="secondary">{teamStats?.totalClients || 0}</Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Task Statistics */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Task Statistics</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {taskLoading ? (
            <div className="space-y-3">
              <div className="h-4 bg-muted animate-pulse rounded"></div>
              <div className="h-4 bg-muted animate-pulse rounded"></div>
              <div className="h-4 bg-muted animate-pulse rounded"></div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Tasks</span>
                <Badge variant="default">{taskStats?.totalTasks || 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Active</span>
                <Badge variant="secondary">{taskStats?.activeTasks || 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Completed</span>
                <Badge variant="outline">{taskStats?.completedTasks || 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Overdue</span>
                <Badge variant="destructive">{taskStats?.overdueTasks || 0}</Badge>
              </div>
              <div className="pt-2">
                <div className="text-xs text-muted-foreground mb-1">
                  Completion Rate: {taskStats ? Math.round((taskStats.completedTasks / taskStats.totalTasks) * 100) : 0}%
                </div>
                <Progress 
                  value={taskStats ? (taskStats.completedTasks / taskStats.totalTasks) * 100 : 0} 
                  className="h-2" 
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Equipment Statistics */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Equipment Statistics</CardTitle>
          <HardHat className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {equipmentLoading ? (
            <div className="space-y-3">
              <div className="h-4 bg-muted animate-pulse rounded"></div>
              <div className="h-4 bg-muted animate-pulse rounded"></div>
              <div className="h-4 bg-muted animate-pulse rounded"></div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Equipment</span>
                <Badge variant="default">{equipmentStats?.totalEquipments || 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Available</span>
                <Badge variant="secondary">{equipmentStats?.availabeEquipments || 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Reserved</span>
                <Badge variant="outline">{equipmentStats?.reservedEquipments || 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Reservations</span>
                <Badge variant="default">{equipmentStats?.totalReservation || 0}</Badge>
              </div>
              <div className="pt-2">
                <div className="text-xs text-muted-foreground mb-1">
                  Utilization: {equipmentStats ? Math.round((equipmentStats.reservedEquipments / equipmentStats.totalEquipments) * 100) : 0}%
                </div>
                <Progress 
                  value={equipmentStats ? (equipmentStats.reservedEquipments / equipmentStats.totalEquipments) * 100 : 0} 
                  className="h-2" 
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document Statistics */}
      <Card className="md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Document Statistics</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {documentLoading ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="h-4 bg-muted animate-pulse rounded"></div>
              <div className="h-4 bg-muted animate-pulse rounded"></div>
              <div className="h-4 bg-muted animate-pulse rounded"></div>
              <div className="h-4 bg-muted animate-pulse rounded"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Documents</span>
                <Badge variant="default">{documentStats?.totalDocuments || 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Images</span>
                <Badge variant="secondary">{documentStats?.totalImages || 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">PDF Files</span>
                <Badge variant="outline">{documentStats?.totalPdfFiles || 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Word Files</span>
                <Badge variant="outline">{documentStats?.totalWordFiles || 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Excel Files</span>
                <Badge variant="outline">{documentStats?.totalExcelFiles || 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">PowerPoint Files</span>
                <Badge variant="outline">{documentStats?.totalPowerPointFiles || 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Other Files</span>
                <Badge variant="secondary">{documentStats?.totalOtherFiles || 0}</Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DetailedStatistics;
