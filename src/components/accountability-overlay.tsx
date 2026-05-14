import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";
import { useCareer } from "@/lib/career-context";

export function AccountabilityOverlay({ variant = "top" }: { variant?: "top" | "bottom" }) {
  const { dsaIncomplete, missingCachingMilestone } = useCareer();
  const [dismissed, setDismissed] = useState(false);
  const show = (dsaIncomplete || missingCachingMilestone) && !dismissed;

  const message = missingCachingMilestone
    ? "TRAJECTORY ALERT: MISSING MILESTONE 'SYSTEM DESIGN: CACHING'. SYSTEM RESTRICTIONS ACTIVE."
    : "ANKITH: YOU ARE FALLING BEHIND THE 15 LPA TARGET.";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: variant === "bottom" ? 60 : -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: variant === "bottom" ? 60 : -60, opacity: 0 }}
          transition={{ type: "spring", stiffness: 240, damping: 24 }}
          className={`fixed left-1/2 z-50 -translate-x-1/2 ${variant === "bottom" ? "bottom-4" : "top-20"}`}
        >
          <div className="animate-pulse-alert flex items-center gap-3 rounded-full border border-destructive/60 bg-destructive/15 px-5 py-2.5 backdrop-blur-xl">
            <AlertTriangle className="h-4 w-4 flex-none text-destructive" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-destructive-foreground">
              {message}
            </span>
            <button onClick={() => setDismissed(true)} className="rounded-full p-0.5 text-destructive-foreground/80 hover:bg-white/10">
              <X className="h-3 w-3" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
