interface PageErrorProps {
  message: string;
}

export function PageError({ message }: PageErrorProps) {
  return (
    <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-6 py-4 text-sm text-rose-200">
      <p className="font-medium">Unable to load data</p>
      <p className="mt-1 text-rose-300/80">{message}</p>
      <p className="mt-2 text-xs text-rose-400/60">
        Ensure the ShogunX API is running on port 3000 and restart the dashboard
        dev server after changing <code className="rounded bg-zinc-900 px-1">.env.local</code>.
      </p>
    </div>
  );
}
