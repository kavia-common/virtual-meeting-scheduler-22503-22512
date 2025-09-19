import { ReactNode, useEffect, useRef } from "react";

/**
 * PUBLIC_INTERFACE
 * Modal wrapper with overlay and Esc/Backdrop close.
 */
export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open && modalRef.current) {
      modalRef.current.focus();
    }
  }, [open]);

  if (!open) return null;

  return (
    <div 
      ref={modalRef}
      className="modal-overlay" 
      role="dialog" 
      aria-modal="true"
      tabIndex={-1}
    >
      <button
        className="absolute inset-0 w-full h-full cursor-default bg-transparent"
        onClick={onClose}
        aria-label="Close modal"
      />
      <div 
        className="modal-content card relative"
        role="document"
      >
        {title ? <div className="pb-3 border-b">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div> : null}
        <div className="py-4">{children}</div>
        {footer ? <div className="pt-3 border-t flex justify-end gap-2">{footer}</div> : null}
      </div>
    </div>
  );
}
