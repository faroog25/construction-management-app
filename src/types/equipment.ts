
export interface EquipmentItem {
  id: string;
  name: string;
  category: string;
  description: string;
  status: 'Available' | 'Reserved' | 'Maintenance' | 'Out of Service';
  imageUrl?: string;
  featured: boolean;
  purchaseDate?: string;
  [key: string]: any;
}

export interface Booking {
  id: string;
  equipmentId: number;
  equipmentName: string;
  category: string;
  projectId?: number; // Added projectId field
  projectName: string;
  startDate: string;
  endDate: string;
  duration: number;
  notes?: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  createdAt: string;
  dailyRate: number;
  totalCost: number;
}
