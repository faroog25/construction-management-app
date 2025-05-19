
import React, { useState, useEffect } from 'react';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { format } from 'date-fns';
import { DateRange } from 'react-date-range';
import { addDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CalendarDays, Loader2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { reserveEquipment } from '@/services/equipmentAssignmentService';
import { useToast } from '@/hooks/use-toast';
import { EquipmentItem } from '@/types/equipment';
import { getAllProjectNames, ProjectNameResponse } from '@/services/projectService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BookingFormProps {
  selectedEquipment: EquipmentItem | null;
  onBookingSubmit: (booking: any) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ selectedEquipment, onBookingSubmit }) => {
  const [projectId, setProjectId] = useState('');
  const [projectName, setProjectName] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [formattedEndDate, setFormattedEndDate] = useState('');
  const [duration, setDuration] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projects, setProjects] = useState<ProjectNameResponse[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
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
      setEndDate(date[0].endDate);
      
      const formattedEndDate = format(date[0].endDate, 'yyyy-MM-dd');
      setFormattedEndDate(formattedEndDate);
      
      const timeDiff = date[0].endDate.getTime() - date[0].startDate.getTime();
      const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      setDuration(dayDiff);
    }
  }, [date]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoadingProjects(true);
      const projectsList = await getAllProjectNames();
      setProjects(projectsList);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast({
        title: "Error",
        description: "Failed to load projects. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const handleProjectChange = (value: string) => {
    const selectedProjectId = value;
    setProjectId(selectedProjectId);
    
    // Find the project name based on the selected ID
    const selectedProject = projects.find(project => project.id.toString() === selectedProjectId);
    if (selectedProject) {
      setProjectName(selectedProject.name);
    }
  };

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
        description: "Please select a project for this booking.",
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
      
      // Format dates for the API request
      const formattedStartDate = format(startDate, 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\'');
      const formattedEndDate = format(endDate, 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\'');
      
      // Book the equipment using the new API
      const response = await reserveEquipment({
        equipmentId: Number(selectedEquipment.id),
        projectId: parseInt(projectId),
        startDate: formattedStartDate,
        endDate: formattedEndDate
      });

      if (response.success) {
        toast({
          title: "Booking Request Sent",
          description: `Your booking request for ${selectedEquipment.name} has been sent.`,
          variant: "default",
        });

        // Prepare booking details for local submission
        const bookingDetails = {
          equipmentId: selectedEquipment.id,
          equipmentName: selectedEquipment.name,
          category: selectedEquipment.category,
          projectId: parseInt(projectId),
          projectName: projectName,
          startDate: format(startDate, 'yyyy-MM-dd'),
          endDate: format(endDate, 'yyyy-MM-dd'),
          duration: duration,
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
      <div className="space-y-2">
        <Label htmlFor="project">Project</Label>
        {isLoadingProjects ? (
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">Loading projects...</span>
          </div>
        ) : (
          <Select value={projectId} onValueChange={handleProjectChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id.toString()}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="space-y-2">
        <Label>Booking Dates</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
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

      <Button onClick={handleBookNow} disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Submitting..." : "Book Now"}
      </Button>
    </div>
  );
};

export default BookingForm;
