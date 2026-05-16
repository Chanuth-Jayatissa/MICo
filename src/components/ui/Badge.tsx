interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "gold" | "success" | "outline";
  size?: "sm" | "md";
  className?: string;
}

export default function Badge({
  children,
  variant = "default",
  size = "md",
  className = "",
}: BadgeProps) {
  const variantClasses = {
    default:
      "bg-surface-light border border-border text-slate-iron",
    gold:
      "bg-gold-50 border border-gold/30 text-gold font-semibold",
    success:
      "bg-success/10 border border-success/30 text-success",
    outline:
      "bg-transparent border border-slate-light text-slate-muted",
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[11px]",
    md: "px-3 py-1 text-xs",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium transition-all duration-200 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </span>
  );
}
