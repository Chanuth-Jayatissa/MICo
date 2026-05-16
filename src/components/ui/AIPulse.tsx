interface AIPulseProps {
  label?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function AIPulse({
  label,
  className = "",
  size = "md",
}: AIPulseProps) {
  const sizeClasses = {
    sm: "h-2 w-2",
    md: "h-3 w-3",
    lg: "h-4 w-4",
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative">
        <div
          className={`${sizeClasses[size]} rounded-full bg-gold animate-pulse-glow`}
        />
        {/* Outer ring pulse */}
        <div
          className={`absolute inset-0 ${sizeClasses[size]} rounded-full bg-gold/30 animate-ping`}
          style={{ animationDuration: "2s" }}
        />
      </div>
      {label && (
        <span className="text-sm text-slate-muted font-medium">
          {label}
        </span>
      )}
    </div>
  );
}
