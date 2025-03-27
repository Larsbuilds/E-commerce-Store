import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { useTranslation } from 'react-i18next';

const Layout = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className={`min-h-screen bg-base-100 ${isRTL ? 'rtl' : 'ltr'}`}>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout; 