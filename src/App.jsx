import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import PasswordGate from "./components/PasswordGate.jsx";
import Explorer from "./components/Explorer.jsx";
import { getSession } from "./lib/session.js";

export default function App() {
  const existing = getSession();
  const [personName, setPersonName] = useState(existing?.name ?? null);

  return (
    <AnimatePresence mode="wait">
      {personName ? (
        <Explorer key="explorer" personName={personName} onLock={() => setPersonName(null)} />
      ) : (
        <PasswordGate key="gate" onUnlock={(name) => setPersonName(name)} />
      )}
    </AnimatePresence>
  );
}
