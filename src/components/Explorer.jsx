import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase.js";
import { createNode, renameNode, deleteNodeRecursive } from "../lib/nodes.js";
import { clearSession } from "../lib/session.js";
import Breadcrumb from "./Breadcrumb.jsx";
import Toolbar from "./Toolbar.jsx";
import NodeCard from "./NodeCard.jsx";
import EmptyState from "./EmptyState.jsx";
import Modal from "./Modal.jsx";

export default function Explorer({ personName, onLock }) {
  const [path, setPath] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [modal, setModal] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const currentFolderId = path.length ? path[path.length - 1].id : null;

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, "nodes"), where("parentId", "==", currentFolderId));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => {
        if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
      setNodes(list);
      setLoading(false);
    });
    return () => unsub();
  }, [currentFolderId]);

  function navigateTo(index) {
    if (index === -1) setPath([]);
    else setPath(path.slice(0, index + 1));
  }

  function openNode(node) {
    if (node.type === "folder") {
      setPath([...path, { id: node.id, name: node.name }]);
    } else {
      setModal({ type: "fileStub", target: node });
    }
  }

  function askCreate(type) {
    setInputValue("");
    setModal({ type: type === "folder" ? "createFolder" : "createFile" });
  }

  function askRename(node) {
    setInputValue(node.name);
    setModal({ type: "rename", target: node });
  }

  function askDelete(node) {
    setModal({ type: "delete", target: node });
  }

  async function submitCreate(type) {
    const name = inputValue.trim();
    if (!name) return;
    await createNode({ name, type, parentId: currentFolderId, ownerName: personName });
    setModal(null);
  }

  async function submitRename() {
    const name = inputValue.trim();
    if (!name || !modal.target) return;
    await renameNode(modal.target.id, name);
    setModal(null);
  }

  async function confirmDelete() {
    if (!modal.target) return;
    await deleteNodeRecursive(modal.target.id);
    setModal(null);
  }

  function handleLock() {
    clearSession();
    onLock();
  }

  const emptyLabel =
    currentFolderId === null
      ? "no spaces yet, create the first folder to get started"
      : "this folder is empty";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-ink-900"
    >
      <header className="sticky top-0 z-10 flex flex-col gap-3 border-b border-ink-700 bg-ink-900/95 px-5 py-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <Breadcrumb path={path} onNavigate={navigateTo} />
        <Toolbar
          onNewFolder={() => askCreate("folder")}
          onNewFile={() => askCreate("file")}
          viewMode={viewMode}
          onToggleView={setViewMode}
          onLock={handleLock}
        />
      </header>

      <main className="px-5 py-6">
        {loading ? (
          <div className="py-20 text-center font-mono text-xs text-ink-500">loading</div>
        ) : nodes.length === 0 ? (
          <EmptyState label={emptyLabel} />
        ) : (
          <motion.div
            layout
            className={
              viewMode === "grid"
                ? "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
                : "flex flex-col gap-2"
            }
          >
            <AnimatePresence mode="popLayout">
              {nodes.map((node) => (
                <NodeCard
                  key={node.id}
                  node={node}
                  onOpen={openNode}
                  onRename={askRename}
                  onDelete={askDelete}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      <Modal open={!!modal} onClose={() => setModal(null)}>
        {() => {
          if (!modal) return null;

          if (modal.type === "createFolder" || modal.type === "createFile") {
            const type = modal.type === "createFolder" ? "folder" : "file";
            return (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submitCreate(type);
                }}
              >
                <h2 className="font-display text-base text-paper-100">
                  new {type}
                </h2>
                <input
                  autoFocus
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={type === "folder" ? "folder name" : "file name"}
                  className="mt-3 w-full rounded-lg border border-ink-600 bg-ink-900 px-3 py-2 font-body text-sm text-paper-100 placeholder:text-ink-500 focus:border-amber-600 focus:outline-none"
                />
                <ModalActions onCancel={() => setModal(null)} confirmLabel="create" />
              </form>
            );
          }

          if (modal.type === "rename") {
            return (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submitRename();
                }}
              >
                <h2 className="font-display text-base text-paper-100">rename</h2>
                <input
                  autoFocus
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="mt-3 w-full rounded-lg border border-ink-600 bg-ink-900 px-3 py-2 font-body text-sm text-paper-100 focus:border-amber-600 focus:outline-none"
                />
                <ModalActions onCancel={() => setModal(null)} confirmLabel="save" />
              </form>
            );
          }

          if (modal.type === "delete") {
            return (
              <div>
                <h2 className="font-display text-base text-paper-100">
                  delete {modal.target.type}
                </h2>
                <p className="mt-2 font-body text-sm text-ink-400">
                  {modal.target.type === "folder"
                    ? `this removes "${modal.target.name}" and everything inside it. this cannot be undone.`
                    : `this removes "${modal.target.name}" permanently. this cannot be undone.`}
                </p>
                <ModalActions
                  onCancel={() => setModal(null)}
                  confirmLabel="delete"
                  danger
                  onConfirm={confirmDelete}
                />
              </div>
            );
          }

          if (modal.type === "fileStub") {
            return (
              <div>
                <h2 className="font-display text-base text-paper-100">
                  {modal.target.name}
                </h2>
                <p className="mt-2 font-body text-sm text-ink-400">
                  the text editor for opening and writing inside files arrives in the
                  next phase. for now this file exists and can be renamed, moved later,
                  or deleted.
                </p>
                <div className="mt-5 flex justify-end">
                  <button
                    onClick={() => setModal(null)}
                    className="rounded-lg bg-ink-600 px-4 py-2 font-body text-sm text-paper-100 hover:bg-ink-500"
                  >
                    close
                  </button>
                </div>
              </div>
            );
          }

          return null;
        }}
      </Modal>
    </motion.div>
  );
}

function ModalActions({ onCancel, onConfirm, confirmLabel, danger }) {
  return (
    <div className="mt-5 flex justify-end gap-2">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-lg px-4 py-2 font-body text-sm text-ink-400 hover:text-paper-200"
      >
        cancel
      </button>
      <button
        type={onConfirm ? "button" : "submit"}
        onClick={onConfirm}
        className={
          danger
            ? "rounded-lg bg-rust-500 px-4 py-2 font-body text-sm text-paper-100 hover:bg-rust-400"
            : "rounded-lg bg-amber-500 px-4 py-2 font-body text-sm text-ink-950 hover:bg-amber-400"
        }
      >
        {confirmLabel}
      </button>
    </div>
  );
}
