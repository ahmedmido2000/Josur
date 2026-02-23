import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import DriverNavbar from '../components/DriverNavbar'
import Footer from '../../shared/components/Footer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faClock } from '@fortawesome/free-regular-svg-icons'
import { useGetNotificationsQuery } from '../../api/site/notificationApi'
import LoadingSpinner from '../../components/LoadingSpinner'

const DriverNotifications = () => {
    const { t, i18n } = useTranslation(['driver']);
    const [showRating, setShowRating] = useState(false);
    const [rating, setRating] = useState(0);

    const { data: notificationsData, isLoading } = useGetNotificationsQuery();
    const notifications = notificationsData?.items || [];

    // Helper to get localized field
    const getLangField = (item, field) => {
        if (!item) return '';
        const isEn = i18n.language === 'en';
        const enField = `${field}_en`;
        return (isEn && item[enField]) ? item[enField] : item[field];
    };

  return (
    <>
        <DriverNavbar />
        <div className="container my-5">
            <h2 className='orders-title'>{t('notification.title')}</h2>
            
            {isLoading ? (
                <div className="d-flex justify-content-center py-5">
                    <LoadingSpinner />
                </div>
            ) : notifications.length === 0 ? (
                <div className="text-center py-5">
                    <p className="text-muted">{t('notification.noNotifications')}</p>
                </div>
            ) : (
                <>
                    <label className="form-label mb-1 mt-2">{t('notification.label')}</label>
                    <div className="notifications-container py-3 px-2 rounded-3">
                        {notifications.map((item, index) => (
                            <React.Fragment key={index}>
                                <div className="notification-item d-flex align-items-start gap-2">
                                    <img src={item.avatar || "/assets/man.png"} className='notification-user-img' alt="user" />
                                    <div>
                                        <div className="d-flex align-items-center gap-1 mb-1 flex-wrap">
                                            <h6 className='document-li m-0'>{getLangField(item, 'msg')}</h6>
                                            {item.order_title && <h5 className='orders-card-title m-0'>{item.order_title}</h5>}
                                        </div>
                                        <div className="d-flex gap-1 align-items-center footer-main-sublabel mb-2">
                                            <FontAwesomeIcon icon={faClock} />
                                            <p className='m-0'>{item.created_at}</p>
                                        </div>
                                        
                                        {/* Dynamic buttons based on notification type */}
                                        {item.type === 'action' && (
                                            <div className="d-flex gap-1">
                                                <button type='button' className="services-btn py-1 px-3 text-decoration-none">{t('notification.ignore')}</button>
                                                <button type='button' className="login-button py-1 px-3 text-decoration-none">{t('notification.startNow')}</button>
                                            </div>
                                        )}
                                        {item.type === 'rating' && (
                                            <div className="d-flex gap-1">
                                                <button type='button' className="services-btn py-1 px-3 text-decoration-none">{t('notification.ignore')}</button>
                                                <button type='button' className="orange-btn py-1 px-3 text-decoration-none" onClick={() => setShowRating(true)}>{t('notification.rate')}</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {index < notifications.length - 1 && <hr />}
                            </React.Fragment>
                        ))}
                    </div>
                </>
            )}
        </div>
        <Footer />
        {showRating && (
  <div className="rating-overlay" onClick={() => setShowRating(false)}>
    <div
      className="rating-modal"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="orders-title mb-4">{t('notification.rating.title')}</h3>

      {/* User Info */}
      <img src="/assets/man.png" className="rating-user-img" alt="" />
      <h4 className="orders-card-title mb-2">User Name</h4>
      <div className="d-flex gap-1 align-items-center mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
                <FontAwesomeIcon
                    key={star}
                    icon={faStar}
                    className={rating >= star ? 'yellow-star' : 'gray-star'}
                    onClick={() => setRating(star)}
                    style={{ cursor: 'pointer' }}
                />
            ))}
      </div>
      
      <button 
        className="login-button w-100" 
        onClick={() => setShowRating(false)}
      >
        {t('notification.rating.submit')}
      </button>
    </div>
  </div>
)}
    </>
  )
}

export default DriverNotifications
   