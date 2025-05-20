
import React from 'react';
import { Document } from '@/types/document';
import { FileText, Download, Calendar, User, ExternalLink, Pencil, Trash, File } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { downloadDocument } from '@/services/documentService';
import { toast } from 'sonner';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface DocumentCardProps {
  document: Document;
  onDocumentUpdated?: () => void;
  onDocumentSelected?: (doc: Document) => void;
  readOnly?: boolean;
}

export function DocumentCard({ document, onDocumentUpdated, onDocumentSelected, readOnly = false }: DocumentCardProps) {
  const handleDownload = async () => {
    try {
      toast.loading('جاري تحميل المستند...');
      const blob = await downloadDocument(document.id);
      
      // Create a blob URL for the file
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link element
      const link = window.document.createElement('a');
      link.href = url;
      link.download = document.name || 'document';
      
      // Trigger download
      window.document.body.appendChild(link);
      link.click();
      
      // Clean up
      window.document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.dismiss();
      toast.success('تم تحميل المستند بنجاح');
    } catch (error) {
      toast.dismiss();
      toast.error('فشل في تحميل المستند');
    }
  };

  const handleEdit = () => {
    if (onDocumentSelected) {
      onDocumentSelected(document);
    }
  };

  const handleDelete = () => {
    if (onDocumentSelected) {
      onDocumentSelected(document);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  const getDocumentIcon = (docType: string | undefined) => {
    switch (docType) {
      case 'pdf':
        return <File className="h-10 w-10 text-red-500" />;
      case 'doc':
        return <File className="h-10 w-10 text-blue-500" />;
      case 'image':
        return <File className="h-10 w-10 text-green-500" />;
      case 'archive':
        return <File className="h-10 w-10 text-yellow-500" />;
      default:
        return <FileText className="h-10 w-10 text-primary/80" />;
    }
  };

  return (
    <Card className="overflow-hidden hover:border-primary/50 hover:shadow-md transition-all">
      <CardContent className="p-4">
        <div className="flex items-center justify-center h-24 bg-muted/30 rounded-md mb-3">
          {getDocumentIcon(document.type)}
        </div>
        
        <div>
          <div className="flex items-start justify-between">
            <h3 className="font-medium truncate" title={document.name}>{document.name}</h3>
            <Badge variant="outline" className="ml-2 shrink-0">
              {document.type === 'pdf' ? 'PDF' : 
               document.type === 'doc' ? 'Word' :
               document.type === 'image' ? 'صورة' :
               document.type === 'archive' ? 'ملف مضغوط' : 'مستند'}
            </Badge>
          </div>
          
          {document.description && (
            <p className="text-muted-foreground text-sm mt-1 line-clamp-2" title={document.description}>
              {document.description}
            </p>
          )}
          
          <div className="mt-2 flex items-center text-xs text-muted-foreground">
            <Calendar className="inline h-3 w-3 mr-1" />
            <span>{formatDate(document.createdDate)}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between p-4 pt-0 gap-2">
        <Button 
          variant="outline" 
          size="sm"
          className="flex-1"
          onClick={handleDownload}
        >
          <Download className="h-3.5 w-3.5 mr-1" />
          تحميل
        </Button>

        {!readOnly ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEdit}>
                <Pencil className="h-3.5 w-3.5 mr-2" />
                تعديل
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500" onClick={handleDelete}>
                <Trash className="h-3.5 w-3.5 mr-2" />
                حذف
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.open(document.fileUrl, '_blank')}
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
