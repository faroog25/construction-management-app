
import { API_BASE_URL } from '@/config/api';

export interface UserProfile {
  id: number;
  name: string;
  userName: string;
  email: string;
  phoneNumber: string;
}

export const getUserProfile = async (): Promise<UserProfile> => {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch(`${API_BASE_URL}/Users/getProfile`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user profile');
  }

  return response.json();
};
