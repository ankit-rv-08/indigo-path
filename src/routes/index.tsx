import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Bot, Activity, Cpu } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Career Command — Autonomous Career Architect" },
      { name: "description", content: "Personal AI OS for career intelligence: presence, outreach, execution pipeline, and timeline." },
      { property: "og:title", content: "Career Command" },
      { property: "og:description", content: "Personal AI OS for career intelligence." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/20 blur-[140px]" />
        <div className="absolute right-0 bottom-0 h-[400px] w-[600px] rounded-full bg-accent/20 blur-[120px]" />
      </div>

      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-primary/20 ring-1 ring-primary/40">
            <Cpu className="h-4 w-4 text-primary" />
          </div>
          <span className="text-glow text-sm font-bold uppercase tracking-[0.25em]">Career.OS</span>
        </div>
        <Link to="/dashboard" className="rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-foreground hover:bg-primary/20">
          Enter Console <ArrowRight className="ml-1 inline h-3 w-3" />
        </Link>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-24 pt-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-3 py-1.5 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[oklch(0.7_0.18_160)] opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[oklch(0.7_0.18_160)]" />
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">System Online · Placing</span>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-glow text-5xl font-bold uppercase tracking-tight md:text-7xl">
          Autonomous<br /><span className="bg-gradient-to-r from-primary via-accent to-[oklch(0.75_0.2_320)] bg-clip-text text-transparent">Career Architect</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mx-auto mt-5 max-w-xl text-sm text-muted-foreground md:text-base">
          A personal AI OS for placement. Presence matrix, outreach HUD, execution pipeline, and a tactical timeline locked on Dec 31, 2026.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/dashboard" className="shadow-glow inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-bold uppercase tracking-widest text-primary-foreground transition hover:bg-primary/90">
            Launch Dashboard <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/architect" className="inline-flex items-center gap-2 rounded-md border border-border bg-card/40 px-5 py-3 text-sm font-bold uppercase tracking-widest backdrop-blur-md hover:bg-card/60">
            <Bot className="h-4 w-4 text-accent" /> Full Architect View
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-16 grid gap-3 md:grid-cols-3">
          {[
            { icon: Activity, k: "Presence", v: "LinkedIn · GitHub · Resume" },
            { icon: Bot, k: "MIKE", v: "Persistent AI strategist" },
            { icon: Cpu, k: "Pipeline", v: "Kanban × DSA × Outreach" },
          ].map((c) => (
            <div key={c.k} className="glass rounded-xl p-5 text-left">
              <c.icon className="h-5 w-5 text-primary" />
              <div className="mt-3 text-[10px] font-bold uppercase tracking-widest text-primary">{c.k}</div>
              <div className="mt-1 text-sm text-foreground/90">{c.v}</div>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
