
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  Building,
  Briefcase,
  Users,
  MessagesSquare
} from 'lucide-react';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  department: 'engineering' | 'architecture' | 'project_management' | 'construction' | 'administration';
  email: string;
  phone: string;
  location: string;
  projects: number;
  avatar?: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 1,
    name: 'Emma Johnson',
    role: 'Senior Architect',
    department: 'architecture',
    email: 'emma.johnson@example.com',
    phone: '(555) 123-4567',
    location: 'New York',
    projects: 8,
  },
  {
    id: 2,
    name: 'Daniel Smith',
    role: 'Project Manager',
    department: 'project_management',
    email: 'daniel.smith@example.com',
    phone: '(555) 234-5678',
    location: 'Chicago',
    projects: 6,
  },
  {
    id: 3,
    name: 'Olivia Wilson',
    role: 'Structural Engineer',
    department: 'engineering',
    email: 'olivia.wilson@example.com',
    phone: '(555) 345-6789',
    location: 'Boston',
    projects: 5,
  },
  {
    id: 4,
    name: 'William Brown',
    role: 'Construction Manager',
    department: 'construction',
    email: 'william.brown@example.com',
    phone: '(555) 456-7890',
    location: 'Denver',
    projects: 4,
  },
  {
    id: 5,
    name: 'Sophia Miller',
    role: 'Interior Designer',
    department: 'architecture',
    email: 'sophia.miller@example.com',
    phone: '(555) 567-8901',
    location: 'Los Angeles',
    projects: 7,
  },
  {
    id: 6,
    name: 'James Davis',
    role: 'Civil Engineer',
    department: 'engineering',
    email: 'james.davis@example.com',
    phone: '(555) 678-9012',
    location: 'Seattle',
    projects: 3,
  },
  {
    id: 7,
    name: 'Ava Garcia',
    role: 'Project Coordinator',
    department: 'project_management',
    email: 'ava.garcia@example.com',
    phone: '(555) 789-0123',
    location: 'Miami',
    projects: 5,
  },
  {
    id: 8,
    name: 'Noah Martinez',
    role: 'Safety Inspector',
    department: 'construction',
    email: 'noah.martinez@example.com',
    phone: '(555) 890-1234',
    location: 'Portland',
    projects: 6,
  },
  {
    id: 9,
    name: 'Isabella Rodriguez',
    role: 'Administrative Assistant',
    department: 'administration',
    email: 'isabella.rodriguez@example.com',
    phone: '(555) 901-2345',
    location: 'Austin',
    projects: 2,
  },
  {
    id: 10,
    name: 'Liam Thompson',
    role: 'Electrical Engineer',
    department: 'engineering',
    email: 'liam.thompson@example.com',
    phone: '(555) 012-3456',
    location: 'Dallas',
    projects: 4,
  },
  {
    id: 11,
    name: 'Mia Anderson',
    role: 'Project Architect',
    department: 'architecture',
    email: 'mia.anderson@example.com',
    phone: '(555) 123-4567',
    location: 'Phoenix',
    projects: 5,
  },
  {
    id: 12,
    name: 'Benjamin Taylor',
    role: 'Site Supervisor',
    department: 'construction',
    email: 'benjamin.taylor@example.com',
    phone: '(555) 234-5678',
    location: 'Philadelphia',
    projects: 7,
  },
];

const getDepartmentBadge = (department: TeamMember['department']) => {
  switch (department) {
    case 'engineering':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Engineering</Badge>;
    case 'architecture':
      return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Architecture</Badge>;
    case 'project_management':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Project Management</Badge>;
    case 'construction':
      return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Construction</Badge>;
    case 'administration':
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Administration</Badge>;
    default:
      return null;
  }
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

const Team = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-16"></div> {/* Navbar spacer */}
      <main className="flex-1 container mx-auto px-4 py-8 animate-in">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Team</h1>
            <p className="text-muted-foreground mt-1">Manage your project team members</p>
          </div>
          <div className="mt-4 lg:mt-0">
            <Button className="rounded-lg">
              <Plus className="mr-2 h-4 w-4" />
              Add Team Member
            </Button>
          </div>
        </div>
        
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search team members..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
            <TabsTrigger value="engineering">Engineering</TabsTrigger>
            <TabsTrigger value="project_management">Project Management</TabsTrigger>
            <TabsTrigger value="construction">Construction</TabsTrigger>
          </TabsList>
          
          {['all', 'architecture', 'engineering', 'project_management', 'construction', 'administration'].map((tabValue) => (
            <TabsContent key={tabValue} value={tabValue} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {TEAM_MEMBERS
                  .filter(member => tabValue === 'all' || member.department === tabValue)
                  .filter(member => 
                    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    member.location.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((member) => (
                    <Card 
                      key={member.id} 
                      className="animate-in transition-all hover:shadow-md overflow-hidden"
                    >
                      <CardContent className="p-0">
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-12 w-12 border">
                                {member.avatar ? (
                                  <AvatarImage src={member.avatar} alt={member.name} />
                                ) : (
                                  <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                                )}
                              </Avatar>
                              <div>
                                <h3 className="font-medium">{member.name}</h3>
                                <p className="text-sm text-muted-foreground">{member.role}</p>
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem className="flex items-center">
                                  <Mail className="mr-2 h-4 w-4" />
                                  <span>Email</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center">
                                  <Phone className="mr-2 h-4 w-4" />
                                  <span>Call</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center">
                                  <MessagesSquare className="mr-2 h-4 w-4" />
                                  <span>Message</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          
                          <div className="mb-4">
                            {getDepartmentBadge(member.department)}
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">{member.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">{member.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">{member.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">{member.projects} active projects</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
              {TEAM_MEMBERS.filter(member => tabValue === 'all' || member.department === tabValue).length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No team members found</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
};

export default Team;
