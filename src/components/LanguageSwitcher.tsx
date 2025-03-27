import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

const languages = [
  { code: 'en', name: 'English', dir: 'ltr' },
  { code: 'ar', name: 'العربية', dir: 'rtl' },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = async (lng: string) => {
    try {
      await i18n.changeLanguage(lng);
      console.log('Language changed to:', lng);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  useEffect(() => {
    // Update document direction based on current language
    const currentLang = languages.find(lang => lang.code === i18n.language);
    if (currentLang) {
      // Only set dir on the main content, not the navbar
      const mainContent = document.querySelector('main');
      if (mainContent) {
        mainContent.dir = currentLang.dir;
      }
      document.documentElement.lang = currentLang.code;
      console.log('Direction set to:', currentLang.dir);
    }
  }, [i18n.language]);

  return (
    <div className="dropdown dropdown-end" dir="ltr" style={{ direction: 'ltr' }}>
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
      </div>
      <ul tabIndex={0} className="dropdown-content z-50 menu p-2 shadow-lg bg-base-100 rounded-box w-52" style={{ direction: 'ltr' }}>
        {languages.map((lang) => (
          <li key={lang.code}>
            <button
              onClick={() => changeLanguage(lang.code)}
              className={`flex items-center gap-2 ${i18n.language === lang.code ? 'active' : ''}`}
            >
              <span className="text-lg">{lang.code === 'ar' ? '🇸🇦' : '🇬🇧'}</span>
              {lang.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LanguageSwitcher; 