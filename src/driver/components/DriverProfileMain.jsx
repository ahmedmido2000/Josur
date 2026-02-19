import React, { useState, useEffect, useRef } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, updateUser } from '../../store/slices/authSlice';
import { useGetListsQuery } from '../../api/site/siteApi';
import { useGetDriverProfileQuery, useUpdateDriverProfileMutation } from '../../api/driver/driverApi';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';

const DriverProfileMain = () => {
  const { t, i18n } = useTranslation('driver');
  const isRtl = i18n.language === 'ar';
  const fileInputRef = useRef(null);
  const truckPhotoRef = useRef(null);
  const dispatch = useDispatch();
  const userFromRedux = useSelector(selectCurrentUser);

  const { data: listsData } = useGetListsQuery();
  const { data: profileData, isLoading: isProfileLoading } = useGetDriverProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateDriverProfileMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    last_name: '',
    mobile: '',
    country_id: '',
    city_id: '',
    image: null,
    imagePreview: null,
    // Truck info
    truck_type: '',
    truck_plate: '',
    production_year: '',
    capacity: '',
    status: '',
    truck_image: null,
    truckImagePreview: null
  });

  useEffect(() => {
    const user = userFromRedux || profileData?.data;
    if (user) {
      const truck = user.truck || {};
      setFormData({
        name: user.name || '',
        last_name: user.last_name || '',
        mobile: user.mobile || '',
        country_id: (user.country_id && user.country_id !== 0 && user.country_id !== '0') ? user.country_id : '',
        city_id: (user.city_id && user.city_id !== 0 && user.city_id !== '0') ? user.city_id : '',
        image: null,
        imagePreview: user.avatar || user.image || '../assets/man.png',
        truck_type: truck.truck_type_id || '',
        truck_plate: truck.plate_number || '',
        production_year: truck.year || '',
        capacity: truck.capacity || '',
        status: truck.status || '',
        truck_image: null,
        truckImagePreview: truck.image || '../assets/truck-details-img.png'
      });
    }
  }, [userFromRedux, profileData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === 'user') {
        setFormData(prev => ({
          ...prev,
          image: file,
          imagePreview: URL.createObjectURL(file)
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          truck_image: file,
          truckImagePreview: URL.createObjectURL(file)
        }));
      }
    }
  };

  const handleSave = async () => {
    const updateData = new FormData();
    updateData.append('name', formData.name);
    updateData.append('last_name', formData.last_name);
    updateData.append('mobile', formData.mobile);
    updateData.append('country_id', formData.country_id);
    updateData.append('city_id', formData.city_id);
    
    updateData.append('truck_type_id', formData.truck_type);
    updateData.append('plate_number', formData.truck_plate);
    updateData.append('year', formData.production_year);
    updateData.append('capacity', formData.capacity);
    updateData.append('truck_status', formData.status);

    if (formData.image) {
      updateData.append('file', formData.image);
    }
    if (formData.truck_image) {
      updateData.append('truck_file', formData.truck_image);
    }

    try {
      const res = await updateProfile(updateData).unwrap();
      if (res.status === 1) {
        toast.success(t('driver.profile.updateSuccess'));
        if (res.data) {
          dispatch(updateUser(res.data));
        }
        setIsEditing(false);
      } else {
        toast.error(res.message || t('driver.profile.updateError'));
      }
    } catch (err) {
      toast.error(t('driver.profile.updateError'));
    }
  };

  const getLangField = (item, field) => {
    if (!item) return '';
    return i18n.language === 'ar' ? item[field] : (item[`${field}_en`] || item[field]);
  };

  if (isProfileLoading && !userFromRedux) return <LoadingSpinner />;

  const displayUser = userFromRedux || profileData?.data || {};

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 pb-4">
      <div className="d-flex gap-3 align-items-center">
                    <div className="position-relative">
                        <img src={formData.imagePreview || '../assets/man.png'} className='profile-main-img' alt="user" />
                        {isEditing && (
                            <div 
                                className="position-absolute bottom-0 end-0 bg-white rounded-circle p-1 shadow-sm" 
                                style={{ cursor: 'pointer' }}
                                onClick={() => fileInputRef.current.click()}
                            >
                                <i className="fas fa-camera text-primary"></i>
                            </div>
                        )}
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            style={{ display: 'none' }} 
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, 'user')}
                        />
                    </div>
                    <div>
                        <h6 className="orders-title m-0">{`${displayUser.name || ''} ${displayUser.last_name || ''}`}</h6>
                        <p className="why-card-desc email-text m-0">{displayUser.email}</p>
                    </div>
                </div>
        <div className="d-flex align-items-center gap-2">
          {!isEditing ? (
            <button 
              type='button' 
              className="login-button text-decoration-none"
              onClick={() => setIsEditing(true)}
            >
              {t('driver.profile.edit')}
            </button>
          ) : (
            <>
              <button 
                type='button' 
                className="btn btn-outline-secondary px-4 py-2"
                onClick={() => setIsEditing(false)}
                disabled={isUpdating}
              >
                {t('driver.profile.cancel')}
              </button>
              <button 
                type='button' 
                className="login-button text-decoration-none"
                onClick={handleSave}
                disabled={isUpdating}
              >
                {isUpdating ? t('driver.profile.submitting') : t('driver.profile.save')}
              </button>
            </>
          )}
        </div>
      </div>
        <div className="row mt-4">
            <h3 className='orders-title mb-3'>{t('driver.profile.personalInfo')}</h3>
            <div className="col-md-6">
            <div className="mb-3">
                    <label className="form-label mb-1">{t('driver.profile.firstName')}</label>
                <input
                    type="text"
                    name="name"
                    className="form-control form-input py-2"
                    placeholder={t('driver.profile.firstName')}
                    value={formData.name}
                    onChange={handleChange}
                    readOnly={!isEditing}
                />
                </div>
            </div>
            <div className="col-md-6">
            <div className="mb-3">
                    <label className="form-label mb-1">{t('driver.profile.lastName')}</label>
                <input
                    type="text"
                    name="last_name"
                    className="form-control form-input py-2"
                    placeholder={t('driver.profile.lastName')}
                    value={formData.last_name}
                    onChange={handleChange}
                    readOnly={!isEditing}
                />
                </div>
            </div>
            <div className="col-md-6">
            <div className="mb-3">
                    <label className="form-label mb-1">{t('driver.profile.email')}</label>
                <input
                    type="email"
                    className="form-control form-input py-2"
                    placeholder={t('driver.profile.email')}
                    value={displayUser.email || ''}
                    readOnly
                    disabled
                />
                </div>
            </div>
            <div className="col-md-6">
            <div className="mb-3">
                    <label className="form-label mb-1">{t('driver.profile.country')}</label>
                    <div className="select-wrapper position-relative">
    <select 
      name="country_id"
      className={`form-select form-input py-2 ${isRtl ? 'ps-3' : 'pe-3'}`}
      value={formData.country_id}
      onChange={handleChange}
      disabled={!isEditing}
    >
        <option value="">{t('driver.profile.selectCountry')}</option>
        {listsData?.Country && Object.values(listsData.Country).map(country => (
            <option key={country.id} value={country.id}>{getLangField(country, 'name')}</option>
        ))}
    </select>
    <div className={`select-icon position-absolute ${isRtl ? 'start-0 ps-2' : 'end-0 pe-2'} top-50 translate-middle-y`}>
        <ExpandMoreIcon />
    </div>
