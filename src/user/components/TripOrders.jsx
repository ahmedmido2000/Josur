import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong, faCircle, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  useGetTripNewOrdersQuery, 
  useGetTripShippingOrdersQuery, 
  useGetTripCompleteOrdersQuery, 
  useGetTripCanceledOrdersQuery 
} from '../../api/user/userApi';
import { useGetListsQuery } from '../../api/site/siteApi';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useCancelRequestMutation, useAcceptOfferMutation } from '../../api/site/siteApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const TripOrders = ({ activeSubFilter, offersExpanded, toggleOffers, setShowRating, setShowCancel }) => {
  const { t, i18n } = useTranslation();
  const { token } = useAuth();
  const navigate = useNavigate();
  const currentLanguage = i18n.language || 'ar';
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [activeSubFilter]);

  const [acceptOffer, { isLoading: isAccepting }] = useAcceptOfferMutation();

  // Fetch lists for truck images
  const { data: listsResponse } = useGetListsQuery();
  const truckList = listsResponse?.Truck || [];

  const handleAcceptOffer = async (offerId) => {
    try {
      const response = await acceptOffer(offerId).unwrap();
      if (response.status === 1) {
        toast.success(t('user:user.orders.acceptSuccess') || 'Offer accepted successfully');
      } else {
        toast.error(response.message || t('common:messages.error'));
      }
    } catch (error) {
      toast.error(error?.data?.message || t('common:messages.error'));
    }
  };

  const handleOrderAgain = () => {
    navigate('/user/trip-upload');
  };

  // Call all hooks to follow Rules of Hooks, but use 'skip' to only fire the active one
  const newRequests = useGetTripNewOrdersQuery({ token, page }, { skip: activeSubFilter !== 'new-request' });
  const shippingRequests = useGetTripShippingOrdersQuery({ token, page }, { skip: activeSubFilter !== 'waiting' });
  const completeRequests = useGetTripCompleteOrdersQuery({ token, page }, { skip: activeSubFilter !== 'shipped' });
  const canceledRequests = useGetTripCanceledOrdersQuery({ token, page }, { skip: activeSubFilter !== 'cancelled' });

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
    <div className="trip-orders-wrapper">
      {orders.map((order) => {
        const truckImg = getTruckImage(order.truck_id);
        if (activeSubFilter === 'new-request') {
          return (
            <div key={order.id} className="new-orders-card p-2 border rounded-3 mt-2">
              <div className="card-order-details border-bottom pb-2">
                <div className="d-flex flex-column align-items-start gap-2 w-100">
                  <div className='d-flex align-items-center justify-content-between w-100'>
                    <h3 className='orders-card-title m-0'>{getName(order.type) || t('requestTypes:trips')}</h3>
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
                      <span>{getName(order.city_from) || t('user:tripUpload.selectCityPlaceholder')}</span>
                      <span>{getName(order.city_from) || t('user:tripUpload.selectCityPlaceholder')}</span>
                    </div>
                  </div>
                  <div className="d-flex gap-2 align-items-center">
                    <img src="../assets/calendar.svg" className='mb-1' alt="calender" />
                    <h6 className='user-desc m-0'>{order.date !== '0000-00-00' ? order.date : '--'}</h6>
                    <FontAwesomeIcon icon={faCircle} className='dot-icon' />
                    <h6 className='user-desc m-0'>{order.time || '--'}</h6>
                  </div>
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
                      <h6 className='user-desc m-0 mt-1'>{t('user:tripUpload.tripsPerMonth')}</h6>
                      <p className='footer-main-sublabel m-0'>{order.good_price || 0}</p>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className='user-desc m-0 mt-1'>{t('user:basicUpload.goodType')}</h6>
                      <p className='footer-main-sublabel m-0'>{getName(order.good_type_id)}</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <div className="offers-dropdown d-flex align-items-center justify-content-center gap-2" onClick={toggleOffers} style={{ cursor: 'pointer' }}>
                      <h6 className='offers-dropdown-text m-0'>{t('common:buttons.offers')}</h6>
                      <FontAwesomeIcon icon={offersExpanded ? faChevronUp : faChevronDown} />
                    </div>
                    <div className="cancel-order-btn" onClick={() => setShowCancel(order)}>
                      <p className='m-0'>{t('common:buttons.cancel_order')}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {offersExpanded && (
                <div className="orders-new-offers mt-2 p-2 border-top">
                   {order.requestOffers && order.requestOffers.length > 0 ? (
                     order.requestOffers.map((offer) => (
                       <div key={offer.id} className="offer-item position-relative border rounded-3 p-3 mb-3 bg-white" style={{ border: '1px solid #f0f0f0' }}>
                          <div className="d-flex justify-content-between align-items-start gap-2">
                            {/* Right Part (Child 1): Driver Info + Truck Details */}
                            <div className='d-flex align-items-center gap-3'
                                 onClick={() => navigate('/user/provider-account', { state: { provider: offer.driver_id } })}
                                 style={{ cursor: 'pointer' }}>
                                <div className="driver-avatar-wrapper position-relative">
                                    <img src={offer.driver_id?.avatar || "../assets/man.png"} 
                                         alt="driver" 
                                         className="rounded-circle border" 
                                         style={{ width: '55px', height: '55px', objectFit: 'cover' }} />
                                     <div className="verified-check position-absolute bottom-0 start-0" style={{ transform: 'translate(10%, 10%)' }}>
                                         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                             <circle cx="12" cy="12" r="12" fill="#2D88FF"/>
                                             <path d="M7 12L10.5 15.5L17.5 8.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                         </svg>
                                     </div>
                                </div>
                                <div>
                                    <div className="d-flex align-items-center gap-2 mb-1">
                                        <h6 className="m-0 fw-bold fs-5">{offer.driver_id?.name}</h6>
                                        <div className="rating-pill d-flex align-items-center gap-1 py-1 px-2 rounded-2" 
                                             style={{ backgroundColor: '#EBF4FF', color: '#3182CE', fontSize: '0.85rem' }}>
                                            <img src="../assets/star.svg" alt="star" style={{ width: '13px' }} className="mb-0.5" />
                                            <span className="fw-bold">{offer.driver_id?.rate || '0.0'}</span>
                                        </div>
                                        {/* Truck Image next to rating */}
                                        <div className="truck-icon-badge d-flex align-items-center gap-1 py-1 px-2 rounded-2" style={{ backgroundColor: '#FFF2E6' }}>
                                            <span style={{ color: '#E58E26', fontSize: '0.8rem' }}>{getName(order.truck_id)}</span>
                                            {truckImg ? (
                                              <img src={truckImg} alt="truck" style={{ width: '30px', height: 'auto' }} />
                                            ) : (
                                              <img src="../assets/truck-icon.svg" alt="truck" style={{ width: '30px', height: 'auto' }} />
                                            )}
                                        </div>
                                    </div>
                                    <p className="m-0 text-muted">{t('user:user.orders.truck_driver')}</p>
                                </div>
                            </div>
                            <div className="d-none d-md-block"></div>
                          </div>

                          <div className="d-flex justify-content-between align-items-center mt-3 pt-2">
                              {/* Right Part (Child 1): Price */}
                              <div className="d-flex align-items-baseline gap-1">
                                <span className='fw-bold fs-3 text-primary'>{offer.price}</span>
                                <span className='fw-bold text-primary'>{t('common:currency') || '$'}</span>
                              </div>

                              {/* Left Part (Child 2): Accept Button */}
                              <button 
                                  className="btn btn-primary fw-bold text-center px-4 py-2" 
                                  style={{ borderRadius: '10px', minWidth: '160px' }}
                                  onClick={() => handleAcceptOffer(offer.id)}
                                  disabled={isAccepting}
                              >
                                  {t('common:buttons.accept_offer')}
                              </button>
                          </div>
                        </div>
                     ))
                   ) : (
                     <p className="text-center mt-2 text-muted">{t('common:buttons.no_offers')}</p>
                   )}
                </div>
              )}
            </div>
          );
        } else if (activeSubFilter === 'waiting') {
          return (
            <div key={order.id} className="waiting-orders-card p-2 border rounded-3 mt-2">
              <div className="card-order-details">
                <div className="d-flex flex-column align-items-start gap-2 w-100">
                  <div className='d-flex align-items-center justify-content-between w-100'>
                    <div>
                      <h3 className='orders-card-title m-0 mb-1'>{getName(order.type)}</h3>
                      {order.driver_id && <h5 className='footer-link m-0'>{t('common:provider')}</h5>}
                    </div>
                    <div className="charging-badge py-1 px-2 rounded-2 text-nowrap d-flex align-items-center">
                      <FontAwesomeIcon icon={faCircle} className='dot-orange' /> {t('common:buttons.shipping')}
                    </div>
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center w-100">
                    {order.driver_id && (
                      <div className="d-flex gap-2 align-items-start"
                           onClick={() => navigate('/user/provider-account', { state: { provider: order.driver_id } })}
                           style={{ cursor: 'pointer' }}>
                        <img src={order.driver_id.avatar || "../assets/man.png"} className='user-img' alt="user" />
                        <div>
                          <div className="d-flex gap-1 align-items-center">
                            <h6 className="user-name m-0">{order.driver_id.name}</h6>
                            <div className="new-order-badge p-1 rounded-2 text-nowrap">{order.driver_id.rate || '0'} <img src="../assets/star.svg" alt="" /></div>
                          </div>
                          <p className="user-desc m-0">{t('user:user.orders.driver_title')}: {getName(order.driver_id.truck_type)}</p>
                        </div>
                      </div>
                    )}
                    {truckImg && (
                      <div className="truck-image-small">
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
                      <span>{getName(order.city_from) || '--'}</span>
                      <span>{getName(order.city_from) || '--'}</span>
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
                    <Link to='/user/tracking' state={{ order }} className="offers-dropdown text-decoration-none d-flex align-items-center justify-content-center gap-2">
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
          return (
            <div key={order.id} className="shipped-orders-card p-2 border rounded-3 mt-2">
              <div className="card-order-details">
                <div className="d-flex flex-column align-items-start gap-2 w-100">
                  <div className='d-flex align-items-center justify-content-between w-100'>
                    <h3 className='orders-card-title m-0 mb-1'>{getName(order.type)}</h3>
                    <div className="shipped-badge py-1 px-2 rounded-2 text-nowrap d-flex align-items-center">{t('common:buttons.completed')}</div>
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center w-100">
                    <div className="d-flex flex-wrap gap-4">
                      {order.driver_id && (
                        <div onClick={() => navigate('/user/provider-account', { state: { provider: order.driver_id } })}
                             style={{ cursor: 'pointer' }}>
                          <h5 className='footer-link'>{t('common:provider')}</h5>
                          <div className="d-flex gap-2 align-items-start">
                            <img src={order.driver_id.avatar || "../assets/man.png"} className='user-img' alt="user" />
                            <div>
                              <div className="d-flex gap-1 align-items-center">
                                <h6 className="user-name m-0">{order.driver_id.name}</h6>
                                <div className="new-order-badge p-1 rounded-2 text-nowrap">{order.driver_id.rate} <img src="../assets/star.svg" alt="" /></div>
                              </div>
                              <p className="user-desc m-0">{t('user:user.orders.driver_title')}: {getName(order.driver_id.truck_type)}</p>
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
                      <span>{getName(order.city_from) || '--'}</span>
                      <span>{getName(order.city_from) || '--'}</span>
                    </div>
                  </div>

                  <div className="d-flex gap-2 align-items-center">
                    <img src="../assets/calendar.svg" className='mb-1' alt="calender" />
                    <h6 className='user-desc m-0'>{order.date}</h6>
                  </div>

                  <div className="d-flex align-items-center gap-2 mt-2">
                    <div className="contact-driver-button" onClick={() => setShowRating(order)}>
                      <p className='m-0'>{t('user:notification.rate')}</p>
                    </div>
                    <div className="offers-dropdown d-flex align-items-center justify-content-center gap-2" onClick={handleOrderAgain}>
                      <h6 className='offers-dropdown-text m-0'>{t('common:buttons.order_again')}</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        } else if (activeSubFilter === 'cancelled') {
          const cancelDate = order.created_at ? order.created_at.split(' ')[0] : (order.date !== '0000-00-00' ? order.date : '--');
          const cancelTime = order.created_at ? order.created_at.split(' ')[1]?.substring(0, 5) : (order.time || '--');
          return (
            <div key={order.id} className="cancelled-orders-card p-2 border rounded-3 mt-2">
              <div className="card-order-details">
                <div className="d-flex flex-column align-items-start gap-2 w-100">
                  <div className='d-flex align-items-center justify-content-between w-100'>
                    <h3 className='orders-card-title m-0 mb-1'>{getName(order.type) || t('requestTypes:trips')}</h3>
                    <div className="cancelled-badge py-1 px-2 rounded-2 text-nowrap d-flex align-items-center">{t('common:status.cancelled')}</div>
                  </div>

                  {order.driver_id && (
                    <div onClick={() => navigate('/user/provider-account', { state: { provider: order.driver_id } })}
                         style={{ cursor: 'pointer' }}>
                      <h5 className='footer-link'>{t('common:provider')}</h5>
                      <div className="d-flex gap-2 align-items-start">
                        <img src={order.driver_id.avatar || "../assets/man.png"} className='user-img' alt="user" />
                        <div>
                          <div className="d-flex gap-1 align-items-center">
                            <h6 className="user-name m-0">{order.driver_id.name}</h6>
                            <div className="new-order-badge p-1 rounded-2 text-nowrap">{order.driver_id.rate} <img src="../assets/star.svg" alt="" /></div>
                          </div>
                          <p className="user-desc m-0">{t('user:user.orders.driver_title')}: {getName(order.driver_id.truck_type)}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <h5 className='footer-link'>{t('user:basicUpload.truckData')}</h5>
                    <div className="d-flex align-items-center gap-2">
                      {truckImg && <img src={truckImg} alt="truck" style={{ width: '40px', height: 'auto', borderRadius: '4px' }} />}
                      <h6 className='driver-truck-type m-0'>{getName(order.truck_id)} {order.sub_truck_id ? `- ${getName(order.sub_truck_id)}` : ''}</h6>
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
                      <span>{getName(order.city_from) || '--'}</span>
                      <span>{getName(order.city_to) || '--'}</span>
                    </div>
                  </div>

                  <div className="d-flex gap-2 align-items-center">
                    <img src="../assets/calendar.svg" className='mb-1' alt="calender" />
                    <h6 className='user-desc m-0'>{cancelDate}</h6>
                    <FontAwesomeIcon icon={faCircle} className='dot-icon' />
                    <h6 className='user-desc m-0'>{cancelTime}</h6>
                  </div>

                  <div className="d-flex align-items-center gap-2 mt-2">
                    <div className="contact-driver-button" onClick={() => setShowRating(order)}>
                      <p className='m-0'>{t('user:notification.rate')}</p>
                    </div>
                    <div className="offers-dropdown d-flex align-items-center justify-content-center gap-2" onClick={handleOrderAgain}>
                      <h6 className='offers-dropdown-text m-0'>{t('common:buttons.order_again')}</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }
        return null;
      })}

      {/* Pagination */}
      {(() => {
        const meta = response?.data?.[0]?._meta || {};
        const totalPages = meta.NumberOfPage || 1;
        if (totalPages <= 1) return null;
        return (
          <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
            <button
              className="btn btn-outline-primary btn-sm px-3"
              disabled={page <= 1}
              onClick={() => setPage(p => p - 1)}
            >
              {currentLanguage === 'ar' ? 'السابق' : 'Previous'}
            </button>
            <span className="fw-bold">{page} / {totalPages}</span>
            <button
              className="btn btn-outline-primary btn-sm px-3"
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              {currentLanguage === 'ar' ? 'التالي' : 'Next'}
            </button>
          </div>
        );
      })()}
    </div>
  );
};

export default TripOrders;
