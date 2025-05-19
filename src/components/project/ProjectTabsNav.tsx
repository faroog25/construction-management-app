
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutGrid, ClipboardList, BarChart2, Settings, FileText } from 'lucide-react';

const ProjectTabsNav = () => {
  return (
    <TabsList className="w-full max-w-md grid grid-cols-5 p-1 bg-muted/30">
      <TabsTrigger value="details" className="flex items-center gap-1.5">
        <LayoutGrid className="h-4 w-4" />
        تفاصيل المشروع
      </TabsTrigger>
      <TabsTrigger value="stages" className="flex items-center gap-1.5">
        <ClipboardList className="h-4 w-4" />
        المراحل والمهام
      </TabsTrigger>
      <TabsTrigger value="gantt" className="flex items-center gap-1.5">
        <BarChart2 className="h-4 w-4" />
        مخطط جانت
      </TabsTrigger>
      <TabsTrigger value="equipment" className="flex items-center gap-1.5">
        <Settings className="h-4 w-4" />
        المعدات
      </TabsTrigger>
      <TabsTrigger value="documents" className="flex items-center gap-1.5">
        <FileText className="h-4 w-4" />
        المستندات
      </TabsTrigger>
    </TabsList>
  );
};

export default ProjectTabsNav;
