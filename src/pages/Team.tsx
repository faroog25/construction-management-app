
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
  Trash2,
  Filter,
  UserPlus,
  UserCog,
  Phone2
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
  const [activeTab, setActiveTab] = useState('engineers');

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
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 bg-white p-4 rounded-lg shadow-sm border">
            <div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                إدارة الفريق
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">إدارة أعضاء فريق البناء والعملاء</p>
            </div>
            <div className="mt-4 lg:mt-0 flex flex-wrap gap-2">
              <Button 
                className="gap-1 shadow-sm" 
                onClick={() => {
                  setActiveTab('engineers');
                  setIsAddModalOpen(true);
                }}
              >
                <UserPlus className="h-4 w-4" />
                إضافة مهندس موقع
              </Button>
              <Button 
                className="gap-1" 
                variant="outline" 
                onClick={() => {
                  setActiveTab('workers');
                  setIsAddWorkerModalOpen(true);
                }}
              >
                <UserCog className="h-4 w-4" />
                إضافة عامل
              </Button>
              <Button 
                className="gap-1" 
                variant="outline" 
                onClick={() => {
                  setActiveTab('clients');
                  setIsAddClientModalOpen(true);
                }}
              >
                <UserCircle className="h-4 w-4" />
                إضافة عميل
              </Button>
            </div>
          </div>

          <Tabs 
            defaultValue="engineers" 
            className="space-y-4"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="bg-muted/30 p-1">
              <TabsTrigger value="engineers" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Building className="h-4 w-4" />
                مهندسو الموقع
              </TabsTrigger>
              <TabsTrigger value="workers" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Briefcase className="h-4 w-4" />
                العمال
              </TabsTrigger>
              <TabsTrigger value="clients" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <UserCircle className="h-4 w-4" />
                العملاء
              </TabsTrigger>
            </TabsList>

            <TabsContent value="engineers" className="space-y-4">
              <Card className="mb-6 border shadow-sm">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                    <div className="relative grow max-w-md">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="البحث عن مهندسي الموقع..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="gap-1">
                        <Filter className="h-4 w-4" />
                        تصفية
                      </Button>
                      <Button size="sm" className="gap-1" onClick={() => setIsAddModalOpen(true)}>
                        <Plus className="h-4 w-4" />
                        إضافة
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredEngineers.length === 0 ? (
                  <div className="col-span-full flex flex-col items-center justify-center bg-muted/10 rounded-lg p-12 text-center border border-dashed">
                    <Building className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium mb-2">لا يوجد مهندسون</h3>
                    <p className="text-muted-foreground mb-4">لم يتم العثور على مهندسي موقع. أضف مهندساً جديداً للبدء.</p>
                    <Button onClick={() => setIsAddModalOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      إضافة مهندس موقع
                    </Button>
                  </div>
                ) : (
                  filteredEngineers.map((engineer) => (
                    <Card 
                      key={engineer.id} 
                      className="group overflow-hidden border hover:shadow-md transition-shadow duration-200"
                    >
                      <CardContent className="p-0">
                        <div className="relative">
                          <div className="absolute right-2 top-2 z-10">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem onClick={() => handleEdit(engineer)}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  تعديل
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDelete(engineer.id)}
                                  className="text-red-600 focus:text-red-700 focus:bg-red-50"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  حذف
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
                            <div className="flex items-start gap-4">
                              <Avatar className="h-14 w-14 border-2 border-white shadow-sm">
                                <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                                  {getInitials(engineer)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold text-lg">
                                  {getFullName(engineer)}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {engineer.id ? `الرقم التعريفي: ${engineer.id}` : 'لا يوجد رقم تعريفي'}
                                </p>
                                <Badge className="mt-2" variant={engineer.isAvailable ? "success" : "destructive"}>
                                  {engineer.isAvailable ? 'متاح' : 'غير متاح'}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-blue-600 shrink-0" />
                            <span className="text-gray-700 truncate">
                              {engineer.email || 'لا يوجد بريد إلكتروني'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-green-600 shrink-0" />
                            <span className="text-gray-700 truncate">
                              {engineer.phoneNumber || 'لا يوجد رقم هاتف'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-red-600 shrink-0" />
                            <span className="text-gray-700 truncate">
                              {engineer.address || 'لا يوجد عنوان'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="border-t p-4 bg-muted/10 flex justify-end space-x-2 space-x-reverse">
                          <Button variant="outline" size="sm" className="gap-1" onClick={() => handleEdit(engineer)}>
                            <Pencil className="h-3.5 w-3.5" />
                            تعديل
                          </Button>
                          <Button variant="destructive" size="sm" className="gap-1" onClick={() => handleDelete(engineer.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                            حذف
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
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
