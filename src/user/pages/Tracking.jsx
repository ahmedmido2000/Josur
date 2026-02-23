import React, { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import UserNavbar from '../components/UserNavbar'
import Footer from '../../shared/components/Footer'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faArrowDown, faArrowDownLong, faDotCircle, faCircleDot, faCircle, faCaretDown, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { useGetListsQuery } from '../../api/site/siteApi';

import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Custom icons for map
const truckIcon = new L.Icon({
    iconUrl: '/assets/truck-icon.svg',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
});

const storeIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const locationIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const Tracking = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation(['user', 'driver', 'common']);
    const currentLanguage = i18n.language || 'ar';
    const { data: listsResponse } = useGetListsQuery();
    const statuses = listsResponse?.Status || [];

    // Get order from location state
    const order = location.state?.order;

    // Redirect if no order data
    useEffect(() => {
        if (!order) {
            navigate('/user/orders');
        }
    }, [order, navigate]);

    const [pickupLocation, setPickupLocation] = useState([24.7136, 46.6753]); 
    const [deliveryLocation, setDeliveryLocation] = useState([24.7136, 46.6753]);
    const [currentTruckLocation, setCurrentTruckLocation] = useState([24.7136, 46.6753]);
    const [currentStep, setCurrentStep] = useState(0);
    const [totalDistance, setTotalDistance] = useState(0);
    const [remainingDistance, setRemainingDistance] = useState(0);

    // Haversine formula to calculate distance between two coordinates in km
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the earth in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c;
        return d.toFixed(1);
    };

    useEffect(() => {
        if (order) {
            let pLat = 24.7136, pLon = 46.6753;
            let dLat = 24.7136, dLon = 46.6753;

            if (order.lat_from && order.lang_from) {
                pLat = parseFloat(order.lat_from);
                pLon = parseFloat(order.lang_from);
                setPickupLocation([pLat, pLon]);
            }
            if (order.lat_to1 && order.lang_to1) {
                dLat = parseFloat(order.lat_to1);
                dLon = parseFloat(order.lang_to1);
                setDeliveryLocation([dLat, dLon]);
            }

            const dist = calculateDistance(pLat, pLon, dLat, dLon);
            setTotalDistance(dist);

            // Step logic: 0 = new, 1 = shipping, 2 = completed
            let currentLat = pLat;
            let currentLon = pLon;

            if (order.status === 2 || order.status === 3) {
                setCurrentStep(2);
                setRemainingDistance(0);
                currentLat = dLat;
                currentLon = dLon;
            } else if (order.status === 1) {
                setCurrentStep(1);
                // Move 60% of the way for better UX visibility
                currentLat = pLat + (dLat - pLat) * 0.6;
                currentLon = pLon + (dLon - pLon) * 0.6;
                setRemainingDistance((dist * 0.4).toFixed(1));
            } else {
                setCurrentStep(0);
                setRemainingDistance(dist);
            }
            setCurrentTruckLocation([currentLat, currentLon]);
        }
    }, [order]);

    if (!order) return null;

    const getName = (obj) => {
        if (!obj) return '';
        if (currentLanguage === 'en' && obj.name_en) return obj.name_en;
        return obj.name || obj.name_en || '';
    };

    const getStatusName = (statusId) => {
        const status = statuses.find(s => s.id === statusId);
        return getName(status);
    };
  
  // Map component
  const MapComponent = () => {
    const [zoom, setZoom] = useState(11);

    const ZoomListener = () => {
        useMapEvents({
            zoomend: (e) => {
                setZoom(e.target.getZoom());
            },
        });
        return null;
    };

    const getDynamicTruckIcon = (zoom) => {
        const baseSize = 40;
        const scale = zoom / 11;
        const size = Math.max(20, Math.min(80, baseSize * scale));
        return new L.Icon({
            iconUrl: '/assets/truck-icon.svg',
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2],
            popupAnchor: [0, -size / 2],
        });
    };

    return (
        <MapContainer 
          center={pickupLocation} 
          zoom={11} 
          className="rounded-3"
          style={{ height: '95%', minHeight: '400px', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <ZoomListener />
          
          <Marker position={pickupLocation} icon={storeIcon}>
            <Popup>{t('driver:orders.receipt_place')}</Popup>
          </Marker>
          
          <Marker position={deliveryLocation} icon={locationIcon}>
            <Popup>{t('driver:orders.delivery_place')}</Popup>
          </Marker>

          {currentTruckLocation && (
            <Marker position={currentTruckLocation} icon={getDynamicTruckIcon(zoom)}>
              <Popup>{t('user:user.tracking')}</Popup>
            </Marker>
          )}

          <Polyline 
            positions={[pickupLocation, deliveryLocation]} 
            color="#2D88FF" 
            weight={4} 
            dashArray="10, 10" 
            opacity={0.8}
          />
        </MapContainer>
    );
  };

  return (
    <>
      <UserNavbar />

      <div className="container mb-5">
        <div className="row">
          <div className="col-12 mt-3">
            <div className="shadow p-3 rounded-3 h-100">
            <h2 className='orders-title'>{t('user:user.tracking')}</h2>
            <div className="mt-3 pb-3 h-100">
              <MapComponent />
            </div>
            </div>
          </div>
          <div className="col-12 mt-4">
            <div className="shadow p-3 rounded-3 h-100">
                {order.requestStatus && order.requestStatus.map((statusItem, index) => (
                    <div key={statusItem.id} className={`tracking-item p-2 d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2 ${index === 0 ? 'active' : ''}`}>
                        <div className='d-flex align-items-center gap-2'>
                            <FontAwesomeIcon icon={faCircle} className='dot-gray' />
                            <div>
                                <h6 className='document-li m-0'>{getStatusName(statusItem.status_id)}</h6>
                                <p className='user-desc m-0'>{getName(order.city_from) || '--'}</p>
                            </div>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <h6 className='user-desc m-0'>{statusItem.created_at?.split(' ')[0]}</h6>
                            <FontAwesomeIcon icon={faCircle} className='dot-icon' />
                            <h6 className='user-desc m-0'>{statusItem.created_at?.split(' ')[1]}</h6>
                        </div>
                    </div>
                ))}

                {/* Shipment Progress */}
                <div className="shipment-progress mt-4">
                    {/* Top Labels */}
                    <div className="progress-labels">
                    {[t('user:user.tracking_steps.receipt'), t('user:user.tracking_steps.on_way'), t('user:user.tracking_steps.delivery')].map((item, index) => (
                        <span
                        key={index}
                        className={`progress-label ${
                            currentStep >= index ? "active" : ""
                        }`}
                        >
                        {item}
                        </span>
                    ))}
                    </div>

                    {/* Line & Truck */}
                    <div className="progress-line-wrapper mt-4">
                    <div className="progress-line-bg" />

                    <div
                        className="progress-line-active"
                        style={{ width: `${currentStep * 50}%` }}
                    />

                    <div
                        className={`truck-position step-${currentStep}`}
                    >
                        <img src="/assets/filter-card-img-1.png" alt="truck" />
                    </div>
                    </div>
                </div>

                <div className="d-flex justify-content-between align-items-center flex-wrap">
                    <div className="from-to-wrapper mt-3">
                        {/* الأيقونات */}
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
                        {/* النص */}
                        <div className="from-to-text">
                            <span>{getName(order.city_from) || '--'}</span>
                            <span>{getName(order.city_to) || '--'}</span>
                        </div>
                    </div>
                    <div className="d-flex align-items-center flex-wrap gap-2 mt-3">
                        <h2 className='orders-title'>{t('user:user.distance')}</h2>
                        <img src="/assets/distance.svg" alt="distance" />
                        <p className="orders-card-title mb-2">{totalDistance} {t('user:user.km')}</p>
                        <FontAwesomeIcon icon={faCircle} className='dot-gray-8' />
                        <h2 className='orders-title'>{t('user:user.cargo_type')}</h2>
                        <img src="/assets/box.svg" alt="distance" />
                        <p className="orders-card-title mb-2">{getName(order.good_type_id) || '--'}</p>
                    </div>
                    <div className="mt-3 rest-kms">{t('user:user.remaining')} {remainingDistance} {t('user:user.km')}</div>
                </div>
            </div>
          </div>         
        </div>
      </div>

      <Footer />
    </>
  )
}

export default Tracking;