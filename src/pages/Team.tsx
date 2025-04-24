import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TeamMembers } from '@/components/TeamMembers';
import { ClientMembers } from '@/components/ClientMembers';
import { SiteEngineers } from '@/components/SiteEngineers';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  FileSpreadsheet, 
  Filter, 
  Download, 
  User, 
  Users, 
  Briefcase, 
  Phone, 
  AtSign, 
  MapPin,
  UserCog,
  HardHat
} from 'lucide-react';
import { toast } from 'sonner';

const Team = () => {
  const [activeTab, setActiveTab] = useState('team');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleExport = () => {
    toast.success('Team data exported successfully');
  };

  const handleFilterToggle = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-16"></div> {/* Navbar spacer */}
      <main className="flex-1 container mx-auto px-4 py-8 animate-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Team</h1>
            <p className="text-muted-foreground mt-1">Manage your workers and clients</p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search workers..." className="pl-10" />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleFilterToggle}>
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline">
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Import
                </Button>
              </div>
            </div>
            
            {isFilterOpen && (
              <div className="mt-4 pt-4 border-t grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="role">Role</Label>
                  <select 
                    id="role" 
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">All Roles</option>
                    <option value="developer">Developer</option>
                    <option value="engineer">Engineer</option>
                    <option value="manager">Manager</option>
                    <option value="worker">Worker</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <select 
                    id="location" 
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">All Locations</option>
                    <option value="riyadh">Riyadh</option>
                    <option value="jeddah">Jeddah</option>
                    <option value="dammam">Dammam</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <select 
                    id="status" 
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">All Statuses</option>
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                    <option value="onleave">On Leave</option>
                  </select>
                </div>
                <div>
                  <Label className="mb-2 block">Options</Label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Checkbox id="available" />
                      <label htmlFor="available" className="ml-2 text-sm font-medium">
                        Available only
                      </label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="certified" />
                      <label htmlFor="certified" className="ml-2 text-sm font-medium">
                        Certified only
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="team" className="flex items-center gap-2">
              <UserCog className="h-4 w-4" />
              <span>Workers</span>
              <Badge variant="secondary" className="ml-1">24</Badge>
            </TabsTrigger>
            <TabsTrigger value="engineers" className="flex items-center gap-2">
              <HardHat className="h-4 w-4" />
              <span>Site Engineers</span>
              <Badge variant="secondary" className="ml-1">18</Badge>
            </TabsTrigger>
            <TabsTrigger value="clients" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span>Clients</span>
              <Badge variant="secondary" className="ml-1">16</Badge>
            </TabsTrigger>
          </TabsList>
          
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

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          <Card className="overflow-hidden">
            <CardHeader className="bg-muted/20 pb-3">
              <CardTitle className="text-lg">Team Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-md text-blue-600">
                      <Users className="h-5 w-5" />
                    </div>
                    <span>Total Members</span>
                  </div>
                  <span className="text-lg font-bold">24</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-green-100 rounded-md text-green-600">
                      <User className="h-5 w-5" />
                    </div>
                    <span>Available</span>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 font-medium">18</Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-red-100 rounded-md text-red-600">
                      <User className="h-5 w-5" />
                    </div>
                    <span>Unavailable</span>
                  </div>
                  <Badge variant="outline" className="bg-red-50 text-red-700 font-medium">6</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="bg-muted/20 pb-3">
              <CardTitle className="text-lg">Roles & Specialties</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Engineers</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Architects</span>
                  <span className="font-medium">5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Supervisors</span>
                  <span className="font-medium">4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Workers</span>
                  <span className="font-medium">7</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="bg-muted/20 pb-3">
              <CardTitle className="text-lg">Recent Additions</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <span className="font-medium text-sm">AH</span>
                  </div>
                  <div>
                    <p className="font-medium">Ahmed Hassan</p>
                    <p className="text-xs text-muted-foreground">Structural Engineer</p>
                    <p className="text-xs text-muted-foreground mt-1">Added 2 days ago</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                    <span className="font-medium text-sm">SK</span>
                  </div>
                  <div>
                    <p className="font-medium">Sara Khan</p>
                    <p className="text-xs text-muted-foreground">Architect</p>
                    <p className="text-xs text-muted-foreground mt-1">Added 3 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/10 py-2">
              <Button variant="link" className="h-auto p-0 text-sm">View All</Button>
            </CardFooter>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="bg-muted/20 pb-3">
              <CardTitle className="text-lg">Quick Contacts</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium">Project Manager</h3>
                  <div className="space-y-2 mt-1">
                    <p className="text-sm flex items-center gap-2">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>Mohammed Alharbi</span>
                    </p>
                    <p className="text-sm flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>+966 555 123 4567</span>
                    </p>
                    <p className="text-sm flex items-center gap-2">
                      <AtSign className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>m.alharbi@example.com</span>
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium">HR Department</h3>
                  <p className="text-sm flex items-center gap-2 mt-1">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>+966 555 765 4321</span>
                  </p>
                  <p className="text-sm flex items-center gap-2">
                    <AtSign className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>hr@example.com</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Team;
