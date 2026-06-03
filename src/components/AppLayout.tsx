import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

interface AppLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export function AppLayout({ children, title, description }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      <Sidebar />
      <main className="flex flex-1 flex-col overflow-auto">
        <header className="border-b border-zinc-800 bg-zinc-950/80 px-8 py-6 backdrop-blur">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-50">
            {title}
          </h2>
          {description ? (
            <p className="mt-1 text-sm text-zinc-500">{description}</p>
          ) : null}
        </header>
        <div className="flex-1 p-8">{children}</div>
      </main>
    </div>
  );
}
