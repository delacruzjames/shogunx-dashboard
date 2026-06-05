"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityLogEntry } from "@/components/ActivityLogEntry";
import { api, ApiError } from "@/lib/api";
import type { ActivityLog } from "@/lib/types";

const POLL_MS_COMPACT = 3_000;
const POLL_MS_FULL = 2_000;
const SCROLL_NEAR_BOTTOM_PX = 80;
const DEFAULT_LIMIT = 20;

function mergeLogs(existing: ActivityLog[], incoming: ActivityLog[], max: number): ActivityLog[] {
  const byId = new Map<number, ActivityLog>();
  for (const log of existing) byId.set(log.id, log);
  for (const log of incoming) byId.set(log.id, log);
  const merged = Array.from(byId.values()).sort((a, b) => a.id - b.id);
  if (merged.length <= max) return merged;
  return merged.slice(merged.length - max);
}

function maxLogId(logs: ActivityLog[]): number | null {
  if (logs.length === 0) return null;
  return Math.max(...logs.map((l) => l.id));
}

type ActivityFeedProps = {
  limit?: number;
  compact?: boolean;
  fullHeight?: boolean;
};

export function ActivityFeed({
  limit = DEFAULT_LIMIT,
  compact = false,
  fullHeight = false,
}: ActivityFeedProps) {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastIdRef = useRef<number | null>(null);
  const stickToBottomRef = useRef(true);

  const pollMs = compact ? POLL_MS_COMPACT : POLL_MS_FULL;

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior });
  }, []);

  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    stickToBottomRef.current = distance <= SCROLL_NEAR_BOTTOM_PX;
  }, []);

  const loadInitial = useCallback(async () => {
    const data = await api.getActivityLogs({ limit });
    const chronological = [ ...data ].reverse();
    setLogs(chronological);
    lastIdRef.current = maxLogId(chronological);
    setError(null);
    setLive(true);
    if (stickToBottomRef.current) {
      requestAnimationFrame(() => scrollToBottom("auto"));
    }
  }, [limit, scrollToBottom]);

  const pollNew = useCallback(async () => {
    const sinceId = lastIdRef.current;
    if (sinceId == null) {
      await loadInitial();
      return;
    }
    const data = await api.getActivityLogs({ since_id: sinceId, limit });
    if (data.length === 0) return;
    setLogs((prev) => {
      const next = mergeLogs(prev, data, limit);
      lastIdRef.current = maxLogId(next);
      return next;
    });
    setLive(true);
    if (stickToBottomRef.current) {
      requestAnimationFrame(() => scrollToBottom());
    }
  }, [limit, loadInitial, scrollToBottom]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await loadInitial();
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "Failed to load activity");
          setLive(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    const interval = setInterval(async () => {
      try {
        await pollNew();
        setError(null);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Failed to refresh activity");
        setLive(false);
      }
    }, pollMs);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [loadInitial, pollNew, pollMs]);

  if (loading && logs.length === 0) {
    return <p className="text-sm text-zinc-500">Connecting to live feed…</p>;
  }

  const feedBody = (
    <>
      <div
        className={`flex items-center justify-between gap-2 ${compact ? "mb-2" : "mb-3"}`}
      >
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span
            className={`inline-flex h-2 w-2 rounded-full ${live ? "animate-pulse bg-emerald-400" : "bg-zinc-600"}`}
            aria-hidden
          />
          <span>{live ? "Live" : "Offline"}</span>
          <span className="text-zinc-600">·</span>
          <span>updates every {pollMs / 1000}s</span>
        </div>
        {compact ? (
          <Link
            href="/activity"
            className="text-xs font-medium text-sky-400 hover:text-sky-300"
          >
            Open full feed →
          </Link>
        ) : null}
      </div>

      {error ? (
        <p className="mb-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {error}
        </p>
      ) : null}

      {logs.length === 0 ? (
        <p className="text-sm text-zinc-500">
          No messages yet. When the MT4 EA posts a signal, you will see snapshot → Brain → risk →
          orders here — no need to open Experts or server logs.
        </p>
      ) : (
        <div
          ref={scrollRef}
          onScroll={onScroll}
          className={
            fullHeight
              ? "flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-1"
              : compact
                ? "flex max-h-72 flex-col gap-2 overflow-y-auto pr-1"
                : "flex max-h-[min(70vh,640px)] flex-col gap-3 overflow-y-auto pr-1"
          }
        >
          {logs.map((log) => (
            <ActivityLogEntry key={log.id} log={log} />
          ))}
        </div>
      )}
    </>
  );

  if (fullHeight) {
    return (
      <div className="flex min-h-[calc(100vh-11rem)] flex-col rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
        {feedBody}
      </div>
    );
  }

  return <div>{feedBody}</div>;
}
