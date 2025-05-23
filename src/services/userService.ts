
import { api } from './api';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role?: string;
}

export const getUserProfile = async (): Promise<UserProfile> => {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch('https://constructionmanagementassitantapi.runasp.net/me', {
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
