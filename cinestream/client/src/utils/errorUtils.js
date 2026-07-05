/**
 * Extracts a user-friendly message from an Axios error response.
 */
export const getErrorMessage = (error, fallback = 'An unexpected error occurred') => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.response?.data?.validationErrors?.length > 0) {
    return error.response.data.validationErrors.map((e) => e.message).join(', ');
  }
  if (error?.message) {
    if (error.message === 'Network Error') {
      return 'Network error. Please check your connection.';
    }
    return error.message;
  }
  return fallback;
};

export const getValidationErrors = (error) => {
  return error?.response?.data?.validationErrors || [];
};
