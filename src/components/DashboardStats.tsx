
import React from 'react';
import { ArrowUpRight, ArrowDownRight, Activity, Clock, Users, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
  };
  icon: React.ReactNode;
  className?: string;
}

const StatCard = ({ title, value, change, icon, className }: StatCardProps) => {
  return (
    <div className={cn(
      "bg-card rounded-xl p-5 shadow-sm border animate-in transition-all",
      className
    )}>
      <div className="flex justify-between items-start">
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-semibold tracking-tight">{value}</p>
          {change && (
            <div className="flex items-center text-sm">
              {change.isPositive ? (
                <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
              ) : (
                <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />
              )}
              <span className={change.isPositive ? "text-green-500" : "text-red-500"}>
                {change.value}%
              </span>
              <span className="text-muted-foreground ml-1">from last month</span>
            </div>
          )}
        </div>
        <div className="rounded-full p-2 bg-primary/10">
          {icon}
        </div>
      </div>
    </div>
  );
};

const DashboardStats = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Active Projects"
        value={16}
        change={{ value: 12, isPositive: true }}
        icon={<Activity className="h-5 w-5 text-primary" />}
      />
      <StatCard
        title="Pending Tasks"
        value={28}
        change={{ value: 5, isPositive: false }}
        icon={<Clock className="h-5 w-5 text-amber-500" />}
      />
      <StatCard
        title="Team Members"
        value={24}
        change={{ value: 8, isPositive: true }}
        icon={<Users className="h-5 w-5 text-indigo-500" />}
      />
      <StatCard
        title="Documents"
        value={254}
        change={{ value: 24, isPositive: true }}
        icon={<FileText className="h-5 w-5 text-emerald-500" />}
      />
    </div>
  );
};

export default DashboardStats;
