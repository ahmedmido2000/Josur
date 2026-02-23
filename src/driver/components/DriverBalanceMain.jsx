import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGetDriverBalanceQuery } from '../../api/driver/driverApi';
import LoadingSpinner from '../../components/LoadingSpinner';

const DriverBalanceMain = () => {
  const { t, i18n } = useTranslation(['driver']);
  const { data: balanceData, isLoading, isError } = useGetDriverBalanceQuery();

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
    <section>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 pb-4 border-bottom">
        <div>
          <h6 className='user-desc'>{t('balance.totalBalance')}</h6>
          <h2 className='contact-main-title m-0'> $ {balance.toLocaleString()} </h2>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button type='button' className="login-button text-decoration-none">{t('balance.addFunds')}</button>
          <div className="orange-btn d-flex align-items-center justify-content-center gap-2" style={{ cursor: 'pointer' }}>
            {t('balance.withdraw')}
          </div>
        </div>
      </div>
      <h3 className='orders-card-title m-0 py-3'>{t('balance.transactions')}</h3>

      {transactions.length > 0 ? (
        transactions.map((item, index) => (
          <div key={item.id || index} className="d-flex justify-content-between align-items-center py-2 border-bottom">
            <div className="d-flex align-items-center gap-2">
              <img 
                src={item.on_him > 0 ? "/assets/arrow-square-up.svg" : "/assets/arrow-square-down.svg"} 
                alt="arrow" 
              />
              <p className='orders-card-title m-0'>{getLangField(item, 'note')}</p>
              <p className='footer-main-sublabel m-0'>{item.created_at}</p>
            </div>
            <h3 className='orders-card-title m-0'> 
              $ {item.for_him > 0 ? item.for_him : item.on_him} {item.for_him > 0 ? '+' : '-'}
            </h3>
          </div>
        ))
      ) : (
        <div className="text-center py-5">
          <p className="text-muted">{t('balance.noTransactions')}</p>
        </div>
      )}
    </section>
  )
}

export default DriverBalanceMain