import React, { useState, useEffect } from 'react';
import { Calendar } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { format } from 'date-fns';
import { DateRange } from 'react-date-range';
import { addDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalendarDays } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { assignEquipment } from '@/services/equipmentAssignmentService';
import { useToast } from '@/hooks/use-toast';
import { EquipmentItem } from '@/types/equipment';

interface BookingFormProps {
  selectedEquipment: EquipmentItem | null;
  onBookingSubmit: (booking: any) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ selectedEquipment, onBookingSubmit }) => {
  const [projectId, setProjectId] = useState('');
  const [projectName, setProjectName] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState('');
  const [duration, setDuration] = useState(0);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [date, setDate] = React.useState<DateRange[]>([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: 'selection'
    }
  ]);

  useEffect(() => {
    if (date[0].startDate && date[0].endDate) {
      setStartDate(date[0].startDate);
      
      const formattedEndDate = format(date[0].endDate, 'yyyy-MM-dd');
      setEndDate(formattedEndDate);
      
      const timeDiff = date[0].endDate.getTime() - date[0].startDate.getTime();
      const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      setDuration(dayDiff);
    }
  }, [date]);

  const handleBookNow = async () => {
    if (!selectedEquipment) {
      toast({
        title: "Error",
        description: "No equipment selected for booking.",
        variant: "destructive",
      });
      return;
    }

    if (!projectId || !projectName) {
      toast({
        title: "Error",
        description: "Project ID and Project Name are required.",
        variant: "destructive",
      });
      return;
    }

    if (!startDate || !endDate) {
      toast({
        title: "Error",
        description: "Start and End dates are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Book the equipment using the API
      const response = await assignEquipment({
        equipmentId: Number(selectedEquipment.id),  // Convert string to number
        projectId: parseInt(projectId),
        expectedReturnDate: endDate
      });

      if (response.success) {
        toast({
          title: "Booking Request Sent",
          description: `Your booking request for ${selectedEquipment.name} has been sent.`,
          variant: "success",
        });

        // Prepare booking details for local submission
        const bookingDetails = {
          equipmentId: selectedEquipment.id,
          equipmentName: selectedEquipment.name,
          category: selectedEquipment.category,
          projectId: parseInt(projectId),
          projectName: projectName,
          startDate: format(startDate, 'yyyy-MM-dd'),
          endDate: endDate,
          duration: duration,
          notes: notes,
          status: 'Pending', // Assuming initial status is pending
          createdAt: new Date().toISOString(),
          dailyRate: 100, // Example rate
          totalCost: duration * 100, // Example cost calculation
        };

        onBookingSubmit(bookingDetails);
      } else {
        toast({
          title: "Booking Failed",
          description: response.message || "Failed to book equipment. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error booking equipment:", error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="projectId">Project ID</Label>
          <Input
            id="projectId"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            placeholder="Enter project ID"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="projectName">Project Name</Label>
          <Input
            id="projectName"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter project name"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Booking Dates</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !date ? "text-muted-foreground" : undefined
              )}
            >
              <CalendarDays className="mr-2 h-4 w-4" />
              {date ? (
                format(date[0].startDate, "PPP") + " - " + format(date[0].endDate, "PPP")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center" side="bottom">
            <DateRange
              onChange={(item) => setDate([item.selection])}
              showSelectionPreview={true}
              moveRangeOnFirstSelection={false}
              months={2}
              ranges={date}
              direction="horizontal"
              className="border-0"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Input
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any notes for the booking"
        />
      </div>

      <Button onClick={handleBookNow} disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Submitting..." : "Book Now"}
      </Button>
    </div>
  );
};

export default BookingForm;
