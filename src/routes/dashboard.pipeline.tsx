import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { ExecutionPipeline } from "@/components/execution-pipeline";

export const Route = createFileRoute("/dashboard/pipeline")({
  component: () => (
    <PageShell kicker="Execution Pipeline" title="Today's High-LPA Tasks">
      <ExecutionPipeline />
    </PageShell>
  ),
});
