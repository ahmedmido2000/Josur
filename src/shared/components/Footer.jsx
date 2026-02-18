import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGetHomeDataQuery } from '../../api/site/siteApi';

// Import Material Icons for social media
import GitHubIcon from '@mui/icons-material/GitHub';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/Twitter'; // X is the new name for Twitter

const Footer = ({ isProviderPage = false }) => {
  const { t, i18n } = useTranslation(['common', 'auth']);
  const { data: homeData, isLoading } = useGetHomeDataQuery();

  // Helper to get localized field from API
  const getLangField = (item, field) => {
    if (!item) return '';
    const isEn = i18n.language === 'en';
    const enField = `${field}_en`;
    return (isEn && item[enField]) ? item[enField] : item[field];
  };

  const footerSection = homeData?.Sections?.[4]; // ID 76: هل أنت مستعد لبدء العمل وزيادة دخلك؟
  const aboutData = homeData?.About?.[0];

  return (
    <footer className='py-4'>
      <div className="container">
        {/* General Footer - Hidden on Provider Page */}
        <div className={`d-flex justify-content-between align-items-center flex-wrap gap-2 border-bottom pb-3 general-footer ${isProviderPage ? 'd-none' : ''}`}>
          <h3 className='footer-title'>{t('footer.solutionTitle', 'حلول ذكية لشحن وتوصيل البضائع')}</h3>
          <Link to='/login' className="login-button text-decoration-none">{t('common:hero.joinDriver', 'انضم الينا الان')}</Link>
        </div>
        
        {/* Provider Footer - Only Shown on Provider Page */}
        <div className={`d-flex justify-content-center flex-column align-items-center flex-wrap gap-2 border-bottom pb-3 provider-footer ${!isProviderPage ? 'd-none' : ''}`}>
          <h3 className='login-title'>
            {isLoading ? '...' : getLangField(footerSection, 'title') || 'هل أنت مستعد لبدء العمل وزيادة دخلك؟'}
          </h3>
          <Link to='/login' className="login-button text-decoration-none">
            {isLoading ? '...' : getLangField(footerSection, 'content') || 'ابدأ الآن كمزود خدمة'}
          </Link>
        </div>

        <div className="row align-items-center">
          <div className="col-md-4 mt-4">
            {aboutData?.image && (
              <img 
                src={aboutData.image} 
                alt="About Jusoor" 
                className="img-fluid mb-3" 
                style={{ maxHeight: '60px' }} 
              />
            )}
            <h5 className='footer-main-label'>
              {isLoading ? '...' : getLangField(aboutData, 'title') || t('footer.aboutTitle', 'عن جسور')}
            </h5>
            <p className='footer-main-sublabel'>
              {isLoading ? '...' : getLangField(aboutData, 'content') || t('footer.aboutDescription')}
            </p>
            <div className="d-flex justify-content-start align-items-center flex-wrap gap-3 mb-4">
              <img src="assets/Google Play.png" alt="Google" />
              <img src="assets/App Store.png" alt="App" />
            </div>
            <div className="d-flex gap-5 align-items-center mb-3">
              <GitHubIcon className='fs-2 icon-color' />
              <InstagramIcon className='fs-2 icon-color' />
              <FacebookIcon className='fs-2 icon-color' />
              <XIcon className='fs-2 icon-color' />
            </div>
          </div>

          <div className="col-md-2 col-6 pe-md-5 mt-4">
            <h6 className='mb-3 footer-link-title'>{t('footer.links.shortcuts')}</h6>
            <Link to="/" className='mb-3 footer-link d-block text-decoration-none'>{t('footer.links.home')}</Link>
            <Link to="/works" className='mb-3 footer-link d-block text-decoration-none'>{t('footer.links.business')}</Link>
            <Link to="/service-provider" className='mb-3 footer-link d-block text-decoration-none'>{t('footer.links.providers')}</Link>
            <Link to="/contact" className='mb-3 footer-link d-block text-decoration-none'>{t('footer.links.contact')}</Link>
          </div>
          <div className="col-md-1 d-none d-md-block"></div>
          
          <div className="col-md-2 col-6 pe-md-4 mt-4">
            <h6 className='mb-3 footer-link-title'>{t('footer.links.shortcuts')}</h6>
            <Link to="/" className='mb-3 footer-link d-block text-decoration-none'>{t('footer.links.home')}</Link>
            <Link to="/works" className='mb-3 footer-link d-block text-decoration-none'>{t('footer.links.business')}</Link>
            <Link to="/service-provider" className='mb-3 footer-link d-block text-decoration-none'>{t('footer.links.providers')}</Link>
            <Link to="/contact" className='mb-3 footer-link d-block text-decoration-none'>{t('footer.links.contact')}</Link>
          </div>
          <div className="col-md-1 d-none d-md-block"></div>

          <div className="col-md-2 col-6 pe-md-4 mt-4">
            <h6 className='mb-3 footer-link-title'>{t('footer.links.shortcuts')}</h6>
            <Link to="/" className='mb-3 footer-link d-block text-decoration-none'>{t('footer.links.home')}</Link>
            <Link to="/works" className='mb-3 footer-link d-block text-decoration-none'>{t('footer.links.business')}</Link>
            <Link to="/service-provider" className='mb-3 footer-link d-block text-decoration-none'>{t('footer.links.providers')}</Link>
            <Link to="/contact" className='mb-3 footer-link d-block text-decoration-none'>{t('footer.links.contact')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
