import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong, faCircle, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  useGetNormalNewOrdersQuery, 
  useGetNormalShippingOrdersQuery, 
  useGetNormalCompleteOrdersQuery, 
  useGetNormalCanceledOrdersQuery 
} from '../../api/user/userApi';
import { useGetListsQuery } from '../../api/site/siteApi';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../../components/LoadingSpinner';

const BasicOrders = ({ activeSubFilter, offersExpanded, toggleOffers, setShowRating }) => {
  const { t, i18n } = useTranslation();
  const { token } = useAuth();
  const currentLanguage = i18n.language || 'ar';

  // Fetch lists for truck images
  const { data: listsResponse } = useGetListsQuery();
  const truckList = listsResponse?.data?.[0]?.Truck || [];

  // Call all hooks to follow Rules of Hooks, but use 'skip' to only fire the active one
  const newRequests = useGetNormalNewOrdersQuery(token, { skip: activeSubFilter !== 'new-request' });
  const shippingRequests = useGetNormalShippingOrdersQuery(token, { skip: activeSubFilter !== 'waiting' });
  const completeRequests = useGetNormalCompleteOrdersQuery(token, { skip: activeSubFilter !== 'shipped' });
  const canceledRequests = useGetNormalCanceledOrdersQuery(token, { skip: activeSubFilter !== 'cancelled' });

  // Select the active query result
  const activeQueryResult = 
    activeSubFilter === 'new-request' ? newRequests :
    activeSubFilter === 'waiting' ? shippingRequests :
    activeSubFilter === 'shipped' ? completeRequests :
    activeSubFilter === 'cancelled' ? canceledRequests :
    newRequests;

  const { data: response, isLoading, isError } = activeQueryResult;

  // Helper to get localized name
  const getName = (obj) => {
    if (!obj) return '';
    if (currentLanguage === 'en' && obj.name_en) return obj.name_en;
    return obj.name || obj.name_en || '';
  };

  // Helper to get truck image
  const getTruckImage = (truckId) => {
    if (!truckId) return null;
    const truck = truckList.find(t => t.id === truckId || t.id === truckId.id);
    return truck?.image || null;
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center p-5">
        <LoadingSpinner size="medium" message={currentLanguage === 'ar' ? 'جاري التحميل...' : 'Loading...'} />
      </div>
    );
  }

  if (isError) {
    return <div className="alert alert-danger mt-3">{currentLanguage === 'ar' ? 'حدث خطأ أثناء تحميل البيانات' : 'Error loading data'}</div>;
  }

  // Extract orders from the response structure: response.data[0].items
  const orders = response?.data?.[0]?.items || [];

  if (orders.length === 0) {
    return <div className="alert alert-info mt-3">{t('user:orders.noOrders')}</div>;
  }

  return (
    <div className="basic-orders-wrapper">
      {orders.map((order) => {
        if (activeSubFilter === 'new-request') {
          return (
            <div key={order.id} className="new-orders-card p-2 border rounded-3 mt-2">
              <div className="card-order-details border-bottom pb-2">
                <div className="d-flex flex-column align-items-start gap-2 w-100">
                  <div className='d-flex align-items-center justify-content-between w-100'>
                    <h3 className='orders-card-title m-0'>{getName(order.good_type_id) || t('user:basicUpload.orderData')}</h3>
                    <div className="new-order-badge py-1 px-2 rounded-2 text-nowrap">{t('user:orders.newOrder')}</div>
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
                      <span>{order.city_from || t('user:basicUpload.pickupPlaceholder')}</span>
                      <span>{order.city_to || t('user:basicUpload.deliveryPlaceholder')}</span>
                    </div>
                  </div>
                  <div className="d-flex gap-2 align-items-center">
                    <img src="../assets/calendar.svg" className='mb-1' alt="calender" />
                    <h6 className='user-desc m-0'>{order.date !== '0000-00-00' ? order.date : '--'}</h6>
                    <FontAwesomeIcon icon={faCircle} className='dot-icon' />
                    <h6 className='user-desc m-0'>{order.time || '--'}</h6>
                  </div>
                  {/* 
                  <div className="d-flex justify-content-between text-center align-items-center w-100 mb-1 flex-wrap gap-2">
                    <div className="flex-grow-1">
                      <h6 className='user-desc m-0 mt-1'>{t('user:basicUpload.truckType')}</h6>
                      <p className='footer-main-sublabel m-0'>{getName(order.truck_id)}</p>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className='user-desc m-0 mt-1'>{t('user:basicUpload.truckSize')}</h6>
                      <p className='footer-main-sublabel m-0'>{getName(order.sub_truck_id)}</p>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className='user-desc m-0 mt-1'>{t('user:basicUpload.goodType')}</h6>
                      <p className='footer-main-sublabel m-0'>{getName(order.good_type_id)}</p>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className='user-desc m-0 mt-1'>{t('user:basicUpload.goodPrice')}</h6>
                      <p className='footer-main-sublabel m-0'>{order.good_price}</p>
                    </div>
                  </div>
                  */}
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <div className="offers-dropdown d-flex align-items-center justify-content-center gap-2" onClick={toggleOffers} style={{ cursor: 'pointer' }}>
                      <h6 className='offers-dropdown-text m-0'>{t('common:buttons.offers')}</h6>
                      <FontAwesomeIcon icon={offersExpanded ? faChevronUp : faChevronDown} />
                    </div>
                    <div className="cancel-order-btn">
                      <p className='m-0'>{t('common:buttons.cancel_order')}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {offersExpanded && (
                <div className="orders-new-offers">
                   <p className="text-center mt-2 text-muted">{t('common:buttons.no_offers')}</p>
                </div>
              )}
            </div>
          );
        } else if (activeSubFilter === 'waiting') {
          const truckImg = getTruckImage(order.truck_id);
          return (
            <div key={order.id} className="waiting-orders-card p-2 border rounded-3 mt-2">
              <div className="card-order-details">
                <div className="d-flex flex-column align-items-start gap-2 w-100">
                  <div className='d-flex align-items-center justify-content-between w-100'>
                    <div>
                      <h3 className='orders-card-title m-0 mb-1'>{getName(order.good_type_id)}</h3>
                      {order.driver_id && <h5 className='footer-link m-0'>{t('common:provider')}</h5>}
                    </div>
                    <div className="charging-badge py-1 px-2 rounded-2 text-nowrap d-flex align-items-center">
                      <FontAwesomeIcon icon={faCircle} className='dot-orange' /> {t('common:buttons.shipping')}
                    </div>
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center w-100 flex-wrap gap-2">
                    {order.driver_id && (
                      <div className="d-flex gap-2 align-items-start">
                        <img src={order.driver_id.avatar || "/assets/man.png"} className='user-img' alt="user" />
                        <div>
                          <div className="d-flex gap-1 align-items-center">
                            <h6 className="user-name m-0">{order.driver_id.name}</h6>
                            <div className="new-order-badge p-1 rounded-2 text-nowrap">{order.driver_id.rate || '0'} <img src="/assets/star.svg" alt="" /></div>
                          </div>
                          <p className="user-desc m-0">{getName(order.truck_id)}</p>
                        </div>
                      </div>
                    )}
                    {truckImg && (
                      <div className="truck-image-small ms-auto">
                        <img src={truckImg} alt="truck" style={{ width: '60px', height: 'auto', borderRadius: '4px' }} />
                      </div>
                    )}
                  </div>

                  <h5 className='footer-link m-0'>{t('user:basicUpload.truckData')}</h5>
                  <div className="d-flex gap-2 align-items-center">
                    <h6 className='driver-truck-type m-0'>{getName(order.truck_id)} - {getName(order.sub_truck_id)}</h6>
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
                    <img src="../assets/calendar.svg" className='mb-1' alt="calender" />
                    <h6 className='user-desc m-0'>{order.date !== '0000-00-00' ? order.date : '--'}</h6>
                    <FontAwesomeIcon icon={faCircle} className='dot-icon' />
                    <h6 className='user-desc m-0'>{order.time || '--'}</h6>
                  </div>

                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 w-100">
                    <div className="d-flex align-items-center gap-2">
                      <Link to='/user/tracking' className="offers-dropdown text-decoration-none d-flex align-items-center justify-content-center gap-2">
                        <h6 className='offers-dropdown-text m-0'>{t('user:user.tracking')}</h6>
                      </Link>
                      <div className="contact-driver-button">
                        <p className='m-0'>{t('common:buttons.contact_driver')}</p>
                      </div>
                    </div>
                    <div className="code-badge d-flex align-items-center gap-2">
                      <img src="../assets/document-copy.svg" alt="" />
                      {order.id}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        } else if (activeSubFilter === 'shipped') {
          const truckImg = getTruckImage(order.truck_id);
          return (
            <div key={order.id} className="shipped-orders-card p-2 border rounded-3 mt-2">
              <div className="card-order-details">
                <div className="d-flex flex-column align-items-start gap-2 w-100">
                  <div className='d-flex align-items-center justify-content-between w-100'>
                    <h3 className='orders-card-title m-0 mb-1'>{getName(order.good_type_id)}</h3>
                    <div className="shipped-badge py-1 px-2 rounded-2 text-nowrap d-flex align-items-center">{t('common:buttons.completed')}</div>
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center w-100">
                    <div className="d-flex flex-wrap gap-4">
                      {order.driver_id && (
                        <div>
                          <h5 className='footer-link'>{t('common:provider')}</h5>
                          <div className="d-flex gap-2 align-items-start">
                            <img src={order.driver_id.avatar || "../assets/man.png"} className='user-img' alt="user" />
                            <div>
                              <div className="d-flex gap-1 align-items-center">
                                <h6 className="user-name m-0">{order.driver_id.name}</h6>
                                <div className="new-order-badge p-1 rounded-2 text-nowrap">{order.driver_id.rate} <img src="../assets/star.svg" alt="" /></div>
                              </div>
                              <p className="user-desc m-0">{getName(order.truck_id)}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      <div>
                        <h5 className='footer-link'>{t('user:basicUpload.truckData')}</h5>
                        <h6 className='driver-truck-type m-0'>{getName(order.truck_id)}</h6>
                      </div>
                    </div>
                    {truckImg && (
                      <div className="truck-image-small">
                        <img src={truckImg} alt="truck" style={{ width: '60px', height: 'auto', borderRadius: '4px' }} />
                      </div>
                    )}
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
                    <img src="../assets/calendar.svg" className='mb-1' alt="calender" />
                    <h6 className='user-desc m-0'>{order.date}</h6>
                  </div>

                  <div className="d-flex align-items-center gap-2 mt-2">
                    <div className="contact-driver-button" onClick={() => setShowRating(true)}>
                      <p className='m-0'>{t('user:notification.rate')}</p>
                    </div>
                    <div className="offers-dropdown d-flex align-items-center justify-content-center gap-2">
                      <h6 className='offers-dropdown-text m-0'>{t('common:buttons.order_again')}</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        } else if (activeSubFilter === 'cancelled') {
          return (
            <div key={order.id} className="cancelled-orders-card p-2 border rounded-3 mt-2">
              <div className="card-order-details">
                <div className="d-flex flex-column align-items-start gap-2 w-100">
                  <div className='d-flex align-items-center justify-content-between w-100'>
                    <h3 className='orders-card-title m-0 mb-1'>{getName(order.good_type_id)}</h3>
                    <div className="cancelled-badge py-1 px-2 rounded-2 text-nowrap d-flex align-items-center">{t('common:status.cancelled')}</div>
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
                    <img src="../assets/calendar.svg" className='mb-1' alt="calender" />
                    <h6 className='user-desc m-0'>{order.date}</h6>
                  </div>

                  <div className="mt-2 text-start">
                    <div className="contact-driver-button" style={{display: 'inline-block'}} onClick={() => setShowRating(true)}>
                      <p className='m-0'>{t('user:notification.rate')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

export default BasicOrders;
