import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

export default function Breadcrumb({ path, onNavigate }) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto font-mono text-sm text-paper-400">
      <motion.button
        onClick={() => onNavigate(-1)}
        whileTap={{ scale: 0.96 }}
        className="shrink-0 rounded-md px-2 py-1 text-amber-500 transition-colors hover:bg-ink-700"
      >
        idea.
      </motion.button>
      {path.map((crumb, i) => (
        <span key={crumb.id} className="flex shrink-0 items-center gap-1">
          <ChevronRight className="h-3.5 w-3.5 text-ink-500" />
          <motion.button
            onClick={() => onNavigate(i)}
            whileTap={{ scale: 0.96 }}
            className={
              i === path.length - 1
                ? "rounded-md px-2 py-1 text-paper-100"
                : "rounded-md px-2 py-1 transition-colors hover:bg-ink-700 hover:text-paper-200"
            }
          >
            {crumb.name}
          </motion.button>
        </span>
      ))}
    </div>
  );
}
