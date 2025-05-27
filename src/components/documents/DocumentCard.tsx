
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
import { cn } from '@/lib/utils';

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
      case 'pdf': 
        return <FileText className="h-16 w-16 text-red-500" />;
      case 'doc': 
      case 'docx': 
        return <FileText className="h-16 w-16 text-blue-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'image': 
        return <FileImage className="h-16 w-16 text-green-500" />;
      case 'zip':
      case 'rar':
      case '7z':
      case 'archive': 
        return <FileArchive className="h-16 w-16 text-amber-500" />;
      default: 
        return <File className="h-16 w-16 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'approved': return 'bg-green-50 border-green-200 text-green-700';
      case 'pending': return 'bg-amber-50 border-amber-200 text-amber-700';
      case 'rejected': return 'bg-red-50 border-red-200 text-red-700';
      case 'draft': return 'bg-gray-50 border-gray-200 text-gray-700';
      default: return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  const getStatusName = (status: Document['status']) => {
    switch (status) {
      case 'approved': return 'معتمد';
      case 'pending': return 'قيد المراجعة';
      case 'rejected': return 'مرفوض';
      case 'draft': return 'مسودة';
      default: return 'معتمد';
    }
  };

  const getCardStatusClass = (status: Document['status']) => {
    switch (status) {
      case 'approved': return 'border-l-4 border-l-green-500';
      case 'pending': return 'border-l-4 border-l-amber-500';
      case 'rejected': return 'border-l-4 border-l-red-500';
      case 'draft': return 'border-l-4 border-l-gray-500';
      default: return '';
    }
  };

  const getTypeDisplayName = (type: string) => {
    switch (type) {
      case 'pdf': return 'PDF';
      case 'doc': 
      case 'docx': return 'Word';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'image': return 'صورة';
      case 'zip':
      case 'rar':
      case '7z':
      case 'archive': return 'ملف مضغوط';
      default: return type.toUpperCase();
    }
  };

  return (
    <Card className={cn("overflow-hidden hover:shadow-md transition-shadow group", getCardStatusClass(document.status))}>
      <CardContent className="p-0">
        <div className={cn("flex items-center justify-center h-32", getStatusColor(document.status))}>
          {getDocumentIcon(document.type)}
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div className="w-[80%]">
              <h3 className="font-medium text-base truncate" title={document.name}>{document.name}</h3>
              <p className="text-muted-foreground text-xs mt-1">
                {document.owner} • {document.dateModified}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onView} className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  عرض
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDownload} className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  تحميل
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onShare} className="flex items-center gap-2">
                  <Share className="h-4 w-4" />
                  مشاركة
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onEdit} className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  تعديل
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600 flex items-center gap-2" onClick={onDelete}>
                  <Trash className="h-4 w-4" />
                  حذف
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex justify-between items-center mt-3">
            <Badge variant="outline" className={cn("text-xs font-normal", 
              (document.type === 'pdf') && "bg-red-50 text-red-700 border-red-200", 
              (document.type === 'doc' || document.type === 'docx') && "bg-blue-50 text-blue-700 border-blue-200",
              (['jpg', 'jpeg', 'png', 'gif', 'image'].includes(document.type)) && "bg-green-50 text-green-700 border-green-200",
              (['zip', 'rar', '7z', 'archive'].includes(document.type)) && "bg-amber-50 text-amber-700 border-amber-200"
            )}>
              {getTypeDisplayName(document.type)}
            </Badge>
            <Badge variant="outline" className={cn("text-xs font-normal", getStatusColor(document.status))}>
              {getStatusName(document.status)}
            </Badge>
          </div>
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={onView}>
              <Eye className="h-3 w-3 mr-1" />
              عرض
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={onDownload}>
              <Download className="h-3 w-3 mr-1" />
              تحميل
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentCard;
