/**
 * Pure validation utilities for form fields.
 * Returns an error message string, or undefined if valid.
 */

export const validateEmail = (value) => {
  if (!value) return 'Email is required';
  if (!/^\S+@\S+\.\S+$/.test(value)) return 'Enter a valid email address';
  return undefined;
};

export const validatePassword = (value) => {
  if (!value) return 'Password is required';
  if (value.length < 8) return 'Password must be at least 8 characters';
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value))
    return 'Must contain uppercase, lowercase, and a number';
  return undefined;
};

export const validateRequired = (label) => (value) => {
  if (!value?.toString().trim()) return `${label} is required`;
  return undefined;
};

export const validateMinLength = (min) => (value) => {
  if (value && value.length < min) return `Must be at least ${min} characters`;
  return undefined;
};

export const validateMaxLength = (max) => (value) => {
  if (value && value.length > max) return `Cannot exceed ${max} characters`;
  return undefined;
};

export const validatePasswordMatch = (passwordValue) => (confirmValue) => {
  if (confirmValue !== passwordValue) return 'Passwords do not match';
  return undefined;
};
