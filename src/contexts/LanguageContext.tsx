import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the available languages - Arabic only
export type Language = 'ar';

// Define the context type
type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  isRtl: boolean;
};

// Create the context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: 'ar',
  setLanguage: () => {},
  t: (key) => key,
  isRtl: true,
});

// Create a hook for using the language context
export const useLanguage = () => useContext(LanguageContext);

// Define props for the provider component
interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Always use Arabic
  const [language] = useState<Language>('ar');
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const isRtl = true;

  // Effect to load Arabic translations
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const arTranslations = await import('../locales/ar.ts');
        setTranslations(arTranslations.ar || {});
      } catch (error) {
        console.error('Failed to load Arabic translations:', error);
        setTranslations({});
      }
    };

    loadTranslations();
    
    // Save language preference to localStorage
    localStorage.setItem('appLanguage', language);
    
    // Update document direction to RTL
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
    
    // Add RTL class for tailwind
    document.documentElement.classList.add('rtl');

    // Force update of UI components that depend on text direction
    window.dispatchEvent(new Event('languagechange'));
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    return translations[key] || key;
  };

  // Handle language change (always Arabic)
  const handleSetLanguage = (newLanguage: Language) => {
    // Always keep Arabic
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
};
