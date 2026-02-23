import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong, faCircle } from "@fortawesome/free-solid-svg-icons";
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useCreateOfferMutation } from '../../api/driver/driverApi';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';

const NewOrders = ({ orders, isLoading }) => {
  const { t } = useTranslation(['driver', 'common']);
  const navigate = useNavigate();
  const { token } = useAuth();
  const [createOffer, { isLoading: isCreatingOffer }] = useCreateOfferMutation();
  const [prices, setPrices] = useState({});

  const handlePriceChange = (orderId, value) => {
    setPrices(prev => ({ ...prev, [orderId]: value }));
  };

  const handleApplyOffer = async (orderId, price) => {
    if (!price) {
      toast.error(t('driver:orders.enter_price_error') || 'يرجى إدخال السعر');
      return;
    }

    try {
      const response = await createOffer({
        token,
        body: {
          request_id: orderId,
          price: price
        }
      }).unwrap();

      if (response.status === 1) {
        toast.success(response.message || t('driver:orders.offer_success') || 'تم إرسال العرض بنجاح');
      } else {
        toast.error(response.message || t('driver:orders.offer_error') || 'حدث خطأ أثناء إرسال العرض');
      }
    } catch (error) {
      toast.error(t('common:error_occurred'));
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">{t('common:loading')}...</div>;
  }

  if (!orders || orders.length === 0) {
    return <div className="alert alert-info mt-3">{t('driver:orders.no_new_orders') || 'لا توجد طلبات جديدة حالياً'}</div>;
  }

  return (
    <>
      {orders.map((order) => {
        // Extract display fields from the API object
        const orderTitle = order.good_type_id?.name || order.type?.name || 'طلب توصيل';
        const userAvatar = order.user_id?.avatar || "/assets/man.png";
        const userName = order.user_id?.name || 'عميل';
        const userRate = order.user_id?.rate || 0;
        
        // Format time/date
        const displayDate = order.date !== "0000-00-00" ? order.date : '--';
        const displayTime = order.time || '--';
        
        return (
          <div key={order.id} className="new-orders-card p-2 border rounded-3 mt-2">
            <div className="card-order-details pb-2">
              <div className="d-flex flex-column align-items-start gap-2 w-100">
                <div className='d-flex align-items-center justify-content-between w-100'>
                  <h3 className='orders-card-title m-0'>{orderTitle}</h3>
                  <div className='d-flex gap-2 align-items-center'>
                    {order.created_at && (
                        <div className='not-have'>{t('driver:orders.since') || 'منذ'} {order.created_at.split(' ')[1]}</div>
                    )}
                    <div className="new-order-badge py-1 px-2 rounded-2 text-nowrap">
                        {t('driver:orders.status.new') || 'طلب جديد'}
                    </div>
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

                <div className="d-flex align-items-center flex-wrap gap-2">
                    <img src="/assets/distance.svg" alt="distance" />
                    <p className="orders-card-title mb-2">-- كلم</p>
                    <FontAwesomeIcon icon={faCircle} className='dot-gray-8' />
                    <img src="/assets/box.svg" alt="goods" />
                    <p className="orders-card-title mb-2">
                        {order.good_type_id?.name || '--'}
                    </p>
                </div>

                <h3 className='orders-card-title m-0'>{t('driver:orders.enter_price') || 'ادخل السعر المناسب لك'}</h3>
                
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 w-100">
                  <div className="d-flex align-items-center flex-wrap gap-2">
                    <input
                      type="number"
                      className="form-control form-input py-2 blue-input"
                      placeholder="500" 
                      style={{width:'200px'}}
                      value={prices[order.id] || ''}
                      onChange={(e) => handlePriceChange(order.id, e.target.value)}
                    />
                    <button 
                      type='button' 
                      className="login-button text-nowrap text-decoration-none"
                      onClick={() => handleApplyOffer(order.id, 120)}
                      disabled={isCreatingOffer}
                    >
                        {t('driver:orders.apply_with') || 'التقدم ب '} 120$
                    </button>
                    <button 
                      type='button' 
                      className="login-button text-nowrap text-decoration-none"
                      onClick={() => handleApplyOffer(order.id, 150)}
                      disabled={isCreatingOffer}
                    >
                        {t('driver:orders.apply_with') || 'التقدم ب '} 150$
                    </button>
                    {prices[order.id] && (
                         <button 
                         type='button' 
                         className="login-button text-nowrap text-decoration-none"
                         onClick={() => handleApplyOffer(order.id, prices[order.id])}
                         disabled={isCreatingOffer}
                       >
                           {t('driver:orders.apply_with') || 'إرسال عرض ب'} {prices[order.id]}$
                       </button>
                    )}
                  </div>
                  <div 
                    className="code-badge d-flex align-items-center gap-2" 
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/driver/order-details/${order.id}`, { state: { order } })}
                  >
                    {t('driver:orders.details') || 'التفاصيل'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default NewOrders;
