
import { Language } from "@/contexts/LanguageContext";

// Get the stored language from localStorage - always Arabic
export const getLocalStorageLanguage = (): Language => {
  return 'ar';
};
