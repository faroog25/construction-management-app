import { useEffect, useState } from 'react';
import { SiteEngineer, getAllEngineers } from '../services/engineerService';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Skeleton } from './ui/skeleton';
import { Alert, AlertDescription } from './ui/alert';
import { ErrorBoundary } from './ErrorBoundary';
import { Button } from './ui/button';
import { CheckCircle2, XCircle, Search, Plus, HardHat, ArrowUpDown } from 'lucide-react';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { NewSiteEngineerModal } from './NewSiteEngineerModal';
import { deleteSiteEngineer } from '../services/siteEngineerService';

// Define BaseEngineer interface to fix type issues
export interface BaseEngineer {
  id: number;
  fullName: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  isAvailable?: boolean;
}

export function SiteEngineers() {
  const [engineers, setEngineers] = useState<BaseEngineer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isNewEngineerModalOpen, setIsNewEngineerModalOpen] = useState(false);
  const [isEditEngineerModalOpen, setIsEditEngineerModalOpen] = useState(false);
  const [selectedEngineer, setSelectedEngineer] = useState<BaseEngineer | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchEngineers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllEngineers();

      if (!Array.isArray(data)) {
        throw new Error('Invalid data structure received from API');
      }

      const validEngineers = data.filter(engineer => {
        return (
          engineer &&
          typeof engineer === 'object' &&
          'id' in engineer &&
          'fullName' in engineer &&
          'phoneNumber' in engineer &&
          'email' in engineer &&
          'address' in engineer &&
          'isAvailable' in engineer
        );
      });

      setEngineers(validEngineers);
    } catch (err) {
      console.error('Error fetching engineers:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch engineers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEngineers();
  }, []);

  const handleSort = (column: string) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const filteredEngineers = engineers.filter(engineer => 
    engineer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    engineer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    engineer.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedEngineers = [...filteredEngineers].sort((a, b) => {
    const direction = sortDirection === 'asc' ? 1 : -1;
    
    switch (sortColumn) {
      case 'name':
        return direction * a.fullName.localeCompare(b.fullName);
      case 'phone':
        return direction * a.phoneNumber.localeCompare(b.phoneNumber);
      case 'email':
        return direction * (a.email || '').localeCompare(b.email || '');
      case 'address':
        return direction * (a.address || '').localeCompare(b.address || '');
      case 'status':
        return direction * (a.isAvailable === b.isAvailable ? 0 : a.isAvailable ? -1 : 1);
      default:
        return 0;
    }
  });

  const handleDeleteEngineer = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this engineer?')) {
      try {
        await deleteSiteEngineer(id);
        toast.success('Engineer deleted successfully');
        fetchEngineers();
      } catch (error) {
        console.error('Error deleting engineer:', error);
        toast.error('Failed to delete engineer');
      }
    }
  };

  const handleEditEngineer = (engineer: BaseEngineer) => {
    setSelectedEngineer(engineer);
    setIsEditEngineerModalOpen(true);
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl flex items-center gap-2">
          <HardHat className="h-5 w-5 text-primary" />
          Site Engineers
        </CardTitle>
        
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search engineers..." 
              className="pl-9 h-9 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button size="sm" onClick={() => setIsNewEngineerModalOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort('name')} className="cursor-pointer">
                <div className="flex items-center">
                  Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead onClick={() => handleSort('phone')} className="cursor-pointer">
                <div className="flex items-center">
                  Phone
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead onClick={() => handleSort('email')} className="cursor-pointer">
                <div className="flex items-center">
                  Email
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead onClick={() => handleSort('address')} className="cursor-pointer">
                <div className="flex items-center">
                  Address
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead onClick={() => handleSort('status')} className="cursor-pointer">
                <div className="flex items-center">
                  Status
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell>
                    <Skeleton className="h-4 w-[150px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[120px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[180px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[150px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[80px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-[100px] ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : sortedEngineers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {searchQuery ? 
                    <div className="flex flex-col items-center justify-center p-4">
                      <Search className="h-8 w-8 opacity-30 mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        No engineers found matching "{searchQuery}"
                      </p>
                      <Button variant="ghost" size="sm" onClick={() => setSearchQuery('')}>Clear search</Button>
                    </div>
                    : 
                    <div className="flex flex-col items-center justify-center p-4">
                      <HardHat className="h-8 w-8 opacity-30 mb-2" />
                      <p className="text-sm text-muted-foreground mb-3">
                        No site engineers found
                      </p>
                      <Button size="sm" onClick={() => setIsNewEngineerModalOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add your first site engineer
                      </Button>
                    </div>
                  }
                </TableCell>
              </TableRow>
            ) : (
              sortedEngineers.map((engineer) => (
                <TableRow key={engineer.id}>
                  <TableCell>
                    {engineer.fullName}
                  </TableCell>
                  <TableCell>{engineer.phoneNumber}</TableCell>
                  <TableCell>{engineer.email || '-'}</TableCell>
                  <TableCell>{engineer.address || '-'}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {engineer.isAvailable ? (
                        <div className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mr-1.5" />
                          <span className="text-green-600 text-sm">
                            Available
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <XCircle className="h-4 w-4 text-red-600 mr-1.5" />
                          <span className="text-red-600 text-sm">
                            Unavailable
                          </span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditEngineer(engineer)}
                      >
                        <ArrowUpDown className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteEngineer(engineer.id)}
                      >
                        <ArrowUpDown className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <NewSiteEngineerModal
      isOpen={isNewEngineerModalOpen}
      onOpenChange={setIsNewEngineerModalOpen}
      onEngineerCreated={fetchEngineers}
    />

    {isEditEngineerModalOpen && selectedEngineer && (
      <NewSiteEngineerModal
        isOpen={isEditEngineerModalOpen}
        onOpenChange={setIsEditEngineerModalOpen}
        onEngineerCreated={fetchEngineers}
      />
    )}
  );
}
