"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { PageError } from "@/components/PageError";
import { PageLoader } from "@/components/PageLoader";
import { ActivityFeed } from "@/components/ActivityFeed";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { api, ApiError } from "@/lib/api";
import type { DashboardData } from "@/lib/types";
import { formatPnL, formatPrice, pnlColorClass } from "@/lib/format";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const result = await api.getDashboard();
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "Failed to load dashboard");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    const interval = setInterval(load, 30_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <AppLayout
      title="Dashboard"
      description="Live overview of XAUUSD price, signals, orders, and today's performance."
    >
      {loading && !data ? <PageLoader /> : null}
      {error ? <PageError message={error} /> : null}
      {data ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            label="XAUUSD Price"
            value={data.xauusdPrice ? formatPrice(data.xauusdPrice) : "—"}
            hint="Latest market snapshot"
          />
          <StatCard
            label="Latest Signal"
            value={
              data.latestSignal ? (
                <span className="flex items-center gap-2">
                  <StatusBadge status={data.latestSignal.action} />
                  <span className="text-lg">{data.latestSignal.symbol}</span>
                </span>
              ) : (
                "—"
              )
            }
            hint={
              data.latestSignal?.timeframe
                ? `Timeframe: ${data.latestSignal.timeframe}`
                : undefined
            }
          />
          <StatCard
            label="Signal Confidence"
            value={
              data.signalConfidence !== null ? `${data.signalConfidence}%` : "—"
            }
          />
          <StatCard
            label="Order Status"
            value={data.orderStatus}
            hint="From execution instruction"
          />
          <StatCard
            label="Open Position"
            value={data.openPositionStatus}
          />
          <StatCard
            label="Daily PnL"
            value={data.dailyPnl ? formatPnL(data.dailyPnl) : "—"}
            valueClassName={pnlColorClass(data.dailyPnl)}
          />
          <StatCard
            label="Trades Today"
            value={
              data.totalTradesToday !== null ? String(data.totalTradesToday) : "—"
            }
          />
        </div>
      ) : null}
      {!error ? (
        <section className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
          <h2 className="text-sm font-semibold text-zinc-200">Live activity</h2>
          <p className="mt-1 text-xs text-zinc-500">
            Chat-style live log — replaces checking MT4 Experts and docker logs for pipeline steps.
          </p>
          <div className="mt-4">
            <ActivityFeed limit={20} compact />
          </div>
        </section>
      ) : null}
    </AppLayout>
  );
}
