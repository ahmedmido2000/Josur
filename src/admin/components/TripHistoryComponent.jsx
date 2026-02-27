import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from 'react-i18next';
import { useGetCompanyOrdersMutation } from '../../api/admin/adminApi';
import { useGetListsQuery } from '../../api/site/siteApi';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Helper: get date range for period filters
const getDateRange = (period) => {
  const now = new Date();
  let dateFrom, dateTo;
  const fmt = (d) => d.toISOString().split('T')[0];

  switch (period) {
    case 'this_month':
      dateFrom = new Date(now.getFullYear(), now.getMonth(), 1);
      dateTo = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      break;
    case 'last_month':
      dateFrom = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      dateTo = new Date(now.getFullYear(), now.getMonth(), 0);
      break;
    case 'last_3_months':
      dateFrom = new Date(now.getFullYear(), now.getMonth() - 3, 1);
      dateTo = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      break;
    case 'last_6_months':
      dateFrom = new Date(now.getFullYear(), now.getMonth() - 6, 1);
      dateTo = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      break;
    case 'this_year':
      dateFrom = new Date(now.getFullYear(), 0, 1);
      dateTo = new Date(now.getFullYear(), 11, 31);
      break;
    case 'all':
    default:
      return { date_from: '', date_to: '' };
  }
  return { date_from: fmt(dateFrom), date_to: fmt(dateTo) };
};

