"use client";

import { useCallback } from "react";
import { ActivityLogEntry } from "@/components/ActivityLogEntry";
import { AppLayout } from "@/components/AppLayout";
import { PageError } from "@/components/PageError";
import { PageLoader } from "@/components/PageLoader";
import { Pagination } from "@/components/Pagination";
import { api } from "@/lib/api";
import { PAGE_SIZE } from "@/lib/pagination";
import { usePaginatedList } from "@/hooks/usePaginatedList";

export default function ActivityPage() {
  const fetchPage = useCallback(
    (page: number) => api.getActivityLogsPage({ page, per_page: PAGE_SIZE }),
    [],
  );

  const { rows, meta, loading, error, goToPage } = usePaginatedList(
    fetchPage,
    "Failed to load activity",
  );

  return (
    <AppLayout
      title="Activity"
      description="Pipeline log — newest first. Paginate to browse older MT4 snapshots, AI decisions, risk checks, and orders."
    >
      {loading && rows.length === 0 ? <PageLoader /> : null}
      {error ? <PageError message={error} /> : null}
      {!error ? (
        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/60">
          {rows.length === 0 && !loading ? (
            <p className="px-4 py-8 text-sm text-zinc-500">
              No activity yet. When the MT4 EA posts a signal, events appear here.
            </p>
          ) : (
            <div className="flex flex-col gap-3 p-4">
              {rows.map((log) => (
                <ActivityLogEntry key={log.id} log={log} />
              ))}
            </div>
          )}
          {meta ? (
            <Pagination meta={meta} onPageChange={goToPage} disabled={loading} />
          ) : null}
        </div>
      ) : null}
    </AppLayout>
  );
}
