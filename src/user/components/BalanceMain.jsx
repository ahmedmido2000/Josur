import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGetUserBalanceQuery } from '../../api/user/userApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useSelector } from 'react-redux';

const BalanceMain = () => {
  const { t, i18n } = useTranslation(['user']);
  const { token } = useSelector((state) => state.auth);
  const { data: balanceData, isLoading, isError } = useGetUserBalanceQuery(token);

  // تعيين البيانات بناءً على هيكل الريسبونس المقدم
  const balanceInfo = balanceData?.data?.[0];
  const balance = balanceInfo?._meta?.Balance || 0;
  const transactions = balanceInfo?.items || [];

  const getLangField = (item, field) => {
    if (!item) return '';
    const isEn = i18n.language === 'en';
    const enField = `${field}_en`;
    return (isEn && item[enField]) ? item[enField] : item[field];
  };

  if (isLoading) return <LoadingSpinner />;
  
  if (isError) {
    return (
      <div className="text-center py-5">
        <p className="text-danger">حدث خطأ أثناء تحميل البيانات</p>
      </div>
    );
  }

  return (
    <section className="balance-container">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 pb-4 border-bottom">
        <div className="balance-info">
          <h6 className='user-desc mb-1'>{t('balance.totalBalance')}</h6>
          <h2 className='contact-main-title m-0 fw-bold text-primary'> $ {balance.toLocaleString()} </h2>
        </div>
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <button type='button' className="login-button text-decoration-none px-4 py-2">{t('balance.addFunds')}</button>
          <div className="orange-btn d-flex align-items-center justify-content-center gap-2 px-4 py-2" style={{ cursor: 'pointer' }}>
            {t('balance.withdraw')}
          </div>
        </div>
      </div>
      
      <div className="transactions-header py-4">
        <h3 className='orders-card-title m-0'>{t('balance.transactions')}</h3>
      </div>

      <div className="transactions-list">
        {transactions.length > 0 ? (
          transactions.map((item, index) => (
            <div key={item.id || index} className="transaction-item d-flex justify-content-between align-items-center py-3 border-bottom flex-wrap gap-3">
              <div className="d-flex align-items-center gap-3">
                <div className={`transaction-icon-box rounded-circle d-flex align-items-center justify-content-center ${item.on_him > 0 ? 'bg-danger-subtle' : 'bg-success-subtle'}`} style={{ width: '40px', height: '40px' }}>
                  <img 
                    src={item.on_him > 0 ? "../assets/arrow-square-up.svg" : "../assets/arrow-square-down.svg"} 
                    alt="arrow" 
                    style={{ width: '20px' }}
                  />
                </div>
                <div>
                  <p className='orders-card-title m-0 fw-semibold'>{getLangField(item, 'note')}</p>
                  <p className='footer-main-sublabel m-0 text-muted' style={{ fontSize: '0.85rem' }}>{item.created_at}</p>
                </div>
              </div>
              <div className="transaction-amount ms-auto text-end">
                <h3 className={`orders-card-title m-0 ${item.for_him > 0 ? 'text-success' : 'text-danger'}`}> 
                  {item.for_him > 0 ? '+' : '-'} $ {item.for_him > 0 ? item.for_him : item.on_him}
                </h3>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-5">
            <div className="mb-3 opacity-50">
               <i className="fas fa-history fa-3x"></i>
            </div>
            <p className="text-muted">{t('balance.noTransactions')}</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default BalanceMain