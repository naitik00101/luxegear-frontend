import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  IoCheckmarkCircle,
  IoCloseCircle,
  IoInformationCircle,
  IoWarning,
  IoClose,
} from "react-icons/io5";
import { useToast } from "../../context/ToastContext";
import "./Toast.css";

const ICONS = {
  success: <IoCheckmarkCircle size={22} />,
  error: <IoCloseCircle size={22} />,
  info: <IoInformationCircle size={22} />,
  warning: <IoWarning size={22} />,
};

const ToastItem = ({ toast, onRemove }) => {
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => onRemove(toast.id), toast.duration || 3000);
    return () => clearTimeout(timerRef.current);
  }, [toast, onRemove]);

  return (
    <div className={`toast toast-${toast.type}`} role="alert">
      <span className="toast-icon">{ICONS[toast.type]}</span>
      <span className="toast-message">{toast.message}</span>
      <button
        className="toast-close"
        onClick={() => onRemove(toast.id)}
        aria-label="Close"
      >
        <IoClose size={18} />
      </button>
      <div
        className="toast-progress"
        style={{ animationDuration: `${toast.duration || 3000}ms` }}
      />
    </div>
  );
};

const Toast = () => {
  const { toasts, removeToast } = useToast();

  if (!toasts.length) return null;

  return createPortal(
    <div className="toast-container" aria-live="polite">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={removeToast} />
      ))}
    </div>,
    document.body
  );
};

export default Toast;
