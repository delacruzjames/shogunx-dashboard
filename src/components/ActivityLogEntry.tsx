"use client";

import { formatDateTime } from "@/lib/format";
import type { ActivityLog } from "@/lib/types";

const levelBubble: Record<string, string> = {
  success: "bg-emerald-950/80 ring-emerald-500/25",
  warn: "bg-amber-950/80 ring-amber-500/25",
  error: "bg-red-950/80 ring-red-500/25",
  info: "bg-zinc-900/90 ring-zinc-700/50",
};

export const activityCategoryMeta: Record<
  string,
  { label: string; badge: string; dot: string }
> = {
  snapshot: { label: "MT4", badge: "bg-sky-500/20 text-sky-200", dot: "bg-sky-400" },
  analysis: { label: "Brain", badge: "bg-violet-500/20 text-violet-200", dot: "bg-violet-400" },
  risk: { label: "Risk", badge: "bg-amber-500/20 text-amber-200", dot: "bg-amber-400" },
  orders: { label: "Orders", badge: "bg-emerald-500/20 text-emerald-200", dot: "bg-emerald-400" },
  execution: { label: "Exec", badge: "bg-zinc-500/20 text-zinc-200", dot: "bg-zinc-400" },
  system: { label: "System", badge: "bg-zinc-600/20 text-zinc-300", dot: "bg-zinc-500" },
};

type ActivityLogEntryProps = {
  log: ActivityLog;
};

export function ActivityLogEntry({ log }: ActivityLogEntryProps) {
  const meta = activityCategoryMeta[log.category] ?? activityCategoryMeta.system;

  return (
    <div className="flex gap-2.5">
      <div
        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${meta.dot}`}
        title={meta.label}
        aria-hidden
      />
      <div
        className={`min-w-0 flex-1 rounded-2xl rounded-tl-sm px-3 py-2 ring-1 ring-inset ${levelBubble[log.level] ?? levelBubble.info}`}
      >
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
          <span className={`rounded px-1.5 py-0.5 font-medium ${meta.badge}`}>{meta.label}</span>
          <time className="text-zinc-500" dateTime={log.created_at}>
            {formatDateTime(log.created_at)}
          </time>
          {log.trade_signal_id ? (
            <span className="text-zinc-600">#{log.trade_signal_id}</span>
          ) : null}
          {log.order_id ? <span className="text-zinc-600">ord {log.order_id}</span> : null}
        </div>
        <p className="mt-1 text-sm leading-snug text-zinc-100">{log.message}</p>
      </div>
    </div>
  );
}
