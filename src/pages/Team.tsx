
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TeamMembers } from '@/components/TeamMembers';
import { ClientMembers } from '@/components/ClientMembers';
import { SiteEngineers } from '@/components/SiteEngineers';
import TeamStatistics from '@/components/TeamStatistics';
import { UserCog, HardHat, Briefcase, PieChart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Team = () => {
  const [activeTab, setActiveTab] = useState('stats');

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
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              <span>الإحصائيات</span>
            </TabsTrigger>
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
          
          <TabsContent value="stats" className="space-y-4 animate-in">
            <TeamStatistics />
          </TabsContent>
          
          <TabsContent value="team" className="space-y-4 animate-in">
            <TeamMembers />
          </TabsContent>
          
          <TabsContent value="engineers" className="space-y-4 animate-in">
            <SiteEngineers />
          </TabsContent>
          
          <TabsContent value="clients" className="space-y-4 animate-in">
            <ClientMembers />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Team;
