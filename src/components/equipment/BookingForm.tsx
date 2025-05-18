
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { format, addDays, differenceInDays } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { EquipmentItem, Booking } from '@/types/equipment';
import { useToast } from '@/hooks/use-toast';
import { assignEquipment } from '@/services/equipmentAssignmentService';
import { getAllProjectNames, ProjectNameResponse } from '@/services/projectService';

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
  const [projectId, setProjectId] = useState<number | null>(null);
  const [projects, setProjects] = useState<ProjectNameResponse[]>([]);
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoadingProjects, setIsLoadingProjects] = useState<boolean>(false);

  const calculateDailyRate = (equipment: EquipmentItem | null): number => {
    if (!equipment) return 0;
    
    const baseRate = equipment.category === 'Heavy Equipment' ? 500 : 
                     equipment.category === 'Tools' ? 50 : 
                     equipment.category === 'Vehicles' ? 150 : 100;
    return baseRate;
  };

  // Load projects on component mount
  useEffect(() => {
    async function loadProjects() {
      setIsLoadingProjects(true);
      try {
        const projectsList = await getAllProjectNames();
        setProjects(projectsList);
      } catch (error) {
        console.error("Error loading projects:", error);
        toast({
          variant: "destructive",
          title: "خطأ في تحميل المشاريع",
          description: "فشل في تحميل قائمة المشاريع. يرجى المحاولة مرة أخرى.",
        });
      } finally {
        setIsLoadingProjects(false);
      }
    }
    
    loadProjects();
  }, [toast]);

  useEffect(() => {
    if (startDate && endDate) {
      const days = differenceInDays(endDate, startDate) + 1;
      setDuration(days);
    }
  }, [startDate, endDate]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEquipment || !endDate || !projectId) {
      toast({
        variant: "destructive",
        title: "معلومات ناقصة",
        description: "الرجاء ملء جميع الحقول المطلوبة.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create assignment request
      const assignmentRequest = {
        equipmentId: selectedEquipment.id,
        projectId: projectId,
        expectedReturnDate: endDate.toISOString()
      };

      // Send assignment request to API
      const result = await assignEquipment(assignmentRequest);

      // If successful, create booking for UI
      if (result.success) {
        const dailyRate = calculateDailyRate(selectedEquipment);
        const totalCost = dailyRate * duration;

        // Find project name from selected projectId
        const selectedProject = projects.find(p => p.id === projectId);
        
        const newBooking: Booking = {
          id: result.data?.id || Date.now().toString(), 
          equipmentId: selectedEquipment.id,
          equipmentName: selectedEquipment.name,
          category: selectedEquipment.category,
          startDate: startDate?.toISOString() || new Date().toISOString(),
          endDate: endDate.toISOString(),
          duration,
          projectName: selectedProject?.name || "مشروع",
          projectId: projectId,
          notes,
          status: 'Confirmed',
          createdAt: new Date().toISOString(),
          dailyRate,
          totalCost
        };

        onBookingSubmit(newBooking);
        
        toast({
          title: "تم تأكيد الحجز",
          description: `تم حجز ${selectedEquipment.name} بنجاح لمدة ${duration} أيام.`,
        });
        
        // Reset form
        setProjectId(null);
        setNotes('');
      } else {
        throw new Error(result.message || result.errors?.join(', ') || "فشل في حجز المعدات");
      }
    } catch (error) {
      console.error('Equipment booking error:', error);
      toast({
        variant: "destructive",
        title: "فشل في حجز المعدات",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء محاولة حجز المعدات",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedEquipment) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-muted/40 p-4 rounded-md border">
        <h3 className="font-medium mb-2">المعدات المحددة</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-muted-foreground text-sm">المعدات:</span>
            <p className="font-medium">{selectedEquipment.name}</p>
          </div>
          <div>
            <span className="text-muted-foreground text-sm">الفئة:</span>
            <p>{selectedEquipment.category}</p>
          </div>
          <div>
            <span className="text-muted-foreground text-sm">الحالة:</span>
            <p className="text-green-600">{selectedEquipment.status}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="project">المشروع</Label>
        {isLoadingProjects ? (
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>جاري تحميل المشاريع...</span>
          </div>
        ) : (
          <Select 
            onValueChange={(value) => setProjectId(Number(value))}
            value={projectId?.toString()}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="اختر مشروع" />
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start-date">تاريخ البداية</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : "حدد التاريخ"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
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
          <Label htmlFor="end-date">تاريخ الإرجاع المتوقع</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : "حدد التاريخ"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
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
          <Label htmlFor="duration">المدة (أيام)</Label>
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">ملاحظات (اختياري)</Label>
        <Textarea
          id="notes"
          placeholder="أي متطلبات خاصة أو ملاحظات لهذا الحجز"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isSubmitting || !projectId}>
          {isSubmitting ? "جاري المعالجة..." : "تأكيد الحجز"}
        </Button>
      </div>
    </form>
  );
};

export default BookingForm;
