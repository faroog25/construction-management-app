
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
  const documentTypes = ['pdf', 'doc', 'image', 'archive'];
  const statusTypes = ['approved', 'pending', 'rejected', 'draft'];
  
  const hasActiveFilters = filterStatus !== 'all' || filterType !== 'all';
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn(
          "flex gap-2",
          hasActiveFilters && "border-primary bg-primary/5"
        )}>
          <Filter className="h-4 w-4" />
          Filters
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
            <h4 className="font-medium mb-2">Status</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="all-status" 
                  checked={filterStatus === 'all'} 
                  onCheckedChange={() => setFilterStatus('all')}
                />
                <label htmlFor="all-status" className="text-sm">All</label>
              </div>
              {statusTypes.map(status => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`status-${status}`} 
                    checked={filterStatus === status} 
                    onCheckedChange={() => setFilterStatus(status)}
                  />
                  <label htmlFor={`status-${status}`} className="text-sm capitalize">{status}</label>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Document Type</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="all-types" 
                  checked={filterType === 'all'} 
                  onCheckedChange={() => setFilterType('all')}
                />
                <label htmlFor="all-types" className="text-sm">All Types</label>
              </div>
              {documentTypes.map(type => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`type-${type}`} 
                    checked={filterType === type} 
                    onCheckedChange={() => setFilterType(type)}
                  />
                  <label htmlFor={`type-${type}`} className="text-sm capitalize">{type}</label>
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
              Reset Filters
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
