import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useGetListsQuery, useGetSubTrucksQuery } from '../../api/site/siteApi';
import { useGetCompanyDriversMutation, useUpdateVehicleMutation, useViewVehicleQuery } from '../../api/admin/adminApi';
import LoadingSpinner from '../../components/LoadingSpinner';

const UpdateVehicleComponent = ({ vehicleId }) => {
    const { t, i18n } = useTranslation(['admin', 'common']);
    const navigate = useNavigate();
    const isRtl = i18n.language === 'ar';

    const [formData, setFormData] = useState({
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
        type: '', 
        model: ''
    });

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

    const { data: vehicleResponse, isLoading: isVehicleLoading } = useViewVehicleQuery(vehicleId);
    const { data: listsData, isLoading: listsLoading } = useGetListsQuery();
    const [getCompanyDrivers, { data: driversData, isLoading: driversLoading }] = useGetCompanyDriversMutation();
    
    const { data: subTrucksData, isFetching: subTrucksLoading } = useGetSubTrucksQuery(formData.truck_id, {
        skip: !formData.truck_id
    });

    useEffect(() => {
        getCompanyDrivers({});
    }, [getCompanyDrivers]);

    const [updateVehicle, { isLoading: isSubmitting }] = useUpdateVehicleMutation();

    useEffect(() => {
        const vehicle = vehicleResponse?.data?.[0]?.[0] || vehicleResponse?.data?.[0];
        if (vehicle) {
            setFormData({
                driver_id: vehicle.driver_id?.user_id || vehicle.driver_id?.id || vehicle.driver_id || '',
                truck_id: vehicle.truck_id?.id || vehicle.truck_id || '',
                sub_truck_id: vehicle.sub_truck_id?.id || vehicle.sub_truck_id || '',
                plate_number: vehicle.plate_number || '',
                name: vehicle.name || '',
                mobile: vehicle.mobile || '',
                email: vehicle.email || '',
                year_manufacture: vehicle.year_manufacture || '',
                color: vehicle.color || '',
                capacity: vehicle.capacity || '',
                description: vehicle.description || '',
                type: vehicle.type || '',
                model: vehicle.model || ''
            });
            
            setPreviews({
                driving_license: vehicle.driving_license || null,
                insurance: vehicle.insurance || null,
                car_registration: vehicle.car_registration || null
            });
        }
    }, [vehicleResponse]);

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
            setFileNames(prev => ({ ...prev, [fieldName]: file.name }));
            if (file.type.startsWith('image/')) {
                setPreviews(prev => ({ ...prev, [fieldName]: URL.createObjectURL(file) }));
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

        const data = new FormData();
        data.append('vehicle_id', vehicleId); // Ensuring the ID is sent
        
        Object.keys(formData).forEach(key => {
            if (formData[key] !== undefined && formData[key] !== null) {
                // If the key is driver_id, still send it but maybe the API expects user_id for update?
                // I'll send both to be safe or stay consistent with what worked.
                if (key === 'driver_id') {
                    data.append('user_id', formData[key]);
                }
                data.append(key, formData[key]);
            }
        });

        if (files.driving_license) data.append('driving_license', files.driving_license);
        if (files.insurance) data.append('insurance', files.insurance);
        if (files.car_registration) data.append('car_registration', files.car_registration);

        try {
            const response = await updateVehicle(data).unwrap();
            if (response.status === 1) {
                toast.success(isRtl ? 'تم تحديث البيانات بنجاح' : 'Vehicle updated successfully');
                navigate('/admin/dashboard');
            } else {
                toast.error(response.message || (isRtl ? 'حدث خطأ' : 'Error updating vehicle'));
            }
        } catch {
            toast.error(isRtl ? 'فشل الاتصال بالخادم' : 'Server connection failed');
        }
    };

    if (isVehicleLoading || listsLoading || driversLoading) return <LoadingSpinner />;

    const trucks = listsData?.Truck || [];
    const drivers = driversData?.data?.[0]?.items || [];
    const subTrucks = subTrucksData || [];
    const vehicleTypes = listsData?.VehicleType || {};

    return (
        <div className="settings-content">
            <div className="d-flex align-items-center gap-2 mb-1">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
                onClick={() => navigate(-1)}
              >
                <i className="fas fa-arrow-left"></i> {t('common:buttons.back')}
              </button>
            </div>
            <h4 className="orders-title m-0">{t('drivers.ownerDashboard')}</h4>

            <form onSubmit={handleSubmit} className="p-3 mt-2 shadow rounded-2 bg-white">
                <div className="d-flex gap-1 align-items-center mb-2">
                    <i className="fas fa-truck text-primary fs-4"></i>
                    <h4 className="orders-title m-0">{t('updateVehicle.title')}</h4>
                </div>

                <p className="months-filter-item m-0 mb-3 text-muted">
                    {t('updateVehicle.subtitle')}
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

                    {/* Truck Type Selection (Dropdown with Images like AddTruck) */}
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
                                required
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label className="form-label mb-1">{t('addVehicle.email')}</label>
                            <input 
                                type="email" 
                                className="form-control form-input py-2" 
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
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
                                    {Object.entries(vehicleTypes).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
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
                                rows="3"
                            />
                        </div>
                    </div>

                    {/* Documents */}
                    <div className="col-12 mt-3">
                        <h6 className="fw-bold border-bottom pb-2">{t('addVehicle.documents')}</h6>
                        <div className="row g-3">
                            {[
                                { id: 'driving_license', label: t('addVehicle.drivingLicense') },
                                { id: 'insurance', label: t('addVehicle.insurance') },
                                { id: 'car_registration', label: t('addVehicle.carRegistration') }
                            ].map(doc => (
                                <div key={doc.id} className="col-md-4">
                                    <label className="form-label small">{doc.label}</label>
                                    <div className="card border-dashed p-3 text-center position-relative h-100 mb-2 mt-0">
                                        <label className="upload-box m-0 cursor-pointer w-100 h-100 d-flex flex-column align-items-center justify-content-center">
                                            <input
                                                type="file"
                                                hidden
                                                onChange={(e) => handleFileChange(e, doc.id)}
                                                accept="image/*,.pdf"
                                            />
                                            {previews[doc.id] ? (
                                                <img src={previews[doc.id]} alt="preview" style={{ maxWidth: '100%', maxHeight: '100px', objectFit: 'contain' }} />
                                            ) : (
                                                <>
                                                    <i className="fas fa-cloud-upload-alt text-primary mb-2 fs-3"></i>
                                                    <p className="m-0 small text-muted text-nowrap">{t('addVehicle.uploadFile')}</p>
                                                </>
                                            )}
                                        </label>
                                    </div>
                                    {fileNames[doc.id] && (
                                        <div className="px-2 py-1 bg-light rounded-pill mb-2 d-flex align-items-center justify-content-between">
                                            <span className="small text-truncate" style={{ maxWidth: '120px' }} title={fileNames[doc.id]}>
                                                {fileNames[doc.id]}
                                            </span>
                                            <button 
                                                type="button" 
                                                className="btn btn-link text-danger p-0 border-0"
                                                onClick={() => removeFile(doc.id)}
                                            >
                                                <i className="fas fa-times-circle"></i>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                    <button type="button" className="btn btn-outline-secondary px-4 rounded-pill" onClick={() => navigate(-1)}>
                        {t('common:buttons.cancel')}
                    </button>
                    <button type="submit" className="btn btn-primary px-5 rounded-pill" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                {t('common:loading')}
                            </>
                        ) : (
                            <>
                                <i className="fas fa-save me-2"></i>
                                {isRtl ? 'حفظ التعديلات' : 'Save Changes'}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateVehicleComponent;
