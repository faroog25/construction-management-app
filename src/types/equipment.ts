
export interface EquipmentItem {
  id: string;
  name: string;
  category: string;
  description: string;
  dailyRate: number;
  status: 'Available' | 'In Use' | 'Maintenance';
  imageUrl?: string;
  featured: boolean;
  [key: string]: any;
}

export interface Booking {
  id: string;
  equipmentId: string;
  equipmentName: string;
  category: string;
  startDate: string;
  endDate: string;
  duration: number;
  dailyRate: number;
  totalCost: number;
  projectName: string;
  notes?: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  createdAt: string;
}
