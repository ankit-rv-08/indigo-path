import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Linkedin, Github, FileText, TrendingUp, TrendingDown, Sparkles, ChevronDown } from "lucide-react";
import { useCareer } from "@/lib/career-context";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const ICONS: Record<string, typeof Linkedin> = {
  linkedin: Linkedin,
  github: Github,
  resume: FileText,
};

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * 100},${100 - ((v - min) / range) * 100}`)
    .join(" ");
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-16 w-full">
      <defs>
        <linearGradient id="sg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.65 0.26 277)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="oklch(0.65 0.26 277)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={pts} fill="none" stroke="oklch(0.7 0.25 295)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      <polygon points={`0,100 ${pts} 100,100`} fill="url(#sg)" />
    </svg>
  );
}

export function PresenceMatrix({ compact = false }: { compact?: boolean }) {
  const { metrics, notes, setNote } = useCareer();
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className={compact ? "grid gap-3" : "grid gap-4 md:grid-cols-3"}>
      {metrics.map((m) => {
        const Icon = ICONS[m.id] ?? Linkedin;
        const Trend = m.delta >= 0 ? TrendingUp : TrendingDown;
        const isOpen = open === m.id;
        return (
          <motion.div
            key={m.id}
            layout
            className="glass rounded-xl p-4 transition hover:shadow-glow"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/15 ring-1 ring-primary/30">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{m.label}</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-glow">{m.score}</span>
                    <span className={`flex items-center gap-1 text-xs font-medium ${m.delta >= 0 ? "text-[oklch(0.78_0.17_160)]" : "text-destructive"}`}>
                      <Trend className="h-3 w-3" /> {m.delta >= 0 ? "+" : ""}{m.delta}
                    </span>
                  </div>
                </div>
              </div>
              <button onClick={() => setOpen(isOpen ? null : m.id)} className="rounded-md p-1.5 text-muted-foreground hover:bg-white/5 hover:text-foreground">
                <ChevronDown className={`h-4 w-4 transition ${isOpen ? "rotate-180" : ""}`} />
              </button>
            </div>

            <div className="mt-3"><Sparkline data={m.history} /></div>

            <div className="mt-3 flex gap-2">
              <Button
                size="sm"
                className="w-full bg-primary/90 text-xs uppercase tracking-wider hover:bg-primary"
                onClick={() => toast.success(`AI generating update for ${m.label}…`)}
              >
                <Sparkles className="mr-1.5 h-3 w-3" /> Generate Update
              </Button>
            </div>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 space-y-3 border-t border-border pt-3">
                    <div>
                      <div className="mb-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">AI Improvement Tips</div>
                      <ul className="space-y-1.5">
                        {m.tips.map((t, i) => (
                          <li key={i} className="flex gap-2 text-xs text-foreground/90">
                            <span className="text-primary">▸</span>{t}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="mb-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">Notes</div>
                      <Textarea
                        value={notes[m.id] ?? ""}
                        onChange={(e) => setNote(m.id, e.target.value)}
                        placeholder="Personal observations…"
                        className="min-h-[60px] bg-background/40 text-xs"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
