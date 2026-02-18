import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGetHomeDataQuery } from '../../api/site/siteApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
// Import required modules
import { Pagination, Autoplay } from 'swiper/modules';

const Hero = () => {
  const [activeFilter, setActiveFilter] = useState(null);
  const { t, i18n } = useTranslation('common');
  const { data: homeData, isLoading } = useGetHomeDataQuery();
  const swiperRef = useRef(null);

  const toggleFilter = (name) => {
    setActiveFilter(name);
  };
  
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

  const sliders = homeData?.slider || [];

  return (
    <section className="hero-section p-0 position-relative">
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        loop={sliders.length > 1}
        autoHeight={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        }}
        speed={800}
        pagination={{ clickable: true }}
        navigation={false}
        onSwiper={(swiper) => { swiperRef.current = swiper; }}
        watchOverflow={false}
        className="hero-swiper"
      >
        {isLoading ? (
          <SwiperSlide>
            <div className="hero-slide-content d-flex justify-content-center align-items-center" style={{ minHeight: '85vh' }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </SwiperSlide>
        ) : (
          sliders.map((slider) => (
            <SwiperSlide key={slider.id}>
              <div 
                className="hero-slide-item" 
                style={{ 
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)), url(${slider.image})`,
                }}
              >
                <div className="container hero-text-container">
                  <div className="hero-content text-center my-4 mx-auto text-white" style={{ maxWidth: '850px' }}>
                    <h1 className="hero-title fw-bold" style={{color:"#1a73e8"}}>
                      {getLangField(slider, 'title') || slider.title}
                    </h1>
                    <p className="hero-description fs-5 text-white">
                      {getLangField(slider, 'content') || slider.content}
                    </p>

                    <div className="hero-buttons d-flex justify-content-center align-items-center gap-2">
                      <Link to="/login" className="login-button text-decoration-none">{t('hero.orderTruck')}</Link>
                      <Link to="/login" className="join-button text-decoration-none">{t('hero.joinDriver', 'انضم كسائق')}</Link>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))
        )}

        {/* Custom Navigation Arrows moved inside Swiper */}
        {sliders.length > 1 && (
          <>
            <button
              className="hero-nav-btn hero-nav-prev"
              onClick={() => swiperRef.current?.slidePrev()}
              aria-label="Previous slide"
            >
              <FontAwesomeIcon icon={i18n.dir() === 'rtl' ? faChevronRight : faChevronLeft} />
            </button>
            <button
              className="hero-nav-btn hero-nav-next"
              onClick={() => swiperRef.current?.slideNext()}
              aria-label="Next slide"
            >
              <FontAwesomeIcon icon={i18n.dir() === 'rtl' ? faChevronLeft : faChevronRight} />
            </button>
          </>
        )}
      </Swiper>

      {/* Filter box - Static and positioned absolutely on top of the slider */}
      <div className="container position-absolute start-50 translate-middle-x filter-box-container" style={{ bottom: '50px', zIndex: 110 }}>
        <div className="filter-box text-start mx-auto mt-0">
          <h6 className="search-filter-title text-start">{t('hero.orderNow')}</h6>

          {/* Filter Checkboxes */}
          <div className="d-flex gap-3 align-items-center flex-wrap justify-content-center justify-content-md-start">
            {[
              { id: "fast", label: t('requestTypes.normal') },
              { id: "travel", label: t('requestTypes.trips') },
              { id: "contract", label: t('requestTypes.contract') }
            ].map((item) => (
              <div
                key={item.id}
                className={`filter-checkbox-box ${activeFilter === item.id ? 'active' : ''}`}
                onClick={() => toggleFilter(item.id)}
              >
                <input
                  type="radio"
                  name="requestType"
                  className="checkbox-style"
                  checked={activeFilter === item.id}
                  readOnly
                />

                <span
                  className="mb-1 checkbox-label"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFilter(item.id);
                  }}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          
          {/* Additional Checkboxes */}
          <div className="mt-3 d-flex flex-wrap gap-2 gap-md-4 justify-content-center justify-content-md-start">
            <div className="d-flex align-items-center gap-1">
              <input type="checkbox" className="checkbox-style" id="doorPickup" />
              <label htmlFor="doorPickup" className="checkbox-label">
                {t('requestTypes.singleLocation')}
              </label>
            </div>
            <div className="d-flex align-items-center gap-1">
              <input type="checkbox" className="checkbox-style" id="cashOnDelivery" />
              <label htmlFor="cashOnDelivery" className="checkbox-label">
                {t('requestTypes.multipleLocations')}
              </label>
            </div>
          </div>

          {/* Location Search Row */}
          <div className="location-search-row d-flex flex-column flex-md-row align-items-center gap-3 mt-3">
            {/* Pickup Location Input */}
            <div className="input-with-icon w-100">
              <i className="far fa-map map-icon"></i>
              <input
                type="text"
                className="form-control location-input"
                placeholder={t('hero.pickupPlaceholder')}
              />
            </div>

            {/* Arrow Icon */}
            <i className={`material-icons arrow-icon d-none d-md-block ${i18n.language === 'en' ? 'rotate-180' : ''}`}>keyboard_backspace</i>

            {/* Delivery Location Input */}
            <div className="input-with-icon w-100">
              <i className="far fa-map map-icon"></i>
              <input
                type="text"
                className="form-control location-input"
                placeholder={t('hero.deliveryPlaceholder')}
              />
            </div>

            {/* Search Button */}
            <button className="login-button d-flex align-items-center justify-content-center gap-2 search-width w-100">
              <i className="fas fa-search"></i>
              {t('hero.search')}
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};


export default Hero;