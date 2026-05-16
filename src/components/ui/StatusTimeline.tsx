import { Check } from "lucide-react";

export type TimelineNodeStatus = "completed" | "active" | "pending";

interface TimelineNode {
  label: string;
  status: TimelineNodeStatus;
}

interface StatusTimelineProps {
  nodes: TimelineNode[];
  className?: string;
}

export default function StatusTimeline({
  nodes,
  className = "",
}: StatusTimelineProps) {
  return (
    <div className={`flex items-center gap-0 ${className}`}>
      {nodes.map((node, index) => (
        <div key={index} className="flex items-center">
          {/* Node */}
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                node.status === "completed"
                  ? "border-success bg-success text-white"
                  : node.status === "active"
                  ? "border-gold bg-gold/10 animate-pulse-glow"
                  : "border-border bg-surface-light text-slate-light"
              }`}
            >
              {node.status === "completed" ? (
                <Check className="h-4 w-4" />
              ) : node.status === "active" ? (
                <div className="h-2.5 w-2.5 rounded-full bg-gold" />
              ) : (
                <div className="h-2 w-2 rounded-full bg-slate-light" />
              )}
            </div>
            <span
              className={`text-[11px] font-medium max-w-[90px] text-center leading-tight ${
                node.status === "completed"
                  ? "text-success"
                  : node.status === "active"
                  ? "text-gold font-semibold"
                  : "text-slate-light"
              }`}
            >
              {node.label}
            </span>
          </div>

          {/* Connector Line */}
          {index < nodes.length - 1 && (
            <div
              className={`h-0.5 w-10 mx-1 -mt-5 transition-all duration-500 ${
                node.status === "completed"
                  ? "bg-success"
                  : node.status === "active"
                  ? "bg-gradient-to-r from-gold to-border"
                  : "bg-border"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
