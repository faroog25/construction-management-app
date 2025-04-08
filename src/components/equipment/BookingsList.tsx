
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { format, parseISO } from 'date-fns';
import { FileText, Calendar, Clock, DollarSign, Info } from 'lucide-react';
import { Booking } from '@/types/equipment';

interface BookingsListProps {
  bookings: Booking[];
}

const BookingsList: React.FC<BookingsListProps> = ({ bookings }) => {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
  };

  const handleCloseDialog = () => {
    setSelectedBooking(null);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>My Equipment Bookings</CardTitle>
          <CardDescription>
            View all your equipment bookings and their details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Bookings Yet</h3>
              <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                You don't have any equipment bookings yet. Go to the equipment list to book your first equipment.
              </p>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/equipment?tab=equipment'}
              >
                Browse Equipment
              </Button>
            </div>
          ) : (
            <div className="overflow-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipment</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Total Cost</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">
                        {booking.equipmentName}
                        <div className="text-xs text-muted-foreground mt-1">{booking.category}</div>
                      </TableCell>
                      <TableCell>{booking.projectName}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{booking.duration} days</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>${booking.totalCost.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={booking.status === 'Confirmed' ? 'success' : 'outline'}
                          className={booking.status === 'Confirmed' ? 'bg-green-500' : ''}
                        >
                          {booking.status}
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
                <p className="text-sm text-muted-foreground mb-2">Category: {selectedBooking.category}</p>
                <p className="text-sm text-muted-foreground">Status: {selectedBooking.status}</p>
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
                    <p className="text-sm text-muted-foreground">{formatDate(selectedBooking.endDate)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Duration</p>
                    <p className="text-sm text-muted-foreground">{selectedBooking.duration} days</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <DollarSign className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Daily Rate</p>
                    <p className="text-sm text-muted-foreground">${selectedBooking.dailyRate.toFixed(2)}</p>
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
              
              {selectedBooking.notes && (
                <div className="bg-muted/30 p-3 rounded-md">
                  <p className="text-sm font-medium mb-1">Notes</p>
                  <p className="text-sm text-muted-foreground">{selectedBooking.notes}</p>
                </div>
              )}
              
              <div className="bg-muted/50 p-4 rounded-md border">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Cost</span>
                  <span className="text-lg font-bold">${selectedBooking.totalCost.toFixed(2)}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  ${selectedBooking.dailyRate.toFixed(2)} × {selectedBooking.duration} days
                </p>
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
