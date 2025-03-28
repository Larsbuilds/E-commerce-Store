import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

const languages = [
  { code: 'en', name: 'English', dir: 'ltr', flag: '🇬🇧' },
  { code: 'ar', name: 'العربية', dir: 'rtl', flag: '🇸🇦' },
  { code: 'de', name: 'Deutsch', dir: 'ltr', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', dir: 'ltr', flag: '🇫🇷' },
  { code: 'es', name: 'Español', dir: 'ltr', flag: '🇪🇸' },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const changeLanguage = async (lng: string) => {
    try {
      const currentLang = languages.find(lang => lang.code === lng);
      if (currentLang) {
        // Update document direction
        document.documentElement.dir = currentLang.dir;
        document.documentElement.lang = currentLang.code;
        
        // Update DaisyUI RTL class
        document.documentElement.classList.remove('rtl', 'ltr');
        document.documentElement.classList.add(currentLang.dir);
        
        // Change language
        await i18n.changeLanguage(lng);
      }
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  useEffect(() => {
    const currentLang = languages.find(lang => lang.code === i18n.language);
    if (currentLang) {
      document.documentElement.dir = currentLang.dir;
      document.documentElement.lang = currentLang.code;
      document.documentElement.classList.remove('rtl', 'ltr');
      document.documentElement.classList.add(currentLang.dir);
    }
  }, [i18n.language]);

  return (
    <div className={`dropdown ${isRTL ? 'dropdown-start' : 'dropdown-end'}`}>
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
      </div>
      <ul tabIndex={0} className="dropdown-content z-50 menu p-2 shadow-lg bg-base-100 rounded-box w-52">
        {languages.map((lang) => (
          <li key={lang.code}>
            <button
              onClick={() => changeLanguage(lang.code)}
              className={`flex items-center gap-2 ${i18n.language === lang.code ? 'active' : ''}`}
            >
              <span className="text-lg">{lang.flag}</span>
              {lang.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LanguageSwitcher; 