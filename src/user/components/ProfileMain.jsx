import React, { useState, useEffect, useRef } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, updateUser } from '../../store/slices/authSlice';
import { useGetListsQuery } from '../../api/site/siteApi';
import { useGetUserProfileQuery, useUpdateUserProfileMutation } from '../../api/user/userApi';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';

const ProfileMain = () => {
  const { t, i18n } = useTranslation('user');
  const isRtl = i18n.language === 'ar';
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const userFromRedux = useSelector(selectCurrentUser);
  const { token } = useSelector((state) => state.auth);

  const { data: listsData } = useGetListsQuery();
  const { data: profileResponse, isLoading: isProfileLoading, refetch } = useGetUserProfileQuery(token);
  
  // Extract profile data safely - handling case where it might be in data[0] or data
  const profileData = profileResponse?.data?.[0] || profileResponse?.data;
  
  const [updateProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    last_name: '',
    mobile: '',
    country_id: '',
    city_id: '',
    image: null,
    imagePreview: null
  });

  useEffect(() => {
    // Prefer profileData from server, fallback to userFromRedux
    const user = profileData || userFromRedux;
    if (user && !isEditing) {
      setFormData({
        name: user.name || '',
        last_name: user.last_name || '',
        mobile: user.mobile || user.phone || '',
        country_id: (user.country_id && user.country_id !== 0 && user.country_id !== '0') ? user.country_id : '',
        city_id: (user.city_id && user.city_id !== 0 && user.city_id !== '0') ? user.city_id : '',
        image: null,
        imagePreview: user.avatar || user.image || user.profile_image || '/assets/man.png'
      });
    }
  }, [userFromRedux, profileData, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleSave = async () => {
    const updateData = new FormData();
    updateData.append('name', formData.name);
    updateData.append('last_name', formData.last_name);
    updateData.append('mobile', formData.mobile);
    updateData.append('country_id', formData.country_id);
    updateData.append('city_id', formData.city_id);
    
    if (formData.image) {
      updateData.append('file', formData.image);
    }

    try {
      const res = await updateProfile({ profileData: updateData, token }).unwrap();
      if (res.status === 1) {
        toast.success(t('profile.updateSuccess'));
        
        // Refetch profile data to ensure local state and RTK cache are synced
        const newProfile = await refetch();
        const updatedUser = newProfile.data?.data?.[0] || newProfile.data?.data || res.data;
        
        if (updatedUser) {
          dispatch(updateUser(updatedUser));
        }
        
        setIsEditing(false);
      } else {
        toast.error(res.message || t('profile.updateError'));
      }
    } catch (err) {
      toast.error(t('profile.updateError'));
    }
  };

  const getLangField = (item, field) => {
    if (!item) return '';
    return i18n.language === 'ar' ? item[field] : (item[`${field}_en`] || item[field]);
  };

  if (isProfileLoading && !userFromRedux) return <div className="p-5 text-center"><LoadingSpinner /></div>;

  const displayUser = profileData || userFromRedux || {};

  return (
    <section className="profile-edit-section">
      <div className="profile-header d-flex justify-content-between align-items-center flex-wrap gap-4 pb-4 border-bottom mb-4">
        <div className="d-flex gap-3 align-items-center">
          <div className="position-relative">
            <div className="profile-img-container shadow-sm border rounded-circle overflow-hidden bg-light" style={{ width: '90px', height: '90px' }}>
                <img 
                    src={formData.imagePreview || '/assets/man.png'} 
                    className='w-100 h-100 object-fit-cover' 
                    alt="user" 
                    onError={(e) => { e.target.src = '/assets/man.png' }}
                />
            </div>
            {isEditing && (
                <div 
                    className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center shadow" 
                    style={{ cursor: 'pointer', width: '30px', height: '30px' }}
                    onClick={() => fileInputRef.current.click()}
                >
                    <i className="fas fa-camera" style={{ fontSize: '13px' }}></i>
                </div>
            )}
            <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                accept="image/*"
                onChange={handleImageChange}
            />
          </div>
          <div>
              <h5 className="orders-title m-0 fw-bold">{`${displayUser.name || ''} ${displayUser.last_name || ''}`}</h5>
              <p className="text-muted m-0 small">{displayUser.email}</p>
          </div>
        </div>
        
        <div className="profile-actions">
          {!isEditing ? (
            <button 
              type='button' 
              className="login-button border-0 px-4 py-2 rounded-pill shadow-sm"
              onClick={() => setIsEditing(true)}
            >
              <i className="fas fa-edit me-2"></i>
              {t('profile.edit')}
            </button>
          ) : (
            <div className="d-flex gap-2">
                <button 
                    type='button' 
                    className="btn btn-outline-secondary px-4 py-2 rounded-pill small"
                    onClick={() => setIsEditing(false)}
                    disabled={isUpdating}
                >
                    {t('common:buttons.cancel')}
                </button>
                <button 
                    type='button' 
                    className="login-button border-0 px-4 py-2 rounded-pill shadow-sm small"
                    onClick={handleSave}
                    disabled={isUpdating}
                >
                    {isUpdating ? t('profile.submitting') : t('profile.save')}
                </button>
            </div>
          )}
        </div>
      </div>

      <div className="row g-3 mt-2">
          <div className="col-md-6 col-12">
              <div className="mb-3">
                  <label className="form-label mb-1 fw-semibold small">{t('profile.firstName')}</label>
                  <input
                      type="text"
                      name="name"
                      className="form-control form-input py-2"
                      placeholder={t('profile.firstName')}
                      value={formData.name}
                      onChange={handleChange}
                      readOnly={!isEditing}
                  />
              </div>
          </div>
          <div className="col-md-6 col-12">
              <div className="mb-3">
                  <label className="form-label mb-1 fw-semibold small">{t('profile.lastName')}</label>
                  <input
                      type="text"
                      name="last_name"
                      className="form-control form-input py-2"
                      placeholder={t('profile.lastName')}
                      value={formData.last_name}
                      onChange={handleChange}
                      readOnly={!isEditing}
                  />
              </div>
          </div>
          <div className="col-md-6 col-12">
              <div className="mb-3">
                  <label className="form-label mb-1 fw-semibold small">{t('profile.email')}</label>
                  <input
                      type="email"
                      className="form-control form-input py-2 bg-light"
                      placeholder={t('profile.email')}
                      value={displayUser.email || ''}
                      readOnly
                      disabled
                  />
              </div>
          </div>
          <div className="col-md-6 col-12">
              <div className="mb-3">
                  <label className="form-label mb-1 fw-semibold small">{t('profile.phone')}</label>
                  <input
                      type="text"
                      name="mobile"
                      className="form-control form-input py-2"
                      placeholder={t('profile.phone')}
                      value={formData.mobile}
                      onChange={handleChange}
                      readOnly={!isEditing}
                      dir="ltr"
                  />
              </div>
          </div>
          <div className="col-md-6 col-12">
              <div className="mb-3">
                  <label className="form-label mb-1 fw-semibold small">{t('profile.country')}</label>
                  <div className="select-wrapper position-relative">
                      <select 
                          name="country_id"
                          className={`form-select form-input py-2 ${isRtl ? 'ps-3' : 'pe-3'}`}
                          value={formData.country_id}
                          onChange={handleChange}
                          disabled={!isEditing}
                      >
                          <option value="">{t('profile.selectCountry')}</option>
                          {listsData?.Country && Object.values(listsData.Country).map(country => (
                              <option key={country.id} value={country.id}>{getLangField(country, 'name')}</option>
                          ))}
                      </select>
                      {!isEditing ? null : (
                          <div className={`select-icon position-absolute ${isRtl ? 'start-0 ps-2' : 'end-0 pe-2'} top-50 translate-middle-y pointer-none`}>
                              <ExpandMoreIcon />
                          </div>
                      )}
                  </div>
              </div>
          </div>
          <div className="col-md-6 col-12">
              <div className="mb-3">
                  <label className="form-label mb-1 fw-semibold small">{t('profile.city')}</label>
                  <div className="select-wrapper position-relative">
                      <select 
                          name="city_id"
                          className={`form-select form-input py-2 ${isRtl ? 'ps-3' : 'pe-3'}`}
                          value={formData.city_id}
                          onChange={handleChange}
                          disabled={!isEditing}
                      >
                          <option value="">{t('profile.selectCity')}</option>
                          {listsData?.city && Object.values(listsData.city)
                              .filter(city => !formData.country_id || city.country_id.toString() === formData.country_id.toString())
                              .map(city => (
                              <option key={city.id} value={city.id}>{getLangField(city, 'name')}</option>
                          ))}
                      </select>
                      {!isEditing ? null : (
                          <div className={`select-icon position-absolute ${isRtl ? 'start-0 ps-2' : 'end-0 pe-2'} top-50 translate-middle-y pointer-none`}>
                              <ExpandMoreIcon />
                          </div>
                      )}
                  </div>
              </div>
          </div>
      </div>
    </section>
  )
}

export default ProfileMain
