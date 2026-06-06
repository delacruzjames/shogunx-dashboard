import type { ReactNode } from "react";

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string | number;
  emptyMessage?: string;
}

function renderCell<T extends object>(col: Column<T>, row: T): ReactNode {
  return col.render
    ? col.render(row)
    : String(row[col.key as keyof T] ?? "—");
}

export function DataTable<T extends object>({
  columns,
  data,
  keyExtractor,
  emptyMessage = "No data available.",
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="bg-zinc-900/50 px-4 py-12 text-center text-sm text-zinc-500 md:px-6">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div className="divide-y divide-zinc-800 md:hidden">
        {data.map((row, index) => (
          <div key={keyExtractor(row, index)} className="px-4 py-4">
            {columns.map((col) => (
              <div
                key={col.key}
                className="flex items-start justify-between gap-4 border-b border-zinc-800/50 py-2 last:border-0"
              >
                <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  {col.header}
                </span>
                <span
                  className={`min-w-0 text-right text-sm text-zinc-300 ${col.className ?? ""}`}
                >
                  {renderCell(col, row)}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full divide-y divide-zinc-800 text-sm">
          <thead className="bg-zinc-950/60">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 ${col.className ?? ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/80">
            {data.map((row, index) => (
              <tr key={keyExtractor(row, index)} className="hover:bg-zinc-800/30">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`whitespace-nowrap px-4 py-3 text-zinc-300 ${col.className ?? ""}`}
                  >
                    {renderCell(col, row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
