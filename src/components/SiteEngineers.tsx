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
  const [sortDirection, setSortDirection<'asc' | 'desc'>('asc');
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
    
      
        
          
            
              <HardHat className="h-5 w-5 text-primary" />
              Site Engineers
            
          
          
            
              
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search engineers..." 
                  className="pl-9 h-9 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              
            
            
              <Plus className="h-4 w-4" />
              Add
            
          
        
        
          
            
              
                
                  
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  
                
                
                  
                    Phone
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  
                
                
                  
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  
                
                
                  
                    Address
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  
                
                
                  
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  
                
                Actions
              
            
            
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  
                    
                      <Skeleton className="h-4 w-[150px]" />
                    
                    
                      <Skeleton className="h-4 w-[120px]" />
                    
                    
                      <Skeleton className="h-4 w-[180px]" />
                    
                    
                      <Skeleton className="h-4 w-[150px]" />
                    
                    
                      <Skeleton className="h-4 w-[80px]" />
                    
                    
                      <Skeleton className="h-8 w-[100px] ml-auto" />
                    
                  
                ))
              ) : sortedEngineers.length === 0 ? (
                
                  
                    {searchQuery ? 
                      
                        
                          <Search className="h-8 w-8 opacity-30" />
                          
                            No engineers found matching "{searchQuery}"
                          
                          Clear search
                        
                      
                      : 
                      
                        
                          <HardHat className="h-8 w-8 opacity-30" />
                          
                            No site engineers found
                          
                          
                            
                              <Plus className="mr-2 h-4 w-4" />
                              Add your first site engineer
                            
                          
                        
                      
                    }
                  
                
              ) : (
                sortedEngineers.map((engineer) => (
                  
                    
                      {engineer.fullName}
                    
                    {engineer.phoneNumber}
                    {engineer.email || '-'}
                    {engineer.address || '-'}
                    
                      
                        {engineer.isAvailable ? (
                          
                            
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              
                                Available
                              
                            
                          
                        ) : (
                          
                            
                              <XCircle className="h-4 w-4 text-red-600" />
                              
                                Unavailable
                              
                            
                          
                        )}
                      
                    
                    
                      
                        
                          
                            
                              <ArrowUpDown className="h-3 w-3 mr-1" />
                              Edit
                            
                          
                          
                            
                              <ArrowUpDown className="h-3 w-3 mr-1" />
                              Delete
                            
                          
                        
                      
                    
                  
                ))
              )}
            
          
        
      

      
        isOpen={isNewEngineerModalOpen}
        onOpenChange={setIsNewEngineerModalOpen}
        onEngineerCreated={fetchEngineers}
      
      {isEditEngineerModalOpen && selectedEngineer && (
        <NewSiteEngineerModal
          isOpen={isEditEngineerModalOpen}
          onOpenChange={setIsEditEngineerModalOpen}
          onEngineerCreated={fetchEngineers}
        />
      )}
    
  );
}
