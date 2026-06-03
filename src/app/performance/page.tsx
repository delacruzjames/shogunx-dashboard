"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, type Column } from "@/components/DataTable";
import { PageError } from "@/components/PageError";
import { PageLoader } from "@/components/PageLoader";
import { StatCard } from "@/components/StatCard";
import { api, ApiError } from "@/lib/api";
import { formatPnL, formatPercent, pnlColorClass } from "@/lib/format";
import type { DailyPnl, MonthlyPnl, Statistics } from "@/lib/types";

const dailyColumns: Column<DailyPnl>[] = [
  { key: "date", header: "Date" },
  {
    key: "profit_loss",
    header: "P/L",
    render: (row) => (
      <span className={pnlColorClass(row.profit_loss)}>
        {formatPnL(row.profit_loss)}
      </span>
    ),
  },
  { key: "trades", header: "Trades" },
  { key: "wins", header: "Wins" },
  { key: "losses", header: "Losses" },
];

const monthlyColumns: Column<MonthlyPnl>[] = [
  { key: "month", header: "Month" },
  {
    key: "profit_loss",
    header: "P/L",
    render: (row) => (
      <span className={pnlColorClass(row.profit_loss)}>
        {formatPnL(row.profit_loss)}
      </span>
    ),
  },
  { key: "trades", header: "Trades" },
  { key: "wins", header: "Wins" },
  { key: "losses", header: "Losses" },
];

export default function PerformancePage() {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getPerformance({
          daily_days: 30,
          monthly_months: 12,
        });
        if (!cancelled) setStats(data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError ? err.message : "Failed to load performance",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const summary = stats?.summary;
  const todayPnl = stats?.daily_pnl?.at(-1);
  const currentMonthPnl = stats?.monthly_pnl?.at(-1);

  return (
    <AppLayout
      title="Performance"
      description="Trade statistics, win rate, and profit/loss over time."
    >
      {loading ? <PageLoader /> : null}
      {error ? <PageError message={error} /> : null}
      {summary ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total Trades" value={summary.total_trades} />
            <StatCard label="Wins" value={summary.wins} valueClassName="text-emerald-400" />
            <StatCard label="Losses" value={summary.losses} valueClassName="text-rose-400" />
            <StatCard label="Win Rate" value={formatPercent(summary.win_rate)} />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <StatCard
              label="Daily P/L (latest)"
              value={todayPnl ? formatPnL(todayPnl.profit_loss) : "—"}
              valueClassName={pnlColorClass(todayPnl?.profit_loss)}
              hint={todayPnl ? `${todayPnl.trades} trades` : undefined}
            />
            <StatCard
              label="Monthly P/L (current)"
              value={
                currentMonthPnl ? formatPnL(currentMonthPnl.profit_loss) : "—"
              }
              valueClassName={pnlColorClass(currentMonthPnl?.profit_loss)}
              hint={currentMonthPnl?.month}
            />
          </div>
          <div className="mt-8 space-y-8">
            <section>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500">
                Daily P/L
              </h3>
              <DataTable
                columns={dailyColumns}
                data={stats?.daily_pnl ?? []}
                keyExtractor={(row) => row.date}
                emptyMessage="No daily performance data."
              />
            </section>
            <section>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500">
                Monthly P/L
              </h3>
              <DataTable
                columns={monthlyColumns}
                data={stats?.monthly_pnl ?? []}
                keyExtractor={(row) => row.month}
                emptyMessage="No monthly performance data."
              />
            </section>
          </div>
        </>
      ) : null}
    </AppLayout>
  );
}
