import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, X, Plus, ChevronDown, Building2, Clock } from "lucide-react";
import { useCareer } from "@/lib/career-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";
import type { Recruiter } from "@/lib/career-data";

const TONES = ["Direct", "Warm", "Curious", "Confident"] as const;

export function OutreachHud({ variant = "feed" }: { variant?: "feed" | "table" }) {
  const { recruiters, notes, setNote, addRecruiterTag, removeRecruiterTag } = useCareer();
  const [drawerFor, setDrawerFor] = useState<Recruiter | null>(null);
  const [tone, setTone] = useState<(typeof TONES)[number]>("Direct");
  const [draft, setDraft] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [newTag, setNewTag] = useState("");

  const generate = (r: Recruiter) => {
    setDraft(
      `Hi ${r.name.split(" ")[0]}, saw you lead recruiting at ${r.company}. I'm targeting SDE roles in ${r.tags[0] ?? "backend"} systems and just shipped a project relevant to your stack. Open to a 15-min chat this week? — Ankith`
    );
    setTone("Direct");
    setDrawerFor(r);
  };

  if (variant === "table") {
    return (
      <div className="glass overflow-hidden rounded-xl">
        <div className="grid grid-cols-[1.4fr_1fr_0.8fr_auto] gap-3 border-b border-border bg-background/40 px-4 py-2 text-[10px] uppercase tracking-widest text-muted-foreground">
          <div>Contact</div><div>Company</div><div>Match %</div><div className="text-right">Action</div>
        </div>
        <div className="max-h-[420px] overflow-y-auto divide-y divide-border">
          {recruiters.map((r) => (
            <div key={r.id} className="grid grid-cols-[1.4fr_1fr_0.8fr_auto] items-center gap-3 px-4 py-2.5 text-xs hover:bg-white/[0.03]">
              <div>
                <div className="font-medium text-foreground">{r.name}</div>
                <div className="text-[10px] text-muted-foreground">{r.role}</div>
              </div>
              <div className="text-foreground/90">{r.company}</div>
              <div className={`font-mono font-bold ${r.match >= 90 ? "text-[oklch(0.78_0.17_160)]" : r.match >= 80 ? "text-primary" : "text-warning"}`}>
                {r.match}%
              </div>
              <div className="text-right">
                <Button size="sm" variant="ghost" onClick={() => generate(r)} className="h-7 text-[10px] uppercase tracking-wider hover:bg-primary/20">
                  <Sparkles className="mr-1 h-3 w-3" /> DM
                </Button>
              </div>
            </div>
          ))}
        </div>
        <DrawerView drawerFor={drawerFor} setDrawerFor={setDrawerFor} draft={draft} setDraft={setDraft} tone={tone} setTone={setTone} />
      </div>
    );
  }

  return (
    <>
      <div className="glass space-y-2 rounded-xl p-3">
        <div className="px-1 pb-1 text-[10px] uppercase tracking-widest text-muted-foreground">
          Target Recruiters · live feed
        </div>
        <div className="max-h-[560px] space-y-2 overflow-y-auto pr-1">
          {recruiters.map((r) => {
            const isOpen = expanded === r.id;
            return (
              <motion.div key={r.id} layout className="rounded-lg bg-background/40 p-3 ring-1 ring-border transition hover:ring-primary/40">
                <div className="flex items-start gap-3">
                  <div className="grid h-9 w-9 flex-none place-items-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                    {r.name.split(" ").map(s => s[0]).join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="truncate text-sm font-semibold">{r.name}</div>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${r.match >= 90 ? "bg-[oklch(0.7_0.18_160)]/20 text-[oklch(0.85_0.15_160)]" : "bg-primary/20 text-primary"}`}>
                        {r.match}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <Building2 className="h-3 w-3" /> {r.company}
                      <Clock className="ml-1 h-3 w-3" /> {r.lastActive}
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {r.tags.map(t => (
                        <span key={t} className="group flex items-center gap-1 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary/90">
                          {t}
                          <button onClick={() => removeRecruiterTag(r.id, t)} className="opacity-0 transition group-hover:opacity-100"><X className="h-2.5 w-2.5" /></button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex gap-1.5">
                  <Button size="sm" className="flex-1 bg-primary/90 text-[10px] uppercase tracking-wider hover:bg-primary" onClick={() => generate(r)}>
                    <Sparkles className="mr-1 h-3 w-3" /> Generate Cold DM
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setExpanded(isOpen ? null : r.id)} className="h-8 px-2">
                    <ChevronDown className={`h-3.5 w-3.5 transition ${isOpen ? "rotate-180" : ""}`} />
                  </Button>
                </div>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="mt-3 space-y-2 border-t border-border pt-2">
                        <div className="flex gap-1.5">
                          <Input value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="Add tag…" className="h-7 bg-background/40 text-xs" />
                          <Button size="sm" variant="outline" className="h-7" onClick={() => { if (newTag.trim()) { addRecruiterTag(r.id, newTag.trim()); setNewTag(""); } }}>
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Textarea value={notes[r.id] ?? ""} onChange={(e) => setNote(r.id, e.target.value)} placeholder="Notes / follow-ups…" className="min-h-[50px] bg-background/40 text-xs" />
                        <div className="text-[10px] text-muted-foreground">Last contact: never · Status: cold</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
      <DrawerView drawerFor={drawerFor} setDrawerFor={setDrawerFor} draft={draft} setDraft={setDraft} tone={tone} setTone={setTone} />
    </>
  );
}

function DrawerView({
  drawerFor, setDrawerFor, draft, setDraft, tone, setTone,
}: {
  drawerFor: Recruiter | null;
  setDrawerFor: (r: Recruiter | null) => void;
  draft: string; setDraft: (s: string) => void;
  tone: (typeof TONES)[number]; setTone: (t: (typeof TONES)[number]) => void;
}) {
  return (
    <Sheet open={!!drawerFor} onOpenChange={(o) => !o && setDrawerFor(null)}>
      <SheetContent className="glass-strong w-full border-l border-border sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-glow uppercase tracking-widest">Cold DM Studio</SheetTitle>
        </SheetHeader>
        {drawerFor && (
          <div className="mt-4 space-y-4">
            <div className="rounded-lg bg-background/40 p-3 ring-1 ring-border">
              <div className="text-sm font-semibold">{drawerFor.name}</div>
              <div className="text-xs text-muted-foreground">{drawerFor.role} · {drawerFor.company}</div>
            </div>
            <div>
              <div className="mb-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">Tone</div>
              <div className="flex flex-wrap gap-1.5">
                {TONES.map(t => (
                  <button key={t} onClick={() => setTone(t)} className={`rounded-full px-3 py-1 text-[11px] uppercase tracking-wider transition ${tone === t ? "bg-primary/30 text-foreground shadow-glow" : "bg-background/40 text-muted-foreground hover:text-foreground"}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">Draft</div>
              <Textarea value={draft} onChange={(e) => setDraft(e.target.value)} className="min-h-[180px] bg-background/40 text-sm" />
            </div>
            <div className="flex gap-2">
              <Button className="flex-1 bg-primary hover:bg-primary/90" onClick={() => { toast.success("DM sent ✦"); setDrawerFor(null); }}>
                <Send className="mr-2 h-4 w-4" /> Send
              </Button>
              <Button variant="outline" onClick={() => setDraft(draft + "\n\nP.S. Happy to share a Loom of my latest project.")}>
                <Sparkles className="mr-2 h-4 w-4" /> Refine
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
