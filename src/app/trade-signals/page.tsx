"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, type Column } from "@/components/DataTable";
import { PageError } from "@/components/PageError";
import { PageLoader } from "@/components/PageLoader";
import { StatusBadge } from "@/components/StatusBadge";
import { api, ApiError } from "@/lib/api";
import { formatDateTime } from "@/lib/format";
import type { TradeSignal } from "@/lib/types";

const columns: Column<TradeSignal>[] = [
  { key: "symbol", header: "Symbol" },
  {
    key: "action",
    header: "Action",
    render: (row) => <StatusBadge status={row.action} />,
  },
  {
    key: "confidence",
    header: "Confidence",
    render: (row) => `${row.confidence}%`,
  },
  {
    key: "timeframe",
    header: "Timeframe",
    render: (row) => row.timeframe ?? "—",
  },
  {
    key: "reason",
    header: "Reason",
    className: "max-w-md whitespace-normal",
    render: (row) => (
      <span className="line-clamp-2 text-zinc-400">{row.reason ?? "—"}</span>
    ),
  },
  {
    key: "created_at",
    header: "Created",
    render: (row) => formatDateTime(row.created_at),
  },
];

export default function TradeSignalsPage() {
  const [rows, setRows] = useState<TradeSignal[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getTradeSignals();
        if (!cancelled) setRows(data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError ? err.message : "Failed to load trade signals",
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

  return (
    <AppLayout
      title="Trade Signals"
      description="AI-generated trade signals and confidence scores."
    >
      {loading ? <PageLoader /> : null}
      {error ? <PageError message={error} /> : null}
      {!loading && !error ? (
        <DataTable
          columns={columns}
          data={rows}
          keyExtractor={(row) => row.id}
          emptyMessage="No trade signals returned from the API."
        />
      ) : null}
    </AppLayout>
  );
}
