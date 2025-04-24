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

interface BaseEngineer {
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
    <ErrorBoundary>
      <Card className="border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between bg-muted/10 pb-2">
          <CardTitle className="flex items-center gap-2 text-xl">
            <HardHat className="h-5 w-5 text-primary" />
            Site Engineers
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search engineers..." 
                className="pl-9 h-9 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button size="sm" className="gap-1" onClick={() => setIsNewEngineerModalOpen(true)}>
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead 
                  className="font-medium cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="font-medium cursor-pointer"
                  onClick={() => handleSort('phone')}
                >
                  <div className="flex items-center">
                    Phone
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="font-medium cursor-pointer"
                  onClick={() => handleSort('email')}
                >
                  <div className="flex items-center">
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="font-medium cursor-pointer"
                  onClick={() => handleSort('address')}
                >
                  <div className="flex items-center">
                    Address
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="font-medium cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center">
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="font-medium text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[180px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-[100px] ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : sortedEngineers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-32">
                    {searchQuery ? 
                      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <Search className="h-8 w-8 opacity-30" />
                        <p>No engineers found matching "{searchQuery}"</p>
                        <Button variant="link" onClick={() => setSearchQuery('')}>Clear search</Button>
                      </div>
                      : 
                      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <HardHat className="h-8 w-8 opacity-30" />
                        <p>No site engineers found</p>
                        <Button variant="outline" size="sm" onClick={() => setIsNewEngineerModalOpen(true)}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add your first site engineer
                        </Button>
                      </div>
                    }
                  </TableCell>
                </TableRow>
              ) : (
                sortedEngineers.map((engineer) => (
                  <TableRow key={engineer.id} className="group">
                    <TableCell className="font-medium">{engineer.fullName}</TableCell>
                    <TableCell>{engineer.phoneNumber}</TableCell>
                    <TableCell>{engineer.email || '-'}</TableCell>
                    <TableCell>{engineer.address || '-'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {engineer.isAvailable ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <span className="text-green-700 text-sm font-medium">Available</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 text-red-600" />
                            <span className="text-red-700 text-sm font-medium">Unavailable</span>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="outline" 
                          size="xs" 
                          onClick={() => handleEditEngineer(engineer)}
                        >
                          <ArrowUpDown className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="xs"
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

      <EditSiteEngineerModal
        isOpen={isEditEngineerModalOpen}
        onOpenChange={setIsEditEngineerModalOpen}
        onEngineerUpdated={fetchEngineers}
        engineer={selectedEngineer}
      />
    </ErrorBoundary>
  );
}
