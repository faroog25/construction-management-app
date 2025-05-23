
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { User, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getUserProfile } from '@/services/userService';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

const UserProfileDropdown = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const { data: userProfile, isLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: getUserProfile,
  });

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/welcome');
  };

  const getUserInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return 'U';
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  if (isLoading) {
    return (
      <Button variant="ghost" size="icon" className="rounded-full">
        <User size={20} />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src="" alt={userProfile?.firstName} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getUserInitials(userProfile?.firstName, userProfile?.lastName)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 bg-background border shadow-lg" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {userProfile?.firstName} {userProfile?.lastName}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {userProfile?.email}
            </p>
            {userProfile?.role && (
              <p className="text-xs leading-none text-muted-foreground">
                {userProfile.role}
              </p>
            )}
            {userProfile?.phoneNumber && (
              <p className="text-xs leading-none text-muted-foreground">
                {userProfile.phoneNumber}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t('nav.logout')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileDropdown;
