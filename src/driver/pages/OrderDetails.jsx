import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import DriverNavbar from '../components/DriverNavbar'
import Footer from '../../shared/components/Footer'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faArrowDown, faArrowDownLong, faDotCircle, faCircleDot, faCircle, faCaretDown, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';

const OrderDetails = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation(['driver', 'common']);
    
    // Get order from location state
    const order = location.state?.order;

    // If order is missing (e.g., page refresh), go back to orders
    useEffect(() => {
        if (!order) {
            navigate('/driver/orders');
        }
    }, [order, navigate]);

    if (!order) {
        return null; // Component will redirect
    }

    const orderTitle = order.good_type_id?.name || order.type?.name || t('driver:orders.delivery_request');
    const displayDate = order.date !== "0000-00-00" ? order.date : '--';
    const displayTime = order.time || '--';

    const getStatusLabel = (status) => {
        switch(status) {
            case 0: return t('driver:orders.status.new');
            case 2: return t('driver:orders.status.shipping');
            case 3: return t('driver:orders.status.completed');
            default: return t('driver:orders.status.waiting');
        }
    };

    return (
        <>
            <DriverNavbar />

            <div className="container mb-5">
                <div className="row">
                    <div className="col-12 mt-3">
                        <h2 className='orders-title mb-2'>{t('driver:orders.details_title') || 'تفاصيل الطلب'}</h2>
                        <div className="shadow p-3 rounded-3">
                            <div className='d-flex align-items-center justify-content-between w-100 mb-1'>
                            <h3 className='orders-card-title m-0'>{orderTitle}</h3>
                            <div className='d-flex gap-2 align-items-center'>
                            <div className='not-have'>{t('driver:orders.since') || 'منذ'} {order.created_at?.split(' ')[1] || ''}</div>
                            <div className="shipped-badge py-1 px-2 rounded-2 text-nowrap d-flex align-items-center">
                                {getStatusLabel(order.status)}
                            </div>
                        </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <div className="p-2 border rounded-2 h-100">
                                    <h2 className='orders-card-title mb-0'>{t('driver:orders.tracking_title') || 'تتبع الشحنة'}</h2>

                                    {order.requestStatus?.map((statusItem, index) => (
                                        <div key={statusItem.id} className={`tracking-item p-2 d-flex flex-wrap align-items-center justify-content-between gap-2 mt-2 ${index === 0 ? 'active' : ''}`}>
                                            <div className='d-flex align-items-center gap-2'>
                                                <FontAwesomeIcon icon={faCircle} className='dot-gray' />
                                                <div>
                                                    <h6 className='document-li m-0'>{getStatusLabel(statusItem.status_id)}</h6>
                                                    <p className='user-desc m-0'>{order.city_from || '--'}</p>
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center gap-2">
                                                <h6 className='user-desc m-0'>{statusItem.created_at?.split(' ')[0]}</h6>
                                                <FontAwesomeIcon icon={faCircle} className='dot-icon' />
                                                <h6 className='user-desc m-0'>{statusItem.created_at?.split(' ')[1]}</h6>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    <h2 className='orders-card-title my-2'>{t('driver:orders.load_images') || 'صور الحمولة'}</h2>
                                    <div className="taken-imgs d-flex gap-2 align-items-center flex-wrap">
                                        {[...(order.requestImageBefore || []), ...(order.requestImageAfter || [])].map((img) => (
                                            <div key={img.id} className="taken-img position-relative">
                                                <img src={img.image} className="taken-img" alt="cargo" />
                                            </div>
                                        ))}
                                    </div>
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <div className="p-2 border rounded-2 h-100">
                                    <h2 className='orders-card-title mb-2'>{t('driver:orders.shipment_details_title') || 'تفاصيل الشحنة'}</h2>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="p-2 rounded-3 card-gray-bg h-100">
                                            <h2 className='orders-card-title mb-2'>{t('driver:orders.receipt_place') || 'مكان الاستلام'}</h2>
                                            <p className="footer-main-sublabel mb-2">{order.city_from || '--'}</p>
                                            <p className="not-have mb-2">{t('driver:orders.receipt_time') || 'وقت الاستلام'}</p>
                                            <div className="d-flex gap-2 align-items-center">
                                                <img src="/assets/calendar.svg" className='mb-1' alt="calendar" />
                                                <h6 className='user-desc m-0'>{displayDate}</h6>
                                                <FontAwesomeIcon icon={faCircle} className='dot-icon' />
                                                <h6 className='user-desc m-0'>{displayTime}</h6>
                                            </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="p-2 rounded-3 card-gray-bg h-100">
                                            <h2 className='orders-card-title mb-2'>{t('driver:orders.delivery_place') || 'مكان التسليم'}</h2>
                                            <p className="footer-main-sublabel mb-2">{order.city_to || '--'}</p>
                                            <p className="not-have mb-2">{t('driver:orders.delivery_time') || 'وقت التسليم'}</p>
                                            <div className="d-flex gap-2 align-items-center">
                                                <img src="/assets/calendar.svg" className='mb-1' alt="calendar" />
                                                <h6 className='user-desc m-0'>{order.date_delivery || '--'}</h6>
                                                <FontAwesomeIcon icon={faCircle} className='dot-icon' />
                                                <h6 className='user-desc m-0'>{order.time_delivery || '--'}</h6>
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                    <h2 className='orders-card-title mt-2 mb-3'>{t('driver:orders.cargo_specifications') || 'مواصفات الشحنة'}</h2>
                                    <div className="d-flex mb-2 align-items-center gap-1">
                                    <p className="document-li mb-0">{t('driver:orders.weight') || 'الوزن'}:</p>
                                    <p className="document-li mb-0">--</p>
                                    </div>
                                    <div className="d-flex mb-2 align-items-center gap-1">
                                    <p className="document-li mb-0">{t('driver:orders.dimensions') || 'الأبعاد'}:</p>
                                    <p className="document-li mb-0">--</p>
                                    </div>
                                    <div className="d-flex mb-2 align-items-center gap-1">
                                    <p className="document-li mb-0">{t('driver:orders.type_label') || 'النوع'}:</p>
                                    <p className="document-li mb-0">{order.good_type_id?.name || '--'}</p>
                                    </div>
                                    <div className="d-flex mb-2 align-items-center gap-1">
                                    <p className="document-li mb-0">{t('driver:orders.value') || 'القيمة'}:</p>
                                    <p className="document-li mb-0">{order.good_price || '0'} $</p>
                                    </div>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="border p-2 rounded-2">
                                    <h2 className='orders-card-title mb-4'>{t('driver:orders.total_cost') || 'التكلفة الاجمالية'}</h2>
                                    <h6 className="orange-price m-0">{order.driver_price || '0'} $</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>         
                </div>
            </div>

            <Footer />
        </>
    )
}

export default OrderDetails;