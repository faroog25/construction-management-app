
import React from 'react';
import { TeamMembers } from '@/components/TeamMembers';

const Workers = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-16"></div>
      <main className="flex-1 container mx-auto px-4 py-8 animate-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">العمال</h1>
            <p className="text-muted-foreground mt-1">إدارة العمال في المشاريع</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <TeamMembers />
        </div>
      </main>
    </div>
  );
};

export default Workers;
