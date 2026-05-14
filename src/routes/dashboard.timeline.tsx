import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, CheckCircle2, Circle, AlertCircle, X, ChevronLeft, Flame, StickyNote } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { useCareer } from "@/lib/career-context";
import type { Milestone } from "@/lib/career-data";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/dashboard/timeline")({
  component: TimelinePage,
});

interface DayPlan {
  day: number;
  label: string;
  focus: string;
  highPriority: string;
  tasks: string[];
}

function buildDayPlans(m: Milestone): DayPlan[] {
  const focuses = [
    "Foundations & Setup",
    "Deep Practice",
    "Build & Ship",
    "Pair / Mock Session",
    "Refine & Document",
    "Public Artifact Drop",
    "Review & Reflect",
  ];
  const highPriorities = [
    `Block 2hr deep-work on "${m.title}"`,
    `Solve 3 problems tied to "${m.title}"`,
    `Ship a working prototype of "${m.title}"`,
    `Mock interview / peer review on "${m.title}"`,
    `Write technical notes on "${m.title}"`,
    `Publish post or repo on "${m.title}"`,
    `Weekly retro + plan next week`,
  ];
  return Array.from({ length: 7 }, (_, i) => ({
    day: i + 1,
    label: focuses[i],
    focus: focuses[i],
    highPriority: highPriorities[i],
    tasks: [
      m.gameplan[i % m.gameplan.length],
      `Log progress in tracker (15 min)`,
      `Engage with 5 peers / mentors on the topic`,
      i === 6 ? "Sunday review: wins, gaps, next steps" : `Apply learning to a real scenario`,
    ],
  }));
}

function TimelinePage() {
  const { milestones, notes, setNote } = useCareer();
  const [active, setActive] = useState<Milestone | null>(null);
  const [activeDay, setActiveDay] = useState<number | null>(null);

  const dayPlans = useMemo(() => (active ? buildDayPlans(active) : []), [active]);
  const activePlan = activeDay ? dayPlans.find((d) => d.day === activeDay) : null;

  const closeAll = () => { setActive(null); setActiveDay(null); };

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
                onClick={() => { setActive(m); setActiveDay(null); }}
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeAll} className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" />
            <motion.aside
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 220, damping: 28 }}
              className="glass-strong fixed right-0 top-0 z-50 flex h-screen w-full flex-col border-l border-border md:w-[640px]"
            >
              <div className="flex items-center justify-between border-b border-border p-5">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {activeDay && (
                      <button onClick={() => setActiveDay(null)} className="rounded-md p-1 text-muted-foreground hover:bg-white/5 hover:text-foreground">
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                    )}
                    <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                      {activeDay ? `Day ${activeDay} Plan` : "Weekly Gameplan"}
                    </div>
                  </div>
                  <h3 className="text-glow mt-1 truncate text-xl font-bold uppercase tracking-wider">
                    {activePlan ? activePlan.focus : active.title}
                  </h3>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" /> Week {active.week} · {active.date}
                  </div>
                </div>
                <button onClick={closeAll} className="rounded-md p-2 text-muted-foreground hover:bg-white/5 hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5">
                <AnimatePresence mode="wait">
                  {!activeDay ? (
                    <motion.div key="week" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Day-by-Day Breakdown</div>
                      <div className="mt-3 space-y-2">
                        {dayPlans.map((d) => (
                          <button
                            key={d.day}
                            onClick={() => setActiveDay(d.day)}
                            className="group flex w-full items-start gap-3 rounded-lg bg-background/40 p-3 text-left ring-1 ring-border transition hover:bg-background/60 hover:shadow-glow"
                          >
                            <span className="grid h-9 w-9 flex-none place-items-center rounded-md bg-primary/15 text-xs font-bold text-primary ring-1 ring-primary/40">
                              D{d.day}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold">{d.focus}</span>
                              </div>
                              <div className="mt-1 flex items-start gap-1.5 text-[11px] text-muted-foreground">
                                <Flame className="mt-0.5 h-3 w-3 flex-none text-destructive" />
                                <span className="truncate">{d.highPriority}</span>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>

                      <div className="mt-6">
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          <StickyNote className="h-3 w-3" /> Weekly Notes
                        </div>
                        <Textarea
                          value={notes[`week-${active.id}`] ?? ""}
                          onChange={(e) => setNote(`week-${active.id}`, e.target.value)}
                          placeholder="Capture key takeaways, blockers, wins for the whole week..."
                          className="mt-2 min-h-[120px] bg-background/40"
                        />
                      </div>

                      <div className="mt-6 flex gap-2">
                        <Button className="flex-1 bg-primary hover:bg-primary/90">Lock Gameplan</Button>
                        <Button variant="outline">Reschedule</Button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key={`day-${activeDay}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                      <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3">
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-destructive">
                          <Flame className="h-3 w-3" /> High Priority
                        </div>
                        <div className="mt-1 text-sm">{activePlan!.highPriority}</div>
                      </div>

                      <div className="mt-5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Full Task List</div>
                      <div className="mt-3 space-y-2">
                        {activePlan!.tasks.map((t, i) => (
                          <div key={i} className="flex items-start gap-3 rounded-lg bg-background/40 p-3 ring-1 ring-border">
                            <span className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full bg-primary/20 text-[10px] font-bold text-primary ring-1 ring-primary/40">{i + 1}</span>
                            <span className="text-sm">{t}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6">
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          <StickyNote className="h-3 w-3" /> Day {activeDay} Notes
                        </div>
                        <Textarea
                          value={notes[`day-${active.id}-${activeDay}`] ?? ""}
                          onChange={(e) => setNote(`day-${active.id}-${activeDay}`, e.target.value)}
                          placeholder={`Log progress, learnings, next steps for day ${activeDay}...`}
                          className="mt-2 min-h-[120px] bg-background/40"
                        />
                      </div>

                      <div className="mt-6 flex gap-2">
                        <Button className="flex-1 bg-primary hover:bg-primary/90">Mark Day Complete</Button>
                        <Button variant="outline" onClick={() => setActiveDay(null)}>Back to Week</Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </PageShell>
  );
}
