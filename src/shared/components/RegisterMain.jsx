import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGetHomeDataQuery } from '../../api/site/siteApi';
import { useRegisterMutation, useGetListsQuery } from '../../api/auth/authApi';

const RegisterMain = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(['auth', 'common']);
  
  const [formData, setFormData] = useState({
    name: '',
    last_name: '',
    username: '',
    email: '',
    mobile: '',
    password: '',
    password_repeat: '',
    country_id: '',
    city_id: '',
    item1: 0
  });

  const [error, setError] = useState('');
  const { data: homeData, isLoading: homeLoading } = useGetHomeDataQuery();
  const { data: listsData, isLoading: listsLoading } = useGetListsQuery();
  const [register, { isLoading: registerLoading }] = useRegisterMutation();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.password_repeat) {
      setError(i18n.language === 'en' ? 'Passwords do not match' : 'كلمات المرور غير متطابقة');
      return;
    }

    if (!formData.item1) {
      setError(i18n.language === 'en' ? 'You must agree to the terms' : 'يجب الموافقة على الشروط والأحكام');
      return;
    }

    try {
      const result = await register(formData).unwrap();
      // Handle potential nested structure similar to login
      const registerData = result.status === 1 && result.data?.[0]?.status === 1 ? result.data[0] : (result.status === 1 ? result : null);
      
      if (registerData && (registerData.status === 1 || result.status === 1)) {
        navigate('/activate-account', { state: { email: formData.email } });
      } else {
        const backendMsg = result.data?.[0]?.message || result.message;
        setError(backendMsg || (i18n.language === 'en' ? 'Registration failed' : 'فشل التسجيل'));
      }
    } catch (err) {
      // Prioritize identifying the exact backend error message
      const backendError = err.data?.data?.[0]?.message || err.data?.message;
      setError(backendError || (i18n.language === 'en' ? 'An error occurred during registration' : 'حدث خطأ أثناء التسجيل'));
    }
  };

  // Helper to get localized field from API with fallback for bad API data
  const getLangField = (item, field) => {
    if (!item) return '';
    const isEn = i18n.language && i18n.language.startsWith('en');
    const enField = `${field}_en`;
    const arField = `${field}_ar`;
    
    if (isEn) {
      // If English field is missing or same as Arabic (untranslated by API), return null to use local fallback
      if (!item[enField] || item[enField] === item[field]) return null;
      return item[enField];
    } else {
      return item[arField] || item[field];
    }
  };

  const registerSection = homeData?.Sections?.find(s => s.id === 70);

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const filteredCities = listsData?.city?.filter(c => c.country_id.toString() === formData.country_id.toString()) || [];

  const isEn = i18n.language && i18n.language.startsWith('en');

  return (
    <div>
      <div className="login-main bg-white shadow position-relative">
        <form onSubmit={handleRegister} className="d-flex flex-column align-items-center justify-content-center gap-2">
          <Link to='/'>
            <img src="assets/logo.png" alt="logo" />
          </Link>
          <h3 className="login-title mt-2 m-0 text-center">
            {homeLoading ? '...' : (getLangField(registerSection, 'title') || t('auth:register.title'))}
          </h3>
          <p className="login-desc m-0 text-center">
            {homeLoading ? '...' : (getLangField(registerSection, 'content') || t('auth:register.description'))}
          </p>

          {/* Google Login */}
          <div className="google-sign d-flex justify-content-center align-items-center gap-2 mt-2">
            <img src="assets/google.svg" alt="google" />
            <h4 className="m-0">
              {t('auth:login.googleLogin', i18n.language === 'en' ? 'Sign in with Google' : 'سجل الدخول باستخدام Google')}
            </h4>
          </div>

          {/* Divider */}
          <div className="divider">
            <span>{t('common:buttons.or', i18n.language === 'en' ? 'Or' : 'أو')}</span>
          </div>

          {error && <div className="alert alert-danger w-100 text-center py-2" style={{fontSize: '14px'}}>{error}</div>}

          {/* Inputs */}
          <div className="login-form">
            <div className="row">
              <div className="col-md-6">
                <div className="mb-2">
                  <label className="form-label">
                    {t('auth:register.firstName', i18n.language === 'en' ? 'First Name' : 'الاسم الأول')}
                  </label>
                  <input
                    name="name"
                    type="text"
                    className="form-control form-input py-2"
                    placeholder={i18n.language === 'en' ? 'First Name' : 'الاسم الأول'}
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-2">
                  <label className="form-label">
                    {t('auth:register.lastName', i18n.language === 'en' ? 'Last Name' : 'اسم العائلة')}
                  </label>
                  <input
                    name="last_name"
                    type="text"
                    className="form-control form-input py-2"
                    placeholder={i18n.language === 'en' ? 'Last Name' : 'اسم العائلة'}
                    value={formData.last_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="mb-2">
                  <label className="form-label">
                    {i18n.language === 'en' ? 'Username' : 'اسم المستخدم'}
                  </label>
                  <input
                    name="username"
                    type="text"
                    className="form-control form-input py-2"
                    placeholder={i18n.language === 'en' ? 'Username' : 'اسم المستخدم'}
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-2">
                  <label className="form-label">
                    {i18n.language === 'en' ? 'Mobile Number' : 'رقم الجوال'}
                  </label>
                  <input
                    name="mobile"
                    type="text"
                    className="form-control form-input py-2"
                    placeholder="05xxxxxxxx"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="mb-2">
              <label className="form-label">
                {t('auth:register.email', i18n.language === 'en' ? 'Email' : 'البريد الإلكتروني')}
              </label>
              <input
                name="email"
                type="email"
                className="form-control form-input py-2"
                placeholder={t('auth:register.email')}
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="mb-2">
                  <label className="form-label">
                    {t('auth:register.password', i18n.language === 'en' ? 'Password' : 'كلمة المرور')}
                  </label>
                  <div className="position-relative">
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      className="form-control form-input py-2"
                      placeholder={t('auth:register.password')}
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                    <FontAwesomeIcon
                      icon={showPassword ? faEyeSlash : faEye}
                      className="password-toggle"
                      onClick={togglePassword}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-2">
                  <label className="form-label">
                    {i18n.language === 'en' ? 'Repeat Password' : 'تكرار كلمة المرور'}
                  </label>
                  <input
                    name="password_repeat"
                    type={showPassword ? 'text' : 'password'}
                    className="form-control form-input py-2"
                    placeholder={i18n.language === 'en' ? 'Repeat Password' : 'تكرار كلمة المرور'}
                    value={formData.password_repeat}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="mb-2">
                  <label className="form-label">{t('auth:register.country', i18n.language === 'en' ? 'Country' : 'الدولة')}</label>
                  <select 
                    name="country_id" 
                    className="form-select form-input py-2"
                    value={formData.country_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">{i18n.language === 'en' ? 'Select Country' : 'اختر الدولة'}</option>
                    {listsData?.Country?.map(c => (
                      <option key={c.id} value={c.id}>{getLangField(c, 'name')}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-2">
                  <label className="form-label">{i18n.language === 'en' ? 'City' : 'المدينة'}</label>
                  <select 
                    name="city_id" 
                    className="form-select form-input py-2"
                    value={formData.city_id}
                    onChange={handleInputChange}
                    required
                    disabled={!formData.country_id}
                  >
                    <option value="">{i18n.language === 'en' ? 'Select City' : 'اختر المدينة'}</option>
                    {filteredCities.map(c => (
                      <option key={c.id} value={c.id}>{getLangField(c, 'name')}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-1 mb-3">
              <input
                type="checkbox"
                id="agree"
                name="item1"
                checked={formData.item1 === 1}
                onChange={handleInputChange}
              />
              <label htmlFor="agree" className="not-have m-0">
                {i18n.language === 'en' ? 'By creating an account, you agree to our ' : 'من خلال إنشاء حساب، فإنك توافق على '}
                <a href="#" className="text-decoration-none register-link">
                  {i18n.language === 'en' ? 'Terms and Conditions' : 'الشروط والأحكام'}
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="login-button w-100 py-2 rounded-3"
              disabled={registerLoading}
            >
              {registerLoading ? <span className="spinner-border spinner-border-sm"></span> : t('auth:register.registerButton', i18n.language === 'en' ? 'Register' : 'إنشاء حساب')}
            </button>

            {/* Login Link */}
            <div className="text-center mt-2">
              <span className='not-have'>
                {t('auth:register.haveAccount', i18n.language === 'en' ? 'Already have an account?' : 'لديك حساب بالفعل؟')} 
              </span>
              <Link to='/login' className="register-link text-decoration-none">
                {t('auth:register.signIn', i18n.language === 'en' ? 'Sign In' : 'تسجيل الدخول')}
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterMain;

