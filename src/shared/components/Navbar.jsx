import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const location = useLocation();
  const { t } = useTranslation(['common', 'auth', 'hero']);
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
    <nav className="navbar navbar-expand-lg shadow-sm py-2 navbar-background sticky-top">
      <div className="container-fluid px-lg-5">
        {/* Logo and Brand */}
        <div className="d-flex align-items-center gap-3">
          <Link to='/' className="navbar-brand m-0 p-0">
            <img src="/assets/logo.png" alt="logo" style={{ height: '40px' }} />
          </Link>
        </div>

        {/* Mobile Action Icons (Visible on mobile only) */}
        {!isAuthenticated && (
          <div className="d-flex d-lg-none align-items-center gap-2 ms-auto me-2">
            <LanguageSwitcher isMinimal={true} />
            <Link to="/login" className="login-button py-1 px-3 fs-6 text-decoration-none rounded-pill">
              {t('auth:login.loginButton')}
            </Link>
          </div>
        )}
        {isAuthenticated && (
          <div className="d-flex d-lg-none align-items-center gap-2 ms-auto me-2">
            <LanguageSwitcher isMinimal={true} />
            <Link to={user?.role === 'driver' ? "/driver/profile" : "/user/profile"} className="text-decoration-none">
                <img src={user?.avatar || "/assets/man.png"} className='user-img border shadow-sm' alt="user" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
            </Link>
          </div>
        )}
        
        {/* Navbar Toggler */}
        <button
          className="navbar-toggler border-0 shadow-none"
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
          <ul className="navbar-nav mx-auto pt-3 pt-lg-0">
            {navItems.map((item, index) => (
              <li className="nav-item mx-lg-0 mx-xl-1" key={index}>
                <Link
                  className={`nav-link nav-link-custom ${location.pathname === item.path ? 'active' : ''}`}
                  to={item.path}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Action items (Mobile & Desktop) */}
          <ul className="navbar-nav align-items-lg-center gap-lg-3 mt-3 mt-lg-0 px-2 px-lg-0">
            <li className="nav-item d-none d-lg-block">
              <LanguageSwitcher />
            </li>
            <li className="nav-item d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center gap-2">
              {isAuthenticated ? (
                <>
                  <Link 
                    to={user?.role === 'driver' ? "/driver/profile" : "/user/profile"} 
                    className="login-button text-decoration-none d-flex align-items-center justify-content-center justify-content-lg-start gap-2 px-3 py-2 rounded-pill shadow-sm"
                  >
                    <img 
                      src={user?.avatar || "/assets/avatar.png"} 
                      alt="avatar" 
                      style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} 
                      onError={(e) => { e.target.src = "/assets/man.png" }}
                    />
                    <span className="fw-semibold">{(user?.name || t('navigation.profile'))}</span>
                  </Link>
                  <button onClick={logout} className="join-button text-decoration-none border-0 px-3 py-2 rounded-pill d-flex align-items-center justify-content-center gap-2">
                    <i className="fas fa-sign-out-alt"></i>
                    <span className="d-lg-none">{t('buttons.logout', 'تسجيل الخروج')}</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="login-button text-decoration-none px-4 py-2 rounded-pill text-center">
                    {t('auth:login.loginButton')}
                  </Link>
                  <Link to="/login" className="join-button text-decoration-none px-4 py-2 rounded-pill shadow-sm text-center">
                    {t('hero:hero.joinDriver')}
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