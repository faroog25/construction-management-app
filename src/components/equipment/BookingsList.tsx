
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Booking, cancelBooking } from '@/services/equipmentAssignmentService';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Check, Clock, AlertTriangle, Ban, Eye, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { EquipmentDetailsDialog } from './EquipmentDetailsDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface BookingsListProps {
  bookings: Booking[];
  onBookingUpdated: () => void;
  readOnly?: boolean;
}

export function BookingsList({ bookings, onBookingUpdated, readOnly = false }: BookingsListProps) {
  const [selectedEquipment, setSelectedEquipment] = useState<number | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const [isCanceling, setIsCanceling] = useState(false);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'yyyy-MM-dd');
  };

  const handleViewEquipment = (equipmentId: number) => {
    setSelectedEquipment(equipmentId);
    setIsDetailsOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">فعال</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">قيد الانتظار</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">مكتمل</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">ملغي</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleCancelBooking = (booking: Booking) => {
    setBookingToCancel(booking);
    setCancelDialogOpen(true);
  };

  const confirmCancelBooking = async () => {
    if (!bookingToCancel) return;
    
    setIsCanceling(true);
    try {
      const result = await cancelBooking(bookingToCancel.id);
      
      if (result.success) {
        toast.success('تم إلغاء الحجز بنجاح');
        onBookingUpdated();
      } else {
        toast.error(result.message || 'فشل في إلغاء الحجز');
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء إلغاء الحجز');
    } finally {
      setIsCanceling(false);
      setCancelDialogOpen(false);
    }
  };

  if (!bookings || bookings.length === 0) {
    return (
      <div className="text-center py-6">
        <p>لا توجد حجوزات للعرض</p>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>المعدة</TableHead>
              <TableHead>النوع</TableHead>
              <TableHead>تاريخ البداية</TableHead>
              <TableHead>تاريخ النهاية</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">{booking.equipmentName}</TableCell>
                <TableCell>{booking.equipmentType}</TableCell>
                <TableCell>{formatDate(booking.startDate)}</TableCell>
                <TableCell>{formatDate(booking.endDate)}</TableCell>
                <TableCell>{getStatusBadge(booking.status)}</TableCell>
                <TableCell>
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewEquipment(booking.equipmentId)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      عرض
                    </Button>
                    {!readOnly && booking.status.toLowerCase() === 'active' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleCancelBooking(booking)}
                      >
                        <Ban className="h-4 w-4 mr-1" />
                        إلغاء
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Equipment Details Dialog */}
      <EquipmentDetailsDialog
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        equipmentId={selectedEquipment || 0}
      />

      {/* Cancel Booking Dialog */}
      {!readOnly && (
        <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>تأكيد إلغاء الحجز</AlertDialogTitle>
              <AlertDialogDescription>
                هل أنت متأكد من رغبتك في إلغاء حجز {bookingToCancel?.equipmentName}؟ 
                هذا الإجراء لا يمكن التراجع عنه.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isCanceling}>إلغاء</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmCancelBooking}
                disabled={isCanceling}
                className="bg-red-500 hover:bg-red-600"
              >
                {isCanceling ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    جارٍ المعالجة...
                  </>
                ) : (
                  'تأكيد الإلغاء'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
