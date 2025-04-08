
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  FileImage, 
  FileArchive,
  File,
  MoreVertical,
  Download,
  Eye,
  Share,
  Edit,
  Trash
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

interface DocumentCardProps {
  document: Document;
  onView: () => void;
  onDownload: () => void;
  onShare: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const DocumentCard = ({ document, onView, onDownload, onShare, onEdit, onDelete }: DocumentCardProps) => {
  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="h-16 w-16 text-red-500" />;
      case 'doc': return <FileText className="h-16 w-16 text-blue-500" />;
      case 'image': return <FileImage className="h-16 w-16 text-green-500" />;
      case 'archive': return <FileArchive className="h-16 w-16 text-amber-500" />;
      default: return <File className="h-16 w-16 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'approved': return 'bg-green-50 border-green-200';
      case 'pending': return 'bg-amber-50 border-amber-200';
      case 'rejected': return 'bg-red-50 border-red-200';
      case 'draft': return 'bg-gray-50 border-gray-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className={`flex items-center justify-center h-32 ${getStatusColor(document.status)}`}>
          {getDocumentIcon(document.type)}
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div className="w-[80%]">
              <h3 className="font-medium text-base truncate" title={document.name}>{document.name}</h3>
              <p className="text-muted-foreground text-xs mt-1">{document.project}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onView}>
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onShare}>
                  <Share className="mr-2 h-4 w-4" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600" onClick={onDelete}>
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex justify-between items-center mt-3">
            <Badge variant="outline" className="text-xs font-normal">
              {document.type.toUpperCase()}
            </Badge>
            <span className="text-xs text-muted-foreground">{document.size}</span>
          </div>
          <div className="flex items-center justify-between mt-3 pt-2 border-t">
            <Button variant="ghost" size="sm" className="h-8 px-2" onClick={onView}>
              <Eye className="h-3 w-3 mr-1" />
              View
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-2" onClick={onDownload}>
              <Download className="h-3 w-3 mr-1" />
              Download
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentCard;
