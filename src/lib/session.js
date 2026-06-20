const SESSION_KEY = "idea_session";

export function getSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setSession(name) {
  sessionStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ name, unlockedAt: Date.now() })
  );
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}
