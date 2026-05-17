"use client";

import { useMico } from "@/lib/store/mico-store";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const bgMap = {
  success: "bg-success/10 border-success/30 text-success",
  error: "bg-error/10 border-error/30 text-error",
  warning: "bg-gold-50 border-gold/30 text-gold",
  info: "bg-pine-50 border-pine/30 text-pine",
};

export default function ToastContainer() {
  const { state, dismissToast } = useMico();

  if (state.toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 max-w-sm">
      {state.toasts.map((toast) => {
        const Icon = iconMap[toast.type];
        return (
          <div
            key={toast.id}
            className={`flex items-start gap-3 rounded-xl border px-4 py-3 shadow-elevated backdrop-blur-sm animate-slide-in-right ${bgMap[toast.type]}`}
          >
            <Icon className="h-5 w-5 shrink-0 mt-0.5" />
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => dismissToast(toast.id)}
              className="shrink-0 rounded-lg p-0.5 opacity-60 hover:opacity-100 transition-opacity"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
