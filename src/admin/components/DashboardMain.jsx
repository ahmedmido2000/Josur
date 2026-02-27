import React, { useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Import new components
import VehiclesComponent from './VehiclesComponent';
import DriversComponent from './DriversComponent';
import LiveTrackingComponent from './LiveTrackingComponent';
import TripHistoryComponent from './TripHistoryComponent';
import SettingsComponent from './SettingsComponent';

const DashboardMain = () => {
  const { t } = useTranslation(['admin']);

  // State for tracking active sub-filter
  const [activeSubFilter, setActiveSubFilter] = useState('vehicles');
  
  // State for tracking if offers section is expanded
  const [offersExpanded, setOffersExpanded] = useState(false);
  
  // Sub filters data (now with 5 items)
  const subFilters = [
    {
      id: 'vehicles',
      label: t('admin:dashboard.vehicles'),
      icon: 'admin-filter-icon-1.svg'
    },
    {
      id: 'drivers',
      label: t('admin:dashboard.drivers'),
      icon: 'admin-filter-icon-2.svg'
    },
    {
      id: 'live-tracking',
      label: t('admin:dashboard.liveTracking'),
      icon: 'admin-filter-icon-3.svg'
    },
    {
      id: 'trip-history',
      label: t('admin:dashboard.tripHistory'),
      icon: 'admin-filter-icon-4.svg'
    },
    {
      id: 'settings',
      label: t('admin:dashboard.settingsTab'),
      icon: 'admin-filter-icon-5.svg'
    }
  ];
  
  // Handle sub-filter click
  const handleSubFilterClick = (filterId) => {
    setActiveSubFilter(filterId);
    // Reset offers expanded state when changing sub-filters
    setOffersExpanded(false);
  };
  
  // Toggle offers section
  const toggleOffers = () => {
    setOffersExpanded(!offersExpanded);
  };

  // Function to render the appropriate button based on active filter
  const renderActionButton = () => {
    if (activeSubFilter === 'vehicles' || activeSubFilter === 'live-tracking') {
      return (
        <Link to='/admin/add-truck' className="login-button text-decoration-none d-flex align-items-center gap-2 justify-content-center take-img-btn"> 
          <FontAwesomeIcon icon={faPlus} /> {t('admin:dashboard.addVehicleBtn')}
        </Link>
      );
    } else if (activeSubFilter === 'drivers') {
      return (
        <Link to='/admin/add-driver' className="login-button text-decoration-none d-flex align-items-center gap-2 justify-content-center take-img-btn"> 
          <FontAwesomeIcon icon={faPlus} /> {t('admin:dashboard.inviteDriverBtn')}
        </Link>
      );
    } else if (activeSubFilter === 'settings') {
      return (
        <button type='button' className="login-button text-decoration-none d-flex align-items-center gap-2 justify-content-center take-img-btn"> 
           {t('admin:dashboard.editAllBtn')}
        </button>
      );
    }
    // No button for trip-history
    return null;
  };

  // Function to render the appropriate component based on sub-filter
  const renderActiveComponent = () => {
    switch (activeSubFilter) {
      case 'vehicles':
        return <VehiclesComponent />;
      case 'drivers':
        return <DriversComponent />;
      case 'live-tracking':
        return <LiveTrackingComponent />;
      case 'trip-history':
        return <TripHistoryComponent />;
      case 'settings':
        return <SettingsComponent />;
      default:
        return <div className="alert alert-info mt-3">يرجى اختيار قسم من القائمة</div>;
    }
  };

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center">
        <h4 className="orders-title m-0">{t('admin:dashboard.ownerDashboard')}</h4>
        {renderActionButton()}
      </div>
      
      {/* Sub Filters - now with 5 items */}
      <div className="orders-sub-filter d-flex align-items-center justify-content-between flex-wrap flex-md-nowrap mt-2 border-bottom">
        {subFilters.map((filter) => (
          <div key={filter.id} className="w-100">
            <div 
              className={`sub-filter-item d-flex justify-content-center gap-1 align-items-center ${activeSubFilter === filter.id ? 'active' : ''}`}
              onClick={() => handleSubFilterClick(filter.id)}
              style={{ cursor: 'pointer' }}
            >
              <img 
                src={`../assets/${activeSubFilter === filter.id ? filter.icon.replace('.svg', '-active.svg') : filter.icon}`} 
                alt={filter.label} 
              />                
              <h6 className='sub-filter-text m-0'>{filter.label}</h6>
            </div>
          </div>
        ))}
      </div>

      {/* Render appropriate component based on active filter */}
      {renderActiveComponent()}
      
    </section>
  )
}

export default DashboardMain;