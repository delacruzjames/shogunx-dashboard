"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, type Column } from "@/components/DataTable";
import { PageError } from "@/components/PageError";
import { PageLoader } from "@/components/PageLoader";
import { StatusBadge } from "@/components/StatusBadge";
import { api, ApiError } from "@/lib/api";
import { formatDateTime, formatPrice } from "@/lib/format";
import type { Order } from "@/lib/types";

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
  const [rows, setRows] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getOrders();
        if (!cancelled) setRows(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "Failed to load orders");
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
      title="Orders"
      description="Pending and historical orders from the execution pipeline."
    >
      {loading ? <PageLoader /> : null}
      {error ? <PageError message={error} /> : null}
      {!loading && !error ? (
        <DataTable
          columns={columns}
          data={rows}
          keyExtractor={(row) => row.id}
          emptyMessage="No orders returned from the API."
        />
      ) : null}
    </AppLayout>
  );
}
