
import React from 'react';
import DashboardStats from '@/components/DashboardStats';
import ProjectCard from '@/components/ProjectCard';
import ProjectTimeline from '@/components/ProjectTimeline';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ChevronRight, Building, Clock, FileText, Briefcase } from 'lucide-react';

// Updated projects array to match ProjectCard props
const projects = [
  {
    id: 1,
    name: 'West Heights Tower',
    client_name: 'Skyline Properties',
    expected_end_date: '2023-09-30',
    start_date: '2023-05-15',
    progress: 75,
    status: 1, // 1 = active
  },
  {
    id: 2,
    name: 'Riverside Office Complex',
    client_name: 'Metro Developments',
    expected_end_date: '2023-11-15',
    start_date: '2023-06-20',
    progress: 45,
    status: 1, // 1 = active
  },
  {
    id: 3,
    name: 'Heritage Park Renovation',
    client_name: 'City Council',
    expected_end_date: '2023-08-10',
    start_date: '2023-04-05',
    progress: 90,
    status: 2, // 2 = completed
  },
  {
    id: 4,
    name: 'Parkview Residential Complex',
    client_name: 'Horizon Homes',
    expected_end_date: '2023-12-05',
    start_date: '2023-07-10',
    progress: 30,
    status: 3, // 3 = pending
  },
];

const tasks = [
  { id: 1, title: 'Review foundation plans', type: 'document', dueDate: 'Today', status: 'urgent' },
  { id: 2, title: 'Approve material suppliers', type: 'approval', dueDate: 'Tomorrow', status: 'normal' },
  { id: 3, title: 'Site inspection at West Heights', type: 'site', dueDate: 'Aug 28', status: 'normal' },
  { id: 4, title: 'Team coordination meeting', type: 'meeting', dueDate: 'Aug 29', status: 'normal' },
];

const getTaskIcon = (type: string) => {
  switch (type) {
    case 'document': return <FileText className="h-4 w-4 text-blue-500" />;
    case 'approval': return <Briefcase className="h-4 w-4 text-purple-500" />;
    case 'site': return <Building className="h-4 w-4 text-green-500" />;
    case 'meeting': return <Clock className="h-4 w-4 text-amber-500" />;
    default: return <FileText className="h-4 w-4" />;
  }
};

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-16"></div> {/* Navbar spacer */}
      
      <main className="flex-1 container mx-auto px-4 py-8 animate-in">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, manage your construction projects efficiently.
            </p>
          </div>
          <div className="mt-4 lg:mt-0 flex flex-wrap gap-3">
            <Button className="rounded-lg">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </div>
        </div>
        
        <div className="space-y-8">
          <DashboardStats />
          
          <div className="grid gap-8 lg:grid-cols-3">
            <Card className="lg:col-span-2 animate-in" style={{ animationDelay: "0.1s" }}>
              <CardHeader className="pb-3">
                <CardTitle>Project Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <ProjectTimeline />
              </CardContent>
            </Card>
            
            <Card className="animate-in" style={{ animationDelay: "0.2s" }}>
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle>Upcoming Tasks</CardTitle>
                <Button variant="ghost" size="sm" className="text-sm" asChild>
                  <a href="/tasks">
                    View all
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </a>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div 
                      key={task.id} 
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="mt-0.5">{getTaskIcon(task.type)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm leading-none mb-1 text-balance">{task.title}</p>
                        <p className="text-xs text-muted-foreground">Due {task.dueDate}</p>
                      </div>
                      <div className={`px-2 py-1 text-xs rounded-full ${
                        task.status === 'urgent' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-slate-100 text-slate-800'
                      }`}>
                        {task.status === 'urgent' ? 'Urgent' : 'Normal'}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Recent Projects</h2>
              <Button variant="ghost" size="sm" asChild>
                <a href="/projects">
                  View all projects
                  <ChevronRight className="ml-1 h-4 w-4" />
                </a>
              </Button>
            </div>
            
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">All Projects</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-4">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {projects.map((project, index) => (
                    <ProjectCard
                      key={project.id}
                      {...project}
                      className="animate-in"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="active" className="space-y-4">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {projects
                    .filter(p => p.status === 1)
                    .map((project, index) => (
                      <ProjectCard
                        key={project.id}
                        {...project}
                        className="animate-in"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      />
                    ))}
                </div>
              </TabsContent>
              
              <TabsContent value="completed" className="space-y-4">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {projects
                    .filter(p => p.status === 2)
                    .map((project, index) => (
                      <ProjectCard
                        key={project.id}
                        {...project}
                        className="animate-in"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      />
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
