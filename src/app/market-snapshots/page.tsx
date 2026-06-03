"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, type Column } from "@/components/DataTable";
import { PageError } from "@/components/PageError";
import { PageLoader } from "@/components/PageLoader";
import { api, ApiError } from "@/lib/api";
import { formatDateTime, formatNumber, formatPrice } from "@/lib/format";
import type { MarketSnapshot } from "@/lib/types";

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
  const [rows, setRows] = useState<MarketSnapshot[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getMarketSnapshots();
        if (!cancelled) setRows(data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError ? err.message : "Failed to load market snapshots",
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
      title="Market Snapshots"
      description="Historical market data captured from the trading system."
    >
      {loading ? <PageLoader /> : null}
      {error ? <PageError message={error} /> : null}
      {!loading && !error ? (
        <DataTable
          columns={columns}
          data={rows}
          keyExtractor={(row) => row.id}
          emptyMessage="No market snapshots returned from the API."
        />
      ) : null}
    </AppLayout>
  );
}
