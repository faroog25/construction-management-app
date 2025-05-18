
import { API_BASE_URL } from '@/config/api';

export interface EquipmentAssignmentRequest {
  equipmentId: number;
  projectId: number;
  expectedReturnDate: string;
}

export interface EquipmentAssignmentResponse {
  success: boolean;
  message: string;
  errors?: string[];
  data?: any;
}

export async function assignEquipment(assignmentData: EquipmentAssignmentRequest): Promise<EquipmentAssignmentResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/EquipmentAssignments/Assign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
