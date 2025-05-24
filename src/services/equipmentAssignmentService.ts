
import { API_BASE_URL } from '@/config/api';

export interface EquipmentAssignmentRequest {
  equipmentId: number;
  projectId: number;
  expectedReturnDate: string;
}

export interface EquipmentReservationRequest {
  equipmentId: number;
  projectId: number;
  startDate: string;
  endDate: string;
}

export interface EquipmentAssignmentResponse {
  success: boolean;
  message: string;
  errors?: string[];
  data?: any;
}

export interface ProjectEquipment {
  id: number;
  projectId: number;
  projectName: string;
  equipmentId: number;
  equipmentName: string;
  bookDate?: string;
  expectedReturnDate?: string;
  actualReturnDate?: string | null;
  startDate?: string;
  endDate?: string;
  reservationStatus?: ReservationStatus;
}

export interface EquipmentReservation {
  id: number;
  projectId: number;
  projectName: string;
  equipmentId: number;
  equipmentName: string;
  startDate: string;
  endDate: string;
  reservationStatus: ReservationStatus;
}

export enum ReservationStatus {
  NotStarted = 0,
  Started = 1,
  Completed = 2
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export async function assignEquipment(assignmentData: EquipmentAssignmentRequest): Promise<EquipmentAssignmentResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/EquipmentAssignments/Assign`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(assignmentData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`فشل في حجز المعدات. (HTTP ${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error assigning equipment:', error);
    if (error instanceof Error) {
      throw new Error(`فشل في حجز المعدات: ${error.message}`);
    }
    throw new Error('حدث خطأ غير متوقع أثناء حجز المعدات');
  }
}

export async function reserveEquipment(reservationData: EquipmentReservationRequest): Promise<EquipmentAssignmentResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/EquipmentReservations/Reserve`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(reservationData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`فشل في حجز المعدات. (HTTP ${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error reserving equipment:', error);
    if (error instanceof Error) {
      throw new Error(`فشل في حجز المعدات: ${error.message}`);
    }
    throw new Error('حدث خطأ غير متوقع أثناء حجز المعدات');
  }
}

export async function getProjectEquipment(projectId: number): Promise<ProjectEquipment[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/EquipmentReservations/ByProject/${projectId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`فشل في جلب بيانات المعدات. (HTTP ${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching project equipment:', error);
    if (error instanceof Error) {
      throw new Error(`فشل في جلب بيانات المعدات: ${error.message}`);
    }
    throw new Error('حدث خطأ غير متوقع أثناء جلب بيانات المعدات');
  }
}

export async function getAllEquipmentAssignments(): Promise<ProjectEquipment[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/EquipmentAssignments/All`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`فشل في جلب بيانات الحجوزات. (HTTP ${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching equipment assignments:', error);
    if (error instanceof Error) {
      throw new Error(`فشل في جلب بيانات الحجوزات: ${error.message}`);
    }
    throw new Error('حدث خطأ غير متوقع أثناء جلب بيانات الحجوزات');
  }
}

export async function getAllEquipmentReservations(): Promise<EquipmentReservation[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/EquipmentReservations/All`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`فشل في جلب بيانات الحجوزات. (HTTP ${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching equipment reservations:', error);
    if (error instanceof Error) {
      throw new Error(`فشل في جلب بيانات الحجوزات: ${error.message}`);
    }
    throw new Error('حدث خطأ غير متوقع أثناء جلب بيانات الحجوزات');
  }
}

export async function returnEquipment(assignmentId: number): Promise<EquipmentAssignmentResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/EquipmentAssignments/Return/${assignmentId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`فشل في إعادة المعدات. (HTTP ${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error returning equipment:', error);
    if (error instanceof Error) {
      throw new Error(`فشل في إعادة المعدات: ${error.message}`);
    }
    throw new Error('حدث خطأ غير متوقع أثناء إعادة المعدات');
  }
}

export async function cancelReservation(reservationId: number): Promise<EquipmentAssignmentResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/EquipmentReservations/RemoveReservation/${reservationId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`فشل في الغاء الحجز. (HTTP ${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error canceling reservation:', error);
    if (error instanceof Error) {
      throw new Error(`فشل في الغاء الحجز: ${error.message}`);
    }
    throw new Error('حدث خطأ غير متوقع أثناء الغاء الحجز');
  }
}
