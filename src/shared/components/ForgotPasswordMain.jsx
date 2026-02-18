import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGetHomeDataQuery } from '../../api/site/siteApi';
import { usePasswordResetMutation } from '../../api/auth/authApi';

const ForgotPasswordMain = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const { t, i18n } = useTranslation(['auth', 'common']);
    const { data: homeData, isLoading: isHomeLoading } = useGetHomeDataQuery();
    const [passwordReset, { isLoading: isResetLoading }] = usePasswordResetMutation();

    // Helper to get localized field from API
    const getLangField = (item, field) => {
        if (!item) return '';
        const isEn = i18n.language === 'en';
        const enField = `${field}_en`;
        return (isEn && item[enField]) ? item[enField] : item[field];
    };

    // Use login section as style template or custom title
    const loginSection = homeData?.Sections?.find(s => s.id === 69);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!email) {
            setError(i18n.language === 'en' ? 'Email is required' : 'البريد الإلكتروني مطلوب');
            return;
        }

        try {
            const response = await passwordReset({ email }).unwrap();
            
            // Extract message from nested structure: response.data[0].message
            const apiData = response.status === 1 && response.data?.[0] ? response.data[0] : null;
            const apiMessage = apiData?.message || response.message;

            if (response.status === 1 && apiData?.status === 1) {
                setMessage(apiMessage || (i18n.language === 'en' ? 'Reset link sent to your email' : 'تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني'));
                setEmail('');
            } else {
                setError(apiMessage || (i18n.language === 'en' ? 'Failed to process request' : 'نسور! فشل في معالجة طلبك'));
            }
        } catch (err) {
            setError(err.data?.message || (i18n.language === 'en' ? 'An error occurred' : 'حدث خطأ ما'));
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
                        {i18n.language === 'en' ? 'Forgot Password?' : 'نسيت كلمة المرور؟'}
                    </h3>
                    <p className="login-desc m-0 text-center">
                        {i18n.language === 'en' 
                          ? 'Enter your email to receive a password reset link' 
                          : 'أدخل بريدك الإلكتروني لتلقي رابط إعادة تعيين كلمة المرور'}
                    </p>

                    <div className="divider mt-3 mb-2">
                        <span>{t('common:buttons.or', 'أو')}</span>
                    </div>

                    {error && <div className="alert alert-danger py-2 w-100 text-center" style={{ fontSize: '14px' }}>{error}</div>}
                    {message && <div className="alert alert-success py-2 w-100 text-center" style={{ fontSize: '14px' }}>{message}</div>}

                    <div className="login-form w-100">
                        <div className="mb-3">
                            <label className="form-label">{t('auth:login.email', 'البريد الإلكتروني')}</label>
                            <input
                                type="email"
                                className="form-control form-input py-2"
                                placeholder={t('auth:login.email', 'البريد الإلكتروني')}
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
                              : (i18n.language === 'en' ? 'Send Reset Link' : 'إرسال رابط التعيين')}
                        </button>

                        <div className="text-center mt-3">
                            <Link to='/login' className="register-link text-decoration-none">
                                {i18n.language === 'en' ? 'Back to Login' : 'العودة لتسجيل الدخول'}
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordMain;
