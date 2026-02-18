import React from "react";
import { toast } from "react-toastify";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

/**
 * Custom Toast Component
 * @param {Object} props
 * @param {string} props.title - Title of the toast
 * @param {string} props.message - Main message
 * @param {'success'|'error'|'warning'|'info'} props.type - Type of toast
 * @param {Function} props.closeToast - Function to close the toast (injected by react-toastify)
 */
const StyledToast = ({ title, message, type, closeToast }) => {
  const styles = {
    success: {
      icon: (
        <CheckCircle className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
      ),
      container:
        "bg-emerald-50/90 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800",
      title: "text-emerald-800 dark:text-emerald-300",
      body: "text-emerald-600 dark:text-emerald-400",
      progress: "bg-emerald-500",
    },
    error: {
      icon: <XCircle className="w-6 h-6 text-rose-500 dark:text-rose-400" />,
      container:
        "bg-rose-50/90 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800",
      title: "text-rose-800 dark:text-rose-300",
      body: "text-rose-600 dark:text-rose-400",
      progress: "bg-rose-500",
    },
    warning: {
      icon: (
        <AlertTriangle className="w-6 h-6 text-amber-500 dark:text-amber-400" />
      ),
      container:
        "bg-amber-50/90 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800",
      title: "text-amber-800 dark:text-amber-300",
      body: "text-amber-600 dark:text-amber-400",
      progress: "bg-amber-500",
    },
    info: {
      icon: <Info className="w-6 h-6 text-blue-500 dark:text-blue-400" />,
      container:
        "bg-blue-50/90 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800",
      title: "text-blue-800 dark:text-blue-300",
      body: "text-blue-600 dark:text-blue-400",
      progress: "bg-blue-500",
    },
  };

  const currentStyle = styles[type] || styles.info;

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl border backdrop-blur-md p-4 shadow-lg transition-all duration-300 hover:shadow-xl ${currentStyle.container}`}
      role="alert"
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="shrink-0 mt-0.5">{currentStyle.icon}</div>

        {/* Content */}
        <div className="flex-1 space-y-1">
          {title && (
            <h3
              className={`font-semibold text-sm leading-none tracking-tight ${currentStyle.title}`}
            >
              {title}
            </h3>
          )}
          <div className={`text-sm opacity-90 ${currentStyle.body}`}>
            {message}
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={closeToast}
          className="shrink-0 rounded-md p-1 opacity-60 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background group"
          aria-label="Close"
        >
          <X className={`h-4 w-4 ${currentStyle.title}`} />
        </button>
      </div>

      {/* Optional decorative blurry blob */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/10 rounded-full blur-2xl pointer-events-none" />
    </div>
  );
};

// Helper utility to launch toasts easily
export const showToast = {
  success: (message, options = {}) => {
    toast(
      <StyledToast
        message={message}
        type="success"
        title={options.title || "Success"}
      />,
      { ...options },
    );
  },
  error: (message, options = {}) => {
    toast(
      <StyledToast
        message={message}
        type="error"
        title={options.title || "Error"}
      />,
      { ...options },
    );
  },
  warning: (message, options = {}) => {
    toast(
      <StyledToast
        message={message}
        type="warning"
        title={options.title || "Warning"}
      />,
      { ...options },
    );
  },
  info: (message, options = {}) => {
    toast(
      <StyledToast
        message={message}
        type="info"
        title={options.title || "Info"}
      />,
      { ...options },
    );
  },
};

export default StyledToast;
