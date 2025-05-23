
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { format, parseISO } from 'date-fns';
import { FileText, Calendar, Clock, Info, Filter, CalendarDays, Check, X, AlertCircle, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  getAllEquipmentReservations, 
  EquipmentReservation, 
  ReservationStatus, 
  cancelReservation 
} from '@/services/equipmentAssignmentService';
import { useToast } from '@/hooks/use-toast';
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

const BookingsList: React.FC = () => {
  const [selectedBooking, setSelectedBooking] = useState<EquipmentReservation | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<EquipmentReservation | null>(null);
  const { toast } = useToast();

  const { data: bookings, isLoading, error, refetch } = useQuery({
    queryKey: ['equipmentReservations'],
    queryFn: getAllEquipmentReservations,
  });

  const handleViewDetails = (booking: EquipmentReservation) => {
    setSelectedBooking(booking);
  };

  const handleCloseDialog = () => {
    setSelectedBooking(null);
  };

  const openCancelDialog = (booking: EquipmentReservation, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookingToCancel(booking);
    setCancelDialogOpen(true);
  };

  const handleCancelReservation = async () => {
    if (!bookingToCancel) return;
    
    try {
      setIsCancelling(true);
      await cancelReservation(bookingToCancel.id);
      
      toast({
        title: "Reservation Cancelled",
        description: `The booking for ${bookingToCancel.equipmentName} has been successfully cancelled.`,
        variant: "default",
      });
      
      // Close the dialog and refresh bookings list
      setCancelDialogOpen(false);
      setBookingToCancel(null);
      refetch();
    } catch (error) {
      console.error('Failed to cancel reservation:', error);
      toast({
        title: "Cancellation Failed",
        description: error instanceof Error ? error.message : "Unable to cancel the reservation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getStatusBadge = (status: ReservationStatus) => {
    switch (status) {
      case ReservationStatus.NotStarted:
        return (
          <Badge variant="outline" className="bg-blue-500">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Not Started</span>
            </div>
          </Badge>
        );
      case ReservationStatus.Started:
        return (
          <Badge variant="outline" className="bg-amber-500">
            <div className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              <span>Started</span>
            </div>
          </Badge>
        );
      case ReservationStatus.Completed:
        return (
          <Badge variant="default" className="bg-green-500">
            <div className="flex items-center gap-1">
              <Check className="h-3 w-3" />
              <span>Completed</span>
            </div>
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <div className="flex items-center gap-1">
              <X className="h-3 w-3" />
              <span>Unknown</span>
            </div>
          </Badge>
        );
    }
  };

  const filteredBookings = bookings?.filter(booking => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'not-started') return booking.reservationStatus === ReservationStatus.NotStarted;
    if (statusFilter === 'in-progress') return booking.reservationStatus === ReservationStatus.Started;
    if (statusFilter === 'completed') return booking.reservationStatus === ReservationStatus.Completed;
    return true;
  });

  if (isLoading) {
    return (
      <Card className="shadow-lg border-muted">
        <CardContent className="pt-6">
          <div className="flex flex-col justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">جاري تحميل بيانات الحجوزات...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-lg border-muted">
        <CardContent className="pt-6">
          <div className="flex flex-col justify-center items-center py-12">
            <div className="flex items-center text-destructive mb-4">
              <X className="h-8 w-8 mr-2" />
              <p className="text-lg">فشل في تحميل بيانات الحجوزات</p>
            </div>
            <Button onClick={() => refetch()} variant="outline">
              إعادة المحاولة
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="shadow-lg border-muted">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
            <CalendarDays className="h-6 w-6" />
            Equipment Bookings
          </CardTitle>
          <CardDescription>
            View and manage all your equipment reservations in one place.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Bookings</SelectItem>
                <SelectItem value="not-started">Not Started</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredBookings && filteredBookings.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Bookings Found</h3>
              <p className="text-muted-foreground">
                {statusFilter === 'all' 
                  ? "You don't have any bookings yet." 
                  : `No ${statusFilter} bookings found.`}
              </p>
            </div>
          ) : (
            <div className="overflow-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipment</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings?.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">
                        {booking.equipmentName}
                      </TableCell>
                      <TableCell>{booking.projectName}</TableCell>
                      <TableCell>{formatDate(booking.startDate)}</TableCell>
                      <TableCell>{formatDate(booking.endDate)}</TableCell>
                      <TableCell>
                        {getStatusBadge(booking.reservationStatus)}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewDetails(booking)}
                        >
                          Details
                        </Button>
                        {(booking.reservationStatus === ReservationStatus.NotStarted || 
                         booking.reservationStatus === ReservationStatus.Started) && (
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={(e) => openCancelDialog(booking, e)}
                          >
                            Cancel
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Booking Details Dialog */}
      {selectedBooking && (
        <Dialog open={!!selectedBooking} onOpenChange={handleCloseDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
              <DialogDescription>
                Detailed information about your equipment booking.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="bg-muted/30 p-4 rounded-lg">
                <h3 className="font-medium text-lg mb-3">{selectedBooking.equipmentName}</h3>
                <div className="flex items-center gap-2 mt-2">
                  {getStatusBadge(selectedBooking.reservationStatus)}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Start Date</p>
                    <p className="text-sm text-muted-foreground">{formatDate(selectedBooking.startDate)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">End Date</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(selectedBooking.endDate)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Project</p>
                  <p className="text-sm text-muted-foreground">{selectedBooking.projectName}</p>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              {(selectedBooking.reservationStatus === ReservationStatus.NotStarted || 
                selectedBooking.reservationStatus === ReservationStatus.Started) && (
                <Button 
                  variant="destructive" 
                  onClick={(e) => {
                    handleCloseDialog();
                    openCancelDialog(selectedBooking, e as unknown as React.MouseEvent);
                  }}
                >
                  Cancel Reservation
                </Button>
              )}
              <Button onClick={handleCloseDialog}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Cancel Reservation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Reservation</AlertDialogTitle>
            <AlertDialogDescription>
              {bookingToCancel ? (
                <>
                  Are you sure you want to cancel the reservation for <span className="font-medium">{bookingToCancel.equipmentName}</span>?
                  This action cannot be undone.
                </>
              ) : (
                'Are you sure you want to cancel this reservation? This action cannot be undone.'
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCancelling}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleCancelReservation();
              }}
              disabled={isCancelling}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isCancelling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                'Yes, Cancel Reservation'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BookingsList;
