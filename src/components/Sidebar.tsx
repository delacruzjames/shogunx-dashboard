"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Dashboard", icon: "◈" },
  { href: "/activity", label: "Activity", icon: "◎" },
  { href: "/market-snapshots", label: "Market Snapshots", icon: "◇" },
  { href: "/trade-signals", label: "Trade Signals", icon: "△" },
  { href: "/orders", label: "Orders", icon: "□" },
  { href: "/positions", label: "Positions", icon: "○" },
  { href: "/performance", label: "Performance", icon: "▣" },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-zinc-800 bg-zinc-950 transition-transform duration-200 ease-in-out md:static md:z-auto md:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
    >
      <div className="border-b border-zinc-800 px-6 py-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-amber-500/90">
              ShogunX
            </p>
            <h1 className="mt-1 text-lg font-bold text-zinc-100">Dashboard</h1>
            <p className="mt-0.5 text-xs text-zinc-500">View-only monitoring</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2.5 text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200 md:hidden"
            aria-label="Close navigation menu"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {navItems.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors md:py-2.5 ${
                active
                  ? "bg-amber-500/10 text-amber-200 ring-1 ring-amber-500/20"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
              }`}
            >
              <span className="text-xs opacity-70" aria-hidden>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-zinc-800 px-4 py-4 text-xs text-zinc-600">
        Read-only · No trade execution
      </div>
    </aside>
  );
}
