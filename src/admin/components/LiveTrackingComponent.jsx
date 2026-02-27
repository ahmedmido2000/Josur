import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faChevronDown, faChevronUp, faEnvelope, faTriangleExclamation, faArrowDownLong } from "@fortawesome/free-solid-svg-icons";
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});
const LiveTrackingComponent = () => {
        const { t, i18n } = useTranslation(['admin']);
        const isRtl = i18n.language === 'ar';
        // State for map markers
        const [pickupLocation, setPickupLocation] = useState([24.7136, 46.6753]); // Default to Riyadh, Saudi Arabia
        const [deliveryLocation, setDeliveryLocation] = useState([24.7136, 46.6753]); // Default to Riyadh, Saudi Arabia
      // Function to handle map clicks
  const handleMapClick = (e) => {
    // You can implement logic to determine if this is pickup or delivery location
    // For now, we'll just update the pickup location
    setPickupLocation([e.latlng.lat, e.latlng.lng]);
  };
  
  // Map component
  const MapComponent = () => (
    <MapContainer 
      center={pickupLocation} 
      zoom={13} 
      className="rounded-3"
      style={{ height: '95%', minHeight: '400px', width: '100%' }}
      onClick={handleMapClick}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={pickupLocation}>
        <Popup>موقع الشحن</Popup>
      </Marker>
      <Marker position={deliveryLocation}>
        <Popup>موقع التوصيل</Popup>
      </Marker>
    </MapContainer>
  );
  return (
    <div className="vehicles-content mt-2">
      <div className="shadow p-2 rounded-3">
        <h4 className="orders-title m-0">{t('admin:liveTracking.title')}</h4>
        <div className="row mt-2">
            <div className="col-md-9 mb-2">
            <div className="position-relative">
  <input
    type="text"
    className="form-control form-input py-2"
    style={{paddingInlineStart:'35px'}}
    placeholder={t('admin:liveTracking.searchPlaceholder')}
  />

  <span className="search-input-icon">
    <i className="fas fa-search"></i>
  </span>
</div>

            </div>
            <div className="col-md-3 mb-2">
            <div className="mb-3">
                                            <div className="select-wrapper position-relative">
    <select className="form-select form-input py-2" style={{ paddingInlineEnd: '2.2rem' }}>
        <option value="">{t('admin:liveTracking.allStatuses')}</option>
    </select>
    <div className="select-icon position-absolute top-50 translate-middle-y pe-1" style={{ insetInlineEnd: 0, pointerEvents: 'none' }}>
        <ExpandMoreIcon />
    </div>
</div>
                                        </div>
            </div>
        </div>
        <div className="row">
            <div className="col-md-5">
                <div className="card-order-details p-2 border rounded-3 mb-2">
                    <div className="d-flex flex-column align-items-start gap-2 w-100">
                    <div className='d-flex align-items-start justify-content-between w-100'>
                    <div className="d-flex gap-2 align-items-start">
                        <div className="truck-icon-container d-flex justify-content-center align-items-center">
                            <img src="../assets/truck-icon.svg" alt="user" />

                        </div>
                            <div>
                            <div className="d-flex gap-1 align-items-center">
                                <h6 className="orders-title m-0">دينا</h6>
                            </div>
                            <p className="driver-truck-type m-0">عمر الراجحي</p>
                            </div>
                        </div>
                        <div className="new-order-badge py-1 px-2 rounded-2 text-nowrap">تحميل</div>
                    </div>
                    <div className="from-to-wrapper">
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
                  <span>الرياض</span>
                  <span>الجزائر</span>
                </div>
              </div>
              <div className="d-flex gap-2 align-items-center">
                <img src="../assets/calendar.svg" className='mb-1' alt="calender" />
                <h6 className='user-desc m-0'>03-06-2025</h6>
                <FontAwesomeIcon icon={faCircle} className='dot-icon' />
                <h6 className='user-desc m-0'>08:00</h6>
              </div>
                    <div className='d-flex gap-1 align-items-center'>
                        <p className="user-desc m-0">الوقت المتوقع للتسليم:</p>
                        <h4 className="orders-card-title mb-0">2024-01-14</h4>
                        <h4 className="orders-card-title mb-0">08:00</h4>
                        </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center gap-2 pt-2 border-top mt-2">
                        <div className="d-flex align-items-center gap-2">
                            <h4 className="orders-card-title mb-0">65 ميلاً في الساعة</h4>
                            <img src="../assets/gas-station.svg" alt="gas-station" />
                            <p className="percent-green m-0">76%</p>
                        </div>
                        <div className='not-have'>منذ دقيقتين</div>
                    </div>
                </div>
                <div className="card-order-details p-2 border rounded-3 mb-2">
                    <div className="d-flex flex-column align-items-start gap-2 w-100">
                    <div className='d-flex align-items-start justify-content-between w-100'>
                    <div className="d-flex gap-2 align-items-start">
                        <div className="truck-icon-container d-flex justify-content-center align-items-center">
                            <img src="../assets/truck-icon.svg" alt="user" />

                        </div>
                            <div>
                            <div className="d-flex gap-1 align-items-center">
                                <h6 className="orders-title m-0">دينا</h6>
                            </div>
                            <p className="driver-truck-type m-0">عمر الراجحي</p>
                            </div>
                        </div>
                        <div className="new-order-badge py-1 px-2 rounded-2 text-nowrap">تحميل</div>
                    </div>
                    <div className="from-to-wrapper">
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
                  <span>الرياض</span>
                  <span>الجزائر</span>
                </div>
              </div>
              <div className="d-flex gap-2 align-items-center">
                <img src="../assets/calendar.svg" className='mb-1' alt="calender" />
                <h6 className='user-desc m-0'>03-06-2025</h6>
                <FontAwesomeIcon icon={faCircle} className='dot-icon' />
                <h6 className='user-desc m-0'>08:00</h6>
              </div>
                    <div className='d-flex gap-1 align-items-center'>
                        <p className="user-desc m-0">الوقت المتوقع للتسليم:</p>
                        <h4 className="orders-card-title mb-0">2024-01-14</h4>
                        <h4 className="orders-card-title mb-0">08:00</h4>
                        </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center gap-2 pt-2 border-top mt-2">
                        <div className="d-flex align-items-center gap-2">
                            <h4 className="orders-card-title mb-0">65 ميلاً في الساعة</h4>
                            <img src="../assets/gas-station.svg" alt="gas-station" />
                            <p className="percent-green m-0">76%</p>
                        </div>
                        <div className='not-have'>منذ دقيقتين</div>
                    </div>
                </div>
                <div className="card-order-details p-2 border rounded-3 mb-2">
                    <div className="d-flex flex-column align-items-start gap-2 w-100">
                    <div className='d-flex align-items-start justify-content-between w-100'>
                    <div className="d-flex gap-2 align-items-start">
                        <div className="truck-icon-container d-flex justify-content-center align-items-center">
                            <img src="../assets/truck-icon.svg" alt="user" />

                        </div>
                            <div>
                            <div className="d-flex gap-1 align-items-center">
                                <h6 className="orders-title m-0">دينا</h6>
                            </div>
                            <p className="driver-truck-type m-0">عمر الراجحي</p>
                            </div>
                        </div>
                        <div className="new-order-badge py-1 px-2 rounded-2 text-nowrap">تحميل</div>
                    </div>
                    <div className="from-to-wrapper">
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
                  <span>الرياض</span>
                  <span>الجزائر</span>
                </div>
              </div>
              <div className="d-flex gap-2 align-items-center">
                <img src="../assets/calendar.svg" className='mb-1' alt="calender" />
                <h6 className='user-desc m-0'>03-06-2025</h6>
                <FontAwesomeIcon icon={faCircle} className='dot-icon' />
                <h6 className='user-desc m-0'>08:00</h6>
              </div>
                    <div className='d-flex gap-1 align-items-center'>
                        <p className="user-desc m-0">الوقت المتوقع للتسليم:</p>
                        <h4 className="orders-card-title mb-0">2024-01-14</h4>
                        <h4 className="orders-card-title mb-0">08:00</h4>
                        </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center gap-2 pt-2 border-top mt-2">
                        <div className="d-flex align-items-center gap-2">
                            <h4 className="orders-card-title mb-0">65 ميلاً في الساعة</h4>
                            <img src="../assets/gas-station.svg" alt="gas-station" />
                            <p className="percent-green m-0">76%</p>
                        </div>
                        <div className='not-have'>منذ دقيقتين</div>
                    </div>
                </div>
            </div>
            <div className="col-md-7">
            <h2 className='orders-title'>{t('admin:liveTracking.mapView')}</h2>
            <div className="mt-1 pb-3 h-100">
              <MapComponent />
            </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTrackingComponent;