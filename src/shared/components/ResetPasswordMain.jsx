import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useResetPasswordMutation, useLoginMutation } from '../../api/auth/authApi';
import { setCredentials } from '../../store/slices/authSlice';

const ResetPasswordMain = () => {
    const [token, setToken] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorKey, setErrorKey] = useState('');
    const [apiErrors, setApiErrors] = useState([]);
    const [messageKey, setMessageKey] = useState('');
    const [apiMessage, setApiMessage] = useState('');

    const { t, i18n } = useTranslation(['auth', 'common']);
    const [resetPassword, { isLoading }] = useResetPasswordMutation();
    const [login] = useLoginMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // Get email passed from ForgotPassword page
    const email = location.state?.email || '';

    const togglePassword = () => {
        setShowPassword((prev) => !prev);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorKey('');
        setApiErrors([]);
        setMessageKey('');
        setApiMessage('');

        if (!token) {
            setErrorKey('auth:resetPassword.tokenRequired');
            return;
        }

        if (!password) {
            setErrorKey('auth:resetPassword.passwordRequired');
            return;
        }

        try {
            const response = await resetPassword({ token, password }).unwrap();

            const apiData = response.data?.[0] || null;

            if (response.status === 1 && apiData?.status === 1) {
                // True success - inner status is also 1
                const successMsg = apiData?.message || '';
                if (successMsg) {
                    setApiMessage(successMsg);
                } else {
                    setMessageKey('auth:resetPassword.success');
                }

                // If the API returns login data (access_token), log in directly
                if (apiData?.access_token && apiData?.data) {
                    dispatch(setCredentials({
                        user: apiData.data,
                        token: apiData.access_token,
                    }));

                    const userType = apiData.data?.user_type;
                    setTimeout(() => {
                        if (userType === 3) {
                            navigate('/user/orders');
                        } else if (userType === 4) {
                            navigate('/driver/orders');
                        } else if (userType === 5) {
                            navigate('/admin/dashboard');
                        } else {
                            navigate('/');
                        }
                    }, 1000);
                } else if (email) {
                    // Try to log in with the new password
                    try {
                        const loginResponse = await login({ username: email, password }).unwrap();
                        const loginData = loginResponse.status === 1 && loginResponse.data?.[0]?.status === 1 ? loginResponse.data[0] : null;

                        if (loginData) {
                            dispatch(setCredentials({
                                user: loginData.data,
                                token: loginData.access_token,
                            }));

                            const userType = loginData.data?.user_type;
                            setTimeout(() => {
                                if (userType === 3) {
                                    navigate('/user/orders');
                                } else if (userType === 4) {
                                    navigate('/driver/orders');
                                } else if (userType === 5) {
                                    navigate('/admin/dashboard');
                                } else {
                                    navigate('/');
                                }
                            }, 1000);
                        } else {
                            setTimeout(() => navigate('/login'), 1500);
                        }
                    } catch {
                        setTimeout(() => navigate('/login'), 1500);
                    }
                } else {
                    // No email available, redirect to login
                    setTimeout(() => navigate('/login'), 1500);
                }
            } else {
                // Inner status is 0 or outer status is 0: show API error messages
                const errors = response.data
                    ?.map(item => item.message)
                    .filter(Boolean) || [];
                if (errors.length > 0) {
                    setApiErrors(errors);
                } else {
                    setErrorKey('auth:resetPassword.error');
                }
            }
        } catch (err) {
            // Network or unexpected errors - try to extract API messages
            const errData = err?.data || err;
            if (errData?.status === 0 && Array.isArray(errData?.data)) {
                const errors = errData.data.map(item => item.message).filter(Boolean);
                if (errors.length > 0) {
                    setApiErrors(errors);
                    return;
                }
            }
            setErrorKey('auth:resetPassword.error');
        }
    };

    return (
        <div>
            <div className="login-main bg-white shadow position-relative">
                <form onSubmit={handleSubmit} className="d-flex flex-column align-items-center justify-content-center gap-2">
                    <Link to='/'>
                        <img src="assets/logo.png" alt="logo" />
                    </Link>
                    <h3 className="login-title mt-2 m-0">
                        {t('auth:resetPassword.title')}
                    </h3>
                    <p className="login-desc m-0 text-center">
                        {t('auth:resetPassword.description')}
                    </p>

                    <div className="divider mt-3 mb-2">
                        <span>{t('common:buttons.or')}</span>
                    </div>

                    {errorKey && <div className="alert alert-danger py-2 w-100 text-center" style={{ fontSize: '14px' }}>{t(errorKey)}</div>}
                    {apiErrors.length > 0 && (
                        <div className="alert alert-danger py-2 w-100" style={{ fontSize: '14px' }}>
                            {apiErrors.map((msg, idx) => (
                                <div key={idx} className="text-center">{msg}</div>
                            ))}
                        </div>
                    )}
                    {messageKey && <div className="alert alert-success py-2 w-100 text-center" style={{ fontSize: '14px' }}>{t(messageKey)}</div>}
                    {apiMessage && <div className="alert alert-success py-2 w-100 text-center" style={{ fontSize: '14px' }}>{apiMessage}</div>}

                    <div className="login-form w-100">
                        <div className="mb-3">
                            <label className="form-label">{t('auth:resetPassword.code')}</label>
                            <input
                                type="text"
                                className="form-control form-input py-2"
                                placeholder={t('auth:resetPassword.codePlaceholder')}
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">{t('auth:resetPassword.newPassword')}</label>
                            <div className="position-relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-control form-input py-2"
                                    placeholder={t('auth:resetPassword.newPasswordPlaceholder')}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <span
                                    className="position-absolute top-50 translate-middle-y"
                                    style={{ cursor: 'pointer', left: i18n.language === 'ar' ? '12px' : 'auto', right: i18n.language === 'ar' ? 'auto' : '12px' }}
                                    onClick={togglePassword}
                                >
                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="text-muted" />
                                </span>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="login-button w-100 py-2 rounded-3"
                            disabled={isLoading}
                        >
                            {isLoading 
                              ? <span className="spinner-border spinner-border-sm"></span> 
                              : t('auth:resetPassword.submitButton')}
                        </button>

                        <div className="text-center mt-3">
                            <Link to='/login' className="register-link text-decoration-none">
                                {t('auth:resetPassword.backToLogin')}
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordMain;
