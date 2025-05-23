
import { Language } from "@/contexts/LanguageContext";

// Get the stored language from localStorage
export const getLocalStorageLanguage = (): Language => {
  const storedLanguage = localStorage.getItem('appLanguage') as Language;
  return storedLanguage || 'en';
};
