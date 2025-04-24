import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, addDays, differenceInDays } from 'date-fns';
import { CalendarIcon, Calculator, CheckCircle } from 'lucide-react';
import { EquipmentItem, Booking } from '@/types/equipment';
import { useToast } from '@/hooks/use-toast';

interface BookingFormProps {
  selectedEquipment: EquipmentItem | null;
  onBookingSubmit: (booking: Booking) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ selectedEquipment, onBookingSubmit }) => {
  const { toast } = useToast();
  const today = new Date();
  
  const [startDate, setStartDate] = useState<Date | undefined>(addDays(today, 1));
  const [endDate, setEndDate] = useState<Date | undefined>(addDays(today, 3));
  const [duration, setDuration] = useState<number>(2);
  const [projectName, setProjectName] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [totalCost, setTotalCost] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (startDate && endDate && selectedEquipment) {
      const days = differenceInDays(endDate, startDate) + 1;
      setDuration(days);
      setTotalCost(days * selectedEquipment.dailyRate);
    }
  }, [startDate, endDate, selectedEquipment]);

  const handleStartDateChange = (date: Date | undefined) => {
    if (date) {
      setStartDate(date);
      if (endDate && date >= endDate) {
        const newEndDate = addDays(date, 1);
        setEndDate(newEndDate);
      }
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    if (date && startDate && date >= startDate) {
      setEndDate(date);
      const days = differenceInDays(date, startDate) + 1;
      setDuration(days);
    }
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const days = parseInt(e.target.value, 10) || 1;
    setDuration(days);
    if (startDate) {
      setEndDate(addDays(startDate, days - 1));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEquipment || !startDate || !endDate || !projectName) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill out all required fields.",
      });
      return;
    }

    setIsSubmitting(true);

    const newBooking: Booking = {
      id: '',
      equipmentId: selectedEquipment.id,
      equipmentName: selectedEquipment.name,
      category: selectedEquipment.category,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      duration,
      dailyRate: selectedEquipment.dailyRate,
      totalCost,
      projectName,
      notes,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
    };

    setTimeout(() => {
      onBookingSubmit(newBooking);
      toast({
        title: "Booking Confirmed",
        description: `You have successfully booked ${selectedEquipment.name} for ${duration} days.`,
      });
      setIsSubmitting(false);
      // Reset form
      setProjectName('');
      setNotes('');
    }, 1000);
  };

  if (!selectedEquipment) {
    return (
      <Card className="shadow-md">
        <CardContent className="pt-6 text-center py-20">
          <h3 className="text-lg font-medium mb-2">No Equipment Selected</h3>
          <p className="text-muted-foreground mb-4">
            Please select an equipment from the equipment list tab first.
          </p>
          <Button variant="outline" onClick={() => window.history.back()}>
            Go Back to Equipment List
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Book Equipment</CardTitle>
        <CardDescription>
          Complete the form below to book the selected equipment for your project.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-muted/40 p-4 rounded-md mb-6 border">
            <h3 className="font-medium mb-2">Selected Equipment</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-muted-foreground text-sm">Equipment:</span>
                <p className="font-medium">{selectedEquipment.name}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-sm">Category:</span>
                <p>{selectedEquipment.category}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-sm">Status:</span>
                <p className="text-green-600">{selectedEquipment.status}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectName">Project Name</Label>
            <Input
              id="projectName"
              placeholder="Enter project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="start-date">Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={handleStartDateChange}
                  disabled={(date) => date < today}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration (Days)</Label>
            <Input
              id="duration"
              type="number"
              min="1"
              max="30"
              value={duration}
              onChange={handleDurationChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="end-date">End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={handleEndDateChange}
                  disabled={(date) => startDate ? date < startDate : date < today}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any special requirements or notes for this booking"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => window.history.back()}>
          Cancel
        </Button>
        <Button 
          disabled={isSubmitting || !projectName || !startDate || !endDate} 
          onClick={handleSubmit}
        >
          {isSubmitting ? "Processing..." : "Confirm Booking"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookingForm;
