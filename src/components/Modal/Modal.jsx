import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import "./Modal.css";

/**
 * Accessible modal: portal to body, backdrop dismiss, Escape, scroll lock.
 * Pass `titleId` when content includes a visible title with that id, otherwise `ariaLabel`.
 */
export function Modal({
  children,
  onClose,
  titleId,
  ariaLabel,
  closeLabel = "סגור",
  showCloseButton = false,
  panelClassName = "",
  overlayClassName = "",
}) {
  const closeRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    if (showCloseButton) {
      closeRef.current?.focus();
    } else {
      panelRef.current?.focus();
    }
  }, [showCloseButton]);

  const ariaProps =
    titleId != null
      ? { "aria-labelledby": titleId }
      : { "aria-label": ariaLabel ?? "Dialog" };

  return createPortal(
    <div
      className={`modal-overlay${overlayClassName ? ` ${overlayClassName}` : ""}`}
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={panelRef}
        className={`modal__panel${panelClassName ? ` ${panelClassName}` : ""}`}
        role="dialog"
        aria-modal="true"
        {...ariaProps}
        tabIndex={showCloseButton ? undefined : -1}
        onClick={(e) => e.stopPropagation()}
      >
        {showCloseButton && (
          <button
            ref={closeRef}
            type="button"
            className="modal__close"
            onClick={onClose}
            aria-label={closeLabel}
          >
            <X size={22} strokeWidth={2} />
          </button>
        )}
        {children}
      </div>
    </div>,
    document.body
  );
}
