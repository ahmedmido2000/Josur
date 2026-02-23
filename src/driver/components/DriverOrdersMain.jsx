import React, { useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { 
  useGetDriverNewOrdersQuery, 
  useGetDriverShippingOrdersQuery, 
  useGetDriverCompletedOrdersQuery,
  useRateCustomerMutation
} from '../../api/driver/driverApi';
import { toast } from 'react-toastify';

// Sub-components
import NewOrders from './NewOrders';
import ShippingOrders from './ShippingOrders';
import CompletedOrders from './CompletedOrders';

const DriverOrdersMain = () => {
  const { t } = useTranslation(['driver', 'common']);
  const { token } = useAuth();
  const [rateCustomer, { isLoading: isRating }] = useRateCustomerMutation();
  
  // State for tracking active sub-filter
  const [activeSubFilter, setActiveSubFilter] = useState('new-request');
  const [showRating, setShowRating] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  
  // API Queries
  const { data: newOrdersData, isLoading: isLoadingNew } = useGetDriverNewOrdersQuery(token, {
    skip: activeSubFilter !== 'new-request'
  });
  const { data: shippingOrdersData, isLoading: isLoadingShipping } = useGetDriverShippingOrdersQuery(token, {
    skip: activeSubFilter !== 'waiting'
  });
  const { data: completedOrdersData, isLoading: isLoadingCompleted } = useGetDriverCompletedOrdersQuery(token, {
    skip: activeSubFilter !== 'shipped'
  });

  // Extract items from API responses
  const newOrders = newOrdersData?.status === 1 ? newOrdersData.data[0]?.items || [] : [];
  const shippingOrders = shippingOrdersData?.status === 1 ? shippingOrdersData.data[0]?.items || [] : [];
  const completedOrders = completedOrdersData?.status === 1 ? completedOrdersData.data[0]?.items || [] : [];
  
  // Sub filters data
  const subFilters = [
    {
      id: 'new-request',
      label: t('driver:orders.status.new') || 'طلب جديد',
      icon: 'subfilter-icon-1.svg'
    },
    {
      id: 'waiting',
      label: t('driver:orders.status.waiting') || 'قيد الانتظار',
      icon: 'subfilter-icon-2.svg'
    },
    {
      id: 'shipped',
      label: t('driver:orders.status.shipped') || 'تم الشحن',
      icon: 'subfilter-icon-3.svg'
    }
  ];
  
  // Handle sub-filter click
  const handleSubFilterClick = (filterId) => {
    setActiveSubFilter(filterId);
  };

  const handleRateClient = (order) => {
    setSelectedOrder(order);
    setShowRating(true);
    setRating(0);
    setComment('');
  };

  const handleSubmitRating = async () => {
    if (rating === 0) {
      toast.error(t('driver:orders.rate_error') || 'يرجى اختيار التقييم');
      return;
    }

    try {
      const response = await rateCustomer({
        token,
        body: {
          reqeust_id: selectedOrder.id, // API expects 'reqeust_id' per instructions
          rate: rating,
          comment: comment
        }
      }).unwrap();

      if (response.status === 1) {
        toast.success(response.message || t('driver:orders.rate_success') || 'تم التقييم بنجاح');
        setShowRating(false);
      } else {
        toast.error(response.message || t('driver:orders.rate_error_api') || 'حدث خطأ أثناء التقييم');
      }
    } catch (error) {
      toast.error(t('common:error_occurred'));
    }
  };

  // Function to render the appropriate component based on sub-filter
  const renderOrdersList = () => {
    switch (activeSubFilter) {
      case 'new-request':
        return <NewOrders orders={newOrders} isLoading={isLoadingNew} />;
      case 'waiting':
        return <ShippingOrders orders={shippingOrders} isLoading={isLoadingShipping} />;
      case 'shipped':
        return <CompletedOrders orders={completedOrders} isLoading={isLoadingCompleted} onRateClient={handleRateClient} />;
      default:
        return null;
    }
  };

  return (
    <section>
      <h4 className="orders-title">{t('driver:orders.title') || 'الطلبات'}</h4>
      
      {/* Sub Filters */}
      <div className="orders-sub-filter row align-items-center justify-content-between mt-2 border-bottom">
        {subFilters.map((filter) => (
          <div key={filter.id} className="col-lg-3 col-md-6">
            <div 
              className={`sub-filter-item d-flex justify-content-center gap-1 align-items-center ${activeSubFilter === filter.id ? 'active' : ''}`}
              onClick={() => handleSubFilterClick(filter.id)}
              style={{ cursor: 'pointer' }}
            >
              <img 
                src={`/assets/${activeSubFilter === filter.id ? filter.icon.replace('.svg', '-active.svg') : filter.icon}`} 
                alt={filter.label} 
              />                
              <h6 className='sub-filter-text m-0'>{filter.label}</h6>
            </div>
          </div>
        ))}
      </div>

      {/* Render appropriate list based on sub-filter */}
      <div className="orders-content mt-3">
        {renderOrdersList()}
      </div>

      {/* Rating Modal */}
      {showRating && (
        <div className="rating-overlay" onClick={() => setShowRating(false)}>
          <div
            className="rating-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* User Info */}
            <img src={selectedOrder?.user_id?.avatar || "/assets/man.png"} className="rating-user-img" alt="user" />
            <h4 className="orders-card-title mb-2">{selectedOrder?.user_id?.name || 'عميل'}</h4>
            <h4 className="user-desc mb-2">{selectedOrder?.city_from || '--'}</h4>
            
            {/* Star Icons for visual */}
            <div className="flex gap-1 align-items-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                 <FontAwesomeIcon key={star} icon={faStar} className={selectedOrder?.user_id?.rate >= star ? 'yellow-star' : 'text-muted'} />
              ))}
            </div>

            <p className="orders-title mb-2">{t('driver:orders.rate_client_prompt') || 'يرجى تقييم العميل'}</p>
            <h4 className="user-desc mb-2">{t('driver:orders.experience_prompt') || 'كيف كانت تجربة العميل يرجى تقييمه'}</h4>

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
              placeholder={t('driver:orders.write_comment') || "اكتب تقييمك..."}
              rows='5'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            {/* Submit */}
            <button 
              className="login-button w-100" 
              onClick={handleSubmitRating}
              disabled={isRating}
            >
              {isRating ? t('common:loading') : (t('driver:orders.rate') || 'تقييم')}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

export default DriverOrdersMain;

