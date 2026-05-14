import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Megaphone, Network, Clock, Flag, ChevronRight, Check, Plus } from "lucide-react";
import { useCareer } from "@/lib/career-context";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import type { Task, TaskStatus, TaskCategory } from "@/lib/career-data";

const COLS: { key: TaskStatus; label: string }[] = [
  { key: "pending", label: "Pending" },
  { key: "in_progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
];
const CAT_ICON: Record<TaskCategory, typeof Code2> = {
  DSA: Code2, Outreach: Megaphone, "System Design": Network,
};
const CAT_COLOR: Record<TaskCategory, string> = {
  DSA: "bg-[oklch(0.6_0.2_30)]/20 text-[oklch(0.78_0.18_30)] ring-[oklch(0.6_0.2_30)]/40",
  Outreach: "bg-primary/20 text-primary ring-primary/40",
  "System Design": "bg-accent/20 text-accent ring-accent/40",
};
const PRIO_COLOR = { high: "text-destructive", medium: "text-warning", low: "text-muted-foreground" } as const;

export function ExecutionPipeline({ orientation = "horizontal" }: { orientation?: "horizontal" | "vertical" }) {
  const { tasks, setTaskStatus, toggleSubtask, addTime } = useCareer();
  const [active, setActive] = useState<Task | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const subProgress = (t: Task) => t.subtasks.length === 0 ? 0 : (t.subtasks.filter(s => s.done).length / t.subtasks.length) * 100;

  const renderCard = (t: Task) => {
    const Icon = CAT_ICON[t.category];
    const isOpen = expanded === t.id;
    const prog = subProgress(t);
    return (
      <motion.div layout key={t.id} className="rounded-lg bg-background/50 p-3 ring-1 ring-border transition hover:ring-primary/40">
        <div className="flex items-start justify-between gap-2">
          <div className={`flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ${CAT_COLOR[t.category]}`}>
            <Icon className="h-3 w-3" /> {t.category}
          </div>
          <Flag className={`h-3.5 w-3.5 ${PRIO_COLOR[t.priority]}`} />
        </div>
        <div className="mt-2 text-sm font-medium leading-snug">{t.title}</div>
        {t.subtasks.length > 0 && (
          <div className="mt-2">
            <Progress value={prog} className="h-1 bg-background" />
            <div className="mt-1 text-[10px] text-muted-foreground">{Math.round(prog)}% · {t.subtasks.filter(s=>s.done).length}/{t.subtasks.length}</div>
          </div>
        )}
        <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{t.timeSpent}m · {t.due}</span>
          <button onClick={() => setExpanded(isOpen ? null : t.id)} className="text-primary hover:underline">
            {isOpen ? "Less" : "More"}
          </button>
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="mt-2 space-y-2 border-t border-border pt-2">
                <p className="text-xs text-foreground/80">{t.description}</p>
                <div className="flex flex-wrap gap-1">
                  {COLS.filter(c => c.key !== t.status).map(c => (
                    <Button key={c.key} size="sm" variant="ghost" className="h-6 px-2 text-[10px]" onClick={() => setTaskStatus(t.id, c.key)}>
                      <ChevronRight className="mr-1 h-3 w-3" />{c.label}
                    </Button>
                  ))}
                  <Button size="sm" variant="ghost" className="h-6 px-2 text-[10px]" onClick={() => setActive(t)}>Open</Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  const wrap = orientation === "vertical" ? "grid gap-3" : "grid gap-3 md:grid-cols-3";

  return (
    <>
      <div className={wrap}>
        {COLS.map((c) => {
          const items = tasks.filter(t => t.status === c.key);
          return (
            <div key={c.key} className="glass rounded-xl p-3">
              <div className="mb-2 flex items-center justify-between px-1">
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{c.label}</div>
                <span className="rounded-full bg-primary/20 px-2 text-[10px] font-bold text-primary">{items.length}</span>
              </div>
              <div className="space-y-2">{items.map(renderCard)}</div>
            </div>
          );
        })}
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="glass-strong max-w-2xl border-border">
          {active && (
            <>
              <DialogHeader>
                <DialogTitle className="text-glow flex items-center gap-2 uppercase tracking-wider">
                  {active.title}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2 text-[11px]">
                  <span className={`rounded px-2 py-0.5 ring-1 ${CAT_COLOR[active.category]}`}>{active.category}</span>
                  <span className={`rounded bg-background/40 px-2 py-0.5 ring-1 ring-border ${PRIO_COLOR[active.priority]}`}>{active.priority.toUpperCase()}</span>
                  <span className="rounded bg-background/40 px-2 py-0.5 ring-1 ring-border">Due: {active.due}</span>
                  <span className="rounded bg-background/40 px-2 py-0.5 ring-1 ring-border">Time: {active.timeSpent}m</span>
                </div>
                <p className="text-sm text-foreground/90">{active.description}</p>
                <div>
                  <div className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">Subtasks</div>
                  <div className="space-y-1.5">
                    {active.subtasks.length === 0 && <div className="text-xs text-muted-foreground">No subtasks.</div>}
                    {active.subtasks.map(s => (
                      <button key={s.id} onClick={() => toggleSubtask(active.id, s.id)} className="flex w-full items-center gap-2 rounded bg-background/40 px-2 py-1.5 text-left text-xs hover:bg-background/60">
                        <span className={`grid h-4 w-4 place-items-center rounded ring-1 ${s.done ? "bg-primary text-primary-foreground ring-primary" : "ring-border"}`}>
                          {s.done && <Check className="h-3 w-3" />}
                        </span>
                        <span className={s.done ? "line-through opacity-60" : ""}>{s.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[15, 30, 60].map(m => (
                    <Button key={m} size="sm" variant="outline" onClick={() => addTime(active.id, m)}>
                      <Plus className="mr-1 h-3 w-3" />{m}m
                    </Button>
                  ))}
                  {COLS.filter(c => c.key !== active.status).map(c => (
                    <Button key={c.key} size="sm" onClick={() => { setTaskStatus(active.id, c.key); setActive({ ...active, status: c.key }); }}>
                      Move → {c.label}
                    </Button>
                  ))}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
