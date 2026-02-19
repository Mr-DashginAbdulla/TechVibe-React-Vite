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
      icon: <CheckCircle className="w-6 h-6 text-success" />,
      container: "bg-success/10 border-success/20",
      title: "text-success",
      body: "text-success/80",
      progress: "bg-success",
    },
    error: {
      icon: <XCircle className="w-6 h-6 text-destructive" />,
      container: "bg-destructive/10 border-destructive/20",
      title: "text-destructive",
      body: "text-destructive/80",
      progress: "bg-destructive",
    },
    warning: {
      icon: <AlertTriangle className="w-6 h-6 text-warning" />,
      container: "bg-warning/10 border-warning/20",
      title: "text-warning",
      body: "text-warning/80",
      progress: "bg-warning",
    },
    info: {
      icon: <Info className="w-6 h-6 text-info" />,
      container: "bg-info/10 border-info/20",
      title: "text-info",
      body: "text-info/80",
      progress: "bg-info",
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
