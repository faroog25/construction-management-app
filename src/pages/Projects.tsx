
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProjectCard from '@/components/ProjectCard';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, Search, Filter, SlidersHorizontal, ChevronDown } from 'lucide-react';

const PROJECTS = [
  {
    id: 1,
    title: 'West Heights Tower',
    client: 'Skyline Properties',
    dueDate: 'Sep 30, 2023',
    teamSize: 12,
    progress: 75,
    status: 'active' as const,
  },
  {
    id: 2,
    title: 'Riverside Office Complex',
    client: 'Metro Developments',
    dueDate: 'Nov 15, 2023',
    teamSize: 8,
    progress: 45,
    status: 'active' as const,
  },
  {
    id: 3,
    title: 'Heritage Park Renovation',
    client: 'City Council',
    dueDate: 'Aug 10, 2023',
    teamSize: 6,
    progress: 90,
    status: 'completed' as const,
  },
  {
    id: 4,
    title: 'Parkview Residential Complex',
    client: 'Horizon Homes',
    dueDate: 'Dec 5, 2023',
    teamSize: 15,
    progress: 30,
    status: 'pending' as const,
  },
  {
    id: 5,
    title: 'Central Station Remodel',
    client: 'Transit Authority',
    dueDate: 'Jan 22, 2024',
    teamSize: 20,
    progress: 15,
    status: 'active' as const,
  },
  {
    id: 6,
    title: 'Oakwood Community Center',
    client: 'Community Foundation',
    dueDate: 'Oct 18, 2023',
    teamSize: 10,
    progress: 55,
    status: 'active' as const,
  },
  {
    id: 7,
    title: 'Harbor View Hotel',
    client: 'Seaside Resorts',
    dueDate: 'Mar 5, 2024',
    teamSize: 24,
    progress: 10,
    status: 'pending' as const,
  },
  {
    id: 8,
    title: 'Greenfield Shopping Mall',
    client: 'Retail Partners Inc.',
    dueDate: 'Feb 12, 2024',
    teamSize: 18,
    progress: 25,
    status: 'active' as const,
  },
  {
    id: 9,
    title: 'Sunnydale School Expansion',
    client: 'Education Department',
    dueDate: 'Jul 30, 2023',
    teamSize: 14,
    progress: 100,
    status: 'completed' as const,
  },
  {
    id: 10,
    title: 'Mountain View Apartments',
    client: 'Highland Properties',
    dueDate: 'Sep 15, 2023',
    teamSize: 10,
    progress: 85,
    status: 'delayed' as const,
  },
  {
    id: 11,
    title: 'Tech Hub Campus',
    client: 'Innovation Partners',
    dueDate: 'Apr 20, 2024',
    teamSize: 22,
    progress: 5,
    status: 'pending' as const,
  },
  {
    id: 12,
    title: 'Riverside Park Bridge',
    client: 'City Infrastructure',
    dueDate: 'Dec 28, 2023',
    teamSize: 9,
    progress: 60,
    status: 'active' as const,
  },
];

const Projects = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  
  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-16"></div> {/* Navbar spacer */}
      <main className="flex-1 container mx-auto px-4 py-8 animate-in">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground mt-1">Manage and monitor all your construction projects</p>
          </div>
          <div className="mt-4 lg:mt-0">
            <Button className="rounded-lg">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </div>
        </div>
        
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <SlidersHorizontal className="h-4 w-4" />
                      <span>Sort</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSortOption('newest')}>
                      Newest First
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOption('progress')}>
                      By Progress
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOption('teamSize')}>
                      Team Size
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="delayed">Delayed</TabsTrigger>
          </TabsList>
          
          {['all', 'active', 'completed', 'pending', 'delayed'].map((tabValue) => (
            <TabsContent key={tabValue} value={tabValue} className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {PROJECTS
                  .filter(project => tabValue === 'all' || project.status === tabValue)
                  .filter(project => 
                    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    project.client.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .sort((a, b) => {
                    if (sortOption === 'newest') return a.id - b.id;
                    if (sortOption === 'progress') return b.progress - a.progress;
                    if (sortOption === 'teamSize') return b.teamSize - a.teamSize;
                    return 0;
                  })
                  .map((project, index) => (
                    <ProjectCard
                      key={project.id}
                      {...project}
                      className="animate-in"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    />
                  ))}
              </div>
              {PROJECTS.filter(project => tabValue === 'all' || project.status === tabValue).length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No projects found</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
};

export default Projects;
