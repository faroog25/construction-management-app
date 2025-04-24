import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
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
  Folder,
  FolderPlus,
  Upload,
  Filter,
  ArrowUpDown,
  Calendar,
  Edit,
  Trash,
  FilePlus,
  Clock,
  Settings,
  LinkIcon,
  CheckCircle2,
  Archive,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import DocumentsViewToggle from '@/components/documents/DocumentsViewToggle';
import DocumentCard from '@/components/documents/DocumentCard';
import { DocumentsFilter } from '@/components/documents/DocumentsFilter';

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
    case 'pdf': return <FileText className="h-10 w-10 text-red-500" />;
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

interface DocumentsProps {
  projectId?: number;
}

const Documents = ({ projectId }: DocumentsProps) => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<string>('dateModified');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterStatus, setFilterStatus] = useState<Document['status'] | 'all'>('all');
  const [filterType, setFilterType] = useState<string>('all');
  
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleUpload = () => {
    toast.info('Upload feature will be implemented soon');
  };

  const handleNewFolder = () => {
    toast.info('New folder feature will be implemented soon');
  };
  
  const handleNewDocument = () => {
    toast.info('New document feature will be implemented soon');
  };
  
  const handleDownload = (id: number) => {
    toast.success(`Document ${id} downloaded successfully`);
  };
  
  const handleView = (id: number) => {
    toast.info(`Viewing document ${id}`);
  };
  
  const handleShare = (id: number) => {
    toast.info(`Share options for document ${id}`);
  };
  
  const handleDelete = (id: number) => {
    toast.error(`Document ${id} deleted`);
  };
  
  const handleEdit = (id: number) => {
    toast.info(`Editing document ${id}`);
  };

  // Filter documents based on search query, selected filters, and projectId
  const filteredDocuments = DOCUMENTS.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         doc.project.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
    const matchesType = filterType === 'all' || doc.type === filterType;
    const matchesProject = !projectId || doc.project.toLowerCase().includes(projectId.toString());
    
    return matchesSearch && matchesStatus && matchesType && matchesProject;
  });
  
  // Sort filtered documents
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    let comparison = 0;
    
    switch (sortColumn) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'project':
        comparison = a.project.localeCompare(b.project);
        break;
      case 'dateModified':
        comparison = new Date(b.dateModified).getTime() - new Date(a.dateModified).getTime();
        break;
      case 'type':
        comparison = a.type.localeCompare(b.type);
        break;
      case 'size':
        const sizeA = parseFloat(a.size.split(' ')[0]);
        const sizeB = parseFloat(b.size.split(' ')[0]);
        comparison = sizeA - sizeB;
        break;
      default:
        comparison = 0;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  return (
    <div className="flex flex-col min-h-screen">
      {!projectId && <div className="h-16"></div>} {/* Navbar spacer - only show when not in tab */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {!projectId && (
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
              <p className="text-muted-foreground mt-1">Manage and access project documentation</p>
            </div>
            <div className="mt-4 lg:mt-0 flex flex-wrap gap-3">
              <Button className="rounded-lg" onClick={handleUpload}>
                <Upload className="mr-2 h-4 w-4" />
                Upload File
              </Button>
              <Button variant="outline" className="rounded-lg" onClick={handleNewFolder}>
                <FolderPlus className="mr-2 h-4 w-4" />
                New Folder
              </Button>
              <Button variant="outline" className="rounded-lg" onClick={handleNewDocument}>
                <FilePlus className="mr-2 h-4 w-4" />
                New Document
              </Button>
            </div>
          </div>
        )}
        
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search documents..." 
                  className="pl-10" 
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              <div className="flex gap-2">
                <DocumentsFilter 
                  filterStatus={filterStatus}
                  setFilterStatus={setFilterStatus}
                  filterType={filterType}
                  setFilterType={setFilterType}
                />
                <DocumentsViewToggle viewMode={viewMode} setViewMode={setViewMode} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Documents</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="shared">Shared</TabsTrigger>
            <TabsTrigger value="blueprints">Blueprints</TabsTrigger>
            <TabsTrigger value="contracts">Contracts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {viewMode === 'list' ? (
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="w-[400px] cursor-pointer" onClick={() => handleSort('name')}>
                        <div className="flex items-center">
                          Name
                          {sortColumn === 'name' && (
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('dateModified')}>
                        <div className="flex items-center">
                          Modified
                          {sortColumn === 'dateModified' && (
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('size')}>
                        <div className="flex items-center">
                          Size
                          {sortColumn === 'size' && (
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('project')}>
                        <div className="flex items-center">
                          Project
                          {sortColumn === 'project' && (
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
                        <div className="flex items-center">
                          Status
                        </div>
                      </TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium flex items-center gap-2">
                        <Folder className="h-5 w-5 text-blue-500 flex-shrink-0" />
                        <span className="truncate">Project Blueprints</span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4" />
                          June 12, 2023
                        </div>
                      </TableCell>
                      <TableCell>--</TableCell>
                      <TableCell>Multiple</TableCell>
                      <TableCell>--</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleView(0)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Open
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleShare(0)}>
                              <Share className="mr-2 h-4 w-4" />
                              Share
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleEdit(0)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(0)}>
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    
                    {sortedDocuments.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {getDocumentIcon(doc.type)}
                            <div className="flex flex-col">
                              <span className="truncate font-medium">{doc.name}</span>
                              <span className="text-xs text-muted-foreground">{doc.type.toUpperCase()}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4" />
                            {doc.dateModified}
                          </div>
                        </TableCell>
                        <TableCell>{doc.size}</TableCell>
                        <TableCell>{doc.project}</TableCell>
                        <TableCell>{getStatusBadge(doc.status)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleView(doc.id)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDownload(doc.id)}>
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleShare(doc.id)}>
                                <Share className="mr-2 h-4 w-4" />
                                Share
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleEdit(doc.id)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(doc.id)}>
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-center h-32 bg-blue-50">
                      <Folder className="h-16 w-16 text-blue-500" />
                    </div>
                    <div className="p-4 flex flex-col">
                      <h3 className="font-medium text-lg">Project Blueprints</h3>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">Folder</span>
                        <span className="text-xs text-muted-foreground">June 12, 2023</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {sortedDocuments.map((doc) => (
                  <DocumentCard 
                    key={doc.id}
                    document={doc}
                    onView={() => handleView(doc.id)}
                    onDownload={() => handleDownload(doc.id)}
                    onShare={() => handleShare(doc.id)}
                    onEdit={() => handleEdit(doc.id)}
                    onDelete={() => handleDelete(doc.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="recent">
            <Card>
              <CardHeader>
                <CardTitle>Recent Documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-3">
                  {sortedDocuments.slice(0, 5).map(doc => (
                    <div key={`recent-${doc.id}`} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getDocumentIcon(doc.type)}
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-muted-foreground">Accessed 2 days ago</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Button variant="ghost" size="icon" onClick={() => handleView(doc.id)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDownload(doc.id)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="shared">
            <Card>
              <CardHeader>
                <CardTitle>Shared Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  {sortedDocuments.slice(2, 6).map(doc => (
                    <div key={`shared-${doc.id}`} className="flex items-center justify-between border-b pb-3">
                      <div className="flex items-center gap-3">
                        {getDocumentIcon(doc.type)}
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <div className="flex items-center text-sm text-muted-foreground gap-2 mt-1">
                            <User className="h-3 w-3" />
                            <span>Shared with: Team</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleView(doc.id)}>
                          <Eye className="mr-1 h-4 w-4" />
                          View
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleShare(doc.id)}>
                          <LinkIcon className="mr-1 h-4 w-4" />
                          Copy Link
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="blueprints">
            <Card>
              <CardHeader>
                <CardTitle>Blueprints</CardTitle>
              </CardHeader>
              <CardContent>
                {sortedDocuments
                  .filter(doc => doc.name.toLowerCase().includes('plan') || doc.name.toLowerCase().includes('schematic'))
                  .map(doc => (
                    <div key={`blueprint-${doc.id}`} className="flex items-center justify-between border-b py-3">
                      <div className="flex items-center gap-3">
                        {getDocumentIcon(doc.type)}
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-muted-foreground">{doc.project}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(doc.status)}
                        <Button variant="outline" size="sm" onClick={() => handleView(doc.id)}>View</Button>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="contracts">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Contracts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {sortedDocuments
                    .filter(doc => doc.name.toLowerCase().includes('contract') || doc.name.toLowerCase().includes('agreement'))
                    .length > 0 ? (
                    sortedDocuments
                      .filter(doc => doc.name.toLowerCase().includes('contract') || doc.name.toLowerCase().includes('agreement'))
                      .map(doc => (
                        <div key={`contract-${doc.id}`} className="flex items-center justify-between border-b py-3">
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className={cn(
                              "h-5 w-5",
                              doc.status === 'approved' ? "text-green-500" : "text-amber-500"
                            )} />
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline">{doc.project}</Badge>
                                <span className="text-xs text-muted-foreground">{doc.dateModified}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleDownload(doc.id)}>
                              <Download className="mr-1 h-3 w-3" />
                              Download
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleView(doc.id)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Archive className="mx-auto h-12 w-12 mb-3 text-muted-foreground/50" />
                      <p>No contract documents found</p>
                      <Button variant="outline" size="sm" className="mt-4" onClick={handleNewDocument}>
                        <FilePlus className="mr-2 h-4 w-4" />
                        Create Contract
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Documents;
