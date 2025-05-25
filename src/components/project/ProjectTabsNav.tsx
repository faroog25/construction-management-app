
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutGrid, ClipboardList, BarChart2, Settings, FileText } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const ProjectTabsNav = () => {
  const { t } = useLanguage();
  
  return (
    <TabsList className="w-full max-w-md grid grid-cols-5 p-1 bg-muted/30">
      <TabsTrigger value="details" className="flex items-center gap-1.5">
        <LayoutGrid className="h-4 w-4" />
        {t('details')}
      </TabsTrigger>
      <TabsTrigger value="stages" className="flex items-center gap-1.5">
        <ClipboardList className="h-4 w-4" />
        {t('stages')}
      </TabsTrigger>
      <TabsTrigger value="gantt" className="flex items-center gap-1.5">
        <BarChart2 className="h-4 w-4" />
        {t('gantt')}
      </TabsTrigger>
      <TabsTrigger value="equipment" className="flex items-center gap-1.5">
        <Settings className="h-4 w-4" />
        {t('equipment')}
      </TabsTrigger>
      <TabsTrigger value="documents" className="flex items-center gap-1.5">
        <FileText className="h-4 w-4" />
        {t('documents')}
      </TabsTrigger>
    </TabsList>
  );
};

export default ProjectTabsNav;
