import { motion } from "framer-motion";
import { FolderOpen } from "lucide-react";

export default function EmptyState({ label }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center gap-3 py-20 text-center"
    >
      <FolderOpen className="h-9 w-9 text-ink-600" strokeWidth={1.4} />
      <p className="font-body text-sm text-ink-500">{label}</p>
    </motion.div>
  );
}
