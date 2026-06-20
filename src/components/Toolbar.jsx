import { motion } from "framer-motion";
import { FolderPlus, FilePlus, Grid2x2, List, Lock } from "lucide-react";

export default function Toolbar({
  onNewFolder,
  onNewFile,
  viewMode,
  onToggleView,
  onLock,
}) {
  return (
    <div className="flex items-center gap-2">
      <ToolbarButton onClick={onNewFolder} icon={<FolderPlus className="h-4 w-4" />} label="new folder" />
      <ToolbarButton onClick={onNewFile} icon={<FilePlus className="h-4 w-4" />} label="new file" />

      <div className="ml-1 flex items-center rounded-lg border border-ink-600 bg-ink-800 p-0.5">
        <ViewToggle active={viewMode === "grid"} onClick={() => onToggleView("grid")}>
          <Grid2x2 className="h-4 w-4" />
        </ViewToggle>
        <ViewToggle active={viewMode === "list"} onClick={() => onToggleView("list")}>
          <List className="h-4 w-4" />
        </ViewToggle>
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onLock}
        title="lock and return to gate"
        className="ml-1 rounded-lg border border-ink-600 bg-ink-800 p-2 text-ink-500 transition-colors hover:border-rust-500/50 hover:text-rust-400"
      >
        <Lock className="h-4 w-4" />
      </motion.button>
    </div>
  );
}

function ToolbarButton({ onClick, icon, label }) {
  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-lg border border-ink-600 bg-ink-800 px-3 py-2 font-body text-sm text-paper-200 transition-colors hover:border-amber-600/50 hover:text-amber-400"
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </motion.button>
  );
}

function ViewToggle({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={
        active
          ? "rounded-md bg-ink-600 p-1.5 text-paper-100"
          : "rounded-md p-1.5 text-ink-500 hover:text-paper-300"
      }
    >
      {children}
    </button>
  );
}
