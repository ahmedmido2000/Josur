import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const DriverSidebar = () => {
  const { t } = useTranslation('driver');
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarItems = [
    {
      id: 'orders',
      title: t('sidebar.orders'),
      icon: 'order-icon.svg',
      path: '/driver/orders'
    },
    {
      id: 'balance',
      title: t('sidebar.balance'),
      icon: 'charge-icon.svg',
      path: '/driver/balance'
    },
    {
      id: 'profile',
      title: t('sidebar.profile'),
      icon: 'profile-icon.svg',
      path: '/driver/profile'
    }
  ];

  return (
    <aside className='user-sidebar'>
      {sidebarItems.map((item) => {
        const isActive = location.pathname === item.path;

        return (
          <div 
            key={item.id}
            className={`user-sidebar-item d-flex gap-2 align-items-center mb-2 ${isActive ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
            style={{ cursor: 'pointer' }}
          >
            <img 
              src={`../assets/${isActive ? item.icon.replace('.svg', '-active.svg') : item.icon}`} 
              alt={item.title} 
            />
            <h6 className='user-sidebar-title m-0'>{item.title}</h6>
          </div>
        )
      })}
    </aside>
  )
}

export default DriverSidebar;
