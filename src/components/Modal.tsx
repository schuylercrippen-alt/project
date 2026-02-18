import React from "react";

interface ModalProps {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ open, title, onClose, children }: ModalProps) {
  if (!open) return null;

  return (
    <div role="dialog" aria-modal="true" aria-labelledby={title ? "modal-title" : undefined}>
      <div onClick={onClose} aria-hidden="true" />
      <div>
        {title && <h2 id="modal-title">{title}</h2>}
        <button aria-label="Close" onClick={onClose}>✕</button>
        {children}
      </div>
    </div>
  );
}
