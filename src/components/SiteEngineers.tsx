
import { useEffect, useState } from 'react';
import { SiteEngineer, getSiteEngineers } from '../services/siteEngineerService';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Skeleton } from './ui/skeleton';
import { Alert, AlertDescription } from './ui/alert';
import { ErrorBoundary } from './ErrorBoundary';
import { Button } from './ui/button';
import { CheckCircle2, XCircle, Search, Plus, UserCog, Pencil, Trash2 } from 'lucide-react';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { NewSiteEngineerModal } from './NewSiteEngineerModal';
import { EditSiteEngineerModal } from './EditSiteEngineerModal';
import { deleteSiteEngineer } from '../services/siteEngineerService';

export function SiteEngineers() {
  const [engineers, setEngineers] = useState<SiteEngineer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewEngineerModalOpen, setIsNewEngineerModalOpen] = useState(false);
  const [isEditEngineerModalOpen, setIsEditEngineerModalOpen] = useState(false);
  const [selectedEngineer, setSelectedEngineer] = useState<SiteEngineer | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchEngineers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getSiteEngineers(currentPage, 10);

      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch site engineers');
      }

      setEngineers(response.data.items || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      console.error('Error fetching site engineers:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch site engineers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEngineers();
  }, [currentPage]);

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

  const handleEditEngineer = (engineer: SiteEngineer) => {
    setSelectedEngineer(engineer);
    setIsEditEngineerModalOpen(true);
  };

  // Filter engineers based on search query
  const filteredEngineers = engineers.filter(engineer => 
    engineer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (engineer.email && engineer.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    engineer.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (engineer.address && engineer.address.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
            <UserCog className="h-5 w-5 text-primary" />
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
                <TableHead className="font-medium">Name</TableHead>
                <TableHead className="font-medium">Phone</TableHead>
                <TableHead className="font-medium">Email</TableHead>
                <TableHead className="font-medium">Address</TableHead>
                <TableHead className="font-medium">Status</TableHead>
                <TableHead className="font-medium text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                // Loading skeleton rows
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
              ) : filteredEngineers.length === 0 ? (
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
                        <UserCog className="h-8 w-8 opacity-30" />
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
                filteredEngineers.map((engineer) => (
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
                          <Pencil className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="xs"
                          onClick={() => handleDeleteEngineer(engineer.id)}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
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
