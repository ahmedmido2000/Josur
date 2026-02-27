import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faSearch } from "@fortawesome/free-solid-svg-icons";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGetCompanyDriversMutation } from '../../api/admin/adminApi';
import { useGetListsQuery } from '../../api/site/siteApi';

const DriversComponent = () => {
  const { i18n } = useTranslation(['admin', 'common']);
  const isRtl = i18n.language === 'ar';
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { data: listsData } = useGetListsQuery();
  const driverStatuses = listsData?.DriverStatus || {};

  const [getCompanyDrivers, { data: driversResponse, isLoading, isError }] = useGetCompanyDriversMutation();

  useEffect(() => {
    getCompanyDrivers({ name: searchTerm, status: statusFilter });
  }, [searchTerm, statusFilter, getCompanyDrivers]);

  const drivers = driversResponse?.data?.[0]?.items || driversResponse?.data?.[0] || [];

  const getStatusText = (status) => {
    if (driverStatuses[String(status)]) return driverStatuses[String(status)];
    return status === 10 ? (isRtl ? 'مفعل' : 'Active') : (isRtl ? 'غير مفعل' : 'Inactive');
  };

  const getStatusClass = (status) => {
    return status === 10 ? 'shipped-badge' : 'charging-badge';
  };

  const handleResend = (driver) => {
    navigate('/admin/add-driver', {
      state: {
        prefill: {
          name: driver.name || '',
          last_name: driver.last_name || '',
          username: driver.username || '',
          email: driver.email || '',
          mobile: driver.mobile || '',
          country_id: driver.country_id || '',
          city_id: driver.city_id || '',
          license_number: driver.license_number || '',
          experience_year: driver.experience_year || '',
          address: driver.address || '',
        }
      }
    });
  };

  return (
    <div className="vehicles-content mt-2">
      <div className="shadow p-2 rounded-3">
        <h4 className="orders-title m-0">{isRtl ? 'إدارة السائقين' : 'Manage Drivers'}</h4>
        <div className="row mt-2">
          <div className="col-md-9 mb-2">
            <div className="position-relative">
              <input
                type="text"
                className="form-control form-input py-2"
                style={{ paddingRight: isRtl ? '35px' : '12px', paddingLeft: isRtl ? '12px' : '35px' }}
                placeholder={isRtl ? 'البحث عن السائق ...' : 'Search for driver ...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="search-input-icon" style={{ right: isRtl ? '10px' : 'auto', left: isRtl ? 'auto' : '10px' }}>
                <FontAwesomeIcon icon={faSearch} />
              </span>
            </div>
          </div>
          <div className="col-md-3 mb-2">
            <div className="select-wrapper position-relative">
              <select
                className="form-select form-input py-2"
                style={{ paddingInlineEnd: '2.2rem' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">{isRtl ? 'كل الحالات' : 'All Statuses'}</option>
                {Object.entries(driverStatuses).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
              <div className="select-icon position-absolute top-50 translate-middle-y pe-1" style={{ insetInlineEnd: 0, pointerEvents: 'none' }}>
                <ExpandMoreIcon />
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
        ) : drivers.length > 0 ? (
          drivers.map((driver) => (
            <div key={driver.user_id} className="card-order-details p-2 border rounded-3 mb-2">
              <div className="d-flex flex-column align-items-start gap-2 w-100">
                <div className="d-flex align-items-start justify-content-between w-100">
                  <div className="d-flex gap-2 align-items-start">
                    <img
                      src={driver.avatar || '../assets/man.png'}
                      className="user-img"
                      alt="user"
                      onError={(e) => { e.target.src = '../assets/man.png'; }}
                    />
                    <div>
                      <div className="d-flex gap-1 align-items-center">
                        <h6 className="user-name m-0">{driver.name} {driver.last_name}</h6>
                        {driver.rate > 0 && (
                          <div className="new-order-badge p-1 rounded-2 text-nowrap">
                            {driver.rate} <img src="../assets/star.svg" alt="" />
                          </div>
                        )}
                      </div>
                      <p className="user-desc m-0">{driver.mobile}</p>
                    </div>
                  </div>
                  <div className={`${getStatusClass(driver.status)} py-1 px-2 rounded-2 text-nowrap d-flex align-items-center`}>
                    {getStatusText(driver.status)}
                  </div>
                </div>

                <div className="d-flex gap-1 align-items-center">
                  <p className="user-desc m-0">{isRtl ? 'البريد:' : 'Email:'}</p>
                  <h4 className="orders-card-title mb-0">{driver.email}</h4>
                </div>
                <div className="d-flex gap-1 align-items-center">
                  <p className="user-desc m-0">{isRtl ? 'تاريخ الانضمام:' : 'Joined:'}</p>
                  <h4 className="orders-card-title mb-0">{driver.created_at}</h4>
                </div>

                {driver.status !== 10 && (
                  <div className="accepted-badge p-2 d-flex align-items-center gap-1 rounded-3 w-100">
                    <FontAwesomeIcon icon={faEnvelope} />
                    {isRtl ? 'في انتظار التفعيل' : 'Pending activation'}
                  </div>
                )}
              </div>

              {driver.status !== 10 && (
                <div className="row">
                  <div className="col-12 mt-3">
                    <button
                      type="button"
                      className="login-button text-decoration-none w-100"
                      onClick={() => handleResend(driver)}
                    >
                      {isRtl ? 'اعادة الارسال' : 'Resend'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-4">
            {isRtl ? 'لا يوجد سائقون يطابقون البحث' : 'No drivers found'}
          </div>
        )}
      </div>
    </div>
  );
};

export default DriversComponent;