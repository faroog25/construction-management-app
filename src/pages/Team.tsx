
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TeamMembers } from '@/components/TeamMembers';
import { ClientMembers } from '@/components/ClientMembers';
import { SiteEngineers } from '@/components/SiteEngineers';
import { Card, CardContent } from '@/components/ui/card';
import { UserCog, HardHat, Briefcase, TrendingUp, TrendingDown, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const Team = () => {
  const [activeTab, setActiveTab] = useState('team');

  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-16"></div>
      <main className="flex-1 container mx-auto px-4 py-8 animate-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">الفريق</h1>
            <p className="text-muted-foreground mt-1">إدارة العمال والعملاء</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="team" className="flex items-center gap-2">
              <UserCog className="h-4 w-4" />
              <span>العمال</span>
              <Badge variant="secondary" className="ml-1">24</Badge>
            </TabsTrigger>
            <TabsTrigger value="engineers" className="flex items-center gap-2">
              <HardHat className="h-4 w-4" />
              <span>المهندسين</span>
              <Badge variant="secondary" className="ml-1">18</Badge>
            </TabsTrigger>
            <TabsTrigger value="clients" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span>العملاء</span>
              <Badge variant="secondary" className="ml-1">16</Badge>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="team" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="flex justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">العمال النشطين</p>
                      <p className="text-2xl font-bold">24</p>
                      <p className="text-xs text-green-600 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        8% من الشهر الماضي
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
                      <p className="text-sm font-medium text-muted-foreground">معدل الحضور</p>
                      <p className="text-2xl font-bold">92%</p>
                      <p className="text-xs text-green-600 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        5% من الشهر الماضي
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
                      <p className="text-sm font-medium text-muted-foreground">الإنتاجية</p>
                      <p className="text-2xl font-bold">85%</p>
                      <p className="text-xs text-red-600 flex items-center">
                        <TrendingDown className="h-3 w-3 mr-1" />
                        3% من الشهر الماضي
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
                      <p className="text-sm font-medium text-muted-foreground">المهندسين المتاحين</p>
                      <p className="text-2xl font-bold">18</p>
                      <p className="text-xs text-green-600 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        4% من الشهر الماضي
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
                      <p className="text-sm font-medium text-muted-foreground">المشاريع المكتملة</p>
                      <p className="text-2xl font-bold">45</p>
                      <p className="text-xs text-green-600 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        12% من الشهر الماضي
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
                      <p className="text-sm font-medium text-muted-foreground">التقييم العام</p>
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
                      <p className="text-sm font-medium text-muted-foreground">العملاء النشطين</p>
                      <p className="text-2xl font-bold">16</p>
                      <p className="text-xs text-green-600 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        2% من الشهر الماضي
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
                      <p className="text-sm font-medium text-muted-foreground">المشاريع الجارية</p>
                      <p className="text-2xl font-bold">28</p>
                      <p className="text-xs text-green-600 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        15% من الشهر الماضي
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
                      <p className="text-sm font-medium text-muted-foreground">رضا العملاء</p>
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
