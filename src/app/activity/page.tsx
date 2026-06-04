"use client";

import { AppLayout } from "@/components/AppLayout";
import { ActivityFeed } from "@/components/ActivityFeed";

export default function ActivityPage() {
  return (
    <AppLayout
      title="Activity"
      description="Live pipeline log — see each MT4 snapshot, OpenAI decision, risk check, and order creation."
    >
      <ActivityFeed limit={100} fullHeight />
    </AppLayout>
  );
}
