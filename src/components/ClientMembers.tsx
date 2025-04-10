
import { useEffect, useState } from 'react';
import { getClients } from '../services/clientService';
import { Client, ClientType } from '@/types/client';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Skeleton } from './ui/skeleton';
import { Alert, AlertDescription } from './ui/alert';
import { ErrorBoundary } from './ErrorBoundary';
import { Button } from './ui/button';
import { Plus, Search, Building2, User, Users } from 'lucide-react';
import { toast } from 'sonner';
import { NewClientModal } from './NewClientModal';
import { Input } from './ui/input';

const getClientTypeLabel = (type: ClientType): string => {
  switch (type) {
    case ClientType.Individual:
      return 'فرد';
    case ClientType.Company:
      return 'شركة';
    default:
      return 'غير معروف';
  }
};

export function ClientMembers() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getClients();

      // Validate the data structure
      if (!Array.isArray(data)) {
        throw new Error('Invalid data structure received from API');
      }

      // Validate each client object
      const validClients = data.filter(client => {
        return (
          client &&
          typeof client === 'object' &&
          'id' in client &&
          'fullName' in client &&
          'email' in client &&
          'phoneNumber' in client &&
          'clientType' in client
        );
      });

      setClients(validClients as Client[]);
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError(err instanceof Error ? err.message : 'فشل في جلب العملاء');
      toast.error('فشل في جلب العملاء');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Filter clients based on search query
  const filteredClients = clients.filter(client => 
    client.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase())
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
            <Users className="h-5 w-5 text-primary" />
            Client Members
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search clients..." 
                className="pl-9 h-9 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button size="sm" className="gap-1" onClick={() => setIsAddModalOpen(true)}>
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
                <TableHead className="font-medium">Email</TableHead>
                <TableHead className="font-medium">Phone</TableHead>
                <TableHead className="font-medium">Type</TableHead>
                <TableHead className="font-medium text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                // Loading skeleton rows
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-[100px] ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : filteredClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-32">
                    {searchQuery ? 
                      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <Search className="h-8 w-8 opacity-30" />
                        <p>No clients found matching "{searchQuery}"</p>
                        <Button variant="link" onClick={() => setSearchQuery('')}>Clear search</Button>
                      </div>
                      : 
                      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <Users className="h-8 w-8 opacity-30" />
                        <p>No client members found</p>
                        <Button variant="outline" size="sm" onClick={() => setIsAddModalOpen(true)}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add your first client
                        </Button>
                      </div>
                    }
                  </TableCell>
                </TableRow>
              ) : (
                filteredClients.map((client) => (
                  <TableRow key={client.id} className="group">
                    <TableCell className="font-medium">{client.fullName}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.phoneNumber}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {client.clientType === ClientType.Individual ? (
                          <User className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Building2 className="h-4 w-4 text-purple-600" />
                        )}
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {getClientTypeLabel(client.clientType)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="outline" size="xs">Edit</Button>
                        <Button variant="destructive" size="xs">Delete</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <NewClientModal
        isOpen={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onClientCreated={fetchClients}
      />
    </ErrorBoundary>
  );
}
