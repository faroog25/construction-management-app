
import React from 'react';
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
import { File, Folder, Search, Upload, Plus, MoreHorizontal, Clock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
