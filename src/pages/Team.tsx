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
  MessagesSquare,
  UserCircle,
  Pencil,
  Trash2
} from 'lucide-react';
import { SiteEngineer, getSiteEngineers, deleteSiteEngineer } from '@/services/siteEngineerService';
import { toast } from 'sonner';
import { NewSiteEngineerModal } from '@/components/NewSiteEngineerModal';
import { EditSiteEngineerModal } from '@/components/EditSiteEngineerModal';
import { TeamMembers } from '@/components/TeamMembers';
import { ClientMembers } from '@/components/ClientMembers';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { NewWorkerModal } from '@/components/NewWorkerModal';
import { NewClientModal } from '@/components/NewClientModal';

const Team = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [siteEngineers, setSiteEngineers] = useState<SiteEngineer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEngineer, setSelectedEngineer] = useState<SiteEngineer | null>(null);
  const [isAddWorkerModalOpen, setIsAddWorkerModalOpen] = useState(false);
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);

  const fetchSiteEngineers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getSiteEngineers();
      
      if (!response || !response.data || !response.data.items) {
        console.error('Invalid data structure:', response);
        throw new Error('تم استلام هيكل بيانات غير صالح من الخادم');
      }
      
      if (response.data.items.length === 0) {
        console.warn('No site engineers returned from API');
      }

      setSiteEngineers(response.data.items);
    } catch (err) {
      console.error('Error fetching site engineers:', err);
      const errorMessage = err instanceof Error ? err.message : 'فشل في جلب مهندسي الموقع';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSiteEngineers();
  }, []);

  const handleEdit = (engineer: SiteEngineer) => {
    setSelectedEngineer(engineer);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المهندس؟')) {
      return;
    }
    
    try {
      await deleteSiteEngineer(id);
      setSiteEngineers(siteEngineers.filter(engineer => engineer.id !== id));
      toast.success('تم الحذف بنجاح');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'فشل في حذف المهندس';
      toast.error(errorMessage);
    }
  };

  const getInitials = (engineer: SiteEngineer) => {
    try {
      const nameParts = engineer.fullName.split(' ');
      if (nameParts.length < 2) return 'غير متوفر';
      return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`;
    } catch (error) {
      console.error('Error getting initials:', error);
      return 'غير متوفر';
    }
  };

  const getFullName = (engineer: SiteEngineer) => {
    try {
      return engineer.fullName || 'اسم غير معروف';
    } catch (error) {
      console.error('Error getting full name:', error);
      return 'اسم غير معروف';
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
          <h2 className="text-xl font-semibold text-red-600 mb-2">خطأ في تحميل الفريق</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button 
            onClick={() => fetchSiteEngineers()}
            className="w-full"
          >
            حاول مرة أخرى
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
              <h1 className="text-3xl font-bold tracking-tight">إدارة الفريق</h1>
              <p className="text-muted-foreground mt-1">إدارة أعضاء فريق البناء</p>
            </div>
            <div className="mt-4 lg:mt-0 flex flex-wrap gap-2">
              <Button className="rounded-lg" onClick={() => setIsAddModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                إضافة مهندس موقع
              </Button>
              <Button className="rounded-lg" variant="outline" onClick={() => setIsAddWorkerModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                إضافة عامل
              </Button>
              <Button className="rounded-lg" variant="outline" onClick={() => setIsAddClientModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                إضافة عميل
              </Button>
            </div>
          </div>

          <Tabs defaultValue="engineers" className="space-y-4">
            <TabsList>
              <TabsTrigger value="engineers" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                مهندسو الموقع
              </TabsTrigger>
              <TabsTrigger value="workers" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                العمال
              </TabsTrigger>
              <TabsTrigger value="clients" className="flex items-center gap-2">
                <UserCircle className="h-4 w-4" />
                العملاء
              </TabsTrigger>
            </TabsList>

            <TabsContent value="engineers" className="space-y-4">
              <Card className="mb-6">
                <CardContent className="p-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="البحث عن مهندسي الموقع..."
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
                                {engineer.id ? `الرقم التعريفي: ${engineer.id}` : 'لا يوجد رقم تعريفي'}
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
                              <DropdownMenuItem onClick={() => handleEdit(engineer)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                تعديل
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDelete(engineer.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                حذف
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {engineer.email || 'لا يوجد بريد إلكتروني'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {engineer.phoneNumber || 'لا يوجد رقم هاتف'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {engineer.address || 'لا يوجد عنوان'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {engineer.isAvailable ? 'متاح' : 'غير متاح'}
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
                  <p className="text-muted-foreground">لم يتم العثور على مهندسي موقع</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="workers">
              <TeamMembers />
            </TabsContent>

            <TabsContent value="clients">
              <ClientMembers />
            </TabsContent>
          </Tabs>

          <NewSiteEngineerModal 
            isOpen={isAddModalOpen}
            onOpenChange={setIsAddModalOpen}
            onEngineerCreated={fetchSiteEngineers}
          />
          <EditSiteEngineerModal
            isOpen={isEditModalOpen}
            onOpenChange={setIsEditModalOpen}
            onEngineerUpdated={fetchSiteEngineers}
            engineer={selectedEngineer}
          />
          <NewWorkerModal 
            isOpen={isAddWorkerModalOpen}
            onOpenChange={setIsAddWorkerModalOpen}
            onWorkerCreated={() => {
              // Refresh workers list
              // TODO: Implement worker list refresh
            }}
          />
          <NewClientModal 
            isOpen={isAddClientModalOpen}
            onOpenChange={setIsAddClientModalOpen}
            onClientCreated={() => {
              // Refresh clients list
              // TODO: Implement client list refresh
            }}
          />
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default Team;
