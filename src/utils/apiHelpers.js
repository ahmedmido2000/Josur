/**
 * API Helper Utilities
 * Common functions for API request/response handling
 */

/**
 * Extract error message from API error response
 * @param {object} error - Error object from RTK Query or fetch
 * @returns {string} - User-friendly error message
 */
export const getErrorMessage = (error) => {
  // RTK Query error structure
  if (error?.data?.message) {
    return error.data.message;
  }
  
  // Standard error message
  if (error?.data?.error) {
    return error.data.error;
  }
  
  // Validation errors (array of errors)
  if (error?.data?.errors && Array.isArray(error.data.errors)) {
    return error.data.errors.map(err => err.message || err).join(', ');
  }
  
  // Network error
  if (error?.status === 'FETCH_ERROR') {
    return 'Network error. Please check your connection.';
  }
  
  // Timeout error
  if (error?.status === 'TIMEOUT_ERROR') {
    return 'Request timeout. Please try again.';
  }
  
  // Generic error message
  if (error?.message) {
    return error.message;
  }
  
  // HTTP status-based messages
  if (error?.status) {
    switch (error.status) {
      case 400:
        return 'Bad request. Please check your input.';
      case 401:
        return 'Unauthorized. Please login again.';
      case 403:
        return 'Access forbidden. You do not have permission.';
      case 404:
        return 'Resource not found.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return `Error: ${error.status}`;
    }
  }
  
  return 'An unexpected error occurred.';
};

/**
 * Build query string from object
 * @param {object} params - Query parameters object
 * @returns {string} - Query string
 */
export const buildQueryString = (params) => {
  if (!params || Object.keys(params).length === 0) {
    return '';
  }
  
  const queryString = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map(v => `${encodeURIComponent(key)}[]=${encodeURIComponent(v)}`).join('&');
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .join('&');
  
  return queryString ? `?${queryString}` : '';
};

/**
 * Format API response data
 * @param {object} response - API response
 * @returns {object} - Formatted response
 */
export const formatResponse = (response) => {
  return {
    data: response?.data || response,
    message: response?.message || 'Success',
    success: response?.success !== undefined ? response.success : true,
  };
};

/**
 * Check if response indicates success
 * @param {object} response - API response
 * @returns {boolean} - True if successful
 */
export const isSuccessResponse = (response) => {
  return response?.success !== false && (response?.status === 200 || response?.status === 201);
};

/**
 * Prepare FormData for file uploads
 * @param {object} data - Data object with files
 * @returns {FormData} - FormData object
 */
export const prepareFormData = (data) => {
  const formData = new FormData();
  
  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof File || value instanceof Blob) {
      formData.append(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (item instanceof File || item instanceof Blob) {
          formData.append(`${key}[${index}]`, item);
        } else {
          formData.append(`${key}[${index}]`, JSON.stringify(item));
        }
      });
    } else if (typeof value === 'object' && value !== null) {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value);
    }
  });
  
  return formData;
};
