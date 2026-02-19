import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGetHomeDataQuery } from '../../api/site/siteApi';
import { faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const WorksDocuments = () => {
  const { i18n } = useTranslation();
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

  const docsSection = homeData?.Sections?.find(s => s.id === 79) || homeData?.Sections?.[79]; // Using ID 79

  const docItems = [
    i18n.language?.startsWith('en') ? 'Commercial Register' : 'السجل التجاري',
    i18n.language?.startsWith('en') ? 'Authorized Person ID' : 'هوية المفوض',
    i18n.language?.startsWith('en') ? 'Signature Authorization' : 'تفويض التوقيع',
    i18n.language?.startsWith('en') ? 'Copy of Articles of Association (if any)' : 'نسخة من عقد التأسيس (إن وُجد)'
  ];

  const isEn = i18n.language && i18n.language.startsWith('en');

  return (
    <section>
      <div className="container provider-documents rounded-5 my-5">
        <div className="row align-items-center">
          <div className="col-md-5 px-4">
            <h3 className='login-title'>
              {isLoading ? '...' : (isEn ? (docsSection?.title_en || docsSection?.title) : (docsSection?.title || 'الوثائق المطلوبة لإتمام الاتفاق'))}
            </h3>
            
            {docItems.map((item, index) => (
              <div key={index} className='document-li d-flex gap-1 align-items-center'>
                <FontAwesomeIcon icon={faCheckSquare} className='document-icon' />
                <div>{item}</div>
              </div>
            ))}
          </div>
          <div className="col-md-7">
          
            <img 
              src={docsSection?.image || "assets/provider-document-img.png"} 
              className='img-fluid works-document-img w-100' 
              alt="truck" 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorksDocuments;
