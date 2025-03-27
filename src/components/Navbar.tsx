import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const { items } = useCart();
  const { t, i18n } = useTranslation();
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const isRTL = i18n.language === 'ar';

  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-xl">
            FAkestore
          </Link>
        </div>
        <div className="flex-none gap-4 items-center">
          <LanguageSwitcher />
          <Link to="/cart" className="btn btn-ghost btn-circle">
            <div className="indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {itemCount > 0 && (
                <span className="badge badge-sm indicator-item">
                  {itemCount === 1 ? t('cart.item', { count: itemCount }) : t('cart.items', { count: itemCount })}
                </span>
              )}
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar; 