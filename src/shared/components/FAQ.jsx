import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetHomeDataQuery } from '../../api/site/siteApi';

const FAQ = () => {
  const { t, i18n } = useTranslation('common');
  const { data: homeData, isLoading } = useGetHomeDataQuery();
  const [activeIndex, setActiveIndex] = useState(null);

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

  const faqs = homeData?.Question || [];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-5">
      <div className="container"> 
        <h2 className="faq-title text-center mb-4">{t('faq.title')}</h2>
        
        <div className="faq mx-auto">
          {isLoading ? (
            <div className="text-center py-4">...</div>
          ) : (
            faqs.map((item, index) => (
              <div
                key={item.id || index}
                className={`faq-item border-bottom py-2 ${activeIndex === index ? "active" : ""}`}
                onClick={() => toggleFAQ(index)}
                style={{ cursor: "pointer" }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="m-0 faq-question">{getLangField(item, 'title') || item.title}</h5>
                  <span className="faq-icon">
                    {activeIndex === index ? "×" : "+"}
                  </span>
                </div>
                <div className={`faq-answer ${activeIndex === index ? "show" : ""}`}>
                  <p className="m-0">{getLangField(item, 'content') || item.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
