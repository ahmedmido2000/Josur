import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { useAddDriverMutation } from '../../api/admin/adminApi';
import { useGetListsQuery } from '../../api/auth/authApi';

const AddDriverComponent = () => {
  const { t, i18n } = useTranslation(['admin', 'common']);
  const [addDriver, { isLoading: isAdding }] = useAddDriverMutation();
  const { data: listsData } = useGetListsQuery();

  const initialState = {
    name: '',
    last_name: '',
    username: '',
    email: '',
    mobile: '',
    password: '',
    password_repeat: '',
    country_id: '',
    city_id: '',
    license_number: '',
    experience_year: '',
    address: ''
  };

  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Map backend field names to translation labels
  const fieldLabels = {
    name: t('admin:drivers.fullName'),
    last_name: t('admin:drivers.lastName'),
    username: t('admin:drivers.username'),
    email: t('admin:drivers.email'),
    mobile: t('admin:drivers.mobile'),
    password: t('admin:drivers.password'),
    license_number: t('admin:drivers.licenseNumber'),
    experience_year: t('admin:drivers.experience'),
    address: t('admin:drivers.address'),
    country_id: t('admin:drivers.country'),
    city_id: t('admin:drivers.city')
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatErrors = (data) => {
    if (Array.isArray(data)) {
      return data.map(err => {
        const label = fieldLabels[err.field] || err.field;
        return `${label}: ${err.message}`;
      }).join(' | ');
    }
    return null;
  };

  const handleAddDriver = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.password_repeat) {
      setError(i18n.language === 'en' ? 'Passwords do not match' : 'كلمات المرور غير متطابقة');
      return;
    }

    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });

      const response = await addDriver(submitData).unwrap();
      if (response.status === 1) {
        setSuccess(t('admin:drivers.success'));
        setFormData(initialState);
      } else {
        const backendErrors = formatErrors(response.data);
        setError(backendErrors || response.message || t('admin:drivers.error'));
      }
    } catch (err) {
      const backendErrors = formatErrors(err.data?.data);
      setError(backendErrors || err.data?.message || t('admin:drivers.error'));
    }
  };

  const filteredCities = (listsData?.city && formData.country_id) 
    ? listsData.city.filter(c => c.country_id?.toString() === formData.country_id?.toString()) 
    : [];

  return (
    <div className="settings-content">
      <h4 className="orders-title m-0">{t('admin:drivers.ownerDashboard')}</h4>

      <div className="p-4 mt-2 shadow rounded-2 bg-white">
        <div className="d-flex gap-1 align-items-center mb-2">
          <img src="../assets/user-add.svg" alt="truck" />
          <h4 className="orders-title m-0">{t('admin:drivers.inviteNewDriver')}</h4>
        </div>

        <p className="months-filter-item m-0 mb-4">
          {t('admin:drivers.inviteDesc')}
        </p>

        {error && <div className="alert alert-danger py-2">{error}</div>}
        {success && <div className="alert alert-success py-2">{success}</div>}

        <form onSubmit={handleAddDriver}>
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label mb-1">{t('admin:drivers.fullName')}</label>
                <input 
                  type="text" 
                  name="name"
                  className="form-control form-input py-2" 
                  placeholder={t('admin:drivers.fullName')}
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label mb-1">{t('admin:drivers.lastName')}</label>
                <input 
                  type="text" 
                  name="last_name"
                  className="form-control form-input py-2" 
                  placeholder={t('admin:drivers.lastName')}
                  value={formData.last_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label mb-1">{t('admin:drivers.username')}</label>
                <input 
                  type="text" 
                  name="username"
                  className="form-control form-input py-2" 
                  placeholder={t('admin:drivers.username')}
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label mb-1">{t('admin:drivers.email')}</label>
                <input 
                  type="email" 
                  name="email"
                  className="form-control form-input py-2" 
                  placeholder={t('admin:drivers.email')}
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="col-md-12">
              <div className="mb-3">
                <label className="form-label mb-1">{t('admin:drivers.mobile')}</label>
                <input 
                  type="text" 
                  name="mobile"
                  className="form-control form-input py-2" 
                  placeholder={t('admin:drivers.mobile')}
                  value={formData.mobile}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label mb-1">{t('admin:drivers.password')}</label>
                <input 
                  type="password" 
                  name="password"
                  className="form-control form-input py-2" 
                  placeholder={t('admin:drivers.password')}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label mb-1">{t('admin:drivers.confirmPassword')}</label>
                <input 
                  type="password" 
                  name="password_repeat"
                  className="form-control form-input py-2" 
                  placeholder={t('admin:drivers.confirmPassword')}
                  value={formData.password_repeat}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label mb-1">{t('admin:drivers.country')}</label>
                <select 
                  name="country_id" 
                  className="form-select form-input py-2"
                  value={formData.country_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">{t('admin:drivers.selectCountry')}</option>
                  {listsData?.Country?.map(country => (
                    <option key={country.id} value={country.id}>
                      {i18n.language === 'en' ? country.name_en : country.name_ar || country.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label mb-1">{t('admin:drivers.city')}</label>
                <select 
                  name="city_id" 
                  className="form-select form-input py-2"
                  value={formData.city_id}
                  onChange={handleInputChange}
                  required
                  disabled={!formData.country_id}
                >
                  <option value="">{t('admin:drivers.selectCity')}</option>
                  {filteredCities.map(city => (
                    <option key={city.id} value={city.id}>
                      {i18n.language === 'en' ? city.name_en : city.name_ar || city.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label mb-1">{t('admin:drivers.licenseNumber')}</label>
                <input 
                  type="text" 
                  name="license_number"
                  className="form-control form-input py-2" 
                  placeholder={t('admin:drivers.licenseNumber')}
                  value={formData.license_number}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label mb-1">{t('admin:drivers.experience')}</label>
                <input 
                  type="text" 
                  name="experience_year"
                  className="form-control form-input py-2" 
                  placeholder={t('admin:drivers.experience')}
                  value={formData.experience_year}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="col-12">
              <div className="mb-4">
                <label className="form-label mb-1">{t('admin:drivers.address')}</label>
                <input 
                  type="text" 
                  name="address"
                  className="form-control form-input py-2" 
                  placeholder={t('admin:drivers.address')}
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="col-md-2 mb-2">
              <button 
                type="button" 
                className="btn btn-outline-light text-dark border w-100"
                onClick={() => setFormData(initialState)}
              >
                {t('admin:drivers.cancel')}
              </button>
            </div>
            <div className="col-md-10 mb-2">
              <button 
                type="submit" 
                className="login-button w-100"
                disabled={isAdding}
              >
                {isAdding ? (
                  <span className="spinner-border spinner-border-sm"></span>
                ) : (
                  <><FontAwesomeIcon icon={faPlus} /> {t('admin:drivers.add')}</>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDriverComponent;
