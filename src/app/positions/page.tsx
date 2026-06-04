"use client";

import { useCallback } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, type Column } from "@/components/DataTable";
import { PageError } from "@/components/PageError";
import { PageLoader } from "@/components/PageLoader";
import { Pagination } from "@/components/Pagination";
import { StatusBadge } from "@/components/StatusBadge";
import { api } from "@/lib/api";
import { formatPnL, formatPrice, pnlColorClass } from "@/lib/format";
import type { Position } from "@/lib/types";
import { usePaginatedList } from "@/hooks/usePaginatedList";

const columns: Column<Position>[] = [
  { key: "ticket", header: "Ticket" },
  { key: "symbol", header: "Symbol" },
  {
    key: "action",
    header: "Action",
    render: (row) => <StatusBadge status={row.action} />,
  },
  {
    key: "entry_price",
    header: "Entry Price",
    render: (row) => formatPrice(row.entry_price),
  },
  {
    key: "stop_loss",
    header: "Stop Loss",
    render: (row) => formatPrice(row.stop_loss),
  },
  {
    key: "take_profit",
    header: "Take Profit",
    render: (row) => formatPrice(row.take_profit),
  },
  {
    key: "status",
    header: "Status",
    render: (row) => <StatusBadge status={row.status} />,
  },
  {
    key: "profit_loss",
    header: "P/L",
    render: (row) => (
      <span className={pnlColorClass(row.profit_loss)}>
        {formatPnL(row.profit_loss)}
      </span>
    ),
  },
];

export default function PositionsPage() {
  const fetchPage = useCallback((page: number) => api.getPositions({ page }), []);

  const { rows, meta, loading, error, goToPage } = usePaginatedList(
    fetchPage,
    "Failed to load positions",
  );

  return (
    <AppLayout
      title="Positions"
      description="Open and closed positions synced from MT4."
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
              loading ? "Loading positions…" : "No positions returned from the API."
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
