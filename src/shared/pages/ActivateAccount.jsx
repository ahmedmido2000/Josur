import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useActivateMutation } from '../../api/auth/authApi';
import Navbar from '../components/Navbar';

const ActivateAccount = () => {
  const { t, i18n } = useTranslation(['auth', 'common']);
  const location = useLocation();
  const navigate = useNavigate();
  const [activate, { isLoading }] = useActivateMutation();
  
  const email = location.state?.email || '';
  const [activationCode, setActivationCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleActivate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!activationCode) {
      setError(t('auth:activateAccount.required'));
      return;
    }

    try {
      const result = await activate({ email, activation_code: activationCode }).unwrap();
      if (result.status === 1) {
        setSuccess(result.message || t('auth:activateAccount.success'));
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(result.message || t('auth:activateAccount.error'));
      }
    } catch (err) {
      setError(err.data?.message || t('auth:activateAccount.error'));
    }
  };

  return (
    <div className="login-container position-relative min-vh-100">
      <div className="login-overlay"></div>
      <Navbar />
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="login-main bg-white shadow position-relative" style={{ maxWidth: '500px' }}>
          <div className="d-flex flex-column align-items-center justify-content-center gap-3">
            <Link to='/'>
              <img src="assets/logo.png" alt="logo" />
            </Link>
            <h3 className="login-title mt-2 m-0">
              {t('auth:activateAccount.title')}
            </h3>
            <p className="login-desc text-center px-3">
              {t('auth:activateAccount.description', { email })}
            </p>

            {error && <div className="alert alert-danger w-100 text-center">{error}</div>}
            {success && <div className="alert alert-success w-100 text-center">{success}</div>}

            <form onSubmit={handleActivate} className="login-form w-100 px-4">
              <div className="mb-3">
                <label className="form-label">{t('auth:login.email')}</label>
                <input
                  type="email"
                  className="form-control form-input py-2"
                  value={email}
                  readOnly
                  disabled
                />
              </div>

              <div className="mb-4">
                <label className="form-label">{t('auth:activateAccount.code')}</label>
                <input
                  type="text"
                  className="form-control form-input py-2"
                  placeholder="123456"
                  value={activationCode}
                  onChange={(e) => setActivationCode(e.target.value)}
                />
              </div>

              <button 
                type="submit" 
                className="login-button w-100 py-2 rounded-3"
                disabled={isLoading}
              >
                {isLoading ? <span className="spinner-border spinner-border-sm"></span> : t('auth:activateAccount.button')}
              </button>

              <div className="text-center mt-3">
                <Link to="/login" className="register-link text-decoration-none small">
                  {t('auth:register.signIn')}
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivateAccount;
