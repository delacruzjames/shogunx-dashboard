import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: ReactNode;
  hint?: string;
  valueClassName?: string;
}

export function StatCard({ label, value, hint, valueClassName = "" }: StatCardProps) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
        {label}
      </p>
      <p className={`mt-2 text-2xl font-semibold text-zinc-100 ${valueClassName}`}>
        {value}
      </p>
      {hint ? <p className="mt-1 text-sm text-zinc-500">{hint}</p> : null}
    </div>
  );
}
