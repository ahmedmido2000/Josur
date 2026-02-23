import React from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong } from "@fortawesome/free-solid-svg-icons";
const TripHistoryComponent = () => {
  return (
    <div className="trip-history-content mt-2">
      <div className="shadow p-2 rounded-3">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h4 className="orders-title m-0">سجل الرحلات</h4>
          <p className='user-desc m-0 mt-1'>سجلات الرحلات التفصيلية وتحليلات الأداء</p>
        </div>
        <button type='button' className="login-button text-decoration-none d-flex align-items-center gap-2 justify-content-center take-img-btn"> 
          <img src="/assets/document-download.svg" alt="download" /> تحميل التقرير
        </button>
      </div>
      <div className="row">
        <div className="col-lg-3 col-md-6 mt-3">
          <div className="p-2 border rounded-3 h-100">
          <p className='user-desc m-0'>إجمالي الرحلات</p>
          <h4 className="orders-title m-0 mt-2">8</h4>

          </div>
        </div>
        <div className="col-lg-3 col-md-6 mt-3">
          <div className="p-2 border rounded-3 h-100">
          <p className='user-desc m-0'>إجمالي الرحلات</p>
          <h4 className="total-earns m-0 mt-2">1150 دولارًا</h4>

          </div>
        </div>
        <div className="col-lg-3 col-md-6 mt-3">
          <div className="p-2 border rounded-3 h-100">
          <p className='user-desc m-0'>إجمالي الرحلات</p>
          <h4 className="total-expenses m-0 mt-2">250 دولارًا</h4>

          </div>
        </div>
        <div className="col-lg-3 col-md-6 mt-3">
          <div className="p-2 border rounded-3 h-100">
          <p className='user-desc m-0'>إجمالي الرحلات</p>
          <h4 className="driver-card-price m-0 mt-2">900 دولار</h4>

          </div>
        </div>
      </div>
      <div className="row mt-3">
            <div className="col-md-8 mb-2">
            <div className="position-relative">
  <input
    type="text"
    className="form-control form-input py-2"
    style={{paddingRight:'35px'}}
    placeholder="البحث عن رحلة او مركبة ..."
  />

  <span className="search-input-icon">
    <i className="fas fa-search"></i>
  </span>
</div>

            </div>
            <div className="col-md-2 mb-2">
            <div className="mb-3">
                                            <div className="select-wrapper position-relative">
    <select className="form-select form-input py-2 pe-3">
        <option value="كل الحالات">كل الحالات</option>
    </select>
    <div className="select-icon position-absolute start-0 top-50 translate-middle-y ps-2">
        <ExpandMoreIcon />
    </div>
</div>
                                        </div>
            </div>
            <div className="col-md-2 mb-2">
            <div className="mb-3">
                                            <div className="select-wrapper position-relative">
    <select className="form-select form-input py-2 pe-3">
        <option value="هذا الشهر">هذا الشهر</option>
    </select>
    <div className="select-icon position-absolute start-0 top-50 translate-middle-y ps-2">
        <ExpandMoreIcon />
    </div>
</div>
                                        </div>
            </div>
        </div>
          <div className="table-responsive border rounded-2">
            <table className="table table-borderless align-middle text-center">
              <thead className="table-head">
                <tr>
                  <th>معرف الرحلة</th>
                  <th>المركبة</th>
                  <th>السائق</th>
                  <th>المسار</th>
                  <th>الحالة</th>
                  <th>الدخل</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className='p-2'><div className='months-filter-item'>#TR001</div></td>
                  <td className='p-2'><div className='months-filter-item'>دينا</div></td>
                  <td className='p-2'><div className='months-filter-item'>عمر الراجحي </div></td>
                  <td className='p-2'>
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
                  <span>الرياض</span>
                  <span>الجزائر</span>
                </div>
              </div>
                  </td>
                  <td className='p-2'><div className="shipped-badge py-1 px-2 rounded-2 text-nowrap text-center">مكتمل</div></td>
                  <td className='p-2'>
                    <div className='datetime-part'>450 دولارًا</div>
                  </td>
                </tr>
                <tr>
                  <td className='p-2'><div className='months-filter-item'>#TR001</div></td>
                  <td className='p-2'><div className='months-filter-item'>دينا</div></td>
                  <td className='p-2'><div className='months-filter-item'>عمر الراجحي </div></td>
                  <td className='p-2'>
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
                  <span>الرياض</span>
                  <span>الجزائر</span>
                </div>
              </div>
                  </td>
                  <td className='p-2'><div className="shipped-badge py-1 px-2 rounded-2 text-nowrap text-center">مكتمل</div></td>
                  <td className='p-2'>
                    <div className='datetime-part'>450 دولارًا</div>
                  </td>
                </tr>
                <tr>
                  <td className='p-2'><div className='months-filter-item'>#TR001</div></td>
                  <td className='p-2'><div className='months-filter-item'>دينا</div></td>
                  <td className='p-2'><div className='months-filter-item'>عمر الراجحي </div></td>
                  <td className='p-2'>
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
                  <span>الرياض</span>
                  <span>الجزائر</span>
                </div>
              </div>
                  </td>
                  <td className='p-2'><div className="shipped-badge py-1 px-2 rounded-2 text-nowrap text-center">مكتمل</div></td>
                  <td className='p-2'>
                    <div className='datetime-part'>450 دولارًا</div>
                  </td>
                </tr>
                <tr>
                  <td className='p-2'><div className='months-filter-item'>#TR001</div></td>
                  <td className='p-2'><div className='months-filter-item'>دينا</div></td>
                  <td className='p-2'><div className='months-filter-item'>عمر الراجحي </div></td>
                  <td className='p-2'>
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
                  <span>الرياض</span>
                  <span>الجزائر</span>
                </div>
              </div>
                  </td>
                  <td className='p-2'><div className="shipped-badge py-1 px-2 rounded-2 text-nowrap text-center">مكتمل</div></td>
                  <td className='p-2'>
                    <div className='datetime-part'>450 دولارًا</div>
                  </td>
                </tr>
                <tr>
                  <td className='p-2'><div className='months-filter-item'>#TR001</div></td>
                  <td className='p-2'><div className='months-filter-item'>دينا</div></td>
                  <td className='p-2'><div className='months-filter-item'>عمر الراجحي </div></td>
                  <td className='p-2'>
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
                  <span>الرياض</span>
                  <span>الجزائر</span>
                </div>
              </div>
                  </td>
                  <td className='p-2'><div className="shipped-badge py-1 px-2 rounded-2 text-nowrap text-center">مكتمل</div></td>
                  <td className='p-2'>
                    <div className='datetime-part'>450 دولارًا</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
      </div>
    </div>
  );
};

export default TripHistoryComponent;