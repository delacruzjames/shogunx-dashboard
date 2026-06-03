"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, type Column } from "@/components/DataTable";
import { PageError } from "@/components/PageError";
import { PageLoader } from "@/components/PageLoader";
import { StatusBadge } from "@/components/StatusBadge";
import { api, ApiError } from "@/lib/api";
import { formatPnL, formatPrice, pnlColorClass } from "@/lib/format";
import type { Position } from "@/lib/types";

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
  const [rows, setRows] = useState<Position[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getPositions();
        if (!cancelled) setRows(data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError ? err.message : "Failed to load positions",
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
      title="Positions"
      description="Open and closed positions synced from MT4."
    >
      {loading ? <PageLoader /> : null}
      {error ? <PageError message={error} /> : null}
      {!loading && !error ? (
        <DataTable
          columns={columns}
          data={rows}
          keyExtractor={(row) => row.id}
          emptyMessage="No positions returned from the API."
        />
      ) : null}
    </AppLayout>
  );
}
