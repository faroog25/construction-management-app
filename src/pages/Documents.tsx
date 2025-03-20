import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  Plus, 
  Search, 
  File, 
  FileText, 
  FileImage, 
  FileArchive,
  MoreVertical,
  Download,
  Eye,
  Share,
  Clock,
  Calendar,
  User
} from 'lucide-react';

interface Document {
  id: number;
  name: string;
  type: string;
  size: string;
  project: string;
  dateModified: string;
  owner: string;
  status: 'approved' | 'pending' | 'rejected' | 'draft';
}

const DOCUMENTS: Document[] = [
  {
    id: 1,
    name: 'West Heights Foundation Plan',
    type: 'pdf',
    size: '4.2 MB',
    project: 'West Heights Tower',
    dateModified: 'Aug 15, 2023',
    owner: 'Emma Johnson',
    status: 'approved',
  },
  {
    id: 2,
    name: 'Riverside Complex Elevations',
    type: 'image',
    size: '8.5 MB',
    project: 'Riverside Office Complex',
    dateModified: 'Aug 10, 2023',
    owner: 'Daniel Smith',
    status: 'approved',
  },
  {
    id: 3,
    name: 'Heritage Park Materials List',
    type: 'doc',
    size: '1.8 MB',
    project: 'Heritage Park Renovation',
    dateModified: 'Aug 5, 2023',
    owner: 'Olivia Wilson',
    status: 'pending',
  },
  {
    id: 4,
    name: 'Parkview Electrical Schematics',
    type: 'pdf',
    size: '12.3 MB',
    project: 'Parkview Residential Complex',
    dateModified: 'Aug 3, 2023',
    owner: 'William Brown',
    status: 'approved',
  },
  {
    id: 5,
    name: 'Central Station Demolition Plan',
    type: 'pdf',
    size: '6.7 MB',
    project: 'Central Station Remodel',
    dateModified: 'Jul 28, 2023',
    owner: 'Sophia Miller',
    status: 'rejected',
  },
  {
    id: 6,
    name: 'Oakwood Center 3D Model',
    type: 'archive',
    size: '45.2 MB',
    project: 'Oakwood Community Center',
    dateModified: 'Jul 25, 2023',
    owner: 'James Davis',
    status: 'approved',
  },
  {
    id: 7,
    name: 'Harbor View Hotel Finishes',
    type: 'doc',
    size: '2.4 MB',
    project: 'Harbor View Hotel',
    dateModified: 'Jul 22, 2023',
    owner: 'Ava Garcia',
    status: 'draft',
  },
  {
    id: 8,
    name: 'Greenfield Mall Floor Plans',
    type: 'pdf',
    size: '9.1 MB',
    project: 'Greenfield Shopping Mall',
    dateModified: 'Jul 20, 2023',
    owner: 'Noah Martinez',
    status: 'approved',
  },
];

const getDocumentIcon = (type: string) => {
  switch (type) {
    case 'pdf': return <File className="h-10 w-10 text-red-500" />;
    case 'doc': return <FileText className="h-10 w-10 text-blue-500" />;
    case 'image': return <FileImage className="h-10 w-10 text-green-500" />;
    case 'archive': return <FileArchive className="h-10 w-10 text-amber-500" />;
    default: return <File className="h-10 w-10 text-gray-500" />;
  }
};

const getStatusBadge = (status: Document['status']) => {
  switch (status) {
    case 'approved':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>;
    case 'pending':
      return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Pending</Badge>;
    case 'rejected':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
    case 'draft':
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Draft</Badge>;
    default:
      return null;
  }
};

const Documents = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-16"></div> {/* Navbar spacer */}
      <main className="flex-1 container mx-auto px-4 py-8 animate-in">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
            <p className="text-muted-foreground mt-1">Manage all your project documents in one place</p>
          </div>
          <div className="mt-4 lg:mt-0">
            <Button className="rounded-lg">
              <Plus className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </div>
        </div>
        
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Documents</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
          </TabsList>
          
          {['all', 'approved', 'pending', 'draft', 'rejected'].map((tabValue) => (
            <TabsContent key={tabValue} value={tabValue} className="space-y-4">
              <div className="grid gap-4">
                {DOCUMENTS
                  .filter(doc => tabValue === 'all' || doc.status === tabValue)
                  .filter(doc => 
                    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    doc.project.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((doc) => (
                    <Card 
                      key={doc.id} 
                      className="animate-in transition-all hover:shadow-md overflow-hidden"
                    >
                      <CardContent className="p-0">
                        <div className="flex flex-col sm:flex-row">
                          <div className="p-6 flex items-center justify-center bg-muted/30">
                            {getDocumentIcon(doc.type)}
                          </div>
                          <div className="p-6 flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="space-y-2">
                              <h3 className="font-medium text-balance">{doc.name}</h3>
                              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3.5 w-3.5" />
                                  <span>{doc.dateModified}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <User className="h-3.5 w-3.5" />
                                  <span>{doc.owner}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3.5 w-3.5" />
                                  <span>{doc.size}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {getStatusBadge(doc.status)}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem className="flex items-center">
                                    <Eye className="mr-2 h-4 w-4" />
                                    <span>View</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="flex items-center">
                                    <Download className="mr-2 h-4 w-4" />
                                    <span>Download</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="flex items-center">
                                    <Share className="mr-2 h-4 w-4" />
                                    <span>Share</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
              {DOCUMENTS.filter(doc => tabValue === 'all' || doc.status === tabValue).length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No documents found</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
};

export default Documents;
