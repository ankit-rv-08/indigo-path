import { motion } from "framer-motion";
import { Activity, Radio } from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";

const navs = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/dashboard/presence", label: "Presence" },
  { to: "/dashboard/outreach", label: "Outreach" },
  { to: "/dashboard/pipeline", label: "Pipeline" },
  { to: "/dashboard/timeline", label: "Timeline" },
] as const;

export function CareerHeader() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <header className="glass-strong sticky top-0 z-30 border-b border-border">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-6 px-6 py-3">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="grid h-9 w-9 place-items-center rounded-md bg-primary/20 ring-1 ring-primary/40"
          >
            <Activity className="h-5 w-5 text-primary" />
          </motion.div>
          <div>
            <h1 className="text-glow text-sm font-bold uppercase tracking-[0.25em] text-foreground sm:text-base">
              Career Command
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Autonomous Career Architect
            </p>
          </div>
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {navs.map((n) => {
            const active = path === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`rounded-md px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition ${
                  active
                    ? "bg-primary/20 text-foreground shadow-glow"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 rounded-full border border-success/40 bg-success/10 px-3 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[oklch(0.7_0.18_160)] opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[oklch(0.7_0.18_160)]" />
          </span>
          <Radio className="h-3 w-3 text-[oklch(0.7_0.18_160)]" />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[oklch(0.85_0.15_160)]">
            System Status: Placing…
          </span>
        </div>
      </div>
    </header>
  );
}
