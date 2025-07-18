import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const toastConfig = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "colored"
};

export const showToast = {
  success: (message) => toast.success(message, toastConfig),
  error: (message) => toast.error(message, toastConfig),
  info: (message) => toast.info(message, toastConfig),
  warning: (message) => toast.warn(message, toastConfig),
  loading: (message) => toast.loading(message),
  dismiss: (toastId) => toast.dismiss(toastId),
  dismissAll: () => toast.dismiss()
};

// Hook personalizado para toasts con i18n
export const useToast = () => {
  const { t } = useTranslation();

  return {
    success: (key, defaultMessage, options = {}) => 
      showToast.success(t(key, defaultMessage), { ...toastConfig, ...options }),
    error: (key, defaultMessage, options = {}) => 
      showToast.error(t(key, defaultMessage), { ...toastConfig, ...options }),
    info: (key, defaultMessage, options = {}) => 
      showToast.info(t(key, defaultMessage), { ...toastConfig, ...options }),
    warning: (key, defaultMessage, options = {}) => 
      showToast.warning(t(key, defaultMessage), { ...toastConfig, ...options }),
    loading: (key, defaultMessage) => 
      showToast.loading(t(key, defaultMessage)),
    dismiss: showToast.dismiss,
    dismissAll: showToast.dismissAll
  };
};
