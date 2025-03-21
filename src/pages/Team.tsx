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

const Team = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [siteEngineers, setSiteEngineers] = useState<SiteEngineer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchSiteEngineers = async () => {
    try {
      const data = await getSiteEngineers();
      setSiteEngineers(data);
    } catch (err) {
      setError('Failed to fetch site engineers');
      toast.error('Failed to load site engineers');
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const filteredEngineers = siteEngineers.filter(engineer => 
    engineer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    engineer.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
    engineer.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-16"></div> {/* Navbar spacer */}
      <main className="flex-1 container mx-auto px-4 py-8 animate-in">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Site Engineers</h1>
            <p className="text-muted-foreground mt-1">Manage your site engineering team</p>
          </div>
          <div className="mt-4 lg:mt-0">
            <Button className="rounded-lg" onClick={() => setIsAddModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Site Engineer
            </Button>
          </div>
        </div>
        
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
                        <AvatarFallback>{getInitials(engineer.fullName)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{engineer.fullName}</h3>
                        <p className="text-sm text-muted-foreground">{engineer.specialization}</p>
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
                      <span className="text-muted-foreground">{engineer.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{engineer.phoneNumber}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{engineer.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{engineer.projects} active projects</span>
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

        <NewSiteEngineerModal 
          isOpen={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
          onEngineerCreated={fetchSiteEngineers}
        />
      </main>
    </div>
  );
};

export default Team;
