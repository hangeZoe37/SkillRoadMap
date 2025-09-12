import React from 'react';
import { toast } from 'react-toastify';

// Custom toast component for better styling
export const showToast = (message, type = 'info', duration = 3000) => {
  const toastConfig = {
    position: "top-right",
    autoClose: duration,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  switch (type) {
    case 'success':
      toast.success(message, {
        ...toastConfig,
        style: {
          background: 'linear-gradient(135deg, #10b981, #059669)',
          color: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
        },
      });
      break;
    case 'error':
      toast.error(message, {
        ...toastConfig,
        style: {
          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
          color: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(239, 68, 68, 0.3)',
        },
      });
      break;
    case 'warning':
      toast.warning(message, {
        ...toastConfig,
        style: {
          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
          color: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(245, 158, 11, 0.3)',
        },
      });
      break;
    case 'info':
    default:
      toast.info(message, {
        ...toastConfig,
        style: {
          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
          color: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)',
        },
      });
      break;
  }
};

// Success toast with custom styling
export const showSuccessToast = (message) => showToast(message, 'success');
export const showErrorToast = (message) => showToast(message, 'error');
export const showWarningToast = (message) => showToast(message, 'warning');
export const showInfoToast = (message) => showToast(message, 'info');

export default { showToast, showSuccessToast, showErrorToast, showWarningToast, showInfoToast };
