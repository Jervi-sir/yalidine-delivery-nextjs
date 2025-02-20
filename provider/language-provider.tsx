import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const LanguageContext = createContext(null);
const KEY_NAME = 'currentLanguage';

export const useLanguage = () => {
   const context = useContext(LanguageContext);
   if (!context) {
      throw new Error('useLanguage must be used within a LanguageProvider');
   }
   return context;
};

export const LanguageProvider = ({ children }) => {
   const [language, setLanguage] = useState('French');
   const [isRtl, setIsRtl] = useState(false);

   useEffect(() => {
      getLanguage();
   }, []);

   // Fetch language from cookies
   const getLanguage = () => {
      try {
         const storedLanguage = Cookies.get(KEY_NAME);
         if (storedLanguage) {
            setLanguage(storedLanguage);
            setIsRtl(storedLanguage === 'Arabic');
         }
      } catch (error) {
         console.error('Failed to get language from cookies:', error);
      }
   };

   // Save language to cookies
   const changeLanguage = (newLanguage) => {
      setLanguage(newLanguage);
      setIsRtl(newLanguage === 'Arabic');
      Cookies.set(KEY_NAME, newLanguage, { expires: 365 }); // Save for 1 year
   };

   // Translate function
   const translate = ({ label, translations }) => {
      return translations[label][language] || label;
   };

   // Context value
   const value = {
      language,
      isRtl,
      changeLanguage,
      translate,
   };

   return (
      <LanguageContext.Provider value={value}>
         {children}
      </LanguageContext.Provider>
   );
};

export const useTranslation = (translations) => {
   const { translate } = useLanguage();

   return (label) => {
      try {
         return translate({ label, translations });
      } catch (error) {
         return label; // Fallback to the label if translation fails
      }
   };
};
