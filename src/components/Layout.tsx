import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { useTranslation } from 'react-i18next';

const Layout = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language === 'ar' ? 'rtl' : 'ltr';

  return (
    <div className="min-h-screen bg-base-100" dir={currentLang}>
      <Navbar />
      <main className="container mx-auto px-4 py-8" dir={currentLang}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout; 