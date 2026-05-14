import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { OutreachHud } from "@/components/outreach-hud";

export const Route = createFileRoute("/dashboard/outreach")({
  component: () => (
    <PageShell kicker="Outreach HUD" title="Target Recruiters">
      <div className="grid gap-4 lg:grid-cols-2">
        <OutreachHud variant="feed" />
        <OutreachHud variant="table" />
      </div>
    </PageShell>
  ),
});
