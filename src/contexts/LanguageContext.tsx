
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
        if (language === 'en') {
          const { en } = await import('../locales/en.ts');
          // Flatten the nested object structure for easier access
          const flattenedTranslations = flattenObject(en);
          setTranslations(flattenedTranslations);
        } else if (language === 'ar') {
          const arTranslations = await import('../locales/ar.ts');
          // Arabic file has default export
          setTranslations(arTranslations.default || {});
        }
      } catch (error) {
        console.error(`Failed to load translations for ${language}:`, error);
        setTranslations({});
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

  // Helper function to flatten nested object
  const flattenObject = (obj: any, prefix = ''): Record<string, string> => {
    const flattened: Record<string, string> = {};
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newKey = prefix ? `${prefix}.${key}` : key;
        
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          Object.assign(flattened, flattenObject(obj[key], newKey));
        } else {
          flattened[newKey] = obj[key];
        }
      }
    }
    
    return flattened;
  };

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
