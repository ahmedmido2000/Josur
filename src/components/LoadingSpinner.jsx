import './LoadingSpinner.css';

/**
 * Loading Spinner Component
 * Reusable loading indicator with fullscreen and inline variants
 */
const LoadingSpinner = ({ 
  fullscreen = false, 
  size = 'medium',
  message = 'Loading...' 
}) => {
  if (fullscreen) {
    return (
      <div className="loading-spinner-fullscreen">
        <div className={`spinner spinner-${size}`}></div>
        {message && <p className="loading-message">{message}</p>}
      </div>
    );
  }
  
  return (
    <div className="loading-spinner-inline">
      <div className={`spinner spinner-${size}`}></div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
