import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGetHomeDataQuery } from '../../api/site/siteApi';

const ProviderDocuments = () => {
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

  const docsSection = homeData?.Sections?.find(section => section.id === 75);

  const isEn = i18n.language && i18n.language.startsWith('en');
  const fullContent = getLangField(docsSection, 'content') || docsSection?.content;
  // Split content by new lines and filter out empty lines
  const contentParts = fullContent ? fullContent.split(/\r?\n/).filter(line => line.trim() !== '') : [];
  
  // The first part is usually the description/intro, the rest are the items
  const description = contentParts.length > 0 ? contentParts[0] : '';
  const docItems = contentParts.length > 1 ? contentParts.slice(1) : [];

  return (
    <section>
      <div className="container provider-documents rounded-5 my-5">
        <div className="row align-items-stretch">
          <div className="col-md-6 px-4 py-4 d-flex flex-column justify-content-center">
            <h3 className='login-title'>
              {isLoading ? '...' : (getLangField(docsSection, 'title') || (isEn ? 'Required Documents' : 'الوثائق المطلوبة لإتمام التسجيل'))}
            </h3>
            <p className='services-card-desc mb-3'>
              {isLoading ? '...' : description}
            </p>
            {docItems.map((item, index) => (
              <div key={index} className='document-li mb-2'>{item}</div>
            ))}
            <div className="mt-auto">
              <button className="login-button mt-3">
                {isEn ? 'Attach Documents Now' : 'إرفاق الوثائق الآن'}
              </button>
            </div>
          </div>
          <div className="col-md-6 p-0 d-flex">
            <img 
              src={docsSection?.image || "assets/provider-document-img.png"} 
              className='provider-document-img w-100' 
              alt="documents" 
              style={{ objectFit: 'cover', minHeight: '100%' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProviderDocuments;
