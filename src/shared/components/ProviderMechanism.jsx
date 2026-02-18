import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGetHomeDataQuery } from '../../api/site/siteApi';

// Import Material Icons
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';

const ProviderMechanism = () => {
  const { i18n } = useTranslation();
  const { data: homeData, isLoading } = useGetHomeDataQuery();

  // Helper to get localized field from API
  const getLangField = (item, field) => {
    if (!item) return '';
    const isEn = i18n.language === 'en';
    const enField = `${field}_en`;
    return (isEn && item[enField]) ? item[enField] : item[field];
  };

  const mechanismSection = homeData?.Sections?.[6]; // ID 74: آلية الانضمام

  // Get provider steps from API and reverse to match logical flow (96 -> 99)
  const providerSteps = homeData?.ProviderProcess ? [...homeData.ProviderProcess].reverse() : [];

  return (
    <div className="container">
      <section className='request-mechanism rounded-5 py-5'>
        <h2 className="services-card-title text-center">
          {isLoading ? '...' : getLangField(mechanismSection, 'title') || 'آلية الانضمام بخطوات بسيطة'}
        </h2>
        <p className="login-desc text-center">
          {isLoading ? '...' : getLangField(mechanismSection, 'content')}
        </p>
        <div className="row align-items-center">
          <div className="col-md-7 text-center mt-3">
            <div className="flow-chart">
              <div className="flow-content mx-auto">
                {/* Icons Column */}
                <div className="icons-column">
                  {providerSteps.map((step, index) => (
                    <div key={step.id} className="step-icon-container">
                      <div className="step-icon">
                        {step.image ? (
                          <img 
                            src={step.image} 
                            alt={getLangField(step, 'title')} 
                            style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                          />
                        ) : (
                          <LocationOnOutlinedIcon className='fs-1' />
                        )}
                      </div>
                      {index < providerSteps.length - 1 && <div className="step-line"></div>}
                    </div>
                  ))}
                </div>
                
                {/* Content Column */}
                <div className="content-column">
                  {providerSteps.map((step) => (
                    <div key={step.id} className="provider-step-box">
                      <h3>{getLangField(step, 'title')}</h3>
                      <p>{getLangField(step, 'content')}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-5 text-center mt-3">
            <img src="assets/iPhone.png" className='img-fluid' style={{maxHeight:"500px"}} alt="iphone" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProviderMechanism;
