import React from 'react';
import ApiDocs from '../components/ApiDocs';
import { Toaster as Sonner } from '@/components/ui/sonner';

const ApiDocsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <ApiDocs />
      <Sonner />
    </div>
  );
};

export default ApiDocsPage; 