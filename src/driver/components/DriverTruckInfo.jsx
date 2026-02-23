import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useGetListsQuery, useGetSubTrucksQuery } from '../../api/site/siteApi';
import { useGetVehicleQuery, useAddVehicleMutation, useUpdateVehicleMutation } from '../../api/driver/driverApi';
import LoadingSpinner from '../../components/LoadingSpinner';

const DriverTruckInfo = ({ user }) => {
  const { t, i18n } = useTranslation(['driver', 'common', 'admin']);
  const isRtl = i18n.language === 'ar';
  const token = localStorage.getItem('josur_auth_token');

  // API Queries
  const { data: listsData } = useGetListsQuery();
  const { data: vehicleResponse, isLoading: isVehicleLoading, refetch: refetchVehicle } = useGetVehicleQuery(token);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  
  const [formData, setFormData] = useState({
    truck_id: '',
    sub_truck_id: '',
    plate_number: '',
    name: user?.name || '',
    mobile: user?.mobile || '',
    email: user?.email || '',
    year_manufacture: '',
    color: '',
    capacity: '',
    description: '',
    type: '', // 1 for new, 2 for used
  });

  const [files, setFiles] = useState({
    driving_license: null,
    insurance: null,
    car_registration: null
  });
  
  const [previews, setPreviews] = useState({
    driving_license: null,
    insurance: null,
    car_registration: null
  });

  const { data: subTrucksData, isFetching: subTrucksLoading } = useGetSubTrucksQuery(formData.truck_id, {
    skip: !formData.truck_id
  });

  const [addVehicle, { isLoading: isAddingVehicle }] = useAddVehicleMutation();
  const [updateVehicle, { isLoading: isUpdatingVehicle }] = useUpdateVehicleMutation();

  const vehicleData = vehicleResponse?.status === 1 ? vehicleResponse.data[0] : null;

  useEffect(() => {
    if (vehicleData) {
      setFormData({
        truck_id: vehicleData.truck_id || '',
        sub_truck_id: vehicleData.sub_truck_id || '',
        plate_number: vehicleData.plate_number || '',
        name: vehicleData.name || user?.name || '',
        mobile: vehicleData.mobile || user?.mobile || '',
        email: vehicleData.email || user?.email || '',
        year_manufacture: vehicleData.year_manufacture || '',
        color: vehicleData.color || '',
        capacity: vehicleData.capacity || '',
        description: vehicleData.description || '',
        type: vehicleData.type || '',
      });
      
      // If there are existing files from API, we might want to show them, 
      // but for now we focus on the ones being uploaded.
      // API typically returns URLs for license, insurance, registration.
      setPreviews({
        driving_license: vehicleData.driving_license || null,
        insurance: vehicleData.insurance || null,
        car_registration: vehicleData.car_registration || null
      });
    }
  }, [vehicleData, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'truck_id') {
      setFormData(prev => ({ ...prev, truck_id: value, sub_truck_id: '' }));
    }
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setFiles(prev => ({ ...prev, [fieldName]: file }));
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
    setPreviews(prev => ({ ...prev, [fieldName]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key]);
    });
    
    if (files.driving_license) submitData.append('driving_license', files.driving_license);
    if (files.insurance) submitData.append('insurance', files.insurance);
    if (files.car_registration) submitData.append('car_registration', files.car_registration);
    
    // If updating, we might need user_id as per prompt
    if (isEditing && vehicleData) {
        submitData.append('user_id', user?.id || '');
    }

    try {
      const action = isAdding ? addVehicle : updateVehicle;
      const res = await action({ token, body: submitData }).unwrap();
      
      if (res.status === 1) {
        toast.success(isAdding ? t('admin:addVehicle.success') : t('driver:driver.profile.updateSuccess'));
        setIsEditing(false);
        setIsAdding(false);
        refetchVehicle();
      } else {
        toast.error(res.message || t('common:error'));
      }
    } catch (err) {
      toast.error(t('common:error'));
    }
  };

  const trucks = listsData?.Truck || [];
  const subTrucks = subTrucksData || [];

  if (isVehicleLoading) return <LoadingSpinner />;

  // Case 1: No vehicle registry, show Add button
  if (!isEditing && !isAdding && !vehicleData) {
    return (
        <div className="mt-4 p-5 text-center shadow-sm rounded-3 bg-white border">
            <i className="fas fa-truck-pickup fa-3x text-light mb-3"></i>
            <h4 className="orders-title mb-2">{t('driver:driver.profile.noTruck')}</h4>
            <p className="text-muted mb-4">{t('driver:driver.profile.noTruckDesc')}</p>
            <button className="login-button text-decoration-none border-0 px-5" onClick={() => setIsAdding(true)}>
                {t('admin:addVehicle.add')}
            </button>
        </div>
    );
  }

  // Unified Form for View, Edit, and Add
  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className='orders-title m-0'>
          {isAdding ? t('admin:addVehicle.title') : t('driver:driver.profile.truckInfo')}
        </h3>
        {!isEditing && !isAdding && (
          <button 
            type="button"
            className="login-button text-decoration-none border-0" 
            onClick={() => setIsEditing(true)}
          >
            {t('driver:driver.profile.edit')}
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 shadow-sm rounded-3 bg-white border">
        <div className="row g-4">
          {/* Form Fields Column */}
          <div className="col-lg-8">
            <div className="row g-3">
              {/* Truck Selection */}
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label mb-1 small text-muted">{t('admin:addVehicle.vehicleType')}</label>
                  <div className="dropdown w-100">
                    <button 
                      className={`form-select form-input py-2 text-start d-flex align-items-center justify-content-between ${(!isEditing && !isAdding) ? 'bg-light' : ''}`}
                      type="button"
                      id="truckDropdown"
                      data-bs-toggle="dropdown"
                      disabled={!isEditing && !isAdding}
                    >
                      {formData.truck_id ? (
                        <div className="d-flex align-items-center gap-2">
                            {trucks.find(t => t.id.toString() === formData.truck_id.toString())?.image && (
                                <img src={trucks.find(t => t.id.toString() === formData.truck_id.toString())?.image} alt="" style={{ width: '24px', height: '16px', objectFit: 'contain' }} />
                            )}
                            <span>{isRtl ? trucks.find(t => t.id.toString() === formData.truck_id.toString())?.name : trucks.find(t => t.id.toString() === formData.truck_id.toString())?.name_en}</span>
                        </div>
                      ) : t('admin:addVehicle.selectTruck')}
                    </button>
                    {(isEditing || isAdding) && (
                      <ul className="dropdown-menu w-100 shadow-sm border-0" aria-labelledby="truckDropdown" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {trucks.map(truck => (
                          <li key={truck.id}>
                            <button className="dropdown-item d-flex align-items-center gap-3 py-2" type="button" onClick={() => handleInputChange({ target: { name: 'truck_id', value: truck.id.toString() } })}>
                              <img src={truck.image} alt={truck.name} style={{ width: '32px', height: '20px', objectFit: 'contain' }} />
                              <span>{isRtl ? truck.name : truck.name_en}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              {/* Sub Truck Selection */}
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label mb-1 small text-muted">{t('admin:addVehicle.subVehicleType')}</label>
                  <div className="select-wrapper position-relative">
                    <select 
                      className="form-select form-input py-2" 
                      name="sub_truck_id" 
                      value={formData.sub_truck_id} 
                      onChange={handleInputChange} 
                      disabled={(!isEditing && !isAdding) || !formData.truck_id || subTrucksLoading} 
                      required
                    >
                      <option value="">{subTrucksLoading ? t('common:loading') : t('admin:addVehicle.selectSubTruck')}</option>
                      {subTrucks.map(sub => (
                        <option key={sub.id} value={sub.id}>{isRtl ? sub.name : sub.name_en}</option>
                      ))}
                    </select>
                    {(isEditing || isAdding) && (
                      <div className={`select-icon position-absolute ${isRtl ? 'start-0 ps-2' : 'end-0 pe-2'} top-50 translate-middle-y`}>
                          <ExpandMoreIcon />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label mb-1 small text-muted">{t('admin:addVehicle.plateNumber')}</label>
                  <input 
                    type="text" 
                    className="form-control form-input py-2" 
                    name="plate_number" 
                    value={formData.plate_number} 
                    onChange={handleInputChange} 
                    readOnly={!isEditing && !isAdding}
                    required 
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label mb-1 small text-muted">{t('admin:addVehicle.type')}</label>
                  <div className="select-wrapper position-relative">
                    <select 
                      className="form-select form-input py-2" 
                      name="type" 
                      value={formData.type} 
                      onChange={handleInputChange} 
                      disabled={!isEditing && !isAdding}
                      required
                    >
                      <option value="">{t('admin:addVehicle.selectType')}</option>
                      <option value="1">{t('admin:addVehicle.new')}</option>
                      <option value="2">{t('admin:addVehicle.used')}</option>
                    </select>
                    {(isEditing || isAdding) && (
                      <div className={`select-icon position-absolute ${isRtl ? 'start-0 ps-2' : 'end-0 pe-2'} top-50 translate-middle-y`}>
                          <ExpandMoreIcon />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="mb-3">
                  <label className="form-label mb-1 small text-muted">{t('admin:addVehicle.yearManufacture')}</label>
                  <input 
                    type="text" 
                    className="form-control form-input py-2" 
                    name="year_manufacture" 
                    value={formData.year_manufacture} 
                    onChange={handleInputChange} 
                    readOnly={!isEditing && !isAdding}
                    required 
                  />
                </div>
              </div>

              <div className="col-md-4">
                <div className="mb-3">
                  <label className="form-label mb-1 small text-muted">{t('admin:addVehicle.color')}</label>
                  <input 
                    type="text" 
                    className="form-control form-input py-2" 
                    name="color" 
                    value={formData.color} 
                    onChange={handleInputChange} 
                    readOnly={!isEditing && !isAdding}
                    required 
                  />
                </div>
              </div>

              <div className="col-md-4">
                <div className="mb-3">
                  <label className="form-label mb-1 small text-muted">{t('admin:addVehicle.capacity')}</label>
                  <input 
                    type="number" 
                    className="form-control form-input py-2" 
                    name="capacity" 
                    value={formData.capacity} 
                    onChange={handleInputChange} 
                    readOnly={!isEditing && !isAdding}
                    required 
                  />
                </div>
              </div>

              <div className="col-12">
                <div className="mb-3">
                  <label className="form-label mb-1 small text-muted">{t('admin:addVehicle.description')}</label>
                  <textarea 
                    className="form-control form-input" 
                    name="description" 
                    value={formData.description} 
                    onChange={handleInputChange} 
                    readOnly={!isEditing && !isAdding}
                    rows="2" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Image/Status Column */}
          <div className="col-lg-4">
            <div className={`p-3 rounded-3 h-100 d-flex flex-column align-items-center justify-content-center ${(!isEditing && !isAdding) ? 'bg-light' : ''}`}>
                <img 
                    src={vehicleData?.truck_image || '/assets/truck-details-img.png'} 
                    className="img-fluid rounded-3 mb-3 mx-auto shadow-sm" 
                    style={{ maxHeight: '200px', objectFit: 'contain' }}
                    alt="truck" 
                />
                {!isEditing && !isAdding && vehicleData && (
                    <div className="text-center">
                        <span className="badge bg-primary px-3 py-2 rounded-pill">
                            {isRtl ? vehicleData.sub_truck_name : vehicleData.sub_truck_name_en}
                        </span>
                        <p className="text-muted small mt-2 mb-0">{vehicleData.description}</p>
                    </div>
                )}
            </div>
          </div>

          {/* Documents Section */}
          <div className="col-12 mt-2">
            <h5 className="orders-title small mb-3">{t('admin:addVehicle.documents')}</h5>
            <div className="row g-3">
              {['driving_license', 'insurance', 'car_registration'].map(field => (
                <div className="col-md-4" key={field}>
                  <label className="form-label mb-1 small text-muted">{t(`admin:addVehicle.${field}`)}</label>
                  <div className={`card text-center p-3 border-dashed position-relative ${(!isEditing && !isAdding) ? 'bg-light border-0' : 'cursor-pointer'}`} style={{ minHeight: '120px' }}>
                      <label className={`d-flex flex-column align-items-center justify-content-center h-100 m-0 ${(!isEditing && !isAdding) ? '' : 'cursor-pointer'}`}>
                          {(isEditing || isAdding) && <input type="file" hidden onChange={(e) => handleFileChange(e, field)} accept="image/*,.pdf" />}
                          {previews[field] ? (
                              <div className="position-relative">
                                  <img src={previews[field]} alt="preview" style={{ maxHeight: '80px', objectFit: 'contain' }} className="rounded shadow-sm" />
                                  {(isEditing || isAdding) && (
                                    <button type="button" className="btn btn-danger btn-sm rounded-circle position-absolute top-0 start-100 translate-middle" style={{ width: '20px', height: '20px', padding: 0 }} onClick={(e) => { e.preventDefault(); removeFile(field); }}>
                                        <i className="fas fa-times"></i>
                                    </button>
                                  )}
                              </div>
                          ) : (
                              <>
                                  <i className="fas fa-cloud-upload-alt text-primary mb-1"></i>
                                  <span className="small text-muted">{t('admin:addVehicle.uploadFile')}</span>
                              </>
                          )}
                      </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {(isEditing || isAdding) && (
          <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
            <button 
              type="button" 
              className="btn btn-outline-secondary px-4 rounded-3" 
              onClick={() => { setIsEditing(false); setIsAdding(false); }}
            >
              {t('common:buttons.cancel')}
            </button>
            <button 
              type="submit" 
              className="login-button text-decoration-none border-0 px-5" 
              disabled={isAddingVehicle || isUpdatingVehicle}
            >
              {(isAddingVehicle || isUpdatingVehicle) ? t('common:loading') : (isAdding ? t('admin:addVehicle.add') : t('common:buttons.save'))}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default DriverTruckInfo;
