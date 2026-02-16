import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TOAST_CONFIG } from '../utils/constants';

/**
 * Toast Notification Component
 * Wrapper for react-toastify with custom configuration
 */
const ToastNotification = () => {
  return (
    <ToastContainer
      position={TOAST_CONFIG.position}
      autoClose={TOAST_CONFIG.autoClose}
      hideProgressBar={TOAST_CONFIG.hideProgressBar}
      closeOnClick={TOAST_CONFIG.closeOnClick}
      pauseOnHover={TOAST_CONFIG.pauseOnHover}
      draggable={TOAST_CONFIG.draggable}
      theme="light"
      rtl={false}
    />
  );
};

export default ToastNotification;
