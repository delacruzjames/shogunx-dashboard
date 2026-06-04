import type { PaginationMeta } from "@/lib/pagination";

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export function Pagination({ meta, onPageChange, disabled = false }: PaginationProps) {
  const { page, per_page, total_count, total_pages } = meta;

  if (total_count === 0) {
    return null;
  }

  const start = (page - 1) * per_page + 1;
  const end = Math.min(page * per_page, total_count);
  const canGoPrev = page > 1 && !disabled;
  const canGoNext = page < total_pages && !disabled;

  return (
    <div className="flex flex-col gap-3 border-t border-zinc-800 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-zinc-500">
        Showing {start}–{end} of {total_count}
        {total_pages > 1 ? ` · Page ${page} of ${total_pages}` : null}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={!canGoPrev}
          className="rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-1.5 text-sm text-zinc-200 transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={!canGoNext}
          className="rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-1.5 text-sm text-zinc-200 transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
