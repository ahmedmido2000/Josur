import React from 'react';
import { useTranslation } from 'react-i18next';

const SettingsComponent = () => {
  const { t } = useTranslation(['admin']);
  return (
    <div className="settings-content p-2 mt-2 shadow border rounded-2">
              <div className="row">
            <h3 className='orders-title mb-3'>{t('admin:settings.teamSettings')}</h3>
            <div className="col-md-6 mb-3">
              <div className="card p-2 h-100">
              <h3 className='orders-title mb-2'>{t('admin:settings.companyInfo')}</h3>
                <div className="mb-3">
                        <label className="form-label mb-1">{t('admin:settings.companyName')}</label>
                    <input
                        type="text"
                        className="form-control form-input py-2"
                        placeholder="Metro Logistics Inc."
                    />
                    </div>
                <div className="mb-3">
                        <label className="form-label mb-1">{t('admin:settings.businessLicense')}</label>
                    <input
                        type="text"
                        className="form-control form-input py-2"
                        placeholder="BL-2024-001234"
                    />
                    </div>
                <div className="mb-3">
                        <label className="form-label mb-1">{t('admin:settings.businessAddress')}</label>
                    <input
                        type="text"
                        className="form-control form-input py-2"
                        placeholder="الرياض"
                    />
                    </div>
                    <div className="mb-3">
                    <label className="form-label mb-1">{t('admin:settings.taxId')}</label>
                <input
                    type="text"
                    className="form-control form-input py-2"
                    placeholder="TX-987654321"
                />
                </div>
                          <button type='button' className="login-button text-decoration-none">{t('admin:settings.updateCompany')}</button>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="card p-2 h-100">
              <h3 className='orders-title mb-2'>{t('admin:settings.contactInfo')}</h3>
                <div className="mb-3">
                        <label className="form-label mb-1">{t('admin:settings.primaryContact')}</label>
                    <input
                        type="text"
                        className="form-control form-input py-2"
                        placeholder="Metro Logistics Inc."
                    />
                    </div>
                <div className="mb-3">
                        <label className="form-label mb-1">{t('admin:settings.email')}</label>
                    <input
                        type="email"
                        className="form-control form-input py-2"
                        placeholder="habibmeddour1997@gmail.com"
                    />
                    </div>
                <div className="mb-3">
                        <label className="form-label mb-1">{t('admin:settings.phone')}</label>
                    <input
                        type="text"
                        className="form-control form-input py-2"
                        placeholder="Phone number"
                    />
                    </div>
                    <div className="mb-3">
                    <label className="form-label mb-1">{t('admin:settings.emergencyContact')}</label>
                <input
                    type="text"
                    className="form-control form-input py-2"
                    placeholder={t('admin:settings.emergencyContact')}
                />
                </div>
                          <button type='button' className="login-button text-decoration-none">{t('admin:settings.updateContact')}</button>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="card p-2 h-100">
              <h3 className='orders-title mb-2'>{t('admin:settings.notifications')}</h3>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                        <label className="form-label mb-0">{t('admin:settings.vehicleApprovals')}</label>
                        <p className='user-desc m-0'>{t('admin:settings.vehicleApprovalsDesc')}</p>
                  </div>
                  <div className="form-check form-switch mb-2">
                  <input className="form-check-input" type="checkbox" id="notif-vehicle" />
                </div>
                    </div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                        <label className="form-label mb-0">{t('admin:settings.tripComplete')}</label>
                        <p className='user-desc m-0'>{t('admin:settings.tripCompleteDesc')}</p>
                  </div>
                  <div className="form-check form-switch mb-2">
                  <input className="form-check-input" type="checkbox" id="notif-trip" />
                </div>
                    </div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                        <label className="form-label mb-0">{t('admin:settings.driverInvites')}</label>
                        <p className='user-desc m-0'>{t('admin:settings.driverInvitesDesc')}</p>
                  </div>
                  <div className="form-check form-switch mb-2">
                  <input className="form-check-input" type="checkbox" id="notif-driver" />
                </div>
                    </div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                        <label className="form-label mb-0">{t('admin:settings.paymentUpdates')}</label>
                        <p className='user-desc m-0'>{t('admin:settings.paymentUpdatesDesc')}</p>
                  </div>
                  <div className="form-check form-switch mb-2">
                  <input className="form-check-input" type="checkbox" id="notif-payment" />
                </div>
                    </div>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="card p-2 h-100">
              <h3 className='orders-title mb-2'>{t('admin:settings.paymentSettings')}</h3>
                <div className="mb-3">
                        <label className="form-label mb-1">{t('admin:settings.bankAccount')}</label>
                    <input
                        type="text"
                        className="form-control form-input py-2"
                        placeholder="****-****-****-1234"
                    />
                    </div>
                <div className="mb-3">
                        <label className="form-label mb-1">{t('admin:settings.routingNumber')}</label>
                    <input
                        type="email"
                        className="form-control form-input py-2"
                        placeholder="021000021"
                    />
                    </div>
                <div className="mb-3">
                        <label className="form-label mb-1">{t('admin:settings.paymentSchedule')}</label>
                    <input
                        type="text"
                        className="form-control form-input py-2"
                        placeholder={t('admin:settings.paymentSchedule')}
                    />
                    </div>
                    <div className='new-order-badge p-2 rounded-2 mb-3'>
                      <h6 className=''>{t('admin:settings.commissionNote')}</h6>
                      <p className='m-0'>{t('admin:settings.commissionDesc')}</p>
                    </div>
                          <button type='button' className="login-button text-decoration-none">{t('admin:settings.updatePayment')}</button>
              </div>
            </div>
            <div className="col-12">
              <div className='card p-2 h-100'>
              <h3 className='orders-title mb-2'>{t('admin:settings.accountManagement')}</h3>
              <label className="form-label mb-1">{t('admin:settings.accountManagementDesc')}</label>
              <div className="row">
                <div className="col-md-4 mt-2">
                  <div className="export-account rounded-2 w-100 text-center">{t('admin:settings.exportData')}</div>
                </div>
                <div className="col-md-4 mt-2">
                  <div className="export-account rounded-2 w-100 text-center">{t('admin:settings.suspendAccount')}</div>
                </div>
                <div className="col-md-4 mt-2">
                  <div className="delete-account rounded-2 w-100 text-center">{t('admin:settings.deleteAccount')}</div>
                </div>
              </div>
              <div className="form-label text-center mt-2 mb-0">{t('admin:settings.deleteWarning')}</div>
              </div>
            </div>
        </div>
    </div>
  );
};

export default SettingsComponent;

