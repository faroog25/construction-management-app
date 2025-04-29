
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Globe size={20} />
          <span className="sr-only">{t('language')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => setLanguage('en')}
          className={language === 'en' ? 'bg-muted' : ''}
        >
          <span className="flex items-center">
            {language === 'en' && <span className="mr-2 text-primary">✓</span>}
            {t('language.english')}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setLanguage('ar')}
          className={language === 'ar' ? 'bg-muted' : ''}
        >
          <span className="flex items-center">
            {language === 'ar' && <span className="mr-2 text-primary">✓</span>}
            {t('language.arabic')}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
