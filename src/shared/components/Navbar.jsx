import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const location = useLocation();
  const { t } = useTranslation('common');
  const { isAuthenticated, user, logout } = useAuth();
  
  // Navigation items with translation keys
  const navItems = [
    { name: t('navigation.home'), path: '/' },
    { name: t('navigation.works'), path: '/works' },
    { name: t('navigation.providers'), path: '/service-provider' },
    { name: t('navigation.about'), path: '/about' },
    { name: t('navigation.contact'), path: '/contact' }
  ];

  return (
    <nav className="navbar navbar-expand-lg shadow-sm py-2 navbar-background">
      <div className="container-fluid px-lg-5">
        {/* Logo */}
        <Link to='/'><img src="assets/logo.png" alt="logo" /></Link>
        
        {/* Navbar Toggler for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible Content */}
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Nav List in the middle */}
          <ul className="navbar-nav mx-auto pt-3 pt-md-0">
            {navItems.map((item, index) => (
              <li className="nav-item" key={index}>
                <Link
                  className={`nav-link nav-link-custom ${location.pathname === item.path ? 'active' : ''}`}
                  to={item.path}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right side items (Language, Login, Join) */}
          <ul className="navbar-nav align-items-lg-center gap-lg-3">
            <li className="nav-item">
              <LanguageSwitcher />
            </li>
            <li className="nav-item d-flex align-items-center gap-2">
              {isAuthenticated ? (
                <>
                  <Link to="/user/profile" className="login-button text-decoration-none d-flex align-items-center gap-2">
                    <img 
                      src={user?.avatar || "assets/avatar.png"} 
                      alt="avatar" 
                      style={{ width: '25px', height: '25px', borderRadius: '50%', objectFit: 'cover' }} 
                    />
                    {user?.name || t('navigation.profile')}
                  </Link>
                  <button onClick={logout} className="join-button text-decoration-none border-0">
                    {t('buttons.logout', 'تسجيل الخروج')}
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="login-button text-decoration-none">
                    {t('auth:login.loginButton', 'سجل الدخول')}
                  </Link>
                  <Link to="/login" className="join-button text-decoration-none">
                    {t('hero.joinDriver', 'انضم كسائق')}
                  </Link>
                </>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;