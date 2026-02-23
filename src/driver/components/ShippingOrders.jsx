import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong, faCircle } from "@fortawesome/free-solid-svg-icons";
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const ShippingOrders = ({ orders, isLoading }) => {
  const { t } = useTranslation(['driver', 'common']);

  if (isLoading) {
    return <div className="text-center py-4">{t('common:loading')}...</div>;
  }

  if (!orders || orders.length === 0) {
    return <div className="alert alert-info mt-3">{t('driver:orders.no_shipping_orders') || 'لا توجد طلبات قيد الشحن'}</div>;
  }

  return (
    <div className="waiting-orders-card">
      {orders.map((order) => {
        const orderTitle = order.good_type_id?.name || order.type?.name || 'طلب توصيل';
        const userAvatar = order.user_id?.avatar || "/assets/man.png";
        const userName = order.user_id?.name || 'عميل';
        const userRate = order.user_id?.rate || 0;
        
        const displayDate = order.date !== "0000-00-00" ? order.date : '--';
        const displayTime = order.time || '--';

        return (
          <div key={order.id} className="card-order-details p-2 border rounded-3 mt-2">
            <div className="d-flex flex-column align-items-start gap-2 w-100">
              <div className='d-flex align-items-center justify-content-between w-100'>
                <div>
                  <h3 className='orders-card-title m-0 mb-1'>{orderTitle}</h3>
                  <h5 className='footer-link m-0'>{t('driver:orders.client') || 'العميل'}</h5>
                </div>
                <div className="charging-badge py-1 px-2 rounded-2 text-nowrap d-flex align-items-center">
                  <FontAwesomeIcon icon={faCircle} className='dot-orange' /> {t('driver:orders.status.shipping') || 'قيد الشحن'}
                </div>
              </div>

              <div className="d-flex gap-2 align-items-start">
                <img src={userAvatar} className='user-img' alt="user" style={{width: '40px', height: '40px', borderRadius: '50%'}} />
                <div>
                  <div className="d-flex gap-1 align-items-center">
                    <h6 className="user-name m-0">{userName}</h6>
                    <div className="new-order-badge p-1 rounded-2 text-nowrap">
                        {userRate} <img src="/assets/star.svg" alt="rate" />
                    </div>
                  </div>
                  <p className="user-desc m-0">{order.city_from || '--'}</p>
                </div>
              </div>

              <div className="from-to-wrapper">
                <div className="from-to-icons">
                  <div className="location-icon">
                    <LocationOnOutlinedIcon className='fs-6' />
                  </div>
                  <div className="circle"></div>
                  <FontAwesomeIcon icon={faArrowDownLong} className="arrow" />
                  <div className="location-icon">
                    <LocationOnOutlinedIcon className='fs-6' />
                  </div>
                </div>
                <div className="from-to-text">
                  <span>{order.city_from || '--'}</span>
                  <span>{order.city_to || '--'}</span>
                </div>
              </div>

              <div className="d-flex gap-2 align-items-center">
                <img src="/assets/calendar.svg" className='mb-1' alt="calendar" />
                <h6 className='user-desc m-0'>{displayDate}</h6>
                <FontAwesomeIcon icon={faCircle} className='dot-icon' />
                <h6 className='user-desc m-0'>{displayTime}</h6>
              </div>

              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 w-100">
                <div className="d-flex align-items-center gap-2">
                  <Link to='/tracking' className="offers-dropdown text-decoration-none d-flex align-items-center justify-content-center gap-2">
                    <h6 className='offers-dropdown-text m-0'>{t('driver:orders.track_location') || 'تتبع موقعك'}</h6>
                  </Link>
                  <div className="contact-driver-button">
                    <p className='m-0'>{t('driver:orders.call_client') || 'الاتصال بالعميل'}</p>
                  </div>
                  <Link 
                    to={`/driver/order-details/${order.id}`} 
                    state={{ order }}
                    className="code-badge d-flex align-items-center gap-2 text-decoration-none"
                    style={{ cursor: 'pointer', color: 'inherit' }}
                  >
                    {t('driver:orders.details') || 'التفاصيل'}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ShippingOrders;
