import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import UserNavbar from '../components/UserNavbar'
import Footer from '../../shared/components/Footer'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useGetListsQuery, useGetSubTrucksQuery, useCreateContractRequestMutation } from "../../api/site/siteApi";
import { toast } from "react-toastify";

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const ContractUpload = () => {
    const { t, i18n } = useTranslation('user');
    const { data: listsData } = useGetListsQuery();
    const [truckId, setTruckId] = useState("");
    const { data: subTrucksData } = useGetSubTrucksQuery(truckId, { skip: !truckId });
    const [createContractRequest, { isLoading: isSubmitting }] = useCreateContractRequestMutation();

    const dateRef = useRef(null);
  
    const [cityId, setCityId] = useState("");
    const [selectedService, setSelectedService] = useState(null); // This is sub_truck_id
    const [numTrips, setNumTrips] = useState("1");
    const [goodTypeId, setGoodTypeId] = useState("");
    const [date, setDate] = useState("");
    const [contractDurationId, setContractDurationId] = useState(null);
    
    // State for map markers
    const [location, setLocation] = useState({ lat: 24.7136, lng: 46.6753, address: "" });

    const [open, setOpen] = useState(false);
    const [selectedTruck, setSelectedTruck] = useState(null);
    const isRtl = i18n.language === 'ar';

    // Helper to get localized field from API
    const getLangField = (item, field) => {
      if (!item) return '';
      const isEn = i18n.language && i18n.language.startsWith('en');
      const enField = `${field}_en`;
      const arField = `${field}_ar`;
      
      if (isEn && item[enField]) return item[enField];
      if (!isEn && item[arField]) return item[arField];
      
      return item[field] || '';
    };

    const handleSelect = (option) => {
      setSelectedTruck(option);
      setTruckId(option.id);
      setOpen(false);
      setSelectedService(null);
    };

    const handleSubmit = async () => {
      if (!cityId || !truckId || !selectedService || !numTrips || !goodTypeId || !date || !contractDurationId) {
        toast.error(t('contractUpload.errorFillAll'));
        return;
      }

      // Format date to DD-MM-YYYY
      const [year, month, day] = date.split('-');
      const formattedDate = `${day}-${month}-${year}`;

      const formData = new FormData();
      formData.append('in_city', cityId);
      formData.append('lat_from', location.lat);
      formData.append('lang_from', location.lng);
      formData.append('truck_id', truckId);
      formData.append('sub_truck_id', selectedService);
      formData.append('number', numTrips);
      formData.append('good_type_id', goodTypeId);
      formData.append('date', formattedDate);
      formData.append('contract_duration_id', contractDurationId);

      try {
        const response = await createContractRequest(formData).unwrap();
        if (response.status === 1) {
          toast.success(t('contractUpload.successMessage'));
          
          // Clear all fields
          setCityId("");
          setTruckId("");
          setSelectedTruck(null);
          setSelectedService(null);
          setNumTrips("1");
          setGoodTypeId("");
          setDate("");
          setContractDurationId(null);
        } else {
          toast.error(response.message || t('contractUpload.errorMessage'));
        }
      } catch (error) {
        toast.error(t('contractUpload.errorMessage'));
      }
    };

    // Map events component
    const MapEvents = () => {
      useMapEvents({
        click: (e) => {
          setLocation({ lat: e.latlng.lat, lng: e.latlng.lng, address: "" });
        },
      });
      return null;
    };
  
    // Map component
    const MapComponent = React.useMemo(() => () => (
      <MapContainer 
        center={[location.lat, location.lng]} 
        zoom={13} 
        className="rounded-3"
        style={{ height: '95%', minHeight: '400px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapEvents />
        <Marker position={[location.lat, location.lng]}>
          <Popup>{t('contractUpload.title')}</Popup>
        </Marker>
      </MapContainer>
    ), [location, t]);

  return (
    <>
      <UserNavbar />

      <div className="container mb-5">
        <div className="row mt-3">
          <div className="col-md-6">
            <div className="shadow p-3 rounded-3 h-100">

              <h2 className='orders-title'>{t('contractUpload.title')}</h2>
                <div className="row">
                <div className="col-12">
                    <div className="mb-2">
                    <label className="form-label mb-1">{t('contractUpload.whereTruck')}</label>
                    <div className="select-wrapper position-relative">
    <select className={`form-select form-input py-2 ${isRtl ? 'ps-3' : 'pe-3'} blue-select`} value={cityId} onChange={(e) => setCityId(e.target.value)}>
        <option value="" disabled>{t('contractUpload.selectOption')}</option>
        {listsData?.InCity && Object.entries(listsData.InCity).map(([id, name]) => (
          <option key={id} value={id}>{name}</option>
        ))}
    </select>
    <div className={`select-icon position-absolute ${isRtl ? 'start-0 ps-2' : 'end-0 pe-2'} top-50 translate-middle-y`}>
        <ExpandMoreIcon />
    </div>
</div>
                </div>
                    </div>
                    <div className="d-flex align-items-center gap-1 border-bottom pb-2">
                        <img src="../assets/map-hotel.svg" alt="map" />
                        <h6 className='choose-from-map m-0'>{t('contractUpload.mapSelect')}</h6>
                    </div>
                    <div className="col-12 mt-3">
                        <label className="form-label mb-1">{t('contractUpload.truckType')}</label>

                        {/* ✅ Custom Select */}
                        <div className="custom-select-wrapper" style={{ zIndex: open ? 1100 : 10 }}>
                            
                            <div
                            className="custom-select form-input"
                            onClick={() => setOpen(!open)}
                            >
                            {selectedTruck ? (
                                <div className="d-flex align-items-center gap-2">
                                {selectedTruck.image && <img src={selectedTruck.image} alt="" style={{ width: '24px' }} />}
                                <span>{getLangField(selectedTruck, 'name')}</span>
                                </div>
                            ) : (
                                <span className="placeholder">{t('contractUpload.truckTypePlaceholder')}</span>
                            )}

                            <ExpandMoreIcon className={`arrow ${open ? "rotate" : ""}`} />
                            </div>

                            {open && (
                            <div className="custom-options">
                                {(listsData?.Truck || []).map((option) => (
                                <div
                                    key={option.id}
                                    className="custom-option"
                                    onClick={() => handleSelect(option)}
                                >
                                    {option.image && <img src={option.image} alt="" style={{ width: '24px' }} />}
                                    <span>{getLangField(option, 'name')}</span>
                                </div>
                                ))}
                            </div>
                            )}

                        </div>

                    </div>  
                                    {/* Service Type Filter (Radio with Images) */}
<div>
<label className="form-label mb-1 mt-3">{t('contractUpload.truckSize')}</label>

  <div className="horizontal-scroll-wrapper">
    {(subTrucksData || []).map((item) => (
      <div
        key={item.id}
        className={`truck-size-card ${
          selectedService === item.id ? "active" : ""
        }`}
        onClick={() => setSelectedService(item.id)}
      >
        <div className="truck-img-wrapper">
          <img
            src={item.image}
            alt={getLangField(item, 'name')}
          />
        </div>
        
        <input
          type="radio"
          className="checkbox-style"
          checked={selectedService === item.id}
          readOnly
        />
      </div>
    ))}
    {truckId && (!subTrucksData || subTrucksData.length === 0) && (
      <p className="text-muted w-100 text-center">{t('contractUpload.noSizes')}</p>
    )}
  </div>

  <div className="row mt-3">
                    <div className="col-lg-8">
                    <div className="mb-3">
                    <label className="form-label mb-1">{t('contractUpload.goodType')}</label>
                    <div className="select-wrapper position-relative">
    <select className={`form-select form-input py-2 ${isRtl ? 'ps-3' : 'pe-3'} blue-select`} value={goodTypeId} onChange={(e) => setGoodTypeId(e.target.value)}>
        <option value="" disabled>{t('contractUpload.goodTypePlaceholder')}</option>
        {(listsData?.GoodType || []).map((type) => (
          <option key={type.id} value={type.id}>{getLangField(type, 'name')}</option>
        ))}
    </select>
    <div className={`select-icon position-absolute ${isRtl ? 'start-0 ps-2' : 'end-0 pe-2'} top-50 translate-middle-y`}>
        <ExpandMoreIcon />
    </div>
</div>
                </div>

                    </div>
                    <div className="col-lg-4">
                    <label className="form-label mb-1">{t('contractUpload.tripsPerMonth')}</label>
                    <div className="select-wrapper position-relative">
                        <select className={`form-select form-input py-2 ${isRtl ? 'ps-3' : 'pe-3'} blue-select`} value={numTrips} onChange={(e) => setNumTrips(e.target.value)}>
                            {[...Array(10)].map((_, i) => (
                              <option key={i+1} value={i+1}>{i+1 < 10 ? `0${i+1}` : i+1}</option>
                            ))}
                        </select>
                        <div className={`select-icon position-absolute ${isRtl ? 'start-0 ps-2' : 'end-0 pe-2'} top-50 translate-middle-y`}>
                            <ExpandMoreIcon />
                        </div>
                    </div>
                    </div>
                </div>
</div>
<div className="mb-3">
                    <label className="form-label mb-1">{t('contractUpload.startDate')}</label>
                    <div className="datetime-wrapper position-relative">
      
      {/* Hidden native inputs */}
      <input
        ref={dateRef}
        type="date"
        className="hidden-native-input"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      {/* Visible fake input */}
      <div className="form-input datetime-input d-flex align-items-center justify-content-between" onClick={() => dateRef.current.showPicker()} style={{ cursor: 'pointer' }}>

        <div className="d-flex align-items-center gap-4">
                    {/* Right: Date */}
        <span className="datetime-part">
          {date || t('contractUpload.startDate')}
        </span>
        </div>
        {/* Left Icon */}
        <CalendarMonthIcon className="calendar-icon" />
      </div>
    </div>
                </div>   
                </div>
                <div className="mb-3">
                <label className="form-label mb-1">{t('contractUpload.contractDuration')}</label>
                    <div className="d-flex align-items-center gap-2">
                        {(listsData?.ContractDuration || []).map((duration) => (
                            <div 
                                key={duration.id}
                                className={`filter-checkbox-box-2 months-filter-item px-4 ${
                                    contractDurationId === duration.id ? "active" : ""
                                }`}
                                onClick={() => setContractDurationId(duration.id)}
                                style={{ flex: 1, textAlign: 'center' }}
                            >
                                {getLangField(duration, 'name')}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="d-flex align-items-center justify-content-end gap-2">
                    <button 
                      type='button' 
                      className="login-button text-decoration-none" 
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? t('contractUpload.submitting') : t('contractUpload.submit')}
                    </button>
                </div>

            </div>
          </div>
          <div className="col-md-6">
            <div className="shadow p-3 rounded-3 h-100">
            <h2 className='orders-title'>{t('basicUpload.mapTitle')}</h2>
            <div className="mt-3 pb-3 h-100">
              <MapComponent />
            </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default ContractUpload;