</div>
                </div>
            </div>
            <div className="col-md-6">
            <div className="mb-3">
                    <label className="form-label mb-1">{t('driver.profile.phone')}</label>
                <input
                    type="text"
                    name="mobile"
                    className="form-control form-input py-2"
                    placeholder={t('driver.profile.phone')}
                    value={formData.mobile}
                    onChange={handleChange}
                    readOnly={!isEditing}
                />
                </div>
            </div>
            <div className="col-md-6">
            <div className="mb-3">
                    <label className="form-label mb-1">{t('driver.profile.city')}</label>
                    <div className="select-wrapper position-relative">
    <select 
      name="city_id"
      className={`form-select form-input py-2 ${isRtl ? 'ps-3' : 'pe-3'}`}
      value={formData.city_id}
      onChange={handleChange}
      disabled={!isEditing}
    >
        <option value="">{t('driver.profile.selectCity')}</option>
        {listsData?.city && Object.values(listsData.city)
            .filter(city => !formData.country_id || city.country_id.toString() === formData.country_id.toString())
            .map(city => (
            <option key={city.id} value={city.id}>{getLangField(city, 'name')}</option>
        ))}
    </select>
    <div className={`select-icon position-absolute ${isRtl ? 'start-0 ps-2' : 'end-0 pe-2'} top-50 translate-middle-y`}>
        <ExpandMoreIcon />
    </div>
