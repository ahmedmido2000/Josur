import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGetHomeDataQuery } from '../../api/site/siteApi';

const WorksHero = () => {
  const { i18n } = useTranslation();
  const { data: homeData, isLoading } = useGetHomeDataQuery();

  // Helper to get localized field from API with fallback for bad API data
  const getLangField = (item, field) => {
    if (!item) return '';
    const isEn = i18n.language && i18n.language.startsWith('en');
    const enField = `${field}_en`;
    const arField = `${field}_ar`;
    
    if (isEn) {
      if (!item[enField] || item[enField] === item[field]) return null;
      return item[enField];
    } else {
      return item[arField] || item[field];
    }
  };

  const worksHeroSection = homeData?.Sections?.find(section => section.id === 77);

  const isEn = i18n.language && i18n.language.startsWith('en');

  return (
    <section className='my-5'>
      <div className="container text-center">
        <h1 className='section-title'>
          {isLoading ? '...' : (getLangField(worksHeroSection, 'title') || (isEn ? 'Tailored Solutions for Companies' : 'الحلول المخصصة للشركات والعقود طويلة الأجل'))}
        </h1>
        <p className='works-desc mx-auto mb-4'>
          {isLoading ? '...' : (getLangField(worksHeroSection, 'content') || worksHeroSection?.content)}
        </p>
        <img 
          src={worksHeroSection?.image || "assets/works-main-bg.png"} 
          className='img-fluid w-100' 
          alt="solutions" 
          style={{ borderRadius: '12px', marginTop: '20px' }}
        />
      </div>
    </section>
  );
};

export default WorksHero;