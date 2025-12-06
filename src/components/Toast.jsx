import React from "react";

import { useToast } from "../context/ToastContext";

const Toast = () => {
  const { toasts } = useToast();

  const getAlertClass = (type) => {
    switch (type) {
      case "success":
        return "alert-success";
      case "error":
        return "alert-error";
      case "warning":
        return "alert-warning";
      default:
        return "alert-info";
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div className="toast toast-end z-50">
      {toasts.map((toast) => (
        <div key={toast.id} className={`alert ${getAlertClass(toast.type)}`}>
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
};

export default Toast;

