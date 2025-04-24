
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, ArrowUpDown, Wrench, RotateCcw, Box, Tag } from 'lucide-react';
import { EquipmentItem } from '@/types/equipment';
import { mockEquipment } from '@/data/mockEquipment';

interface EquipmentListProps {
  onSelectEquipment: (equipment: EquipmentItem) => void;
}

const EquipmentList: React.FC<EquipmentListProps> = ({ onSelectEquipment }) => {
  const [equipment, setEquipment] = useState<EquipmentItem[]>(mockEquipment);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof EquipmentItem>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: keyof EquipmentItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleMakeAvailable = (id: string) => {
    setEquipment(equipment.map(item => 
      item.id === id ? { ...item, status: 'Available' } : item
    ));
  };

  const handleRestore = (id: string) => {
    setEquipment(equipment.map(item => 
      item.id === id ? { ...item, status: 'Available' } : item
    ));
  };

  const sortedEquipment = [...equipment].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredEquipment = sortedEquipment.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="shadow-lg border-muted">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
          <Box className="h-6 w-6" />
          Available Equipment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search equipment by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Tag className="h-4 w-4" />
              Categories
            </Button>
          </div>
        </div>

        <div className="overflow-auto rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead 
                  className="cursor-pointer font-semibold"
                  onClick={() => handleSort('name')}
                >
                  Equipment Name
                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead 
                  className="cursor-pointer font-semibold"
                  onClick={() => handleSort('category')}
                >
                  Category
                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead 
                  className="cursor-pointer font-semibold"
                  onClick={() => handleSort('status')}
                >
                  Status
                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEquipment.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No equipment found. Try adjusting your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredEquipment.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">
                      {item.name}
                      {item.featured && (
                        <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary hover:bg-primary/20">
                          Featured
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={item.status === 'Available' ? 'default' : 'destructive'}
                        className={item.status === 'Available' ? 'bg-green-500 hover:bg-green-600' : ''}
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {item.status === 'Maintenance' ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleMakeAvailable(item.id)}
                            className="gap-1 hover:bg-green-50"
                          >
                            <Wrench className="h-4 w-4" />
                            Mark Available
                          </Button>
                        ) : item.status === 'In Use' ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleRestore(item.id)}
                            className="gap-1 hover:bg-blue-50"
                          >
                            <RotateCcw className="h-4 w-4" />
                            Return
                          </Button>
                        ) : (
                          <Button 
                            variant="default"
                            size="sm"
                            disabled={item.status !== 'Available'}
                            onClick={() => onSelectEquipment(item)}
                            className="bg-primary hover:bg-primary/90"
                          >
                            Book Now
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default EquipmentList;
