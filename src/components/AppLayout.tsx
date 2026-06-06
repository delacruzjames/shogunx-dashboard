"use client";

import { useCallback, useState, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";

interface AppLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export function AppLayout({ children, title, description }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {sidebarOpen ? (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={closeSidebar}
          aria-hidden
        />
      ) : null}

      <main className="flex min-w-0 flex-1 flex-col overflow-auto">
        <header className="sticky top-0 z-30 border-b border-zinc-800 bg-zinc-950/80 px-4 py-4 backdrop-blur md:px-8 md:py-6">
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="-ml-1 rounded-lg p-2.5 text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200 md:hidden"
              aria-label="Open navigation menu"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-xl font-semibold tracking-tight text-zinc-50 md:text-2xl">
                {title}
              </h2>
              {description ? (
                <p className="mt-1 text-sm text-zinc-500">{description}</p>
              ) : null}
            </div>
          </div>
        </header>
        <div className="flex-1 p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
