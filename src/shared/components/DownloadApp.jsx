import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGetHomeDataQuery } from '../../api/site/siteApi';

const DownloadApp = () => {
  const { i18n } = useTranslation();
  const { data: homeData, isLoading } = useGetHomeDataQuery();

  // Helper to get localized field from API
  const getLangField = (item, field) => {
    if (!item) return '';
    const isEn = i18n.language === 'en';
    const enField = `${field}_en`;
    return (isEn && item[enField]) ? item[enField] : item[field];
  };

  const appSection = homeData?.Sections?.[12]; // ID 68: احصل على تطبيقنا المحمول المجاني

  return (
    <section className='mt-5 pt-5 pb-0 mb-0 overflow-hidden'>
      <div className="container pb-0 mb-0">
        <div className="mx-auto text-center">
          <h1 className="app-title mx-auto mb-4">
            {isLoading ? '...' : getLangField(appSection, 'title') || 'احصل على تطبيقنا المحمول المجاني'}
          </h1>
          <p className="app-description mx-auto mb-4">
            {isLoading ? '...' : getLangField(appSection, 'content')}
          </p>

          <div className="d-flex justify-content-center align-items-center gap-3 mb-5">
            <img src="assets/Google Play.png" alt="Google" />
            <img src="assets/App Store.png" alt="App" />
          </div>
          <div className="app-mobiles-wrapper">
            <img src={appSection?.image || "assets/mobiles.jpg"} className='img-fluid' alt="mobiles" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadApp;
