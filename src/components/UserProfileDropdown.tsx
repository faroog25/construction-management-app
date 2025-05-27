
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { User, LogOut, Settings, UserCircle, Mail, Phone } from 'lucide-react';
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

  const getUserInitials = (name?: string, userName?: string) => {
    if (!name && !userName) return 'U';
    return `${name?.charAt(0) || ''}${userName?.charAt(0) || ''}`.toUpperCase();
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
        <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-primary/20 transition-all duration-200">
          <Avatar className="h-10 w-10 border-2 border-primary/10">
            <AvatarImage src="" alt={userProfile?.name} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold">
              {getUserInitials(userProfile?.name, userProfile?.userName)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-80 bg-background/95 backdrop-blur-sm border shadow-xl rounded-xl p-0" 
        align="end" 
        forceMount
        sideOffset={8}
      >
        {/* Header Section */}
        <div className="p-6 pb-4 bg-gradient-to-r from-primary/5 to-primary/10 border-b">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-3 border-white shadow-lg">
              <AvatarImage src="" alt={userProfile?.name} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-lg font-bold">
                {getUserInitials(userProfile?.name, userProfile?.userName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-foreground truncate">
                {userProfile?.name || 'مستخدم'}
              </h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <UserCircle className="h-3 w-3" />
                @{userProfile?.userName || 'username'}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="p-2 rounded-full bg-blue-50 dark:bg-blue-950">
              <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium truncate">
                {userProfile?.email || 'No email'}
              </p>
            </div>
          </div>

          {userProfile?.phoneNumber && (
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="p-2 rounded-full bg-green-50 dark:bg-green-950">
                <Phone className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Phone Number</p>
                <p className="text-sm font-medium">
                  {userProfile.phoneNumber}
                </p>
              </div>
            </div>
          )}
        </div>

        <DropdownMenuSeparator className="mx-4" />

        {/* Actions */}
        <div className="p-2">
          <DropdownMenuItem 
            className="cursor-pointer rounded-lg p-3 focus:bg-muted/50 transition-colors group"
          >
            <div className="p-2 rounded-full bg-gray-50 dark:bg-gray-800 group-hover:bg-gray-100 dark:group-hover:bg-gray-700 transition-colors">
              <Settings className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </div>
            <div className="mr-3">
              <span className="font-medium">Account Settings</span>
              <p className="text-xs text-muted-foreground">Manage your account information</p>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem 
            onClick={handleLogout} 
            className="cursor-pointer rounded-lg p-3 focus:bg-red-50 dark:focus:bg-red-950 text-red-600 dark:text-red-400 transition-colors group"
          >
            <div className="p-2 rounded-full bg-red-50 dark:bg-red-950 group-hover:bg-red-100 dark:group-hover:bg-red-900 transition-colors">
              <LogOut className="h-4 w-4" />
            </div>
            <div className="mr-3">
              <span className="font-medium">{t('nav.logout')}</span>
              <p className="text-xs text-muted-foreground">Sign out of your account</p>
            </div>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileDropdown;
