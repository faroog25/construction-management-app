
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TeamMembers } from '@/components/TeamMembers';
import { ClientMembers } from '@/components/ClientMembers';
import { SiteEngineers } from '@/components/SiteEngineers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCog, HardHat, Briefcase, TrendingUp, TrendingDown, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Workers } from '@/components/Workers';

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
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-2">
            <TabsList className="grid grid-cols-3 gap-2">
              <TabsTrigger value="team" className="flex items-center gap-2 data-[state=active]:bg-blue-500">
                <UserCog className="h-5 w-5" />
                <span className="hidden sm:inline">{t('team.workers')}</span>
                <Badge variant="outline" className="ml-1 bg-blue-50 text-blue-700 border border-blue-200">24</Badge>
              </TabsTrigger>
              <TabsTrigger value="engineers" className="flex items-center gap-2 data-[state=active]:bg-amber-500">
                <HardHat className="h-5 w-5" />
                <span className="hidden sm:inline">{t('team.engineers')}</span>
                <Badge variant="outline" className="ml-1 bg-amber-50 text-amber-700 border border-amber-200">18</Badge>
              </TabsTrigger>
              <TabsTrigger value="clients" className="flex items-center gap-2 data-[state=active]:bg-rose-500">
                <Briefcase className="h-5 w-5" />
                <span className="hidden sm:inline">{t('team.clients')}</span>
                <Badge variant="outline" className="ml-1 bg-rose-50 text-rose-700 border border-rose-200">16</Badge>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="team" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-transparent">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <UserCog className="h-5 w-5 text-blue-600" />
                    {t('team.active_workers')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex justify-between">
                    <div className="space-y-1">
                      <p className="text-2xl font-bold">24</p>
                      <p className="text-xs text-green-600 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        8% {t('team.from_last_month')}
                      </p>
                    </div>
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
                <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-transparent">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <UserCog className="h-5 w-5 text-green-600" />
                    {t('team.attendance_rate')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex justify-between">
                    <div className="space-y-1">
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

              <Card className="shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
                <CardHeader className="pb-2 bg-gradient-to-r from-purple-50 to-transparent">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <UserCog className="h-5 w-5 text-purple-600" />
                    {t('team.productivity')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex justify-between">
                    <div className="space-y-1">
                      <p className="text-2xl font-bold">85%</p>
                      <p className="text-xs text-red-600 flex items-center">
                        <TrendingDown className="h-3 w-3 mr-1" />
                        3% {t('team.from_last_month')}
                      </p>
                    </div>
                    <div className="p-2 bg-purple-100 rounded-full">
                      <Users className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-t-blue-500">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                <UserCog className="h-5 w-5 text-primary" />
                تفاصيل العمال
              </h2>
              <Workers />
            </div>
          </TabsContent>
          
          <TabsContent value="engineers" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-amber-500">
                <CardHeader className="pb-2 bg-gradient-to-r from-amber-50 to-transparent">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <HardHat className="h-5 w-5 text-amber-600" />
                    {t('team.available_engineers')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex justify-between">
                    <div className="space-y-1">
                      <p className="text-2xl font-bold">18</p>
                      <p className="text-xs text-green-600 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        4% {t('team.from_last_month')}
                      </p>
                    </div>
                    <div className="p-2 bg-amber-100 rounded-full">
                      <HardHat className="h-5 w-5 text-amber-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-cyan-500">
                <CardHeader className="pb-2 bg-gradient-to-r from-cyan-50 to-transparent">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <HardHat className="h-5 w-5 text-cyan-600" />
                    {t('team.completed_projects')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex justify-between">
                    <div className="space-y-1">
                      <p className="text-2xl font-bold">45</p>
                      <p className="text-xs text-green-600 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        12% {t('team.from_last_month')}
                      </p>
                    </div>
                    <div className="p-2 bg-cyan-100 rounded-full">
                      <HardHat className="h-5 w-5 text-cyan-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-indigo-500">
                <CardHeader className="pb-2 bg-gradient-to-r from-indigo-50 to-transparent">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <HardHat className="h-5 w-5 text-indigo-600" />
                    {t('team.overall_rating')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex justify-between">
                    <div className="space-y-1">
                      <p className="text-2xl font-bold">4.8</p>
                      <Progress value={96} className="h-2" />
                    </div>
                    <div className="p-2 bg-indigo-100 rounded-full">
                      <HardHat className="h-5 w-5 text-indigo-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-t-amber-500">
              <SiteEngineers />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="col-span-3">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <HardHat className="h-5 w-5 text-primary" />
                    تفاصيل المهندسين
                  </h2>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/team/engineers">عرض كل المهندسين</Link>
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="clients" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-rose-500">
                <CardHeader className="pb-2 bg-gradient-to-r from-rose-50 to-transparent">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-rose-600" />
                    {t('team.active_clients')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex justify-between">
                    <div className="space-y-1">
                      <p className="text-2xl font-bold">16</p>
                      <p className="text-xs text-green-600 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        2% {t('team.from_last_month')}
                      </p>
                    </div>
                    <div className="p-2 bg-rose-100 rounded-full">
                      <Briefcase className="h-5 w-5 text-rose-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-orange-500">
                <CardHeader className="pb-2 bg-gradient-to-r from-orange-50 to-transparent">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-orange-600" />
                    {t('team.ongoing_projects')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex justify-between">
                    <div className="space-y-1">
                      <p className="text-2xl font-bold">28</p>
                      <p className="text-xs text-green-600 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        15% {t('team.from_last_month')}
                      </p>
                    </div>
                    <div className="p-2 bg-orange-100 rounded-full">
                      <Briefcase className="h-5 w-5 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-teal-500">
                <CardHeader className="pb-2 bg-gradient-to-r from-teal-50 to-transparent">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-teal-600" />
                    {t('team.client_satisfaction')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex justify-between">
                    <div className="space-y-1">
                      <p className="text-2xl font-bold">96%</p>
                      <Progress value={96} className="h-2" />
                    </div>
                    <div className="p-2 bg-teal-100 rounded-full">
                      <Briefcase className="h-5 w-5 text-teal-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-t-rose-500">
              <ClientMembers />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="col-span-3">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    تفاصيل العملاء
                  </h2>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/team/clients">عرض كل العملاء</Link>
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Team;
