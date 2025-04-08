
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { EquipmentItem } from '@/types/equipment';
import { mockEquipment } from '@/data/mockEquipment';

interface EquipmentListProps {
  onSelectEquipment: (equipment: EquipmentItem) => void;
}

const EquipmentList: React.FC<EquipmentListProps> = ({ onSelectEquipment }) => {
  const [equipment] = useState<EquipmentItem[]>(mockEquipment);
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
    <Card className="shadow-md">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search equipment..."
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
          </div>
        </div>

        <div className="overflow-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  Name
                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('category')}
                >
                  Category
                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('dailyRate')}
                >
                  Daily Rate
                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  Status
                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEquipment.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No equipment found. Try adjusting your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredEquipment.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.name}
                      {item.featured && (
                        <Badge variant="secondary" className="ml-2">Featured</Badge>
                      )}
                    </TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>${item.dailyRate.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={item.status === 'Available' ? 'default' : 'destructive'}
                        className={item.status === 'Available' ? 'bg-green-500' : ''}
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        disabled={item.status !== 'Available'}
                        onClick={() => onSelectEquipment(item)}
                      >
                        Book Now
                      </Button>
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
