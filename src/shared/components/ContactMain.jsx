import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGetHomeDataQuery } from '../../api/site/siteApi';

const ContactMain = () => {
  const { i18n } = useTranslation();
  const { data: homeData, isLoading } = useGetHomeDataQuery();

  // Helper to get localized field from API
  const getLangField = (item, field) => {
    if (!item) return '';
    const isEn = i18n.language === 'en';
    const enField = `${field}_en`;
    return (isEn && item[enField]) ? item[enField] : item[field];
  };

  const contactSection = homeData?.Sections?.find(section => section.id === 71);

  return (
    <section className='pt-md-5 pb-5'>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6 mt-4">
            <h2 className='contact-main-title'>
              {isLoading ? '...' : getLangField(contactSection, 'title') || 'تواصل معنا'}
            </h2>
            <p className='contact-main-desc'>
              {isLoading ? '...' : getLangField(contactSection, 'content')}
            </p>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control form-input py-2"
                    placeholder={i18n.language === 'en' ? 'First Name' : 'الاسم الأول'}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control form-input py-2"
                    placeholder={i18n.language === 'en' ? 'Phone Number*' : 'رقم الجوال*'}
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control form-input py-2"
                    placeholder={i18n.language === 'en' ? 'Email Address*' : 'عنوان البريد الإلكتروني*'}
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="mb-3">
                  <textarea 
                    rows="5" 
                    className="form-control form-input" 
                    placeholder={i18n.language === 'en' ? 'Share your problems or inquiries here' : 'شاركنا مشاكلك أو استفساراتك هنا'}
                  ></textarea>
                </div>
              </div>
              <div className="col-12">
                <button className="login-button w-100 py-2 rounded-3">
                  {i18n.language === 'en' ? 'Send' : 'إرسال'}
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-6 mt-4">
            <img 
              src={contactSection?.image || "assets/contact-man-img.png"} 
              className='img-fluid w-100 contact-man-img' 
              alt="contact" 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactMain;
