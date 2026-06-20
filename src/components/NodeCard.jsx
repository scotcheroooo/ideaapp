import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Folder, FileText, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { timeAgo } from "../lib/time.js";

export default function NodeCard({ node, onOpen, onRename, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pressTimer = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [menuOpen]);

  function startPress() {
    pressTimer.current = setTimeout(() => setMenuOpen(true), 480);
  }
  function cancelPress() {
    clearTimeout(pressTimer.current);
  }

  const isFolder = node.type === "folder";

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.15 } }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      onDoubleClick={() => onOpen(node)}
      onContextMenu={(e) => {
        e.preventDefault();
        setMenuOpen(true);
      }}
      onTouchStart={startPress}
      onTouchEnd={cancelPress}
      onTouchMove={cancelPress}
      className="group relative select-none"
    >
      <div
        className={
          isFolder
            ? "relative flex h-[124px] flex-col justify-between rounded-b-xl rounded-tr-xl border border-ink-600 bg-ink-700 p-3.5 shadow-card transition-colors group-hover:border-amber-600/60"
            : "relative flex h-[124px] flex-col justify-between rounded-xl border border-ink-600 bg-ink-700 p-3.5 shadow-card transition-colors group-hover:border-teal-500/60"
        }
        style={
          isFolder
            ? { clipPath: "polygon(0 14%, 34% 14%, 40% 2%, 100% 2%, 100% 100%, 0 100%)" }
            : undefined
        }
      >
        <div className="flex items-start justify-between">
          {isFolder ? (
            <Folder className="h-6 w-6 text-amber-500" strokeWidth={1.6} />
          ) : (
            <FileText className="h-6 w-6 text-teal-400" strokeWidth={1.6} />
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((v) => !v);
            }}
            className="rounded-md p-1 text-ink-500 opacity-0 transition-opacity hover:bg-ink-600 hover:text-paper-200 group-hover:opacity-100"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>

        <div>
          <div className="truncate font-body text-sm font-medium text-paper-100">
            {node.name}
          </div>
          <div className="mt-0.5 font-mono text-[11px] text-ink-500">
            {timeAgo(node.updatedAt)}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -4 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 top-full z-20 mt-1 w-36 overflow-hidden rounded-lg border border-ink-600 bg-ink-800 shadow-lifted"
          >
            <button
              onClick={() => {
                setMenuOpen(false);
                onRename(node);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left font-body text-sm text-paper-200 hover:bg-ink-700"
            >
              <Pencil className="h-3.5 w-3.5" />
              rename
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                onDelete(node);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left font-body text-sm text-rust-400 hover:bg-ink-700"
            >
              <Trash2 className="h-3.5 w-3.5" />
              delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
