import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePasswordResetMutation } from '../../api/auth/authApi';

const ForgotPasswordMain = () => {
    const [email, setEmail] = useState('');
    const [messageKey, setMessageKey] = useState('');
    const [errorKey, setErrorKey] = useState('');

    const { t } = useTranslation(['auth', 'common']);

    const [passwordReset, { isLoading: isResetLoading }] = usePasswordResetMutation();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorKey('');
        setMessageKey('');

        if (!email) {
            setErrorKey('auth:forgotPassword.emailRequired');
            return;
        }

        try {
            const response = await passwordReset({ email }).unwrap();
            
            // Extract message from nested structure: response.data[0].message
            const apiData = response.status === 1 && response.data?.[0] ? response.data[0] : null;

            if (response.status === 1 && apiData?.status === 1) {
                setMessageKey('auth:forgotPassword.success');
                // Redirect to reset-password page after a short delay, passing email
                setTimeout(() => {
                    navigate('/reset-password', { state: { email } });
                }, 1500);
            } else {
                setErrorKey('auth:forgotPassword.error');
            }
        } catch {
            setErrorKey('auth:forgotPassword.genericError');
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
                        {t('auth:forgotPassword.title')}
                    </h3>
                    <p className="login-desc m-0 text-center">
                        {t('auth:forgotPassword.description')}
                    </p>

                    <div className="divider mt-3 mb-2">
                        <span>{t('common:buttons.or')}</span>
                    </div>

                    {errorKey && <div className="alert alert-danger py-2 w-100 text-center" style={{ fontSize: '14px' }}>{t(errorKey)}</div>}
                    {messageKey && <div className="alert alert-success py-2 w-100 text-center" style={{ fontSize: '14px' }}>{t(messageKey)}</div>}

                    <div className="login-form w-100">
                        <div className="mb-3">
                            <label className="form-label">{t('auth:login.email')}</label>
                            <input
                                type="email"
                                className="form-control form-input py-2"
                                placeholder={t('auth:login.email')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="login-button w-100 py-2 rounded-3"
                            disabled={isResetLoading}
                        >
                            {isResetLoading 
                              ? <span className="spinner-border spinner-border-sm"></span> 
                              : t('auth:forgotPassword.sendButton')}
                        </button>

                        <div className="text-center mt-3">
                            <Link to='/login' className="register-link text-decoration-none">
                                {t('auth:forgotPassword.backToLogin')}
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordMain;
