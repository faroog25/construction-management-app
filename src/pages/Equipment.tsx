
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import EquipmentList from '@/components/equipment/EquipmentList';
import BookingForm from '@/components/equipment/BookingForm';
import BookingsList from '@/components/equipment/BookingsList';
import { AddEquipmentDialog } from '@/components/equipment/AddEquipmentDialog';
import { EquipmentItem } from '@/types/equipment';
import { Box, CalendarDays, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Equipment = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'equipment';
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentItem | null>(null);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [isAddEquipmentDialogOpen, setIsAddEquipmentDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [equipmentError, setEquipmentError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  const handleSelectEquipment = (equipment: EquipmentItem) => {
    setSelectedEquipment(equipment);
    setIsBookingDialogOpen(true);
  };

  const handleBookingSubmit = () => {
    setIsBookingDialogOpen(false);
    setSelectedEquipment(null);
    
    toast({
      title: "Booking Confirmed",
      description: "Your equipment booking has been successfully submitted.",
      variant: "default",
    });
  };

  const handleEquipmentAdded = () => {
    // Refresh equipment list by updating the key
    setRefreshKey(prevKey => prevKey + 1);
    setEquipmentError(null); // Clear any existing error
    
    toast({
      title: "Equipment Added",
      description: "New equipment has been added successfully.",
      variant: "default",
    });
  };

  const handleEquipmentRefresh = () => {
    // Refresh equipment list by updating the key
    setRefreshKey(prevKey => prevKey + 1);
    setEquipmentError(null); // Clear any existing error
  };

  const handleEquipmentError = (error: string) => {
    setEquipmentError(error);
  };

  const handleAddEquipmentFromError = () => {
    setEquipmentError(null);
    setIsAddEquipmentDialogOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>Equipment Management | Construction Management</title>
      </Helmet>
      
      <Container className="py-8 mt-16">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-primary">Equipment Management</h1>
            <p className="text-lg text-muted-foreground">
              Browse available equipment, make bookings, and manage your equipment reservations efficiently.
            </p>
          </div>
          
          {activeTab === 'equipment' && (
            <Button 
              className="bg-primary hover:bg-primary/90 gap-2" 
              onClick={() => setIsAddEquipmentDialogOpen(true)}
            >
              <PlusCircle className="h-5 w-5" />
              Add Equipment
            </Button>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-8">
          <TabsList className="inline-flex h-14 items-center justify-center rounded-xl bg-muted p-1 text-muted-foreground w-full sm:w-auto">
            <TabsTrigger 
              value="equipment" 
              className="inline-flex items-center justify-center whitespace-nowrap px-6 py-3 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm hover:bg-accent/50"
            >
              <Box className="mr-2 h-5 w-5" />
              Equipment List
            </TabsTrigger>
            <TabsTrigger 
              value="bookings" 
              className="inline-flex items-center justify-center whitespace-nowrap px-6 py-3 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm hover:bg-accent/50"
            >
              <CalendarDays className="mr-2 h-5 w-5" />
              My Bookings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="equipment" className="space-y-6">
            {equipmentError && equipmentError.includes('404') ? (
              <div className="text-center py-16 border border-dashed rounded-lg bg-muted/20">
                <Box className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">لا يوجد معدات</h3>
                <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
                  لم يتم العثور على أي معدات في النظام حتى الآن. يمكنك إضافة معدة جديدة للبدء في إدارة المعدات.
                </p>
                <Button 
                  className="bg-primary hover:bg-primary/90 gap-2" 
                  onClick={handleAddEquipmentFromError}
                >
                  <PlusCircle className="h-5 w-5" />
                  إضافة معدة جديدة
                </Button>
              </div>
            ) : (
              <EquipmentList 
                onSelectEquipment={handleSelectEquipment} 
                onRefresh={handleEquipmentRefresh}
                onError={handleEquipmentError}
                key={refreshKey} // This forces a re-render when refreshKey changes
              />
            )}
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <BookingsList />
          </TabsContent>
        </Tabs>

        <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Book Equipment</DialogTitle>
              <DialogDescription className="text-base">
                Complete the form below to book the selected equipment for your project.
              </DialogDescription>
            </DialogHeader>
            <BookingForm 
              selectedEquipment={selectedEquipment} 
              onBookingSubmit={handleBookingSubmit}
            />
          </DialogContent>
        </Dialog>
        
        {/* Add Equipment Dialog */}
        <AddEquipmentDialog 
          isOpen={isAddEquipmentDialogOpen}
          onClose={() => setIsAddEquipmentDialogOpen(false)}
          onSuccess={handleEquipmentAdded}
        />
      </Container>
    </>
  );
};

export default Equipment;
