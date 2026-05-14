import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  initialMetrics,
  initialRecruiters,
  initialTasks,
  buildMilestones,
  type Metric,
  type Recruiter,
  type Task,
  type TaskStatus,
  type Milestone,
} from "./career-data";

interface CareerCtx {
  metrics: Metric[];
  recruiters: Recruiter[];
  tasks: Task[];
  milestones: Milestone[];
  notes: Record<string, string>;
  setNote: (id: string, v: string) => void;
  toggleSubtask: (taskId: string, subId: string) => void;
  setTaskStatus: (taskId: string, s: TaskStatus) => void;
  addTime: (taskId: string, mins: number) => void;
  addRecruiterTag: (id: string, tag: string) => void;
  removeRecruiterTag: (id: string, tag: string) => void;
  dsaIncomplete: boolean;
  missingCachingMilestone: boolean;
}

const Ctx = createContext<CareerCtx | null>(null);

export function CareerProvider({ children }: { children: ReactNode }) {
  const [metrics] = useState(initialMetrics);
  const [recruiters, setRecruiters] = useState(initialRecruiters);
  const [tasks, setTasks] = useState(initialTasks);
  const [milestones] = useState(buildMilestones);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const value = useMemo<CareerCtx>(() => ({
    metrics, recruiters, tasks, milestones, notes,
    setNote: (id, v) => setNotes(p => ({ ...p, [id]: v })),
    toggleSubtask: (taskId, subId) => setTasks(p => p.map(t =>
      t.id === taskId ? { ...t, subtasks: t.subtasks.map(s => s.id === subId ? { ...s, done: !s.done } : s) } : t
    )),
    setTaskStatus: (taskId, s) => setTasks(p => p.map(t => t.id === taskId ? { ...t, status: s } : t)),
    addTime: (taskId, mins) => setTasks(p => p.map(t => t.id === taskId ? { ...t, timeSpent: t.timeSpent + mins } : t)),
    addRecruiterTag: (id, tag) => setRecruiters(p => p.map(r => r.id === id ? { ...r, tags: Array.from(new Set([...r.tags, tag])) } : r)),
    removeRecruiterTag: (id, tag) => setRecruiters(p => p.map(r => r.id === id ? { ...r, tags: r.tags.filter(t => t !== tag) } : r)),
    dsaIncomplete: tasks.some(t => t.isDsaDaily && t.status !== "completed"),
    missingCachingMilestone: milestones.some(m => m.status === "missed" && m.title.toLowerCase().includes("caching")),
  }), [metrics, recruiters, tasks, milestones, notes]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCareer() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCareer must be used within CareerProvider");
  return ctx;
}
