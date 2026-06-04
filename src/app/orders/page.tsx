"use client";

import { useCallback } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, type Column } from "@/components/DataTable";
import { PageError } from "@/components/PageError";
import { PageLoader } from "@/components/PageLoader";
import { Pagination } from "@/components/Pagination";
import { StatusBadge } from "@/components/StatusBadge";
import { api } from "@/lib/api";
import { formatDateTime, formatPrice } from "@/lib/format";
import type { Order } from "@/lib/types";
import { usePaginatedList } from "@/hooks/usePaginatedList";

const columns: Column<Order>[] = [
  {
    key: "action",
    header: "Action",
    render: (row) => <StatusBadge status={row.action} />,
  },
  { key: "entry_type", header: "Entry Type" },
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
    key: "expires_at",
    header: "Expires",
    render: (row) => formatDateTime(row.expires_at),
  },
];

export default function OrdersPage() {
  const fetchPage = useCallback((page: number) => api.getOrders({ page }), []);

  const { rows, meta, loading, error, goToPage } = usePaginatedList(
    fetchPage,
    "Failed to load orders",
  );

  return (
    <AppLayout
      title="Orders"
      description="Pending and historical orders from the execution pipeline."
    >
      {loading && rows.length === 0 ? <PageLoader /> : null}
      {error ? <PageError message={error} /> : null}
      {!error ? (
        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/80">
          <DataTable
            columns={columns}
            data={rows}
            keyExtractor={(row) => row.id}
            emptyMessage={loading ? "Loading orders…" : "No orders returned from the API."}
          />
          {meta ? (
            <Pagination meta={meta} onPageChange={goToPage} disabled={loading} />
          ) : null}
        </div>
      ) : null}
    </AppLayout>
  );
}
