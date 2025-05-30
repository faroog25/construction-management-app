
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, Bell, Search, Code2, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeSwitcher } from './ThemeSwitcher';
import UserProfileDropdown from './UserProfileDropdown';
import Team from '@/pages/Team';

const Navbar = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const { t, isRtl } = useLanguage();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('nav.dashboard'), path: '/dashboard' },
    { name: t('nav.projects'), path: '/projects' },
    // { name: t('nav.documents'), path: '/documents' },
    { name: t('nav.team'), path: '/team' },
    { name: t('nav.equipment'), path: '/equipment' },
    // { name: t('nav.api_docs'), path: '/api-docs', icon: <Code2 size={16} className={isRtl ? "ml-1" : "mr-1"} /> }
  ];
  
  return (
    <header className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300",
      isScrolled ? "bg-background/90 backdrop-blur-md shadow-sm" : "bg-transparent"
    )}>
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <NavLink to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="font-bold text-primary-foreground text-xl">C</span>
            </div>
            <span className="font-semibold text-xl hidden md:inline-block">{t('app.name')}</span>
          </NavLink>
          
          <nav className="hidden md:flex gap-6">
            {navLinks.map((link) => (
              <NavLink 
                key={link.path} 
                to={link.path}
                className={({ isActive }) => cn(
                  "nav-link flex items-center", 
                  isActive && "active"
                )}
              >
                {/* {link.icon} */}
                {link.name}
              </NavLink>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center gap-3">
          {/* <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full"
          >
            <Search size={20} />
            <span className="sr-only">{t('table.search')}</span>
          </Button> */}
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full"
          >
            <Bell size={20} />
            <span className="sr-only">Notifications</span>
          </Button>
          
          <ThemeSwitcher />
          {/* <LanguageSwitcher /> */}
          
          {/* User Profile Dropdown */}
          <UserProfileDropdown />
          
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Menu size={22} />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[300px] sm:w-[400px]" side={isRtl ? "right" : "left"}>
                <nav className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) => (
                    <NavLink 
                      key={link.path} 
                      to={link.path}
                      className={cn(
                        "text-lg px-2 py-3 rounded-md transition-colors flex items-center",
                        location.pathname === link.path 
                          ? "bg-primary/10 text-primary font-medium" 
                          : "hover:bg-muted"
                      )}
                    >
                      {/* {link.icon} */}
                      {link.name}
                    </NavLink>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
          
          {/* <div className="hidden md:block">
            <Button className="rounded-full" size="sm">{t('nav.get_started')}</Button>
          </div> */}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
