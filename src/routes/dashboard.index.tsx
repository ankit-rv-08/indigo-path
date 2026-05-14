import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Activity, Users, Layers, GitBranch, ArrowRight, Target, Calendar } from "lucide-react";
import { useCareer } from "@/lib/career-context";
import { PageShell } from "@/components/page-shell";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardHome,
});

function DashboardHome() {
  const { metrics, recruiters, tasks, milestones } = useCareer();
  const avg = Math.round(metrics.reduce((a, m) => a + m.score, 0) / metrics.length);
  const open = tasks.filter(t => t.status !== "completed").length;
  const done = tasks.filter(t => t.status === "completed").length;
  const next = milestones.find(m => m.status === "current");

  const cards = [
    { to: "/dashboard/presence", icon: Activity, kicker: "Presence Matrix", title: "Identity Score", value: `${avg}`, sub: "Avg across LinkedIn · GitHub · Resume" },
    { to: "/dashboard/outreach", icon: Users, kicker: "Outreach HUD", title: "Active Leads", value: `${recruiters.length}`, sub: `${recruiters.filter(r => r.match >= 90).length} hot · trading-table view` },
    { to: "/dashboard/pipeline", icon: Layers, kicker: "Execution Pipeline", title: "Today's Tasks", value: `${done}/${open + done}`, sub: "DSA · Outreach · System Design" },
  ];

  return (
    <PageShell kicker="Mission Control" title="Autonomous Career Architect">
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        {cards.map((c, i) => (
          <motion.div key={c.to} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Link to={c.to} className="group block">
              <div className="glass h-full rounded-xl p-5 transition hover:shadow-glow">
                <div className="flex items-start justify-between">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/15 ring-1 ring-primary/30">
                    <c.icon className="h-5 w-5 text-primary" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
                </div>
                <div className="mt-4 text-[10px] font-bold uppercase tracking-widest text-primary">{c.kicker}</div>
                <div className="mt-1 text-2xl font-bold">{c.title}</div>
                <div className="mt-3 flex items-end gap-2">
                  <span className="text-glow text-4xl font-bold">{c.value}</span>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">{c.sub}</div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Link to="/dashboard/timeline" className="group md:col-span-2">
          <div className="glass rounded-xl p-5 transition hover:shadow-glow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-accent">Master Timeline</div>
                <div className="mt-1 text-lg font-bold">{milestones.length} weeks · until Dec 31, 2026</div>
              </div>
              <Calendar className="h-5 w-5 text-accent" />
            </div>
            <div className="mt-4 flex h-14 items-end gap-1 overflow-hidden">
              {milestones.slice(0, 64).map((m) => (
                <div
                  key={m.id}
                  className={`flex-1 rounded-sm ${
                    m.status === "done" ? "bg-[oklch(0.7_0.18_160)]/70" :
                    m.status === "current" ? "bg-primary shadow-glow" :
                    m.status === "missed" ? "bg-destructive" : "bg-white/10"
                  }`}
                  style={{ height: `${20 + (m.week % 6) * 6}%` }}
                />
              ))}
            </div>
            {next && <div className="mt-3 text-xs text-muted-foreground">Next up: <span className="text-foreground">{next.title}</span> · week {next.week}</div>}
          </div>
        </Link>

        <div className="glass rounded-xl p-5">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <div className="text-[10px] font-bold uppercase tracking-widest text-primary">Target</div>
          </div>
          <div className="mt-2 text-3xl font-bold text-glow">15 LPA</div>
          <div className="mt-1 text-xs text-muted-foreground">Confidence: 62% · Trajectory: amber</div>
          <div className="mt-4 space-y-2 text-xs">
            <div className="flex items-center justify-between"><span>DSA</span><GitBranch className="h-3 w-3 text-muted-foreground" /></div>
            <div className="h-1.5 rounded-full bg-background/50"><div className="h-full w-[58%] rounded-full bg-primary" /></div>
            <div className="flex items-center justify-between"><span>Outreach</span></div>
            <div className="h-1.5 rounded-full bg-background/50"><div className="h-full w-[72%] rounded-full bg-accent" /></div>
            <div className="flex items-center justify-between"><span>System Design</span></div>
            <div className="h-1.5 rounded-full bg-background/50"><div className="h-full w-[44%] rounded-full bg-[oklch(0.78_0.17_75)]" /></div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
