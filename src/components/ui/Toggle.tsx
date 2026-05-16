"use client";

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export default function Toggle({
  label,
  checked,
  onChange,
  className = "",
}: ToggleProps) {
  return (
    <label
      className={`inline-flex cursor-pointer items-center gap-3 ${className}`}
    >
      <span className="text-sm font-medium text-slate-iron">{label}</span>
      <button
        role="switch"
        type="button"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border-2 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 ${
          checked
            ? "border-gold bg-gold shadow-gold-glow"
            : "border-border bg-border-light"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md transition-all duration-300 ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </label>
  );
}