</div>
                </div>
            </div>
        </div>
        <div className="row mt-4">
        <h3 className='orders-title mb-3'>{t('driver.profile.truckInfo')}</h3>

                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label mb-1">{t('driver.profile.truckType')}</label>
                                            <div className="select-wrapper position-relative">
    <select 
      name="truck_type"
      className={`form-select form-input py-2 ${isRtl ? 'ps-3' : 'pe-3'}`}
      value={formData.truck_type}
      onChange={handleChange}
      disabled={!isEditing}
    >
        <option value="">{t('driver.profile.truckType')}</option>
        {listsData?.TruckType && Object.values(listsData.TruckType).map(type => (
            <option key={type.id} value={type.id}>{getLangField(type, 'name')}</option>
        ))}
    </select>
    <div className={`select-icon position-absolute ${isRtl ? 'start-0 ps-2' : 'end-0 pe-2'} top-50 translate-middle-y`}>
        <ExpandMoreIcon />
    </div>
</div>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label mb-1">{t('driver.profile.truckPlate')}</label>
                                            <input
                    type="text"
                    name="truck_plate"
                    className="form-control form-input py-2"
                    placeholder={t('driver.profile.truckPlate')}
                    value={formData.truck_plate}
                    onChange={handleChange}
                    readOnly={!isEditing}
                />
                                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label mb-1">{t('driver.profile.productionYear')}</label>
                                            <input
                    type="text"
                    name="production_year"
                    className="form-control form-input py-2"
                    placeholder={t('driver.profile.productionYear')}
                    value={formData.production_year}
                    onChange={handleChange}
                    readOnly={!isEditing}
                />
                                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label mb-1">{t('driver.profile.loadCapacity')}</label>
                                            <input
                                                type="text"
                                                name="capacity"
                                                className="form-control form-input py-2"
                                                placeholder={t('driver.profile.loadCapacity')}
                                                value={formData.capacity}
                                                onChange={handleChange}
                                                readOnly={!isEditing}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label mb-1">{t('driver.profile.truckStatus')}</label>
                                            <input
                                                type="text"
                                                name="status"
                                                className="form-control form-input py-2"
                                                placeholder={t('driver.profile.truckStatus')}
                                                value={formData.status}
                                                onChange={handleChange}
                                                readOnly={!isEditing}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <img src={formData.truckImagePreview || '../assets/truck-details-img.png'} className='img-fluid truck-driver-img w-100' alt="truck" />
                                        {isEditing && (
                                            <>
                                                <button 
                                                    type='button' 
                                                    className="login-button text-decoration-none w-100 mt-3 d-flex align-items-center gap-1 justify-content-center"
                                                    onClick={() => truckPhotoRef.current.click()}
                                                >
                                                    <img src="../assets/camera.svg" alt="" /> {t('driver.profile.changeTruckPhoto')}
                                                </button>
                                                <input 
                                                    type="file" 
                                                    ref={truckPhotoRef} 
                                                    style={{ display: 'none' }} 
                                                    accept="image/*"
                                                    onChange={(e) => handleImageChange(e, 'truck')}
                                                />
                                            </>
                                        )}
                                    </div>
                                </div>
    </section>
  )
}

export default DriverProfileMain
