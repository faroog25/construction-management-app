import React from 'react';
import { Worker } from '@/services/workerService';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ChevronsUpDown, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WorkerMultiSelectProps {
  workers: Worker[];
  selectedWorkers: Worker[];
  onSelectionChange: (workers: Worker[]) => void;
  placeholder?: string;
  className?: string;
}

export function WorkerMultiSelect({
  workers = [],
  selectedWorkers = [],
  onSelectionChange,
  placeholder = "Assign workers...",
  className,
}: WorkerMultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  // Ensure workers and selectedWorkers are arrays
  const safeWorkers = Array.isArray(workers) ? workers : [];
  const safeSelectedWorkers = Array.isArray(selectedWorkers) ? selectedWorkers : [];

  const handleSelect = (worker: Worker) => {
    const isSelected = safeSelectedWorkers.some(w => w.id === worker.id);
    if (isSelected) {
      onSelectionChange(safeSelectedWorkers.filter(w => w.id !== worker.id));
    } else {
      onSelectionChange([...safeSelectedWorkers, worker]);
    }
  };

  const handleRemove = (worker: Worker) => {
    onSelectionChange(safeSelectedWorkers.filter(w => w.id !== worker.id));
  };

  return (
    <div className={cn("space-y-2", className)}>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between"
          >
            {safeSelectedWorkers.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {safeSelectedWorkers.map((worker) => (
                  <Badge
                    key={worker.id}
                    variant="secondary"
                    className="mr-1 mb-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {worker.fullName}
                    <button
                      className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemove(worker);
                      }}
                    >
                      <X className="h-3 w-3 text-primary-foreground hover:text-primary-foreground/80" />
                    </button>
                  </Badge>
                ))}
              </div>
            ) : (
              placeholder
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[300px] max-h-[300px] overflow-auto">
          {safeWorkers.map((worker) => {
            const isSelected = safeSelectedWorkers.some(w => w.id === worker.id);
            return (
              <DropdownMenuCheckboxItem
                key={worker.id}
                checked={isSelected}
                onCheckedChange={() => handleSelect(worker)}
                className={cn(
                  "flex items-center py-2 px-3 cursor-pointer",
                  isSelected && "bg-primary/10"
                )}
              >
                <div className="flex items-center gap-2">
                  {isSelected && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                  <div className="flex flex-col">
                    <span className={cn(
                      "font-medium",
                      isSelected && "text-primary font-semibold"
                    )}>
                      {worker.fullName}
                    </span>
                    <span className={cn(
                      "text-xs",
                      isSelected ? "text-primary/80" : "text-muted-foreground"
                    )}>
                      {worker.specialty}
                    </span>
                  </div>
                </div>
              </DropdownMenuCheckboxItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
} 