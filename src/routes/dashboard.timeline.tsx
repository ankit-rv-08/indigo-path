import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, CheckCircle2, Circle, AlertCircle, X } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { useCareer } from "@/lib/career-context";
import type { Milestone } from "@/lib/career-data";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/timeline")({
  component: TimelinePage,
});

function TimelinePage() {
  const { milestones } = useCareer();
  const [active, setActive] = useState<Milestone | null>(null);

  return (
    <PageShell kicker="Master Timeline" title="Path to Dec 31, 2026">
      <div className="glass relative rounded-xl p-6">
        <div className="absolute left-8 top-6 bottom-6 w-px bg-gradient-to-b from-primary via-accent to-transparent" />
        <div className="space-y-3">
          {milestones.map((m) => {
            const Icon = m.status === "done" ? CheckCircle2 : m.status === "missed" ? AlertCircle : Circle;
            const color =
              m.status === "done" ? "text-[oklch(0.78_0.17_160)]" :
              m.status === "current" ? "text-primary" :
              m.status === "missed" ? "text-destructive" : "text-muted-foreground";
            return (
              <button
                key={m.id}
                onClick={() => setActive(m)}
                className="group relative flex w-full items-center gap-4 rounded-lg bg-background/30 p-3 pl-12 text-left ring-1 ring-border transition hover:bg-background/50 hover:shadow-glow"
              >
                <span className={`absolute left-5 grid h-7 w-7 place-items-center rounded-full bg-card ring-2 ${m.status === "current" ? "ring-primary shadow-glow" : "ring-border"}`}>
                  <Icon className={`h-4 w-4 ${color}`} />
                </span>
                <div className="flex-1 grid grid-cols-[80px_1fr_auto] items-center gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">W{m.week}</span>
                  <span className="text-sm font-medium">{m.title}</span>
                  <span className="text-[10px] text-muted-foreground">{m.date}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActive(null)} className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" />
            <motion.aside
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 220, damping: 28 }}
              className="glass-strong fixed right-0 top-0 z-50 flex h-screen w-full flex-col border-l border-border md:w-[600px]"
            >
              <div className="flex items-center justify-between border-b border-border p-5">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Tactical Gameplan</div>
                  <h3 className="text-glow mt-1 text-xl font-bold uppercase tracking-wider">{active.title}</h3>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" /> Week {active.week} · {active.date}
                  </div>
                </div>
                <button onClick={() => setActive(null)} className="rounded-md p-2 text-muted-foreground hover:bg-white/5 hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5">
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Action Items</div>
                <div className="mt-3 space-y-2">
                  {active.gameplan.map((g, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-lg bg-background/40 p-3 ring-1 ring-border">
                      <span className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full bg-primary/20 text-[10px] font-bold text-primary ring-1 ring-primary/40">{i + 1}</span>
                      <span className="text-sm">{g}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex gap-2">
                  <Button className="flex-1 bg-primary hover:bg-primary/90">Lock Gameplan</Button>
                  <Button variant="outline">Reschedule</Button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </PageShell>
  );
}
