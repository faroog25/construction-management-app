
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import EquipmentList from '@/components/equipment/EquipmentList';
import BookingForm from '@/components/equipment/BookingForm';
import BookingsList from '@/components/equipment/BookingsList';
import { EquipmentItem, Booking } from '@/types/equipment';
import { Box, CalendarDays } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Equipment = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'equipment';
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentItem | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  const handleSelectEquipment = (equipment: EquipmentItem) => {
    setSelectedEquipment(equipment);
    setIsBookingDialogOpen(true);
  };

  const handleBookingSubmit = (booking: Booking) => {
    setBookings([...bookings, { ...booking, id: Date.now().toString() }]);
    setIsBookingDialogOpen(false);
    setSelectedEquipment(null);
    
    toast({
      title: "Booking Confirmed",
      description: `You've successfully booked ${booking.equipmentName} for ${booking.duration} days.`,
      variant: "default",
    });
  };

  return (
    <>
      <Helmet>
        <title>Equipment Management | Construction Management</title>
      </Helmet>
      
      <Container className="py-8 mt-16">
        <div className="mb-8 space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-primary">Equipment Management</h1>
          <p className="text-lg text-muted-foreground">
            Browse available equipment, make bookings, and manage your equipment reservations efficiently.
          </p>
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
            <EquipmentList onSelectEquipment={handleSelectEquipment} />
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <BookingsList bookings={bookings} />
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
      </Container>
    </>
  );
};

export default Equipment;
