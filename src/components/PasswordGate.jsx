import { useState } from "react";
import { motion } from "framer-motion";
import { collection, getDocs } from "firebase/firestore";
import { Loader2, ArrowRight } from "lucide-react";
import { db } from "../firebase.js";
import { sha256Hex } from "../lib/crypto.js";
import { setSession } from "../lib/session.js";

export default function PasswordGate({ onUnlock }) {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("idle");
  const [shakeKey, setShakeKey] = useState(0);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!value.trim() || status === "checking") return;
    setStatus("checking");

    try {
      const hash = await sha256Hex(value);
      const snap = await getDocs(collection(db, "accessCodes"));
      const match = snap.docs.find((d) => d.data().hash === hash);

      if (match) {
        const name = match.data().name || "guest";
        setSession(name);
        setStatus("success");
        setTimeout(() => onUnlock(name), 550);
      } else {
        setStatus("error");
        setShakeKey((k) => k + 1);
        setValue("");
        setTimeout(() => setStatus("idle"), 1600);
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      setShakeKey((k) => k + 1);
      setTimeout(() => setStatus("idle"), 1600);
    }
  }

  return (
    <motion.div
      className="relative flex min-h-screen w-full items-center justify-center bg-ink-950 px-6"
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(transparent_31px,rgba(255,255,255,0.4)_32px),linear-gradient(90deg,transparent_31px,rgba(255,255,255,0.4)_32px)] [background-size:32px_32px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(232,163,61,0.08),transparent_60%)]" />

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 select-none font-display text-5xl font-medium tracking-tight text-paper-100"
        >
          idea<span className="text-amber-500">.</span>
        </motion.div>

        <motion.form
          key={shakeKey}
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 12 }}
          animate={
            status === "error"
              ? { x: [0, -10, 8, -6, 4, 0], opacity: 1, y: 0 }
              : { opacity: 1, y: 0 }
          }
          transition={
            status === "error"
              ? { duration: 0.45 }
              : { duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }
          }
          className="w-full"
        >
          <div className="flex w-full items-center gap-2 rounded-xl border border-ink-600 bg-ink-800 px-4 py-3 shadow-card transition-colors focus-within:border-amber-600">
            <span className="font-mono text-sm text-paper-400">code</span>
            <input
              autoFocus
              type="password"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={status === "checking" || status === "success"}
              placeholder="enter your access code"
              className="w-full bg-transparent font-mono text-sm text-paper-100 placeholder:text-ink-500 focus:outline-none"
            />
          </div>

          <motion.button
            type="submit"
            disabled={status === "checking" || status === "success"}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="relative mt-4 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-amber-500 py-3 font-display text-sm font-medium text-ink-950 disabled:opacity-80"
          >
            <span className="absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.35),transparent)] bg-[length:200%_100%] animate-shimmer" />
            {status === "checking" ? (
              <Loader2 className="relative z-10 h-4 w-4 animate-spin" />
            ) : (
              <>
                <span className="relative z-10">enter</span>
                <ArrowRight className="relative z-10 h-4 w-4" />
              </>
            )}
          </motion.button>

          <div className="mt-3 h-4 text-center font-mono text-xs text-rust-400">
            {status === "error" && "that code does not match any known access"}
          </div>
        </motion.form>
      </div>
    </motion.div>
  );
}
