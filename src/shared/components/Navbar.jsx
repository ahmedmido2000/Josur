import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const location = useLocation();
  const { t } = useTranslation(['common', 'auth', 'user']);
  const { isAuthenticated, user, logout, role } = useAuth();
  
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
            {(role === 'driver' || role === 'admin') ? (
                <Link to={role === 'admin' ? "/admin/dashboard" : "/driver/profile"} className="text-decoration-none">
                    <img src={user?.avatar || "/assets/man.png"} className='user-img border shadow-sm' alt="user" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                </Link>
            ) : (
                <div className="dropdown">
                    <div 
                        className="dropdown-toggle border-0 p-0" 
                        data-bs-toggle="dropdown" 
                        aria-expanded="false"
                        style={{ cursor: 'pointer' }}
                    >
                        <img src={user?.avatar || "/assets/man.png"} className='user-img border shadow-sm' alt="user" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                    </div>
                    <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 mt-2 p-2" style={{ borderRadius: '15px' }}>
                        <li>
                            <Link className="dropdown-item d-flex align-items-center gap-2 py-2 rounded-3" to="/user/profile">
                                <i className="fas fa-user-circle"></i>
                                <span>{t('user:user.navbar.profile')}</span>
                            </Link>
                        </li>
                        <li><hr className="dropdown-divider" /></li>
                        <li>
                            <Link className="dropdown-item d-flex align-items-center gap-2 py-2 rounded-3" to="/user/basic-upload">
                                <i className="fas fa-truck"></i>
                                <span>{t('user:user.navbar.basicUpload')}</span>
                            </Link>
                        </li>
                        <li>
                            <Link className="dropdown-item d-flex align-items-center gap-2 py-2 rounded-3" to="/user/trip-upload">
                                <i className="fas fa-route"></i>
                                <span>{t('user:user.navbar.tripUpload')}</span>
                            </Link>
                        </li>
                        <li>
                            <Link className="dropdown-item d-flex align-items-center gap-2 py-2 rounded-3" to="/user/contract-upload">
                                <i className="fas fa-file-contract"></i>
                                <span>{t('user:user.navbar.contractUpload')}</span>
                            </Link>
                        </li>
                        <li><hr className="dropdown-divider" /></li>
                        <li>
                            <button className="dropdown-item d-flex align-items-center gap-2 py-2 rounded-3 text-danger border-0 bg-transparent w-100 text-start" onClick={logout}>
                                <i className="fas fa-sign-out-alt"></i>
                                <span>{t('common:buttons.logout')}</span>
                            </button>
                        </li>
                    </ul>
                </div>
            )}
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
                  {(role === 'driver' || role === 'admin') ? (
                    <div className="d-flex align-items-center gap-2">
                        <Link 
                            to={role === 'admin' ? "/admin/dashboard" : "/driver/profile"} 
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
                            <span className="d-lg-none">{t('common:buttons.logout')}</span>
                        </button>
                    </div>
                  ) : (
                    <div className="dropdown d-flex justify-content-center">
                        <div 
                            className="login-button text-decoration-none d-flex align-items-center justify-content-center justify-content-lg-start gap-2 px-3 py-2 rounded-pill shadow-sm dropdown-toggle border-0"
                            id="userDropdown"
                            role="button"
                            data-bs-toggle="dropdown" 
                            aria-expanded="false"
                            style={{ cursor: 'pointer' }}
                        >
                            <img 
                                src={user?.avatar || "/assets/avatar.png"} 
                                alt="avatar" 
                                style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} 
                                onError={(e) => { e.target.src = "/assets/man.png" }}
                            />
                            <span className="fw-semibold">{(user?.name || t('navigation.profile'))}</span>
                        </div>
                        <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 mt-2 p-2" aria-labelledby="userDropdown" style={{ borderRadius: '15px' }}>
                            <li>
                                <Link className="dropdown-item d-flex align-items-center gap-2 py-2 rounded-3" to="/user/profile">
                                    <i className="fas fa-user-circle"></i>
                                    <span>{t('user:user.navbar.profile')}</span>
                                </Link>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li>
                                <Link className="dropdown-item d-flex align-items-center gap-2 py-2 rounded-3" to="/user/basic-upload">
                                    <i className="fas fa-truck"></i>
                                    <span>{t('user:user.navbar.basicUpload')}</span>
                                </Link>
                            </li>
                            <li>
                                <Link className="dropdown-item d-flex align-items-center gap-2 py-2 rounded-3" to="/user/trip-upload">
                                    <i className="fas fa-route"></i>
                                    <span>{t('user:user.navbar.tripUpload')}</span>
                                </Link>
                            </li>
                            <li>
                                <Link className="dropdown-item d-flex align-items-center gap-2 py-2 rounded-3" to="/user/contract-upload">
                                    <i className="fas fa-file-contract"></i>
                                    <span>{t('user:user.navbar.contractUpload')}</span>
                                </Link>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li>
                                <button className="dropdown-item d-flex align-items-center gap-2 py-2 rounded-3 text-danger border-0 bg-transparent w-100 text-start" onClick={logout}>
                                    <i className="fas fa-sign-out-alt"></i>
                                    <span>{t('common:buttons.logout')}</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <Link to="/login" className="login-button text-decoration-none px-4 py-2 rounded-pill text-center">
                    {t('auth:login.loginButton')}
                  </Link>
                  <Link to="/login" className="join-button text-decoration-none px-4 py-2 rounded-pill shadow-sm text-center">
                    {t('common:hero.joinDriver')}
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