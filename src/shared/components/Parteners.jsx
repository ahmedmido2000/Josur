import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGetHomeDataQuery } from '../../api/site/siteApi';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Import required modules
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

const Parteners = () => {
  const { t, i18n } = useTranslation('common');
  const { data: homeData, isLoading } = useGetHomeDataQuery();

  // Helper to get localized field from API
  const getLangField = (item, field) => {
    if (!item) return '';
    const isEn = i18n.language && i18n.language.startsWith('en');
    const enField = `${field}_en`;
    const arField = `${field}_ar`;
    
    if (isEn) {
      return item[enField] || item[field];
    } else {
      return item[arField] || item[field];
    }
  };

  const partnersSection = homeData?.Sections?.find(s => s.id === 67); // Using find by ID 67
  const partnerLogos = homeData?.Partners || [];

  const isEn = i18n.language && i18n.language.startsWith('en');

  return (
    <section>
      <div className="container my-5 text-center">
        <h2 className='parteners-title mb-3'>
          {isLoading ? '...' : (isEn ? (partnersSection?.title_en !== partnersSection?.title ? partnersSection?.title_en : t('partners.title')) : (partnersSection?.title || t('partners.title')))}
        </h2>
        <p className='parteners-desc mb-5 mx-auto'>
          {isLoading ? '...' : (isEn ? (partnersSection?.content_en !== partnersSection?.content ? partnersSection?.content_en : t('partners.content')) : (partnersSection?.content || t('partners.content')))}
        </p>
      </div>
      
      {/* Use container-fluid for a full-width slider */}
      <div className="container-fluid mb-5">
        <Swiper
          // Install modules
          modules={[Navigation, Pagination, Autoplay]}
          // Slider configuration
          spaceBetween={30}
          slidesPerView={5} // Show 5 slides on desktop
          loop={partnerLogos.length > 5} // Enable infinite loop only if enough slides
          autoplay={{
            delay: 2500, // Delay between transitions (in ms)
            disableOnInteraction: false, // Continue autoplay after user interaction
          }}
          // Responsive breakpoints
          breakpoints={{
            // when window width is >= 320px (mobile)
            320: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            // when window width is >= 640px (tablet)
            640: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
            // when window width is >= 1024px (desktop)
            1024: {
              slidesPerView: 5,
              spaceBetween: 30,
            },
          }}
          className="partners-swiper"
        >
          {partnerLogos.map((partner) => (
            <SwiperSlide key={partner.id} className="d-flex align-items-stretch">
              <div className="partner-slide text-center p-3 w-100">
                <img src={partner.image} alt={getLangField(partner, 'title')} className="img-fluid partners-img mb-3" />
                <h5 className="partner-name mb-2">
                  {getLangField(partner, 'title')}
                </h5>
                <p className="partner-content small text-muted mb-0">
                  {getLangField(partner, 'content')}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Parteners;
