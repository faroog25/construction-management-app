import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Folder, MoreHorizontal } from "lucide-react";
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
  User,
  Upload
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

const Documents = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-16"></div> {/* Navbar spacer */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
            <p className="text-muted-foreground mt-1">Manage and access project documentation</p>
          </div>
          <div className="mt-4 lg:mt-0 flex flex-wrap gap-3">
            <Button className="rounded-lg">
              <Upload className="mr-2 h-4 w-4" />
              Upload File
            </Button>
            <Button variant="outline" className="rounded-lg">
              <Plus className="mr-2 h-4 w-4" />
              New Folder
            </Button>
          </div>
        </div>
        
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search documents..." className="pl-10" />
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium flex items-center gap-2">
                    <Folder className="h-5 w-5 text-blue-500" />
                    Project Blueprints
                  </TableCell>
                  <TableCell>June 12, 2023</TableCell>
                  <TableCell>--</TableCell>
                  <TableCell>Multiple</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Open</DropdownMenuItem>
                        <DropdownMenuItem>Share</DropdownMenuItem>
                        <DropdownMenuItem>Download</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium flex items-center gap-2">
                    <File className="h-5 w-5 text-red-500" />
                    West Heights Contract.pdf
                  </TableCell>
                  <TableCell>August 3, 2023</TableCell>
                  <TableCell>2.4 MB</TableCell>
                  <TableCell>West Heights Tower</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View</DropdownMenuItem>
                        <DropdownMenuItem>Share</DropdownMenuItem>
                        <DropdownMenuItem>Download</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium flex items-center gap-2">
                    <File className="h-5 w-5 text-green-500" />
                    Cost Estimates.xlsx
                  </TableCell>
                  <TableCell>July 15, 2023</TableCell>
                  <TableCell>1.8 MB</TableCell>
                  <TableCell>Various</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View</DropdownMenuItem>
                        <DropdownMenuItem>Share</DropdownMenuItem>
                        <DropdownMenuItem>Download</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium flex items-center gap-2">
                    <File className="h-5 w-5 text-blue-500" />
                    Riverside Site Analysis.pdf
                  </TableCell>
                  <TableCell>July 28, 2023</TableCell>
                  <TableCell>5.2 MB</TableCell>
                  <TableCell>Riverside Office Complex</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View</DropdownMenuItem>
                        <DropdownMenuItem>Share</DropdownMenuItem>
                        <DropdownMenuItem>Download</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="recent">
            <div className="p-4 text-center text-muted-foreground">
              <Clock className="mx-auto h-8 w-8 mb-2" />
              <p>Your recently accessed documents will appear here</p>
            </div>
          </TabsContent>
          
          <TabsContent value="shared">
            <div className="p-4 text-center text-muted-foreground">
              <p>Documents shared with you will appear here</p>
            </div>
          </TabsContent>
          
          <TabsContent value="blueprints">
            <div className="p-4 text-center text-muted-foreground">
              <p>Blueprint documents will appear here</p>
            </div>
          </TabsContent>
          
          <TabsContent value="contracts">
            <div className="p-4 text-center text-muted-foreground">
              <p>Contract documents will appear here</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Documents;
