import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { PresenceMatrix } from "@/components/presence-matrix";

export const Route = createFileRoute("/dashboard/presence")({
  component: () => (
    <PageShell kicker="Identity HUD" title="Presence Matrix">
      <PresenceMatrix />
    </PageShell>
  ),
});
