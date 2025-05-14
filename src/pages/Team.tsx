
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TeamMembers } from '@/components/TeamMembers';
import { ClientMembers } from '@/components/ClientMembers';
import { SiteEngineers } from '@/components/SiteEngineers';
import { Card, CardContent } from '@/components/ui/card';
import { UserCog, HardHat, Briefcase, TrendingUp, TrendingDown, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Team = () => {
  const [activeTab, setActiveTab] = useState('team');
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-16"></div>
      <main className="flex-1 container mx-auto px-4 py-8 animate-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('team.title')}</h1>
            <p className="text-muted-foreground mt-1">{t('team.subtitle')}</p>
          </div>
          <div className="flex gap-2 mt-4 sm:mt-0">
            <Button variant="outline" asChild>
              <Link to="/team/workers">صفحة العمال</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/team/engineers">صفحة المهندسين</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/team/clients">صفحة العملاء</Link>
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="team" className="flex items-center gap-2">
              <UserCog className="h-4 w-4" />
              <span>{t('team.workers')}</span>
              <Badge variant="secondary" className="ml-1">24</Badge>
            </TabsTrigger>
            <TabsTrigger value="engineers" className="flex items-center gap-2">
              <HardHat className="h-4 w-4" />
              <span>{t('team.engineers')}</span>
              <Badge variant="secondary" className="ml-1">18</Badge>
            </TabsTrigger>
            <TabsTrigger value="clients" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span>{t('team.clients')}</span>
              <Badge variant="secondary" className="ml-1">16</Badge>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="team" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="flex justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">{t('team.active_workers')}</p>
                      <p className="text-2xl font-bold">24</p>
                      <p className="text-xs text-green-600 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        8% {t('team.from_last_month')}
                      </p>
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
                      <p className="text-sm font-medium text-muted-foreground">{t('team.attendance_rate')}</p>
                      <p className="text-2xl font-bold">92%</p>
                      <p className="text-xs text-green-600 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        5% {t('team.from_last_month')}
                      </p>
                    </div>
                    <div className="p-2 bg-green-100 rounded-full">
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <div className="flex justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">{t('team.productivity')}</p>
                      <p className="text-2xl font-bold">85%</p>
                      <p className="text-xs text-red-600 flex items-center">
                        <TrendingDown className="h-3 w-3 mr-1" />
                        3% {t('team.from_last_month')}
                      </p>
                    </div>
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <TeamMembers />
          </TabsContent>
          
          <TabsContent value="engineers" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="flex justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">{t('team.available_engineers')}</p>
                      <p className="text-2xl font-bold">18</p>
                      <p className="text-xs text-green-600 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        4% {t('team.from_last_month')}
                      </p>
                    </div>
                    <div className="p-2 bg-primary/10 rounded-full">
                      <HardHat className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <div className="flex justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">{t('team.completed_projects')}</p>
                      <p className="text-2xl font-bold">45</p>
                      <p className="text-xs text-green-600 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        12% {t('team.from_last_month')}
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
                      <p className="text-sm font-medium text-muted-foreground">{t('team.overall_rating')}</p>
                      <p className="text-2xl font-bold">4.8</p>
                      <Progress value={96} className="h-2" />
                    </div>
                    <div className="p-2 bg-blue-100 rounded-full">
                      <HardHat className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <SiteEngineers />
          </TabsContent>
          
          <TabsContent value="clients" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="flex justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">{t('team.active_clients')}</p>
                      <p className="text-2xl font-bold">16</p>
                      <p className="text-xs text-green-600 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        2% {t('team.from_last_month')}
                      </p>
                    </div>
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Briefcase className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <div className="flex justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">{t('team.ongoing_projects')}</p>
                      <p className="text-2xl font-bold">28</p>
                      <p className="text-xs text-green-600 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        15% {t('team.from_last_month')}
                      </p>
                    </div>
                    <div className="p-2 bg-green-100 rounded-full">
                      <Briefcase className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <div className="flex justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">{t('team.client_satisfaction')}</p>
                      <p className="text-2xl font-bold">96%</p>
                      <Progress value={96} className="h-2" />
                    </div>
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Briefcase className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <ClientMembers />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Team;
