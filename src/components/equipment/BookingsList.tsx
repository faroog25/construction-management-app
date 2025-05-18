
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { format, parseISO } from 'date-fns';
import { FileText, Calendar, Clock, Info, Filter, CalendarDays, Check, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAllEquipmentAssignments, ProjectEquipment } from '@/services/equipmentAssignmentService';
import { Loader2 } from 'lucide-react';

const BookingsList: React.FC = () => {
  const [selectedBooking, setSelectedBooking] = useState<ProjectEquipment | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: bookings, isLoading, error, refetch } = useQuery({
    queryKey: ['equipmentAssignments'],
    queryFn: getAllEquipmentAssignments,
  });

  const handleViewDetails = (booking: ProjectEquipment) => {
    setSelectedBooking(booking);
  };

  const handleCloseDialog = () => {
    setSelectedBooking(null);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const filteredBookings = bookings?.filter(booking => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'returned') return booking.actualReturnDate !== null;
    if (statusFilter === 'not-returned') return booking.actualReturnDate === null;
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
                <SelectItem value="returned">Returned</SelectItem>
                <SelectItem value="not-returned">Not Returned</SelectItem>
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
                    <TableHead>Reservation Date</TableHead>
                    <TableHead>Expected Return</TableHead>
                    <TableHead>Actual Return</TableHead>
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
                      <TableCell>{formatDate(booking.bookDate)}</TableCell>
                      <TableCell>{formatDate(booking.expectedReturnDate)}</TableCell>
                      <TableCell>
                        {booking.actualReturnDate ? formatDate(booking.actualReturnDate) : "Not returned yet"}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={booking.actualReturnDate ? 'default' : 'outline'}
                          className={booking.actualReturnDate ? 'bg-green-500' : 'bg-blue-500'}
                        >
                          <div className="flex items-center gap-1">
                            {booking.actualReturnDate ? (
                              <>
                                <Check className="h-3 w-3" />
                                <span>Returned</span>
                              </>
                            ) : (
                              <>
                                <X className="h-3 w-3" />
                                <span>Not Returned</span>
                              </>
                            )}
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewDetails(booking)}
                        >
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

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
                  <Badge 
                    variant={selectedBooking.actualReturnDate ? 'default' : 'outline'}
                    className={selectedBooking.actualReturnDate ? 'bg-green-500' : 'bg-blue-500'}
                  >
                    <div className="flex items-center gap-1">
                      {selectedBooking.actualReturnDate ? (
                        <>
                          <Check className="h-3 w-3" />
                          <span>Returned</span>
                        </>
                      ) : (
                        <>
                          <X className="h-3 w-3" />
                          <span>Not Returned</span>
                        </>
                      )}
                    </div>
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Book Date</p>
                    <p className="text-sm text-muted-foreground">{formatDate(selectedBooking.bookDate)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Expected Return Date</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(selectedBooking.expectedReturnDate)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Actual Return Date</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedBooking.actualReturnDate ? formatDate(selectedBooking.actualReturnDate) : 'Not returned yet'}
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
              <Button onClick={handleCloseDialog}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default BookingsList;
