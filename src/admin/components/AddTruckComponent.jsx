import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useGetListsQuery, useGetSubTrucksQuery } from '../../api/site/siteApi';
import { useGetCompanyDriversQuery, useAddVehicleMutation } from '../../api/admin/adminApi';
import LoadingSpinner from '../../components/LoadingSpinner';

const AddTruckComponent = () => {
  const { t, i18n } = useTranslation(['admin', 'common']);
  const navigate = useNavigate();
  const isRtl = i18n.language === 'ar';

  const initialState = {
    driver_id: '',
    truck_id: '',
    sub_truck_id: '',
    plate_number: '',
    name: '',
    mobile: '',
    email: '',
    year_manufacture: '',
    color: '',
    capacity: '',
    description: '',
    type: '', // 1 for new, 2 for used
  };

  const [formData, setFormData] = useState(initialState);
  const [files, setFiles] = useState({
    driving_license: null,
    insurance: null,
    car_registration: null
  });
  const [fileNames, setFileNames] = useState({
    driving_license: '',
    insurance: '',
    car_registration: ''
  });
  const [previews, setPreviews] = useState({
    driving_license: null,
    insurance: null,
    car_registration: null
  });

  // API Queries
  const { data: listsData, isLoading: listsLoading } = useGetListsQuery();
  const { data: driversData, isLoading: driversLoading } = useGetCompanyDriversQuery();
  const { data: subTrucksData, isFetching: subTrucksLoading } = useGetSubTrucksQuery(formData.truck_id, {
    skip: !formData.truck_id
  });

  const [addVehicle, { isLoading: isSubmitting }] = useAddVehicleMutation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Reset sub-truck if truck changes
    if (name === 'truck_id') {
      setFormData(prev => ({ ...prev, truck_id: value, sub_truck_id: '' }));
    }
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setFiles(prev => ({ ...prev, [fieldName]: file }));
      setFileNames(prev => ({ ...prev, [fieldName]: file.name }));

      // Create preview if it's an image
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews(prev => ({ ...prev, [fieldName]: reader.result }));
        };
        reader.readAsDataURL(file);
      } else {
        setPreviews(prev => ({ ...prev, [fieldName]: null }));
      }
    }
  };

  const removeFile = (fieldName) => {
    setFiles(prev => ({ ...prev, [fieldName]: null }));
    setFileNames(prev => ({ ...prev, [fieldName]: '' }));
    setPreviews(prev => ({ ...prev, [fieldName]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.truck_id || !formData.sub_truck_id || !formData.driver_id) {
        toast.error(isRtl ? 'يرجى اختيار الشاحنة ونوعها والسائق' : 'Please select truck, sub-type and driver');
        return;
    }

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    
    if (files.driving_license) data.append('driving_license', files.driving_license);
    if (files.insurance) data.append('insurance', files.insurance);
    if (files.car_registration) data.append('car_registration', files.car_registration);

    try {
      const response = await addVehicle(data).unwrap();
      if (response.status === 1) {
        toast.success(t('addVehicle.success'));
        setFormData(initialState);
        setFiles({ driving_license: null, insurance: null, car_registration: null });
        setFileNames({ driving_license: '', insurance: '', car_registration: '' });
        setPreviews({ driving_license: null, insurance: null, car_registration: null });
      } else {
        toast.error(response.message || t('addVehicle.error'));
      }
    } catch (err) {
      console.error('Failed to add vehicle:', err);
      toast.error(t('addVehicle.error'));
    }
  };

  const trucks = listsData?.Truck || [];
  const drivers = driversData?.data?.[0]?.items || [];
  const subTrucks = subTrucksData || [];

  if (listsLoading || driversLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="settings-content">
      <h4 className="orders-title m-0">{t('drivers.ownerDashboard')}</h4>

      <form onSubmit={handleSubmit} className="p-3 mt-2 shadow rounded-2 bg-white">
        <div className="d-flex gap-1 align-items-center mb-2">
            <i className="fas fa-truck text-primary fs-4"></i>
            <h4 className="orders-title m-0">{t('addVehicle.title')}</h4>
        </div>

        <p className="months-filter-item m-0 mb-3 text-muted">
          {t('addVehicle.subtitle')}
        </p>

        <h6 className="form-label mb-3 fw-bold border-bottom pb-2">{t('addVehicle.basicInfo')}</h6>

        <div className="row g-3">
          {/* Driver Selection */}
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label mb-1">{t('addVehicle.driver')}</label>
              <div className="select-wrapper position-relative">
                <select 
                    className="form-select form-input py-2 pe-3"
                    name="driver_id"
                    value={formData.driver_id}
                    onChange={handleInputChange}
                    required
                >
                  <option value="">{t('addVehicle.selectDriver')}</option>
                  {drivers.map(driver => (
                    <option key={driver.user_id} value={driver.user_id}>
                        {driver.name} {driver.last_name} 
                    </option>
                  ))}
                </select>
                <div className={`select-icon position-absolute ${isRtl ? 'start-0' : 'end-0'} top-50 translate-middle-y px-2`}>
                  <ExpandMoreIcon />
                </div>
              </div>
            </div>
          </div>

          {/* Truck Selection */}
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label mb-1">{t('addVehicle.vehicleType')}</label>
              <div className="dropdown w-100">
                <button 
                  className="form-select form-input py-2 text-start d-flex align-items-center justify-content-between"
                  type="button"
                  id="truckDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {formData.truck_id ? (
                    <div className="d-flex align-items-center gap-2">
                        {trucks.find(t => t.id.toString() === formData.truck_id.toString())?.image && (
                            <img 
                                src={trucks.find(t => t.id.toString() === formData.truck_id.toString())?.image} 
                                alt="" 
                                style={{ width: '24px', height: '16px', objectFit: 'contain' }}
                            />
                        )}
                        <span>{isRtl ? trucks.find(t => t.id.toString() === formData.truck_id.toString())?.name : trucks.find(t => t.id.toString() === formData.truck_id.toString())?.name_en}</span>
                    </div>
                  ) : (
                    <span className="text-muted">{t('addVehicle.selectTruck')}</span>
                  )}
                </button>
                <ul className="dropdown-menu w-100 shadow-sm border-0 mt-1" aria-labelledby="truckDropdown" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {trucks.map(truck => (
                    <li key={truck.id}>
                      <button 
                        className="dropdown-item d-flex align-items-center gap-3 py-2" 
                        type="button"
                        onClick={() => handleInputChange({ target: { name: 'truck_id', value: truck.id.toString() } })}
                      >
                        <img 
                            src={truck.image} 
                            alt={truck.name} 
                            style={{ width: '32px', height: '20px', objectFit: 'contain' }}
                        />
                        <span>{isRtl ? truck.name : truck.name_en}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Sub Truck Selection */}
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label mb-1">{t('addVehicle.subVehicleType')}</label>
              <div className="select-wrapper position-relative">
                <select 
                    className="form-select form-input py-2 pe-3"
                    name="sub_truck_id"
                    value={formData.sub_truck_id}
                    onChange={handleInputChange}
                    disabled={!formData.truck_id || subTrucksLoading}
                    required
                >
                  <option value="">{subTrucksLoading ? t('common:loading') : t('addVehicle.selectSubTruck')}</option>
                  {subTrucks.map(sub => (
                    <option key={sub.id} value={sub.id}>
                        {isRtl ? sub.name : sub.name_en}
                    </option>
                  ))}
                </select>
                <div className={`select-icon position-absolute ${isRtl ? 'start-0' : 'end-0'} top-50 translate-middle-y px-2`}>
                  <ExpandMoreIcon />
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Name */}
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label mb-1">{t('addVehicle.name')}</label>
              <input 
                type="text" 
                className="form-control form-input py-2" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder={t('addVehicle.name')} 
                required
              />
            </div>
          </div>

          {/* Plate Number */}
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label mb-1">{t('addVehicle.plateNumber')}</label>
              <input 
                type="text" 
                className="form-control form-input py-2" 
                name="plate_number"
                value={formData.plate_number}
                onChange={handleInputChange}
                placeholder={t('addVehicle.plateNumber')} 
                required
              />
            </div>
          </div>

          {/* Mobile */}
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label mb-1">{t('addVehicle.mobile')}</label>
              <input 
                type="text" 
                className="form-control form-input py-2" 
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                placeholder={t('addVehicle.mobile')} 
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="col-12 col-md-6">
            <div className="mb-3">
              <label className="form-label mb-1">{t('addVehicle.email')}</label>
              <input 
                type="email" 
                className="form-control form-input py-2" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder={t('addVehicle.email')} 
                required
              />
            </div>
          </div>

          {/* Vehicle Condition Type */}
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label mb-1">{t('addVehicle.type')}</label>
              <div className="select-wrapper position-relative">
                <select 
                    className="form-select form-input py-2 pe-3"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                >
                  <option value="">{t('addVehicle.selectType')}</option>
                  <option value="1">{t('addVehicle.new')}</option>
                  <option value="2">{t('addVehicle.used')}</option>
                </select>
                <div className={`select-icon position-absolute ${isRtl ? 'start-0' : 'end-0'} top-50 translate-middle-y px-2`}>
                  <ExpandMoreIcon />
                </div>
              </div>
            </div>
          </div>

          {/* Model */}
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label mb-1">{t('addVehicle.model')}</label>
              <input 
                type="text" 
                className="form-control form-input py-2" 
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                placeholder={t('addVehicle.model')} 
                required
              />
            </div>
          </div>

          {/* Year */}
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label mb-1">{t('addVehicle.yearManufacture')}</label>
              <input 
                type="text" 
                className="form-control form-input py-2" 
                name="year_manufacture"
                value={formData.year_manufacture}
                onChange={handleInputChange}
                placeholder={t('addVehicle.yearManufacture')} 
                required
              />
            </div>
          </div>

          {/* Color */}
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label mb-1">{t('addVehicle.color')}</label>
              <input 
                type="text" 
                className="form-control form-input py-2" 
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                placeholder={t('addVehicle.color')} 
                required
              />
            </div>
          </div>

          {/* Capacity */}
          <div className="col-12">
            <div className="mb-3">
              <label className="form-label mb-1">{t('addVehicle.capacity')}</label>
              <input 
                type="number" 
                className="form-control form-input py-2" 
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                placeholder={t('addVehicle.capacity')} 
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="col-12">
            <div className="mb-3">
              <label className="form-label mb-1">{t('addVehicle.description')}</label>
              <textarea
                className="form-control form-input"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder={t('addVehicle.description')}
                rows="3"
              />
            </div>
          </div>

          {/* Documents */}
          <h6 className="form-label mb-2 fw-bold border-bottom pb-2 mt-4">{t('addVehicle.documents')}</h6>

          {/* Driving License */}
          <div className="col-md-4">
            <label className="form-label mb-1 small">{t('addVehicle.drivingLicense')}</label>
            <div className="card border-dashed p-3 text-center position-relative h-100 mb-2 mt-0">
              <label className="upload-box m-0 cursor-pointer w-100 h-100 d-flex flex-column align-items-center justify-content-center">
                <input
                  type="file"
                  hidden
                  onChange={(e) => handleFileChange(e, 'driving_license')}
                  accept="image/*,.pdf"
                />
                {previews.driving_license ? (
                  <img src={previews.driving_license} alt="preview" style={{ maxWidth: '100%', maxHeight: '100px', objectFit: 'contain' }} />
                ) : (
                  <>
                    <i className="fas fa-cloud-upload-alt text-primary mb-2 fs-3"></i>
                    <p className="m-0 small text-muted text-nowrap">{t('addVehicle.uploadFile')}</p>
                  </>
                )}
              </label>
            </div>
            {fileNames.driving_license && (
                <div className="px-2 py-1 bg-light rounded-pill mb-2 d-flex align-items-center justify-content-between">
                    <span className="small text-truncate" style={{ maxWidth: '120px' }} title={fileNames.driving_license}>
                        {fileNames.driving_license}
                    </span>
                    <button 
                        type="button" 
                        className="btn btn-link text-danger p-0 border-0"
                        onClick={() => removeFile('driving_license')}
                    >
                        <i className="fas fa-times-circle"></i>
                    </button>
                </div>
            )}
          </div>

          {/* Insurance */}
          <div className="col-md-4">
            <label className="form-label mb-1 small">{t('addVehicle.insurance')}</label>
            <div className="card border-dashed p-3 text-center position-relative h-100 mb-2 mt-0">
              <label className="upload-box m-0 cursor-pointer w-100 h-100 d-flex flex-column align-items-center justify-content-center">
                <input
                  type="file"
                  hidden
                  onChange={(e) => handleFileChange(e, 'insurance')}
                  accept="image/*,.pdf"
                />
                {previews.insurance ? (
                  <img src={previews.insurance} alt="preview" style={{ maxWidth: '100%', maxHeight: '100px', objectFit: 'contain' }} />
                ) : (
                  <>
                    <i className="fas fa-cloud-upload-alt text-primary mb-2 fs-3"></i>
                    <p className="m-0 small text-muted text-nowrap">{t('addVehicle.uploadFile')}</p>
                  </>
                )}
              </label>
            </div>
            {fileNames.insurance && (
                <div className="px-2 py-1 bg-light rounded-pill mb-2 d-flex align-items-center justify-content-between">
                    <span className="small text-truncate" style={{ maxWidth: '120px' }} title={fileNames.insurance}>
                        {fileNames.insurance}
                    </span>
                    <button 
                        type="button" 
                        className="btn btn-link text-danger p-0 border-0"
                        onClick={() => removeFile('insurance')}
                    >
                        <i className="fas fa-times-circle"></i>
                    </button>
                </div>
            )}
          </div>

          {/* Car Registration */}
          <div className="col-md-4">
            <label className="form-label mb-1 small">{t('addVehicle.carRegistration')}</label>
            <div className="card border-dashed p-3 text-center position-relative h-100 mb-2 mt-0">
              <label className="upload-box m-0 cursor-pointer w-100 h-100 d-flex flex-column align-items-center justify-content-center">
                <input
                  type="file"
                  hidden
                  onChange={(e) => handleFileChange(e, 'car_registration')}
                  accept="image/*,.pdf"
                />
                {previews.car_registration ? (
                  <img src={previews.car_registration} alt="preview" style={{ maxWidth: '100%', maxHeight: '100px', objectFit: 'contain' }} />
                ) : (
                  <>
                    <i className="fas fa-cloud-upload-alt text-primary mb-2 fs-3"></i>
                    <p className="m-0 small text-muted text-nowrap">{t('addVehicle.uploadFile')}</p>
                  </>
                )}
              </label>
            </div>
            {fileNames.car_registration && (
                <div className="px-2 py-1 bg-light rounded-pill mb-2 d-flex align-items-center justify-content-between">
                    <span className="small text-truncate" style={{ maxWidth: '120px' }} title={fileNames.car_registration}>
                        {fileNames.car_registration}
                    </span>
                    <button 
                        type="button" 
                        className="btn btn-link text-danger p-0 border-0"
                        onClick={() => removeFile('car_registration')}
                    >
                        <i className="fas fa-times-circle"></i>
                    </button>
                </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
          <button 
            type="button" 
            className="btn btn-outline-secondary px-4 rounded-pill"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
          >
            {t('common:buttons.cancel')}
          </button>
          <button 
            type="submit" 
            className="btn btn-primary px-5 rounded-pill shadow-sm d-flex align-items-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                {t('common:loading')}
              </>
            ) : (
              <>
                <i className="fas fa-plus"></i>
                {t('addVehicle.add')}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTruckComponent;
