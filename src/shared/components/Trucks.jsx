import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetHomeDataQuery, useGetSubTrucksQuery } from '../../api/site/siteApi';

const Trucks = () => {
  const { i18n } = useTranslation();
  const { data: homeData, isLoading } = useGetHomeDataQuery();
  const [activeFilter, setActiveFilter] = useState(null);
  
  const { data: currentChildren = [], isLoading: isSubLoading } = useGetSubTrucksQuery(activeFilter, { 
    skip: !activeFilter 
  });

  // Helper to get localized field from API
  const getLangField = (item, field) => {
    if (!item) return '';
    const isEn = i18n.language === 'en';
    const enField = `${field}_en`;
    return (isEn && item[enField]) ? item[enField] : item[field];
  };

  const getImageUrl = (image) => {
    if (!image) return 'assets/truck-type-img.png';
    return image;
  };

  const trucksSection = homeData?.Sections?.[15]; // ID 29: انواع الشاحنات
  const allTrucks = homeData?.Truks || [];

  // تحديد الشاحنات الأساسية بالـ IDs
  const parentIds = [3, 11, 12, 13];
  const parentTrucks = allTrucks.filter((t) => parentIds.includes(t.id));
  
  useEffect(() => {
    if (parentTrucks.length > 0 && !activeFilter) {
      setActiveFilter(parentTrucks[0].id);
    }
  }, [parentTrucks, activeFilter]);

  const handleFilterClick = (id) => {
    setActiveFilter(id);
  };

  const currentParent = parentTrucks.find((t) => t.id === activeFilter);

  return (
    <section className="trucks py-4">
      <div className="container">
        <h2 className="section-title text-center">
          {isLoading ? '...' : getLangField(trucksSection, 'title') || 'انواع الشاحنات'}
        </h2>
        <p className="section-desc text-center">
          {isLoading ? '...' : getLangField(trucksSection, 'content')}
        </p>

        <div className="row">
          {/* Main Truck Categories (Filters) */}
          {parentTrucks.map((type) => (
            <div className="col-lg-3 col-md-6 mt-3" key={type.id}>
              <div
                className={`trucks-filter-card d-flex justify-content-between align-items-center w-100 ${
                  activeFilter === type.id ? 'active' : ''
                }`}
                onClick={() => handleFilterClick(type.id)}
                style={{ cursor: 'pointer' }}
              >
                <span className="trucks-filter-title">{getLangField(type, 'name')}</span>
                <img
                  src={getImageUrl(type.image)}
                  alt={getLangField(type, 'name')}
                  className="filter-card-img"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="row mt-4">
          <div className="col-12">
            <div className="filter-item-container">
              <div className="row align-items-center">
                {/* الصورة الكبيرة على اليمين (في RTL) واليسار (في LTR) */}
                <div className="col-md-5 text-center">
                  <img
                    src={getImageUrl(currentParent?.image)}
                    alt={getLangField(currentParent, 'name')}
                    className="img-fluid filter-card-item-img"
                    style={{ objectFit: 'contain' }}
                  />
                </div>
                {/* القائمة الفرعية على اليسار (في RTL) واليمين (في LTR) */}
                <div className="col-md-7">
                  <div className="d-flex flex-column gap-3 align-items-end" style={{}}>
                    {isSubLoading ? (
                       <div className="col-12 text-center">
                        <p className="text-muted italic">
                          {i18n.language === 'en' ? 'Loading...' : 'جاري التحميل...'}
                        </p>
                      </div>
                    ) : currentChildren.length > 0 ? (
                      currentChildren.map((child) => (
                        <div
                          key={child.id}
                          className="filter-badge d-flex justify-content-between align-items-center"
                        >
                          <span className="filter-badge-text">
                            {getLangField(child, 'name')}
                          </span>
                          <img
                            src={getImageUrl(child.image)}
                            alt={getLangField(child, 'name')}
                            className="filter-badge-img"
                          />
                        </div>
                      ))
                    ) : (
                      <div className="col-12 text-center">
                        <p className="text-muted italic">
                          {i18n.language === 'en'
                            ? 'No sub-types available'
                            : 'لا توجد أنواع فرعية متاحة'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Trucks;
