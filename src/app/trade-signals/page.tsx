"use client";

import { useCallback } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, type Column } from "@/components/DataTable";
import { PageError } from "@/components/PageError";
import { PageLoader } from "@/components/PageLoader";
import { Pagination } from "@/components/Pagination";
import { StatusBadge } from "@/components/StatusBadge";
import { api } from "@/lib/api";
import { formatDateTime } from "@/lib/format";
import type { TradeSignal } from "@/lib/types";
import { usePaginatedList } from "@/hooks/usePaginatedList";

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
    key: "rejection_reason",
    header: "Rejected",
    className: "max-w-xs whitespace-normal",
    render: (row) =>
      row.rejection_reason ? (
        <span className="text-amber-400/90">{row.rejection_reason}</span>
      ) : (
        "—"
      ),
  },
  {
    key: "created_at",
    header: "Created",
    render: (row) => formatDateTime(row.created_at),
  },
];

export default function TradeSignalsPage() {
  const fetchPage = useCallback((page: number) => api.getTradeSignals({ page }), []);

  const { rows, meta, loading, error, goToPage } = usePaginatedList(
    fetchPage,
    "Failed to load trade signals",
  );

  return (
    <AppLayout
      title="Trade Signals"
      description="AI-generated trade signals and confidence scores."
    >
      {loading && rows.length === 0 ? <PageLoader /> : null}
      {error ? <PageError message={error} /> : null}
      {!error ? (
        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/80">
          <DataTable
            columns={columns}
            data={rows}
            keyExtractor={(row) => row.id}
            emptyMessage={
              loading ? "Loading trade signals…" : "No trade signals returned from the API."
            }
          />
          {meta ? (
            <Pagination meta={meta} onPageChange={goToPage} disabled={loading} />
          ) : null}
        </div>
      ) : null}
    </AppLayout>
  );
}
