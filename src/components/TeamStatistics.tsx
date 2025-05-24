
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  UserCheck,
  HardHat,
  Briefcase,
  PieChart,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const TeamStatistics = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 animate-in fade-in-50">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{t('dashboard.team_members')}</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{t('statistics.total_site_engineers')}</p>
                <p className="text-2xl font-bold">18</p>
                <p className="text-xs text-green-600 flex items-center">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  8% {t('common.last_month')}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <HardHat className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{t('statistics.assigned_workers')}</p>
                <p className="text-2xl font-bold">42</p>
                <p className="text-xs text-red-600 flex items-center">
                  <ArrowDown className="h-3 w-3 mr-1" />
                  3% {t('common.last_month')}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <UserCheck className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{t('statistics.total_clients')}</p>
                <p className="text-2xl font-bold">16</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-full">
                <Briefcase className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Statistics */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">{t('team.specialty')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('team.site_engineers')}</span>
                  <span>8 (33%)</span>
                </div>
                <Progress value={33} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">مشرفين</span>
                  <span>4 (17%)</span>
                </div>
                <Progress value={17} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('team.workers')}</span>
                  <span>12 (50%)</span>
                </div>
                <Progress value={50} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">{t('team.availability')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{t('team.available')}</p>
                  <div className="flex items-baseline space-x-2 rtl:space-x-reverse">
                    <span className="text-2xl font-bold">18</span>
                    <Badge variant="secondary">75%</Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{t('team.unavailable')}</p>
                  <div className="flex items-baseline space-x-2 rtl:space-x-reverse">
                    <span className="text-2xl font-bold">6</span>
                    <Badge variant="secondary">25%</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeamStatistics;
