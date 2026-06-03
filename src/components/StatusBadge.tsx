type BadgeVariant = "default" | "success" | "warning" | "danger" | "info";

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-zinc-700/60 text-zinc-200 ring-zinc-600/50",
  success: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
  warning: "bg-amber-500/15 text-amber-300 ring-amber-500/30",
  danger: "bg-rose-500/15 text-rose-300 ring-rose-500/30",
  info: "bg-sky-500/15 text-sky-300 ring-sky-500/30",
};

function resolveVariant(status: string): BadgeVariant {
  const normalized = status.toLowerCase();

  if (
    ["open", "pending", "active", "buy", "buy_limit", "buy_stop"].some((s) =>
      normalized.includes(s),
    )
  ) {
    return normalized.includes("pending") ? "warning" : "success";
  }
  if (["closed", "filled", "executed", "win"].some((s) => normalized.includes(s))) {
    return "success";
  }
  if (["hold", "cancelled", "canceled", "expired", "rejected"].some((s) => normalized.includes(s))) {
    return normalized.includes("hold") ? "info" : "danger";
  }
  if (["sell", "sell_limit", "sell_stop", "loss"].some((s) => normalized.includes(s))) {
    return normalized.includes("loss") ? "danger" : "warning";
  }

  return "default";
}

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const variant = resolveVariant(status);

  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${variantStyles[variant]} ${className}`}
    >
      {status}
    </span>
  );
}
