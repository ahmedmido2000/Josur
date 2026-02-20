import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../hooks/useAuth';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { selectTheme, setTheme } from '../../store/slices/uiSlice';
import { useGetNotificationBadgeQuery } from '../../api/site/notificationApi';

const UserNavbar = () => {
  const location = useLocation();
  const { t } = useTranslation(['common', 'user']);
  const { user, role, logout } = useAuth();
  const dispatch = useDispatch();
  const currentTheme = useSelector(selectTheme);
  
  // Fetch notification badge count
  const { data: badgeCount } = useGetNotificationBadgeQuery(undefined, {
    pollingInterval: 30000,
  });

  const handleToggleTheme = () => {
    dispatch(setTheme(currentTheme === 'light' ? 'dark' : 'light'));
  };
  
  // Navigation items with translation keys
  const navItems = [
    { name: t('navigation.home'), path: '/' },
    { name: t('user:orders.title'), path: '/user/orders' },
    { name: t('user:balance.title'), path: '/user/balance' },
    { name: t('user:profile.title'), path: '/user/profile' },
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
        <div className="d-flex d-lg-none align-items-center gap-2 ms-auto me-1">
            <div className="nav-labg-mode bg-light rounded-pill p-2" onClick={handleToggleTheme} style={{ cursor: 'pointer', display: 'flex' }}>
              <img src={currentTheme === 'light' ? "/assets/moon.svg" : "/assets/sun.svg"} alt="mode" width="16" />
            </div>
            <LanguageSwitcher isMinimal={true} />
            <Link to="/user/notifications" className="nav-labg-mode position-relative bg-light rounded-pill p-2">
              <img src="/assets/notification.svg" alt="notification" width="16" />
              {badgeCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.4rem', padding: '0.15em 0.3em' }}>
                  {badgeCount}
                </span>
              )}
            </Link>
        </div>
        
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
          <ul className="navbar-nav align-items-lg-center gap-lg-2 gap-xl-3 gap-xxl-4 mt-3 mt-lg-0 px-2 px-lg-0">
            <li className="nav-item d-none d-lg-block">
              <LanguageSwitcher />
            </li>
            <li className="nav-item d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center gap-2 gap-xl-3">
                <div className="d-flex align-items-center justify-content-center gap-2">
                    <Link to="/user/notifications" className="nav-labg-mode position-relative bg-light rounded-pill p-2 hover-shadow">
                      <img src="/assets/notification.svg" alt="notification" width="20" />
                      {badgeCount > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                          {badgeCount}
                        </span>
                      )}
                    </Link>
                    <div className="nav-labg-mode bg-light rounded-pill p-2" onClick={handleToggleTheme} style={{ cursor: 'pointer' }}>
                      <img src={currentTheme === 'light' ? "/assets/moon.svg" : "/assets/sun.svg"} alt="mode" width="20" />
                    </div>
                </div>
                
                <div className="d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center gap-2">
                    <Link to="/user/profile" className="d-flex gap-2 align-items-center justify-content-center justify-content-lg-start text-decoration-none login-button px-3 py-2 rounded-pill shadow-sm">
                        <img src={user?.avatar || "/assets/man.png"} className='user-img border border-white' alt="user" style={{ width: '26px', height: '26px', borderRadius: '50%' }} />
                        <div className="text-start">
                            <h6 className="user-name m-0" style={{ fontSize: '0.85rem' }}>{(user?.name || 'User')}</h6>
                        </div>
                    </Link>
                    <button onClick={logout} className="join-button border-0 px-3 py-2 rounded-pill shadow-sm d-flex align-items-center justify-content-center gap-2">
                        <i className="fas fa-sign-out-alt"></i>
                        <span className="d-lg-none">{t('buttons.logout', 'تسجيل الخروج')}</span>
                    </button>
                </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default UserNavbar;