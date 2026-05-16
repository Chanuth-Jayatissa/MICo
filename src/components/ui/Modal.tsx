"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in-up"
      style={{ animationDuration: "0.2s" }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-iron/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={`relative w-full ${sizeClasses[size]} rounded-2xl bg-white p-6 shadow-elevated animate-scale-in`}
        style={{ animationDuration: "0.25s" }}
      >
        {/* Header */}
        {title && (
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-slate-iron">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-muted transition-all duration-200 hover:bg-surface-light hover:text-slate-iron"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Close button if no title */}
        {!title && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-slate-muted transition-all duration-200 hover:bg-surface-light hover:text-slate-iron"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Body */}
        {children}
      </div>
    </div>
  );
}
