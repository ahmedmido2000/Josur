import React, { useRef, useState } from "react";
import DriverNavbar from '../components/DriverNavbar'
import Footer from '../../shared/components/Footer'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faArrowDown, faArrowDownLong, faDotCircle, faCircleDot, faCircle, faCaretDown, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';

const MissionArrived = () => {
    const [currentStep, setCurrentStep] = useState(2);
    const [open, setOpen] = useState(false);
    const [selectedTruck, setSelectedTruck] = useState(null);

    return (
        <>
            <DriverNavbar />

            <div className="container mb-5">
                <div className="row">
                    <div className="col-12 mt-3">
                        <div className="shadow p-3 rounded-3 h-100">
                            <h2 className='orders-title'>اطلب من العميل التوقيع على الشاشة</h2>
                            <div className="mt-3 h-100">
                                <div className="assigned-img d-flex justify-content-center align-items-center">
                                    <img src="/assets/assigned-img.png" className="img-fluid" alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 mt-4">
                        <div className="shadow p-3 rounded-3 h-100">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label mb-1">ادخل رمز التحقق</label>
                                        <input
                                            type="text"
                                            className="form-control form-input py-2"
                                            placeholder="رمز التحقق"
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label mb-1">التقط صورة للحمولة</label>
                                        <button type='button' className="login-button text-decoration-none w-100 d-flex align-items-center gap-1 justify-content-center take-img-btn">
                                            <img src="/assets/camera.svg" alt="" /> التقاط صورة للحمولة 
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="taken-imgs d-flex gap-2 align-items-center flex-wrap mb-3">
                                <div className="taken-img position-relative">
                                    <img src="/assets/taken-img-1.png" className="taken-img" alt="taken-img" />
                                    <img src="/assets/close.svg" className="delete-taken-img" alt="taken-img" />
                                </div>
                                <div className="taken-img position-relative">
                                    <img src="/assets/taken-img-2.png" className="taken-img" alt="taken-img" />
                                    <img src="/assets/close.svg" className="delete-taken-img" alt="taken-img" />
                                </div>
                                <div className="taken-img position-relative">
                                    <img src="/assets/taken-img-3.png" className="taken-img" alt="taken-img" />
                                    <img src="/assets/close.svg" className="delete-taken-img" alt="taken-img" />
                                </div>
                            </div>
                            {/* Shipment Progress */}
                            <div
                                className={`shipment-progress ${
                                    currentStep === 2 ? "shipment-arrived" : ""
                                }`}
                            >
                                {/* Top Labels */}
                                <div className="progress-labels">
                                    {["استلام الشحنة", "في الطريق للشحن", "تسليم الحمولة"].map((item, index) => (
                                        <span
                                            key={index}
                                            className={`progress-label ${
                                                currentStep >= index ? "active" : ""
                                            }`}
                                        >
                                            {item}
                                        </span>
                                    ))}
                                </div>

                                {/* Line & Truck */}
                                <div className="progress-line-wrapper mt-4">
                                    <div className="progress-line-bg" />

                                    <div
                                        className="progress-line-active"
                                        style={{ width: `${currentStep * 50}%` }}
                                    />

                                    <div
                                        className={`truck-position step-${currentStep}`}
                                    >
                                        <img src="/assets/filter-card-img-1.png" alt="truck" />
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between align-items-center flex-wrap">
                                <div className="from-to-wrapper mt-3">
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
                                        <span>الرياض</span>
                                        <span>الجزائر</span>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center flex-wrap gap-2 mt-3">
                                    <h2 className='orders-title'>المسافة</h2>
                                    <img src="/assets/distance.svg" alt="distance" />
                                    <p className="orders-card-title mb-2">33 كلم</p>
                                    <FontAwesomeIcon icon={faCircle} className='dot-gray-8' />
                                    <h2 className='orders-title'>الحمولة</h2>
                                    <img src="/assets/box.svg" alt="distance" />
                                    <p className="orders-card-title mb-2">أثاث منزلي</p>
                                </div>
                                <div className="d-flex gap-2 align-items-center mt-3">
                                    <button type='button' className="login-button text-decoration-none">تم</button>
                                </div>
                            </div>
                        </div>
                    </div>         
                </div>
            </div>

            <Footer />
        </>
    )
}

export default MissionArrived;