import React from "react";
import { useToast } from "../context/ToastContext";

const Toast = () => {
  const { toasts, removeToast } = useToast();

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

  /** Semi-transparent surface so content behind shows through (mobile + desktop). */
  const getGlassSurface = (type) => {
    switch (type) {
      case "success":
        return "border-success/35 !bg-success/78";
      case "error":
        return "border-error/35 !bg-error/78";
      case "warning":
        return "border-warning/35 !bg-warning/78";
      default:
        return "border-info/35 !bg-info/78";
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return (
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "error":
        return (
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "warning":
        return (
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-4 z-50 grid justify-items-center px-3 sm:inset-x-auto sm:right-4 sm:justify-items-end sm:px-0"
      aria-live="polite"
      aria-relevant="additions"
    >
      <div className="grid w-full max-w-md grid-cols-1 grid-rows-1">
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            className="col-start-1 row-start-1 w-full max-w-md justify-self-center sm:justify-self-end"
            style={{ zIndex: 10 + index }}
          >
            <div
              className={`alert pointer-events-auto ${getAlertClass(
                toast.type
              )} ${getGlassSurface(
                toast.type
              )} border backdrop-blur-md shadow-lg animate-[toast-in_0.3s_ease-out] w-full`}
            >
              {getIcon(toast.type)}
              <span className="text-xs sm:text-sm flex-grow">{toast.message}</span>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="btn btn-sm btn-ghost btn-circle"
                aria-label="Dismiss notification"
                title="Dismiss"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Toast;

