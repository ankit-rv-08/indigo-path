import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SUGGESTIONS = [
  "What's my next move?",
  "Critique my LinkedIn",
  "Mock interview me",
  "Explain caching tradeoffs",
];

export function MikeSidebar() {
  const [open, setOpen] = useState(true);
  const [msg, setMsg] = useState("");
  const [log, setLog] = useState<{ from: "mike" | "me"; text: string }[]>([
    { from: "mike", text: "Hey Ankith. You're 3 days behind on DSA. Want a 25-min sprint plan?" },
  ]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setLog((p) => [
      ...p,
      { from: "me", text },
      { from: "mike", text: "Acknowledged. Strategizing… (placeholder reply)" },
    ]);
    setMsg("");
  };

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onClick={() => setOpen(true)}
            className="glass fixed right-4 top-1/2 z-40 -translate-y-1/2 rounded-full p-3 shadow-glow"
          >
            <Bot className="h-5 w-5 text-primary" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: 360, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 360, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 26 }}
            className="glass-strong fixed right-0 top-0 z-40 flex h-screen w-[340px] flex-col border-l border-border"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-md bg-primary/20 ring-1 ring-primary/40">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="text-glow text-xs font-bold uppercase tracking-widest">MIKE</div>
                  <div className="text-[10px] text-muted-foreground">AI Strategist · online</div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="rounded p-1 text-muted-foreground hover:bg-white/5 hover:text-foreground">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {log.map((m, i) => (
                <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs ${m.from === "me" ? "bg-primary/30 text-foreground" : "bg-background/50 text-foreground/90 ring-1 ring-border"}`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border p-3">
              <div className="mb-2 flex flex-wrap gap-1">
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => send(s)} className="rounded-full bg-background/50 px-2 py-0.5 text-[10px] text-muted-foreground ring-1 ring-border hover:text-foreground">
                    <Sparkles className="mr-1 inline h-2.5 w-2.5" />{s}
                  </button>
                ))}
              </div>
              <form onSubmit={(e) => { e.preventDefault(); send(msg); }} className="flex gap-2">
                <Input value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Ask MIKE…" className="h-9 bg-background/40 text-xs" />
                <Button size="sm" className="h-9 bg-primary hover:bg-primary/90" type="submit">
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </form>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
