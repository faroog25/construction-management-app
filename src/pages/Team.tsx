import React, { useState, useEffect } from 'react';
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
import { SiteEngineer, getSiteEngineers, deleteSiteEngineer } from '@/services/siteEngineerService';
import { toast } from 'sonner';
import { NewSiteEngineerModal } from '@/components/NewSiteEngineerModal';
import { TeamMembers } from '@/components/TeamMembers';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const Team = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [siteEngineers, setSiteEngineers] = useState<SiteEngineer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchSiteEngineers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getSiteEngineers();
      
      if (!response || !response.data || !response.data.items) {
        console.error('Invalid data structure:', response);
        throw new Error('Invalid data structure received from API');
      }
      
      if (response.data.items.length === 0) {
        console.warn('No site engineers returned from API');
      }

      setSiteEngineers(response.data.items);
    } catch (err) {
      console.error('Error fetching site engineers:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch site engineers';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSiteEngineers();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteSiteEngineer(id);
      setSiteEngineers(siteEngineers.filter(engineer => engineer.id !== id));
      toast.success('Site engineer deleted successfully');
    } catch (err) {
      toast.error('Failed to delete site engineer');
    }
  };

  const getInitials = (engineer: SiteEngineer) => {
    try {
      const nameParts = engineer.fullName.split(' ');
      if (nameParts.length < 2) return 'N/A';
      return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`;
    } catch (error) {
      console.error('Error getting initials:', error);
      return 'N/A';
    }
  };

  const getFullName = (engineer: SiteEngineer) => {
    try {
      return engineer.fullName || 'Unknown Name';
    } catch (error) {
      console.error('Error getting full name:', error);
      return 'Unknown Name';
    }
  };

  const filteredEngineers = siteEngineers.filter(engineer => {
    try {
      const searchLower = searchQuery.toLowerCase();
      const fullName = getFullName(engineer).toLowerCase();
      const address = engineer.address ? engineer.address.toLowerCase() : '';
      return fullName.includes(searchLower) || address.includes(searchLower);
    } catch (error) {
      console.error('Error filtering engineer:', error);
      return false;
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Team</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button 
            onClick={() => fetchSiteEngineers()}
            className="w-full"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        <div className="h-16"></div> {/* Navbar spacer */}
        <main className="flex-1 container mx-auto px-4 py-8 animate-in">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
              <p className="text-muted-foreground mt-1">Manage your construction team members</p>
            </div>
            <div className="mt-4 lg:mt-0">
              <Button className="rounded-lg" onClick={() => setIsAddModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Site Engineer
              </Button>
            </div>
          </div>

          <Tabs defaultValue="engineers" className="space-y-4">
            <TabsList>
              <TabsTrigger value="engineers" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Site Engineers
              </TabsTrigger>
              <TabsTrigger value="workers" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Workers
              </TabsTrigger>
            </TabsList>

            <TabsContent value="engineers" className="space-y-4">
              <Card className="mb-6">
                <CardContent className="p-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search site engineers..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredEngineers.map((engineer) => (
                  <Card 
                    key={engineer.id} 
                    className="animate-in transition-all hover:shadow-md overflow-hidden"
                  >
                    <CardContent className="p-0">
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12 border">
                              <AvatarFallback>
                                {getInitials(engineer)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">
                                {getFullName(engineer)}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {engineer.id ? `ID: ${engineer.id}` : 'No ID'}
                              </p>
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
                              <DropdownMenuItem 
                                className="flex items-center text-red-600"
                                onClick={() => handleDelete(engineer.id)}
                              >
                                <span>Delete</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {engineer.email || 'No email'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {engineer.phoneNumber || 'No phone'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {engineer.address || 'No address'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {engineer.isAvailable ? 'Available' : 'Not Available'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredEngineers.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No site engineers found</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="workers">
              <TeamMembers />
            </TabsContent>
          </Tabs>

          <NewSiteEngineerModal 
            isOpen={isAddModalOpen}
            onOpenChange={setIsAddModalOpen}
            onEngineerCreated={fetchSiteEngineers}
          />
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default Team;
