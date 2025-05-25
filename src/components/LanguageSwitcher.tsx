
import React from 'react';
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

export function LanguageSwitcher() {
  const { t } = useLanguage();

  return (
    <Button variant="ghost" size="icon" className="rounded-full">
      <Globe size={20} />
      <span className="sr-only">العربية</span>
    </Button>
  );
}
