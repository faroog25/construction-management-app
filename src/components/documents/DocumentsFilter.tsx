
import React from 'react';
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface DocumentsFilterProps {
  filterStatus: string;
  setFilterStatus: (status: any) => void;
  filterType: string;
  setFilterType: (type: string) => void;
}

export function DocumentsFilter({ 
  filterStatus, 
  setFilterStatus, 
  filterType, 
  setFilterType 
}: DocumentsFilterProps) {
  const documentTypes = [
    { value: 'pdf', label: 'PDF' },
    { value: 'doc', label: 'مستندات' },
    { value: 'image', label: 'صور' },
    { value: 'archive', label: 'أرشيف' }
  ];
  
  const statusTypes = [
    { value: 'approved', label: 'مُعتمد' },
    { value: 'pending', label: 'في الانتظار' },
    { value: 'rejected', label: 'مرفوض' },
    { value: 'draft', label: 'مسودة' }
  ];
  
  const hasActiveFilters = filterStatus !== 'all' || filterType !== 'all';
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn(
          "flex gap-2",
          hasActiveFilters && "border-primary bg-primary/5"
        )}>
          <Filter className="h-4 w-4" />
          تصفية
          {hasActiveFilters && (
            <Badge className="h-5 px-1.5 ml-1 rounded-full">
              {(filterStatus !== 'all' ? 1 : 0) + (filterType !== 'all' ? 1 : 0)}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-3" align="end">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">الحالة</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="all-status" 
                  checked={filterStatus === 'all'} 
                  onCheckedChange={() => setFilterStatus('all')}
                />
                <label htmlFor="all-status" className="text-sm">الكل</label>
              </div>
              {statusTypes.map(status => (
                <div key={status.value} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`status-${status.value}`} 
                    checked={filterStatus === status.value} 
                    onCheckedChange={() => setFilterStatus(status.value)}
                  />
                  <label htmlFor={`status-${status.value}`} className="text-sm">{status.label}</label>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">نوع المستند</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="all-types" 
                  checked={filterType === 'all'} 
                  onCheckedChange={() => setFilterType('all')}
                />
                <label htmlFor="all-types" className="text-sm">جميع الأنواع</label>
              </div>
              {documentTypes.map(type => (
                <div key={type.value} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`type-${type.value}`} 
                    checked={filterType === type.value} 
                    onCheckedChange={() => setFilterType(type.value)}
                  />
                  <label htmlFor={`type-${type.value}`} className="text-sm">{type.label}</label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between pt-2 border-t">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setFilterStatus('all');
                setFilterType('all');
              }}
              className={cn(
                "text-xs px-2 h-7",
                !hasActiveFilters && "opacity-50"
              )}
              disabled={!hasActiveFilters}
            >
              إعادة تعيين
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
