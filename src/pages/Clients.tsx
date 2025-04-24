import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, Search, SlidersHorizontal, ChevronDown, Loader2, X, Check } from 'lucide-react';
import { getClients, createClient, updateClient, deleteClient } from '@/services/clientService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Client as ClientType, ClientType as ClientTypeEnum } from '@/types/client';

interface LocalClient {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
}

const adaptToLocalClient = (client: ClientType): LocalClient => {
  return {
    id: parseInt(client.id),
    name: client.fullName || client.name || '',
    email: client.email || '',
    phone: client.phoneNumber || client.phone || '',
    address: client.address || '',
    notes: ''
  };
};

const adaptToApiClient = (client: LocalClient): Omit<ClientType, 'id'> => {
  return {
    fullName: client.name,
    email: client.email,
    phoneNumber: client.phone,
    clientType: ClientTypeEnum.Individual,
    name: client.name,
    phone: client.phone,
    address: client.address
  };
};

const ClientCard = ({ client, onDelete, onUpdate }: { client: LocalClient; onDelete: (id: number) => void; onUpdate: (client: LocalClient) => void }) => (
  <Card className="mb-4 p-4">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-lg font-semibold">{client.name}</h3>
        <p className="text-sm text-muted-foreground">{client.email}</p>
        <p className="text-sm text-muted-foreground">{client.phone}</p>
        <p className="text-sm text-muted-foreground">{client.address}</p>
        {client.notes && (
          <p className="text-sm text-muted-foreground mt-2">{client.notes}</p>
        )}
      </div>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onUpdate(client)}
        >
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(client.id)}
        >
          Delete
        </Button>
      </div>
    </div>
  </Card>
);

const Clients = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState<LocalClient | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const { data: clientsData = [], isLoading, isError } = useQuery({
    queryKey: ['clients'],
    queryFn: () => getClients(1, 10),
  });

  const clients: LocalClient[] = React.useMemo(() => {
    return clientsData.map(adaptToLocalClient);
  }, [clientsData]);

  const createClientMutation = useMutation({
    mutationFn: (clientData: Omit<LocalClient, 'id'>) => createClient(adaptToApiClient(clientData as LocalClient)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setIsModalOpen(false);
      setCurrentClient(null);
    },
  });

  const updateClientMutation = useMutation({
    mutationFn: (params: { id: number, data: Partial<Omit<LocalClient, 'id'>> }) => 
      updateClient(params.id.toString(), params.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setIsModalOpen(false);
      setCurrentClient(null);
      setIsEditing(false);
    },
  });

  const deleteClientMutation = useMutation({
    mutationFn: (id: number) => deleteClient(id.toString()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateClient = async (client: Omit<LocalClient, 'id'>) => {
    try {
      await createClientMutation.mutateAsync(client);
    } catch (error) {
      console.error('Error creating client:', error);
    }
  };

  const handleUpdateClient = async (client: Partial<Omit<LocalClient, 'id'>>) => {
    try {
      if (!currentClient) return;
      await updateClientMutation.mutateAsync({ id: currentClient.id, data: client });
    } catch (error) {
      console.error('Error updating client:', error);
    }
  };

  const handleDeleteClient = async (id: number) => {
    try {
      await deleteClientMutation.mutateAsync(id);
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (isEditing && currentClient) {
      handleUpdateClient({
        name: (form.elements.namedItem('name') as HTMLInputElement).value,
        email: (form.elements.namedItem('email') as HTMLInputElement).value,
        phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
        address: (form.elements.namedItem('address') as HTMLInputElement).value,
        notes: (form.elements.namedItem('notes') as HTMLTextAreaElement).value,
      });
    } else {
      handleCreateClient({
        name: (form.elements.namedItem('name') as HTMLInputElement).value,
        email: (form.elements.namedItem('email') as HTMLInputElement).value,
        phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
        address: (form.elements.namedItem('address') as HTMLInputElement).value,
        notes: (form.elements.namedItem('notes') as HTMLTextAreaElement).value,
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-16"></div>
      <main className="flex-1 container mx-auto px-4 py-8 animate-in">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
            <p className="text-muted-foreground mt-1">Manage your construction clients</p>
          </div>
          <div className="mt-4 lg:mt-0">
            <Button 
              className="rounded-lg"
              onClick={() => {
                setIsModalOpen(true);
                setIsEditing(false);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Client
            </Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search clients..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : isError ? (
          <div className="text-center text-red-500">
            Error loading clients
          </div>
        ) : (
          <div className="space-y-4">
            {filteredClients.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                onDelete={handleDeleteClient}
                onUpdate={(client) => {
                  setCurrentClient(client);
                  setIsModalOpen(true);
                  setIsEditing(true);
                }}
              />
            ))}
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{isEditing ? 'Edit Client' : 'New Client'}</h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setCurrentClient(null);
                    setIsEditing(false);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <Input
                    name="name"
                    defaultValue={currentClient?.name || ''}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input
                    name="email"
                    type="email"
                    defaultValue={currentClient?.email || ''}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <Input
                    name="phone"
                    defaultValue={currentClient?.phone || ''}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <Input
                    name="address"
                    defaultValue={currentClient?.address || ''}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Notes</label>
                  <textarea
                    name="notes"
                    defaultValue={currentClient?.notes || ''}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsModalOpen(false);
                      setCurrentClient(null);
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      createClientMutation.isPending ||
                      updateClientMutation.isPending
                    }
                  >
                    {createClientMutation.isPending || updateClientMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        {isEditing ? 'Update' : 'Create'}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Clients;
