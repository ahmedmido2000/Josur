import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGetHomeDataQuery } from '../../api/site/siteApi';

const ProviderFeatures = () => {
  const { i18n } = useTranslation();
  const { data: homeData, isLoading } = useGetHomeDataQuery();

  // Helper to get localized field from API
  const getLangField = (item, field) => {
    if (!item) return '';
    const isEn = i18n.language === 'en';
    const enField = `${field}_en`;
    return (isEn && item[enField]) ? item[enField] : item[field];
  };

  const featuresSection = homeData?.Sections?.[7]; // ID 73: مميزات الانضمام كمزود خدمة

  return (
    <section className='my-5'>
      <div className="container text-center">
        <h2 className="section-title">
          {isLoading ? '...' : getLangField(featuresSection, 'title') || 'مميزات الانضمام كمزود خدمة'}
        </h2>
        <p className="contact-main-desc mx-auto">
          {isLoading ? '...' : getLangField(featuresSection, 'content')}
        </p>
        <div className="row text-start">
          {(homeData?.AdvantageProvider || []).map((feature) => (
            <div key={feature.id} className="col-lg-3 col-md-6 mt-4">
              <div className="why-card h-100 p-4 d-flex flex-column align-items-center justify-content-start gap-2">
                <img 
                  src={feature.image} 
                  className='img-fluid provider-features-icon' 
                  alt={getLangField(feature, 'title')} 
                  style={{ width: '60px', height: '60px', objectFit: 'contain' }}
                />
                <h5 className='why-card-title m-0 text-center'>{getLangField(feature, 'title')}</h5>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProviderFeatures;
