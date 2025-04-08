import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EquipmentList from '@/components/equipment/EquipmentList';
import BookingForm from '@/components/equipment/BookingForm';
import BookingsList from '@/components/equipment/BookingsList';
import { EquipmentItem, Booking } from '@/types/equipment';

const Equipment = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'equipment';
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentItem | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  const handleSelectEquipment = (equipment: EquipmentItem) => {
    setSelectedEquipment(equipment);
    setSearchParams({ tab: 'booking' });
  };

  const handleBookingSubmit = (booking: Booking) => {
    setBookings([...bookings, { ...booking, id: Date.now().toString() }]);
    setSearchParams({ tab: 'bookings' });
  };

  return (
    <>
      <Helmet>
        <title>Equipment Management | Construction Management</title>
      </Helmet>
      
      <Container className="py-8 mt-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Equipment Management</h1>
          <p className="text-muted-foreground">
            Browse available equipment, make bookings, and manage your equipment reservations.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="equipment">Equipment List</TabsTrigger>
            <TabsTrigger value="booking">Book Equipment</TabsTrigger>
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
          </TabsList>

          <TabsContent value="equipment" className="space-y-6">
            <EquipmentList onSelectEquipment={handleSelectEquipment} />
          </TabsContent>

          <TabsContent value="booking" className="space-y-6">
            <BookingForm 
              selectedEquipment={selectedEquipment} 
              onBookingSubmit={handleBookingSubmit}
            />
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <BookingsList bookings={bookings} />
          </TabsContent>
        </Tabs>
      </Container>
    </>
  );
};

export default Equipment;
