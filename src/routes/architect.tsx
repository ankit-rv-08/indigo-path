import { createFileRoute } from "@tanstack/react-router";
import { CareerProvider } from "@/lib/career-context";
import { CareerHeader } from "@/components/career-header";
import { AccountabilityOverlay } from "@/components/accountability-overlay";
import { MikeSidebar } from "@/components/mike-sidebar";
import { PresenceMatrix } from "@/components/presence-matrix";
import { OutreachHud } from "@/components/outreach-hud";
import { ExecutionPipeline } from "@/components/execution-pipeline";
import { Toaster } from "@/components/ui/sonner";
import { motion } from "framer-motion";
import { useCareer } from "@/lib/career-context";
import { Calendar } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/architect")({
  component: ArchitectPage,
});

function ArchitectPage() {
  return (
    <CareerProvider>
      <div className="min-h-screen pr-0 md:pr-[340px]">
        <CareerHeader />
        <motion.div
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 28 }}
          className="mx-auto max-w-[1600px] px-4 py-4"
        >
          <div className="grid gap-4 lg:grid-cols-[340px_1fr_360px]">
            {/* IdentHUD Left */}
            <div className="space-y-3">
              <SectionLabel>Ident HUD</SectionLabel>
              <PresenceMatrix compact />
              <SectionLabel>Placement Tasks</SectionLabel>
              <ExecutionPipeline orientation="vertical" />
            </div>

            {/* Master Timeline Center */}
            <CenterTimeline />

            {/* OutreachHUD Right */}
            <div className="space-y-3">
              <SectionLabel>Outreach HUD</SectionLabel>
              <OutreachHud variant="table" />
            </div>
          </div>
        </motion.div>
        <AccountabilityOverlay variant="bottom" />
        <MikeSidebar />
        <Toaster />
      </div>
    </CareerProvider>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="px-1 pt-1 text-[10px] font-bold uppercase tracking-[0.3em] text-primary">{children}</div>;
}

function CenterTimeline() {
  const { milestones } = useCareer();
  return (
    <div className="space-y-3">
      <SectionLabel>Master Timeline · Dec 31, 2026</SectionLabel>
      <div className="glass relative rounded-xl p-5">
        <div className="absolute left-9 top-5 bottom-5 w-px bg-gradient-to-b from-primary via-accent to-transparent" />
        <div className="max-h-[700px] space-y-2 overflow-y-auto pr-2">
          {milestones.map((m) => (
            <Link
              key={m.id}
              to="/dashboard/timeline"
              className="group relative flex items-center gap-3 rounded-lg bg-background/30 p-2.5 pl-12 ring-1 ring-border transition hover:bg-background/50"
            >
              <span className={`absolute left-6 grid h-6 w-6 place-items-center rounded-full bg-card ring-2 ${
                m.status === "current" ? "ring-primary shadow-glow" :
                m.status === "missed" ? "ring-destructive" :
                m.status === "done" ? "ring-[oklch(0.7_0.18_160)]" : "ring-border"
              }`}>
                <Calendar className="h-3 w-3 text-muted-foreground" />
              </span>
              <div className="flex-1 grid grid-cols-[42px_1fr_auto] items-center gap-2 text-xs">
                <span className="font-bold text-muted-foreground">W{m.week}</span>
                <span className="truncate">{m.title}</span>
                <span className="text-[10px] text-muted-foreground">{m.date.slice(5)}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