const TripHistoryComponent = () => {
  const { t, i18n } = useTranslation(['admin', 'common']);
  const isRtl = i18n.language === 'ar';

  // Filters state
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [periodFilter, setPeriodFilter] = useState('this_month');
  const [searchTerm, setSearchTerm] = useState('');

  // API hooks
  const { data: listsData } = useGetListsQuery();
  const [getCompanyOrders, { data: ordersResponse, isLoading, isError }] = useGetCompanyOrdersMutation();

  // Extract lists
  const statusList = listsData?.Status || [];
  const requestTypes = listsData?.RequestType || {};

  // Build body filters and fetch data
  const fetchOrders = useCallback(() => {
    const { date_from, date_to } = getDateRange(periodFilter);
    const body = {};
    if (typeFilter) body.type = typeFilter;
    if (statusFilter !== '') body.status = statusFilter;
    if (date_from) body.date_from = date_from;
    if (date_to) body.date_to = date_to;
    getCompanyOrders(body);
  }, [typeFilter, statusFilter, periodFilter, getCompanyOrders]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Extract orders data
  const ordersData = useMemo(() => ordersResponse?.data?.[0] || {}, [ordersResponse]);
  const allItems = useMemo(() => ordersData?.items || [], [ordersData]);
  const meta = useMemo(() => ordersData?._meta || {}, [ordersData]);

  // Frontend text search filter
  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return allItems;
    const term = searchTerm.toLowerCase();
    return allItems.filter((item) => {
      const tripId = ('#TR' + String(item.id).padStart(3, '0')).toLowerCase();
      const vehicleName = (item.sub_truck_id?.name || item.truck_id?.name || '').toLowerCase();
      const driverName = (item.driver_id?.name || '').toLowerCase();
      const userName = (item.user_id?.name || '').toLowerCase();
      const cityFrom = (item.city_from || '').toLowerCase();
      const cityTo = (item.city_to || '').toLowerCase();
      return (
        tripId.includes(term) ||
        vehicleName.includes(term) ||
        driverName.includes(term) ||
        userName.includes(term) ||
        cityFrom.includes(term) ||
        cityTo.includes(term)
      );
    });
  }, [allItems, searchTerm]);

  // Stats calculations
  const totalTrips = meta?.count || filteredItems.length;
  const totalRevenue = useMemo(() => {
    const sum = meta?.sumofprice;
    if (sum) return parseFloat(sum);
    return filteredItems.reduce((acc, item) => acc + (item.good_price || 0), 0);
  }, [filteredItems, meta]);

  const totalExpenses = useMemo(() => {
    return filteredItems.reduce((acc, item) => acc + (item.driver_price || 0), 0);
  }, [filteredItems]);

  const netProfit = totalRevenue - totalExpenses;

  // Status helpers
  const getStatusName = (statusId) => {
    const found = statusList.find((s) => s.id === statusId);
    if (found) return isRtl ? found.name : found.name_en;
    return statusId;
  };

  const getStatusClass = (statusId) => {
    switch (statusId) {
      case 0: return 'charging-badge'; // new
      case 1: return 'charging-badge'; // in shipping
      case 2: return 'shipped-badge';  // complete
      case 3: return 'canceled-badge'; // canceled
      case 4: return 'canceled-badge'; // rejected
      default: return 'charging-badge';
    }
  };

  // Type helper
  const getTypeName = (typeId) => {
    return requestTypes[String(typeId)] || typeId;
  };

  // Location display - show city name only, fallback to N/A
  const getLocationFrom = (item) => {
    if (item.city_from) return item.city_from;
    return isRtl ? '\u063A\u064A\u0631 \u0645\u062D\u062F\u062F' : 'N/A';
  };

  const getLocationTo = (item) => {
    if (item.city_to) return item.city_to;
    return isRtl ? '\u063A\u064A\u0631 \u0645\u062D\u062F\u062F' : 'N/A';
  };

  // Period filter options
  const periodOptions = [
    { value: 'this_month', label: t('admin:tripHistory.thisMonth') },
    { value: 'last_month', label: t('admin:tripHistory.lastMonth') },
    { value: 'last_3_months', label: t('admin:tripHistory.last3Months') },
    { value: 'last_6_months', label: t('admin:tripHistory.last6Months') },
    { value: 'this_year', label: t('admin:tripHistory.thisYear') },
    { value: 'all', label: t('admin:tripHistory.allTime') },
  ];

  // PDF Download — render HTML off-screen so the browser handles Arabic shaping natively,
  // then snapshot with html2canvas and embed in jsPDF.
  const handleDownloadReport = async () => {
    const lang   = i18n.language;
    const rtl    = lang === 'ar';
    const locale = rtl ? 'ar-SA' : 'en-US';
    const tPdf   = i18n.getFixedT(lang, 'admin');          // current UI language
    const cur    = tPdf('tripHistory.currency');
    const date   = new Date().toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
    const dir    = rtl ? 'rtl' : 'ltr';

    // ── Build table rows HTML ─────────────────────────────────────────────────
    const rowsHtml = filteredItems.map((item, idx) => {
      const bg = idx % 2 === 0 ? '#ffffff' : '#f5f7fa';
      const vehicleName = item.sub_truck_id?.name || item.truck_id?.name || '-';
      const driverName  = item.driver_id?.name || '-';
      const route       = getLocationFrom(item) + ' → ' + getLocationTo(item);
      const status      = getStatusName(item.status);
      const type        = getTypeName(item.type?.id);
      const tripId      = '#TR' + String(item.id).padStart(3, '0');
      const income      = (item.driver_price || 0) + ' ' + cur;
      const cells = rtl
        ? [type, item.date || '-', income, status, route, driverName, vehicleName, tripId]
        : [tripId, vehicleName, driverName, route, status, income, item.date || '-', type];
      return `<tr style="background:${bg}">${cells.map(c => `<td style="padding:7px 6px;text-align:center;border:1px solid #dee2e6">${c}</td>`).join('')}</tr>`;
    }).join('');

    // ── Stats ─────────────────────────────────────────────────────────────────
    const stats = [
      { label: tPdf('tripHistory.totalTrips'),    value: totalTrips },
      { label: tPdf('tripHistory.totalRevenue'),  value: totalRevenue  + ' ' + cur },
      { label: tPdf('tripHistory.totalExpenses'), value: totalExpenses + ' ' + cur },
      { label: tPdf('tripHistory.netProfit'),     value: netProfit     + ' ' + cur },
    ];
    const statsHtml = stats.map(s => `
      <div style="flex:1;background:#f0f4ff;border-radius:8px;padding:10px 14px;margin:0 6px;text-align:center">
        <div style="font-size:11px;color:#6c757d;margin-bottom:4px">${s.label}</div>
        <div style="font-size:15px;font-weight:700;color:#2563eb">${s.value}</div>
      </div>`).join('');

    // ── Headers (reversed for RTL so columns match row order) ────────────────
    const headerKeys = rtl
      ? ['type','date','income','status','route','driver','vehicle','tripId']
      : ['tripId','vehicle','driver','route','status','income','date','type'];
    const headersHtml = headerKeys.map(k =>
      `<th style="padding:8px 6px;text-align:center;border:1px solid #1d4ed8;font-weight:600;white-space:nowrap">${tPdf('tripHistory.' + k)}</th>`
    ).join('');

    // ── Full HTML document ───────────────────────────────────────────────────
    const html = `
      <div id="pdf-report" style="
        width:1060px; padding:32px 36px; background:#fff; direction:${dir};
        font-family:'Cairo',Arial,sans-serif; font-size:13px; color:#212529;
        box-sizing:border-box;
      ">
        <!-- Header -->
        <div style="text-align:center;margin-bottom:6px">
          <div style="font-size:22px;font-weight:700;color:#1e3a5f">${tPdf('tripHistory.reportTitle')}</div>
          <div style="font-size:11px;color:#6c757d;margin-top:4px">${tPdf('tripHistory.generatedAt')}: ${date}</div>
        </div>
        <hr style="border:none;border-top:2px solid #2563eb;margin:12px 0"/>

        <!-- Stats -->
        <div style="display:flex;margin-bottom:18px;direction:ltr">${statsHtml}</div>

        <!-- Table -->
        <table style="width:100%;border-collapse:collapse;font-size:12px;direction:${dir}">
          <thead>
            <tr style="background:#2563eb;color:#fff">${headersHtml}</tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>

        <!-- Footer -->
        <div style="margin-top:14px;font-size:10px;color:#adb5bd;text-align:center;direction:ltr">
          Josur Logistics Platform — Trip History Report
        </div>
      </div>`;

    // ── Mount off-screen, capture, clean up ──────────────────────────────────
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'position:fixed;left:-9999px;top:0;z-index:-1';
    wrapper.innerHTML = html;
    // Inherit global <style> for the Cairo web-font already loaded on the page
    document.body.appendChild(wrapper);

    // Small delay to let fonts paint
    await new Promise(r => setTimeout(r, 300));

    try {
      const el = wrapper.querySelector('#pdf-report');
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });

      const imgData  = canvas.toDataURL('image/png');
      const pdfW     = 297;   // A4 landscape width mm
      const pdfH     = 210;   // A4 landscape height mm
      const margin   = 8;
      const maxW     = pdfW - margin * 2;
      const maxH     = pdfH - margin * 2;
      const ratio    = canvas.width / canvas.height;
      let w = maxW;
      let h = w / ratio;
      if (h > maxH) { h = maxH; w = h * ratio; }

      const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      doc.addImage(imgData, 'PNG', margin + (maxW - w) / 2, margin, w, h);
      doc.save('trip-history-report-' + new Date().toISOString().split('T')[0] + '.pdf');
    } finally {
      document.body.removeChild(wrapper);
    }
  };

  return (
    <div className="trip-history-content mt-2">
      <div className="shadow p-2 rounded-3">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h4 className="orders-title m-0">{t('admin:tripHistory.title')}</h4>
            <p className='user-desc m-0 mt-1'>{t('admin:tripHistory.subtitle')}</p>
          </div>
          <button
            type='button'
            className="login-button text-decoration-none d-flex align-items-center gap-2 justify-content-center take-img-btn"
            onClick={handleDownloadReport}
            disabled={isLoading || filteredItems.length === 0}
          > 
            <img src="/assets/document-download.svg" alt="download" /> {t('admin:tripHistory.downloadReport')}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="row">
          <div className="col-lg-3 col-md-6 mt-3">
            <div className="p-2 border rounded-3 h-100">
              <p className='user-desc m-0'>{t('admin:tripHistory.totalTrips')}</p>
              <h4 className="orders-title m-0 mt-2">{isLoading ? '...' : totalTrips}</h4>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mt-3">
            <div className="p-2 border rounded-3 h-100">
              <p className='user-desc m-0'>{t('admin:tripHistory.totalRevenue')}</p>
              <h4 className="total-earns m-0 mt-2">{isLoading ? '...' : totalRevenue + ' ' + t('admin:tripHistory.currency')}</h4>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mt-3">
            <div className="p-2 border rounded-3 h-100">
              <p className='user-desc m-0'>{t('admin:tripHistory.totalExpenses')}</p>
              <h4 className="total-expenses m-0 mt-2">{isLoading ? '...' : totalExpenses + ' ' + t('admin:tripHistory.currency')}</h4>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mt-3">
            <div className="p-2 border rounded-3 h-100">
              <p className='user-desc m-0'>{t('admin:tripHistory.netProfit')}</p>
              <h4 className="driver-card-price m-0 mt-2">{isLoading ? '...' : netProfit + ' ' + t('admin:tripHistory.currency')}</h4>
            </div>
          </div>
        </div>

        {/* Filters Row */}
        <div className="row mt-3">
          {/* Search */}
          <div className="col-md-4 mb-2">
            <div className="position-relative">
              <input
                type="text"
                className="form-control form-input py-2"
                style={{ paddingRight: isRtl ? '35px' : '12px', paddingLeft: isRtl ? '12px' : '35px' }}
                placeholder={t('admin:tripHistory.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="search-input-icon">
                <i className="fas fa-search"></i>
              </span>
            </div>
          </div>

          {/* Type Filter */}
          <div className="col-md-2 mb-2">
            <div className="mb-3">
              <div className="select-wrapper position-relative">
                <select
                  className="form-select form-input py-2"
                  style={{ paddingInlineEnd: '2.2rem' }}
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="">{t('admin:tripHistory.allTypes')}</option>
                  {Object.entries(requestTypes).map(([key, name]) => (
                    <option key={key} value={key}>{name}</option>
                  ))}
                </select>
                <div className="select-icon position-absolute top-50 translate-middle-y pe-1" style={{ insetInlineEnd: 0, pointerEvents: 'none' }}>
                  <ExpandMoreIcon />
                </div>
              </div>
            </div>
          </div>

          {/* Status Filter */}
          <div className="col-md-3 mb-2">
            <div className="mb-3">
              <div className="select-wrapper position-relative">
                <select
                  className="form-select form-input py-2"
                  style={{ paddingInlineEnd: '2.2rem' }}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">{t('admin:tripHistory.allStatuses')}</option>
                  {statusList.map((s) => (
                    <option key={s.id} value={s.id}>{isRtl ? s.name : s.name_en}</option>
                  ))}
                </select>
                <div className="select-icon position-absolute top-50 translate-middle-y pe-1" style={{ insetInlineEnd: 0, pointerEvents: 'none' }}>
                  <ExpandMoreIcon />
                </div>
              </div>
            </div>
          </div>

          {/* Period Filter */}
          <div className="col-md-3 mb-2">
            <div className="mb-3">
              <div className="select-wrapper position-relative">
                <select
                  className="form-select form-input py-2"
                  style={{ paddingInlineEnd: '2.2rem' }}
                  value={periodFilter}
                  onChange={(e) => setPeriodFilter(e.target.value)}
                >
                  {periodOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <div className="select-icon position-absolute top-50 translate-middle-y pe-1" style={{ insetInlineEnd: 0, pointerEvents: 'none' }}>
                  <ExpandMoreIcon />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">{t('admin:tripHistory.loading')}</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {isError && !isLoading && (
          <div className="alert alert-danger mt-3 d-flex justify-content-between align-items-center">
            <span>{t('admin:tripHistory.error')}</span>
            <button className="btn btn-sm btn-outline-danger" onClick={fetchOrders}>
              {t('admin:tripHistory.retry')}
            </button>
          </div>
        )}

        {/* Table */}
        {!isLoading && !isError && (
          <div className="table-responsive border rounded-2">
            <table className="table table-borderless align-middle text-center">
              <thead className="table-head">
                <tr>
                  <th>{t('admin:tripHistory.tripId')}</th>
                  <th>{t('admin:tripHistory.vehicle')}</th>
                  <th>{t('admin:tripHistory.driver')}</th>
                  <th>{t('admin:tripHistory.route')}</th>
                  <th>{t('admin:tripHistory.status')}</th>
                  <th>{t('admin:tripHistory.income')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-4 text-muted">{t('admin:tripHistory.noTrips')}</td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.id}>
                      <td className='p-2'>
                        <div className='months-filter-item'>{'#TR' + String(item.id).padStart(3, '0')}</div>
                      </td>
                      <td className='p-2'>
                        <div className='months-filter-item'>{item.sub_truck_id?.name || item.truck_id?.name || '-'}</div>
                      </td>
                      <td className='p-2'>
                        <div className='months-filter-item'>{item.driver_id?.name || '-'}</div>
                      </td>
                      <td className='p-2'>
                        <div className="from-to-wrapper">
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
                          <div className="from-to-text">
                            <span>{getLocationFrom(item)}</span>
                            <span>{getLocationTo(item)}</span>
                          </div>
                        </div>
                      </td>
                      <td className='p-2'>
                        <div className={getStatusClass(item.status) + ' py-1 px-2 rounded-2 text-nowrap text-center'}>
                          {getStatusName(item.status)}
                        </div>
                      </td>
                      <td className='p-2'>
                        <div className='datetime-part'>{(item.driver_price || 0) + ' ' + t('admin:tripHistory.currency')}</div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripHistoryComponent;
