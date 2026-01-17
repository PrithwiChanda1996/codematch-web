import React from "react";

const Modal = ({
  isOpen,
  onClose,
  title,
  message,
  confirmText = "Yes",
  cancelText = "No",
  onConfirm,
  confirmButtonClass = "btn-error",
  cancelButtonClass = "btn-ghost",
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  const handleCancel = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        {title && <h3 className="font-bold text-lg">{title}</h3>}
        {message && <p className="py-4">{message}</p>}
        <div className="modal-action">
          <button onClick={handleCancel} className={`btn ${cancelButtonClass}`}>
            {cancelText}
          </button>
          <button onClick={handleConfirm} className={`btn ${confirmButtonClass}`}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
