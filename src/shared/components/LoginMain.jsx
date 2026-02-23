import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useGetHomeDataQuery } from '../../api/site/siteApi';
import { useLoginMutation } from '../../api/auth/authApi';
import { setCredentials } from '../../store/slices/authSlice';

const LoginMain = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { t, i18n } = useTranslation(['auth', 'common']);
  const { data: homeData, isLoading: isHomeLoading } = useGetHomeDataQuery();
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const loginSection = homeData?.Sections?.find(s => s.id === 69);

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError(t('auth:login.errors.required', 'يرجى إدخال اسم المستخدم وكلمة المرور'));
      return;
    }

    try {
      const response = await login({ username, password }).unwrap();
      
      // Handle the nested structure from the API response
      // Response: { status: 1, data: [ { status: 1, access_token: "...", data: { user_id: ... } } ] }
      const loginData = response.status === 1 && response.data?.[0]?.status === 1 ? response.data[0] : null;

      if (loginData) {
        const userData = loginData.data;
        
        dispatch(setCredentials({
          user: userData,
          token: loginData.access_token
        }));
        
        // Redirect based on user_type
        const userType = userData?.user_type;
        
        if (userType === 3) {
          // عميل - Client/User
          navigate('/user/orders');
        } else if (userType === 4) {
          // سائق - Driver
          navigate('/driver/orders');
        } else if (userType === 5) {
          // مالك/أدمن - Owner/Admin
          navigate('/admin/dashboard');
        } else {
          // Default fallback
          navigate('/');
        }
      } else {
        // Correctly extract the message from the nested structure
        const backendMsg = response.data?.[0]?.message || response.message;
        setError(backendMsg || t('auth:login.errors.failed'));
      }
    } catch (err) {
      // Prioritize identifying the exact backend error message
      const backendError = err.data?.data?.[0]?.message || err.data?.message;
      setError(backendError || t('auth:login.errors.invalid', 'خطأ في اسم المستخدم أو كلمة المرور'));
    }
  };

  const isEn = i18n.language && i18n.language.startsWith('en');

  return (
    <div>
      <div className="login-main bg-white shadow position-relative">
        <form onSubmit={handleLogin} className="d-flex flex-column align-items-center justify-content-center gap-2">
          <Link to='/'>
            <img src="assets/logo.png" alt="logo" />
          </Link>
          <h3 className="login-title mt-2 m-0 text-center">
            {isHomeLoading ? '...' : (getLangField(loginSection, 'title') || t('auth:login.title'))}
          </h3>
          <p className="login-desc m-0 text-center">
            {isHomeLoading ? '...' : (getLangField(loginSection, 'content') || t('auth:login.description'))}
          </p>

          {/* Google Login */}
          <div className="google-sign d-flex justify-content-center align-items-center gap-2 mt-2">
            <img src="assets/google.svg" alt="google" />
            <h4 className="m-0">{t('auth:login.googleLogin')}</h4>
          </div>

          {/* Divider */}
          <div className="divider">
            <span>{t('common:buttons.or')}</span>
          </div>

          {error && <div className="alert alert-danger py-2 w-100 text-center" style={{ fontSize: '14px' }}>{error}</div>}

          {/* Inputs */}
          <div className="login-form">
            {/* Mobile Number/Email - Shown as Email to UI but sent as 'username' */}
            <div className="mb-2">
              <label className="form-label">{t('auth:login.email')}</label>
              <input
                type="text"
                className="form-control form-input py-2"
                placeholder={t('auth:login.email')}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="mb-2">
              <label className="form-label">{t('auth:login.password')}</label>
              <div className="position-relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control form-input py-2"
                  placeholder={t('auth:login.password')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  className="password-toggle"
                  onClick={togglePassword}
                />
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-start mb-2">
              <Link to='/forgot-password' className="forgot-link text-decoration-none">
                {t('auth:login.forgotPassword')}
              </Link>
            </div>

            {/* Login Button */}
            <button 
              type="submit" 
              className="login-button w-100 py-2 rounded-3 d-flex justify-content-center align-items-center"
              disabled={isLoginLoading}
            >
              {isLoginLoading ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              ) : t('auth:login.loginButton')}
            </button>

            {/* Register Link */}
            <div className="text-center mt-2">
              <span className='not-have'>{t('auth:login.noAccount')} </span>
              <Link to='/create-account' className="register-link text-decoration-none">
                {t('auth:login.signUp')}
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginMain;
