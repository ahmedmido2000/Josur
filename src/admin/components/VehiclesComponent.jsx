import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGetCompanyVehiclesMutation } from '../../api/admin/adminApi';
import { useGetListsQuery } from '../../api/site/siteApi';
import LoadingSpinner from '../../components/LoadingSpinner';

const VehiclesComponent = () => {
    const { i18n } = useTranslation(['admin', 'common']);
    const isRtl = i18n.language === 'ar';
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const { data: listsData } = useGetListsQuery();
    const vehicleStatuses = listsData?.VehicleStatus || [];

    const [getCompanyVehicles, { data: vehiclesResponse, isLoading, isError }] = useGetCompanyVehiclesMutation();

    useEffect(() => {
        getCompanyVehicles({ name: searchTerm, status: statusFilter });
    }, [searchTerm, statusFilter, getCompanyVehicles]);

    const vehicles = vehiclesResponse?.data?.[0]?.items || vehiclesResponse?.data?.[0] || [];

    const getName = (obj) => {
        if (!obj) return '';
        if (typeof obj === 'string') return obj;
        return isRtl ? (obj.name || '') : (obj.name_en || obj.name || '');
    };

    const getStatusText = (status) => {
        const idx = Number(status);
        if (vehicleStatuses[idx]) return vehicleStatuses[idx].trim();
        switch (idx) {
            case 0: return isRtl ? 'قيد الانتظار' : 'Pending';
            case 1: return isRtl ? 'تم الموافقة' : 'Approved';
            case 2: return isRtl ? 'مرفوض' : 'Rejected';
            default: return isRtl ? 'غير معروف' : 'Unknown';
        }
    };

    const getStatusClass = (status) => {
        switch (Number(status)) {
            case 0: return 'charging-badge';
            case 1: return 'shipped-badge';
            case 2: return 'cancelled-badge';
            default: return 'new-order-badge';
        }
    };

    return (
        <div className="vehicles-content mt-2">
            <div className="shadow p-2 rounded-3">
                <h4 className="orders-title m-0">{isRtl ? 'إدارة المركبات' : 'Manage Vehicles'}</h4>
                <div className="row mt-2">
                    <div className="col-md-9 mb-2">
                        <div className="position-relative">
                            <input
                                type="text"
                                className="form-control form-input py-2"
                                style={{ paddingRight: isRtl ? '35px' : '12px', paddingLeft: isRtl ? '12px' : '35px' }}
                                placeholder={isRtl ? "البحث عن مركبة ..." : "Search for vehicle ..."}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <span className="search-input-icon" style={{ right: isRtl ? '10px' : 'auto', left: isRtl ? 'auto' : '10px' }}>
                                <FontAwesomeIcon icon={faSearch} />
                            </span>
                        </div>
                    </div>
                    <div className="col-md-3 mb-2">
                        <div className="mb-3">
                            <div className="select-wrapper position-relative">
                                <select 
                                    className="form-select form-input py-2"
                                    style={{ paddingInlineEnd: '2.2rem' }}
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="">{isRtl ? 'كل الحالات' : 'All Statuses'}</option>
                                    {vehicleStatuses.map((statusLabel, idx) => (
                                        <option key={idx} value={idx}>{statusLabel.trim()}</option>
                                    ))}
                                </select>
                                <div className="select-icon position-absolute top-50 translate-middle-y pe-1" style={{ insetInlineEnd: 0, pointerEvents: 'none' }}>
                                    <ExpandMoreIcon />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="text-center py-4">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : isError ? (
                    <div className="alert alert-danger">{isRtl ? 'حدث خطأ أثناء جلب البيانات' : 'Error fetching data'}</div>
                ) : vehicles.length > 0 ? (
                    vehicles.map((vehicle) => (
                        <div key={vehicle.id} className="card-order-details p-2 border rounded-3 mb-2">
                            <div className="d-flex flex-column align-items-start gap-2 w-100">
                                <div className='d-flex align-items-center justify-content-between w-100'>
                                    <div>
                                        <h4 className="orders-title mb-1">{getName(vehicle.truck_id)}</h4>
                                        <p className="user-desc m-0">{vehicle.name} ({vehicle.year_manufacture})</p>
                                    </div>
                                    <div className={`${getStatusClass(vehicle.status)} py-1 px-2 rounded-2 text-nowrap d-flex align-items-center`}>
                                        {getStatusText(vehicle.status)}
                                    </div>
                                </div>
                                <div className="d-flex gap-2 align-items-center mb-1">
                                    <p className="user-desc m-0">{isRtl ? 'وثائق:' : 'Docs:'}</p>
                                    <div className={`${vehicle.car_registration ? 'document-blue' : 'document-gray'} py-2 px-3 rounded-pill`}>
                                        {isRtl ? 'تسجيل' : 'Registration'}
                                    </div>
                                    <div className={`${vehicle.insurance ? 'document-blue' : 'document-gray'} py-2 px-3 rounded-pill`}>
                                        {isRtl ? 'تأمين' : 'Insurance'}
                                    </div>
                                    <div className={`${vehicle.driving_license ? 'document-blue' : 'document-gray'} py-2 px-3 rounded-pill`}>
                                        {isRtl ? 'رخصة' : 'License'}
                                    </div>
                                </div>
                                {vehicle.status == 2 && vehicle.description && (
                                    <div className="refused-badge p-2 rounded-3 w-100">
                                        {isRtl ? 'سبب الرفض:' : 'Rejection Reason:'} {vehicle.description}
                                    </div>
                                )}
                            </div>
                            <div className="row">
                                <div className="col-md-6 mt-3">
                                    <Link
                                        to={`/admin/vehicle-details/${vehicle.id}`}
                                        className="contact-driver-button-2 w-100 border-0 text-decoration-none d-flex align-items-center justify-content-center"
                                        style={{ height: '40px' }}
                                    >
                                        <p className='m-0'>{isRtl ? 'التفاصيل' : 'Details'}</p>
                                    </Link>
                                </div>
                                <div className="col-md-6 mt-3">
                                    <Link 
                                        to={`/admin/update-vehicle/${vehicle.id}`}
                                        className="login-button text-decoration-none w-100 border-0 d-flex align-items-center justify-content-center"
                                        style={{ height: '40px' }}
                                    >
                                        {isRtl ? 'تعديل' : 'Edit'}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-4">
                        {isRtl ? 'لا توجد مركبات تطابق البحث' : 'No vehicles found matching search'}
                    </div>
                )}
            </div>
        </div>
    );
};


export default VehiclesComponent;