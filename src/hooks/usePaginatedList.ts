"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/lib/api";
import type { PaginatedResult, PaginationMeta } from "@/lib/pagination";

export function usePaginatedList<T>(
  fetchPage: (page: number) => Promise<PaginatedResult<T>>,
  errorMessage: string,
) {
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<T[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(
    async (targetPage: number, cancelled: () => boolean) => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchPage(targetPage);
        if (!cancelled()) {
          setRows(result.data);
          setMeta(result.meta);
        }
      } catch (err) {
        if (!cancelled()) {
          setError(err instanceof ApiError ? err.message : errorMessage);
        }
      } finally {
        if (!cancelled()) {
          setLoading(false);
        }
      }
    },
    [fetchPage, errorMessage],
  );

  useEffect(() => {
    let cancelled = false;

    load(page, () => cancelled);

    return () => {
      cancelled = true;
    };
  }, [page, load]);

  const goToPage = (nextPage: number) => {
    if (nextPage < 1) return;
    if (meta && nextPage > meta.total_pages) return;
    setPage(nextPage);
  };

  return {
    rows,
    meta,
    page,
    loading,
    error,
    goToPage,
  };
}
