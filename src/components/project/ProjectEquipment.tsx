
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { getProjectEquipmentBookings, getAvailableEquipment } from '@/services/equipmentAssignmentService';
import { BookingForm } from '@/components/equipment/BookingForm';
import { BookingsList } from '@/components/equipment/BookingsList';
import { Project } from '@/services/projectService';
import { Loader2 } from 'lucide-react';

interface ProjectEquipmentProps {
  project: Project;
  readOnly?: boolean;
}

const ProjectEquipment = ({ project, readOnly = false }: ProjectEquipmentProps) => {
  const [bookFormVisible, setBookFormVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('bookings');
  
  // Fetch project bookings
  const { 
    data: bookings, 
    isLoading: isLoadingBookings,
    refetch: refetchBookings
  } = useQuery({
    queryKey: ['project-equipment', project.id],
    queryFn: () => getProjectEquipmentBookings(project.id),
    enabled: !!project.id
  });

  // Fetch available equipment for booking
  const {
    data: availableEquipment,
    isLoading: isLoadingEquipment
  } = useQuery({
    queryKey: ['available-equipment'],
    queryFn: getAvailableEquipment,
    enabled: bookFormVisible
  });

  const handleBookingSuccess = () => {
    setBookFormVisible(false);
    refetchBookings();
    setActiveTab('bookings');
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>معدات المشروع</CardTitle>
            <CardDescription>إدارة حجوزات المعدات المخصصة للمشروع</CardDescription>
          </div>
          
          {!readOnly && (
            <Button 
              onClick={() => {
                setBookFormVisible(true);
                setActiveTab('book');
              }}
              disabled={bookFormVisible}
            >
              حجز معدة
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="bookings">الحجوزات الحالية</TabsTrigger>
              {bookFormVisible && !readOnly && (
                <TabsTrigger value="book">حجز معدة جديدة</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="bookings" className="space-y-4">
              {isLoadingBookings ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <BookingsList 
                  bookings={bookings || []} 
                  onBookingUpdated={refetchBookings}
                  readOnly={readOnly}
                />
              )}
              
              {!isLoadingBookings && (!bookings || bookings.length === 0) && (
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium mb-2">لا توجد حجوزات معدات</h3>
                  <p className="text-muted-foreground mb-6">
                    {readOnly 
                      ? 'لا توجد معدات مخصصة لهذا المشروع حالياً.'
                      : 'قم بتخصيص معدات لهذا المشروع باستخدام زر "حجز معدة" أعلاه.'}
                  </p>
                  {!readOnly && (
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setBookFormVisible(true);
                        setActiveTab('book');
                      }}
                    >
                      حجز معدة جديدة
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
            
            {!readOnly && (
              <TabsContent value="book" className="space-y-4">
                {isLoadingEquipment ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <BookingForm 
                    projectId={project.id} 
                    availableEquipment={availableEquipment || []} 
                    onCancel={() => {
                      setBookFormVisible(false);
                      setActiveTab('bookings');
                    }}
                    onSuccess={handleBookingSuccess}
                  />
                )}
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectEquipment;
