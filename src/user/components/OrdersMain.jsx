import React, { useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import BasicOrders from './BasicOrders';
import TripOrders from './TripOrders';
import ContractOrders from './ContractOrders';
import { useTranslation } from 'react-i18next';

const OrdersMain = () => {
  const { t } = useTranslation(['user', 'common']);
  // State for tracking active main filter and sub-filter
  const [showRating, setShowRating] = useState(false);
const [rating, setRating] = useState(0);

  const [activeMainFilter, setActiveMainFilter] = useState('basic-orders');
  const [activeSubFilter, setActiveSubFilter] = useState('new-request');
  
  // State for tracking if offers section is expanded
  const [offersExpanded, setOffersExpanded] = useState(false);
  
  // Main filters data
  const mainFilters = [
    {
      id: 'basic-orders',
      label: t('common:requestTypes.normal')
    },
    {
      id: 'trip-orders',
      label: t('common:requestTypes.trips')
    },
    {
      id: 'contract-orders',
      label: t('common:requestTypes.contract')
    }
  ];
  
  // Sub filters data
  const subFilters = [
    {
      id: 'new-request',
      label: t('user:user.orders.status.new'),
      icon: 'subfilter-icon-1.svg'
    },
    {
      id: 'waiting',
      label: t('user:user.orders.status.waiting'),
      icon: 'subfilter-icon-2.svg'
    },
    {
      id: 'shipped',
      label: t('user:user.orders.status.shipped'),
      icon: 'subfilter-icon-3.svg'
    },
    {
      id: 'cancelled',
      label: t('user:user.orders.status.cancelled'),
      icon: 'subfilter-icon-4.svg'
    }
  ];
  
  // Handle main filter change
  const handleMainFilterChange = (filterId) => {
    setActiveMainFilter(filterId);
    // Reset sub-filter to first option when main filter changes
    setActiveSubFilter('new-request');
    // Reset offers expanded state when changing filters
    setOffersExpanded(false);
  };
  
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

  // Function to render the appropriate card based on both filters
  const renderOrderCard = () => {
    // Basic Orders
    if (activeMainFilter === 'basic-orders') {
      return (
        <BasicOrders 
          activeSubFilter={activeSubFilter} 
          offersExpanded={offersExpanded} 
          toggleOffers={toggleOffers} 
          setShowRating={setShowRating} 
        />
      );
    }
    // Trip Orders
    else if (activeMainFilter === 'trip-orders') {
      return (
        <TripOrders 
          activeSubFilter={activeSubFilter} 
          offersExpanded={offersExpanded} 
          toggleOffers={toggleOffers} 
          setShowRating={setShowRating} 
        />
      );
    }
    // Contract Orders
    else if (activeMainFilter === 'contract-orders') {
      return (
        <ContractOrders 
          activeSubFilter={activeSubFilter} 
          offersExpanded={offersExpanded} 
          toggleOffers={toggleOffers} 
          setShowRating={setShowRating} 
        />
      );
    }
    
    // Default case
    return <div className="alert alert-info">{t('user:user.orders.no_orders')}</div>;
  };

  return (
    <section>
      <h4 className="orders-title">{t('user:user.orders.title')}</h4>
      
      {/* Main Filters */}
      <div className="orders-main-filter d-flex align-items-center gap-4 mt-2">
        {mainFilters.map((filter) => (
          <div key={filter.id} className="main-filter-item d-flex gap-1 align-items-center">
            <input 
              type="radio" 
              id={filter.id} 
              name='orders-main-filter'
              checked={activeMainFilter === filter.id}
              onChange={() => handleMainFilterChange(filter.id)}
            />
            <label 
              className='main-filter-text' 
              htmlFor={filter.id}
            >
              {filter.label}
            </label>
          </div>
        ))}
      </div>
      
      {/* Sub Filters */}
      <div className="orders-sub-filter row align-items-center mt-2 border-bottom g-2">
        {subFilters.map((filter) => (
          <div key={filter.id} className="col-6 col-lg-3">
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

      {/* Render appropriate card based on both filters */}
      {renderOrderCard()}
      {showRating && (
  <div className="rating-overlay" onClick={() => setShowRating(false)}>
    <div
      className="rating-modal"
      onClick={(e) => e.stopPropagation()}
    >


      {/* Driver Info */}
      <img src="../assets/man.png" className="rating-user-img" alt="" />
      <h4 className="orders-card-title mb-2">Omar Alrajihi</h4>
      <h4 className="user-desc mb-2">{t('user:user.orders.truck_driver')}</h4>
      <div className="flex gap-1 align-items-center">
            <FontAwesomeIcon
                  icon={faStar}
                  className='yellow-star'
                />
            <FontAwesomeIcon
                  icon={faStar}
                  className='yellow-star'
                />
            <FontAwesomeIcon
                  icon={faStar}
                  className='yellow-star'
                />
            <FontAwesomeIcon
                  icon={faStar}
                  className='yellow-star'
                />
            <FontAwesomeIcon
                  icon={faStar}
                  className='yellow-star'
                />
            </div>
      {/* Stars */}
      <p className="orders-title mb-2">{t('user:user.orders.rating_title')}</p>
      <h4 className="user-desc mb-2">{t('user:user.orders.rating_subtitle')}</h4>

      <div className="stars-wrapper">
        {[1, 2, 3, 4, 5].map((star) => (
          <FontAwesomeIcon
            key={star}
            icon={faStar}
            className={`star ${rating >= star ? "active" : ""}`}
            onClick={() => setRating(star)}
          />
        ))}
      </div>

      {/* Comment */}
      <textarea
        className="form-control form-input mb-3"
        placeholder={t('user:user.orders.rating_placeholder')}
        rows='5'
      />

      {/* Submit */}
      <button className="login-button w-100">
        {t('user:user.orders.rating_button')}
      </button>
    </div>
  </div>
)}

    </section>
  )
}

export default OrdersMain;