import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function PageShell({ children, title, kicker }: { children: ReactNode; title: string; kicker?: string }) {
  return (
    <motion.div
      initial={{ x: 80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -40, opacity: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 28 }}
      className="mx-auto max-w-[1600px] px-6 py-6"
    >
      <div className="mb-6">
        {kicker && <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">{kicker}</div>}
        <h2 className="text-glow text-2xl font-bold uppercase tracking-wider md:text-3xl">{title}</h2>
      </div>
      {children}
    </motion.div>
  );
}
