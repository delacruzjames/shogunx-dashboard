"use client";

import { useCallback } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, type Column } from "@/components/DataTable";
import { PageError } from "@/components/PageError";
import { PageLoader } from "@/components/PageLoader";
import { Pagination } from "@/components/Pagination";
import { api } from "@/lib/api";
import { formatDateTime, formatNumber, formatPrice } from "@/lib/format";
import type { MarketSnapshot } from "@/lib/types";
import { usePaginatedList } from "@/hooks/usePaginatedList";

const columns: Column<MarketSnapshot>[] = [
  { key: "symbol", header: "Symbol" },
  { key: "timeframe", header: "Timeframe" },
  {
    key: "price",
    header: "Price",
    render: (row) => formatPrice(row.price),
  },
  {
    key: "rsi",
    header: "RSI",
    render: (row) => formatNumber(row.rsi, 2),
  },
  {
    key: "ema50",
    header: "EMA 50",
    render: (row) => formatPrice(row.ema50),
  },
  {
    key: "ema200",
    header: "EMA 200",
    render: (row) => formatPrice(row.ema200),
  },
  {
    key: "support",
    header: "Support",
    render: (row) => formatPrice(row.support),
  },
  {
    key: "resistance",
    header: "Resistance",
    render: (row) => formatPrice(row.resistance),
  },
  {
    key: "created_at",
    header: "Created",
    render: (row) => formatDateTime(row.created_at),
  },
];

export default function MarketSnapshotsPage() {
  const fetchPage = useCallback((page: number) => api.getMarketSnapshots({ page }), []);

  const { rows, meta, loading, error, goToPage } = usePaginatedList(
    fetchPage,
    "Failed to load market snapshots",
  );

  return (
    <AppLayout
      title="Market Snapshots"
      description="Historical market data captured from the trading system."
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
              loading
                ? "Loading market snapshots…"
                : "No market snapshots returned from the API."
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
