
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the available languages
export type Language = 'en' | 'ar';

// Define the context type
type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  isRtl: boolean;
};

// Create the context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
  isRtl: false,
});

// Create a hook for using the language context
export const useLanguage = () => useContext(LanguageContext);

// Define props for the provider component
interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Get the stored language or use 'en' as default
  const storedLanguage = localStorage.getItem('appLanguage') as Language;
  const [language, setLanguage] = useState<Language>(storedLanguage || 'en');
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const isRtl = language === 'ar';

  // Effect to load translations when language changes
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const langData = await import(`../locales/${language}.ts`);
        setTranslations(langData.default);
      } catch (error) {
        console.error(`Failed to load translations for ${language}:`, error);
      }
    };

    loadTranslations();
    
    // Save language preference to localStorage
    localStorage.setItem('appLanguage', language);
    
    // Update document direction
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    
    // Add or remove RTL class for tailwind
    if (isRtl) {
      document.documentElement.classList.add('rtl');
    } else {
      document.documentElement.classList.remove('rtl');
    }

    // Force update of UI components that depend on text direction
    window.dispatchEvent(new Event('languagechange'));
  }, [language, isRtl]);

  // Translation function
  const t = (key: string): string => {
    return translations[key] || key;
  };

  // Handle language change
  const handleSetLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
};
