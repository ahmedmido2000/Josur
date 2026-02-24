import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import UserNavbar from '../components/UserNavbar'
import UserSidebar from '../components/UserSidebar'
import ProfileMain from '../components/ProfileMain'
import Footer from '../../shared/components/Footer'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faArrowDownLong, faCircle, faStar} from "@fortawesome/free-solid-svg-icons";
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';

const ProviderAccount = () => {
    const location = useLocation();
    const provider = location.state?.provider || {};
    const [activeSubFilter, setActiveSubFilter] = useState('new-request');

    // Sub filters data
    const subFilters = [
        {
            id: 'new-request',
            label: 'المعلومات الشخصية',
            icon: 'provider-subfilter-icon-1.svg'
        },
        {
            id: 'waiting',
            label: 'معلومات الشاحنة',
            icon: 'provider-subfilter-icon-2.svg'
        },
        {
            id: 'shipped',
            label: 'الطلبات',
            icon: 'provider-subfilter-icon-3.svg'
        },
        {
            id: 'cancelled',
            label: 'تقييمات العملاء',
            icon: 'provider-subfilter-icon-4.svg'
        }
    ];

    // Handle sub-filter click
    const handleSubFilterClick = (filterId) => {
        setActiveSubFilter(filterId);
    };

    return (
        <>
            <UserNavbar />
            <div className="container mb-5">
                <div className='row mt-3'>
                    <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 pb-4">
                            <div className="d-flex gap-3 align-items-center">
                                <img src={provider?.avatar || "../assets/man.png"} className='profile-main-img' alt="user" />
                                <div>
                                    <h6 className="orders-title m-0">{provider?.name || 'Habib Meddour'}</h6>
                                    <div className="d-flex gap-2 align-items-center mt-2">
                                        <div className="new-order-badge p-1 rounded-2 text-nowrap">{provider?.rate || '4,9'} <img src="../assets/star.svg" alt="" /></div>
                                        <div className="completed-orders-badge p-1 rounded-2 text-nowrap"><span className='number'>38</span> <span>طلب مكتمل</span></div>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                <button type='button' className="login-button text-decoration-none">طلب خدمة</button>
                            </div>
                        </div>
                        <div className="orders-sub-filter row align-items-center border-bottom">
                            {subFilters.map((filter) => (
                                <div key={filter.id} className="col-lg-3 col-md-6">
                                    <div 
                                        className={`sub-filter-item d-flex justify-content-center gap-1 align-items-center ${activeSubFilter === filter.id ? 'active' : ''}`}
                                        onClick={() => handleSubFilterClick(filter.id)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <img 
                                            src={`../assets/${activeSubFilter === filter.id ? filter.icon.replace('.svg', '-active.svg') : filter.icon}`} 
                                            alt={filter.label} 
                                        />                
                                        <h6 className='sub-filter-text m-0'>{filter.label}</h6>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Personal Information Section - Show when activeSubFilter is 'new-request' */}
                        {activeSubFilter === 'new-request' && (
                            <div className="provider-personal-info mt-4">
                                <h3 className="why-card-title m-0 mb-2">نبذة عن مقدم الخدمة</h3>
                                <p className='why-card-desc m-0'>أنا سائق شاحنة ومقدم خدمة شحن، أعمل في هذا المجال منذ سنوات وأحرص دائمًا على توصيل الحمولات بأمان وفي الوقت المحدد. أؤمن بأن الثقة والالتزام هما أساس التعامل الناجح، وأسعى دائمًا لراحة الزبون سواء في التعامل أو في جودة الخدمة. أستخدم شاحنة مجهزة، وأتنقل بين المدن لنقل مختلف أنواع البضائع، وأتعامل مع كل حمولة وكأنها تخصني. إذا كنت تبحث عن شخص يعتمد عليه، فأنا هنا لخدمتك.</p>
                                <div className="row mt-3">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label mb-1">الاسم الاول</label>
                                            <p className='why-card-desc m-0 border-bottom'>habib</p>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label mb-1">الاسم الاخير</label>
                                            <p className='why-card-desc m-0 border-bottom'>meddour</p>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label mb-1">الايميل</label>
                                            <p className='why-card-desc m-0 border-bottom'>habibmeddour1997@gmail.com</p>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label mb-1">المنطقة</label>
                                            <p className='why-card-desc m-0 border-bottom'>Algeria</p>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label mb-1">رقم الهاتف</label>
                                            <p className='why-card-desc m-0 border-bottom'>012535995555</p>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label mb-1">الموقع</label>
                                            <p className='why-card-desc m-0 border-bottom'>Algeria</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Truck Information Section - Show when activeSubFilter is 'waiting' */}
                        {activeSubFilter === 'waiting' && (
                            <div className="provider-truck-info mt-4">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label mb-1">نوع الشاحنة</label>
                                            <p className='why-card-desc m-0 border-bottom'>دينا</p>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label mb-1">رقم تسجيل الشاحنة</label>
                                            <p className='why-card-desc m-0 border-bottom'>1388573 216 40</p>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label mb-1">سنة الصنع</label>
                                            <p className='why-card-desc m-0 border-bottom'>2016</p>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label mb-1">سعة الحمولة (بالطن)</label>
                                            <p className='why-card-desc m-0 border-bottom'>6 طن</p>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label mb-1">حالة الشاحنة</label>
                                            <p className='why-card-desc m-0 border-bottom'>جيدة</p>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <img src="../assets/truck-details-img.png" className='img-fluid truck-details-img w-100' alt="truck" />
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Orders Information Section - Show when activeSubFilter is 'shipped' */}
                        {activeSubFilter === 'shipped' && (
                            <div className="provider-orders-info mt-4">
                                <div className="card-order-details p-2 border rounded-3 mt-2">
                                    <div className="d-flex flex-column align-items-start gap-2 w-100">
                                        <div className='d-flex align-items-center justify-content-between w-100'>
                                            <div>
                                                <h3 className='orders-card-title m-0 mb-1'>طلب توصيل أثاث منزلي</h3>
                                            </div>
                                            <div className="shipped-badge py-1 px-2 rounded-2 text-nowrap d-flex align-items-center">تم الشحن</div>
                                        </div>
                                        <div className="d-flex flex-wrap gap-4">
                                            <div>
                                                <h5 className='footer-link'>العميل</h5>
                                                <div className="d-flex gap-2 align-items-start">
                                                    <img src="../assets/man.png" className='user-img' alt="user" />
                                                    <div>
                                                        <div className="d-flex gap-1 align-items-center">
                                                            <h6 className="user-name m-0">Fahad Nasser</h6>
                                                            <div className="new-order-badge p-1 rounded-2 text-nowrap">4,8 <img src="../assets/star.svg" alt="" /></div>
                                                        </div>
                                                        <p className="user-desc m-0">الرياض</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="from-to-wrapper">
                                            {/* الأيقونات */}
                                            <div className="from-to-icons">
                                                <div className="location-icon">
                                                    <LocationOnOutlinedIcon className='fs-6' />
                                                </div>
                                                <div className="circle"></div>
                                                <FontAwesomeIcon icon={faArrowDownLong} className="arrow" />
                                                <div className="location-icon">
                                                    <LocationOnOutlinedIcon className='fs-6' />
                                                </div>
                                            </div>
                                            {/* النص */}
                                            <div className="from-to-text">
                                                <span>الدمام</span>
                                                <span>مكة</span>
                                            </div>
                                        </div>
                                        <div className="d-flex gap-2 align-items-center">
                                            <img src="../assets/calendar.svg" className='mb-1' alt="calender" />
                                            <h6 className='user-desc m-0'>01-07-2025</h6>
                                            <FontAwesomeIcon icon={faCircle} className='dot-icon' />
                                            <h6 className='user-desc m-0'>09:00</h6>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-order-details p-2 border rounded-3 mt-2">
                                    <div className="d-flex flex-column align-items-start gap-2 w-100">
                                        <div className='d-flex align-items-center justify-content-between w-100'>
                                            <div>
                                                <h3 className='orders-card-title m-0 mb-1'>طلب توصيل أثاث منزلي</h3>
                                            </div>
                                            <div className="shipped-badge py-1 px-2 rounded-2 text-nowrap d-flex align-items-center">تم الشحن</div>
                                        </div>
                                        <div className="d-flex flex-wrap gap-4">
                                            <div>
                                                <h5 className='footer-link'>العميل</h5>
                                                <div className="d-flex gap-2 align-items-start">
                                                    <img src="../assets/man.png" className='user-img' alt="user" />
                                                    <div>
                                                        <div className="d-flex gap-1 align-items-center">
                                                            <h6 className="user-name m-0">Fahad Nasser</h6>
                                                            <div className="new-order-badge p-1 rounded-2 text-nowrap">4,8 <img src="../assets/star.svg" alt="" /></div>
                                                        </div>
                                                        <p className="user-desc m-0">الرياض</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="from-to-wrapper">
                                            {/* الأيقونات */}
                                            <div className="from-to-icons">
                                                <div className="location-icon">
                                                    <LocationOnOutlinedIcon className='fs-6' />
                                                </div>
                                                <div className="circle"></div>
                                                <FontAwesomeIcon icon={faArrowDownLong} className="arrow" />
                                                <div className="location-icon">
                                                    <LocationOnOutlinedIcon className='fs-6' />
                                                </div>
                                            </div>
                                            {/* النص */}
                                            <div className="from-to-text">
                                                <span>الدمام</span>
                                                <span>مكة</span>
                                            </div>
                                        </div>
                                        <div className="d-flex gap-2 align-items-center">
                                            <img src="../assets/calendar.svg" className='mb-1' alt="calender" />
                                            <h6 className='user-desc m-0'>01-07-2025</h6>
                                            <FontAwesomeIcon icon={faCircle} className='dot-icon' />
                                            <h6 className='user-desc m-0'>09:00</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Customer Reviews Section - Show when activeSubFilter is 'cancelled' */}
                        {activeSubFilter === 'cancelled' && (
                            <div className="provider-rates-info mt-4">
                                <div className="card-order-details p-2 border rounded-3 mt-2">
                                    <div className="d-flex flex-column align-items-start gap-2 w-100">
                                        <div className="d-flex gap-2 align-items-start">
                                            <img src="../assets/man.png" className='user-img' alt="user" />
                                            <div>
                                                <div className="d-flex gap-1 align-items-center">
                                                    <h6 className="user-name m-0">Habib meddour</h6>
                                                </div>
                                                <p className="not-have m-0 mt-1">2024/09/28</p>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center gap-2">
                                            <FontAwesomeIcon icon={faStar} className='rate-star-icon' />
                                            <FontAwesomeIcon icon={faStar} className='rate-star-icon' />
                                            <FontAwesomeIcon icon={faStar} className='rate-star-icon' />
                                            <FontAwesomeIcon icon={faStar} className='rate-star-icon' />
                                            <FontAwesomeIcon icon={faStar} className='rate-star-icon' />
                                            <p className="not-have m-0">(5.0)</p>
                                        </div>
                                        <h3 className='orders-card-title m-0'>طلب توصيل أثاث منزلي</h3>
                                        <h5 className='footer-link'>"خدمة رائعة وسريعة! كانت الرحلة ممتعة و السائق محترف للغاية. سأطلب الخدمة مرة أخرى بالتأكيد!"</h5>
                                    </div>
                                </div>
                                <div className="card-order-details p-2 border rounded-3 mt-2">
                                    <div className="d-flex flex-column align-items-start gap-2 w-100">
                                        <div className="d-flex gap-2 align-items-start">
                                            <img src="../assets/man.png" className='user-img' alt="user" />
                                            <div>
                                                <div className="d-flex gap-1 align-items-center">
                                                    <h6 className="user-name m-0">Habib meddour</h6>
                                                </div>
                                                <p className="not-have m-0 mt-1">2024/09/28</p>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center gap-2">
                                            <FontAwesomeIcon icon={faStar} className='rate-star-icon' />
                                            <FontAwesomeIcon icon={faStar} className='rate-star-icon' />
                                            <FontAwesomeIcon icon={faStar} className='rate-star-icon' />
                                            <FontAwesomeIcon icon={faStar} className='rate-star-icon' />
                                            <FontAwesomeIcon icon={faStar} className='rate-star-icon' />
                                            <p className="not-have m-0">(5.0)</p>
                                        </div>
                                        <h3 className='orders-card-title m-0'>طلب توصيل أثاث منزلي</h3>
                                        <h5 className='footer-link'>"خدمة رائعة وسريعة! كانت الرحلة ممتعة و السائق محترف للغاية. سأطلب الخدمة مرة أخرى بالتأكيد!"</h5>
                                    </div>
                                </div>
                                <div className="card-order-details p-2 border rounded-3 mt-2">
                                    <div className="d-flex flex-column align-items-start gap-2 w-100">
                                        <div className="d-flex gap-2 align-items-start">
                                            <img src="../assets/man.png" className='user-img' alt="user" />
                                            <div>
                                                <div className="d-flex gap-1 align-items-center">
                                                    <h6 className="user-name m-0">Habib meddour</h6>
                                                </div>
                                                <p className="not-have m-0 mt-1">2024/09/28</p>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center gap-2">
                                            <FontAwesomeIcon icon={faStar} className='rate-star-icon' />
                                            <FontAwesomeIcon icon={faStar} className='rate-star-icon' />
                                            <FontAwesomeIcon icon={faStar} className='rate-star-icon' />
                                            <FontAwesomeIcon icon={faStar} className='rate-star-icon' />
                                            <FontAwesomeIcon icon={faStar} className='rate-star-icon' />
                                            <p className="not-have m-0">(5.0)</p>
                                        </div>
                                        <h3 className='orders-card-title m-0'>طلب توصيل أثاث منزلي</h3>
                                        <h5 className='footer-link'>"خدمة رائعة وسريعة! كانت الرحلة ممتعة و السائق محترف للغاية. سأطلب الخدمة مرة أخرى بالتأكيد!"</h5>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default ProviderAccount;