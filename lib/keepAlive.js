let timer = null;

export function startKeepAlive() {
  if (typeof window !== 'undefined') return; // client-side: ne rien faire
  if (timer) return;                          // déjà démarré dans ce process

  const url = process.env.NEXTAUTH_URL;
  if (!url) return;

  // Ping toutes les 14 minutes (Render free tier dort après 15 min d'inactivité)
  timer = setInterval(() => {
    fetch(`${url}/api/ping`, { signal: AbortSignal.timeout(8000) }).catch(() => {});
  }, 14 * 60 * 1000);

  // Permet à Node de s'arrêter proprement sans être bloqué par le timer
  if (timer.unref) timer.unref();
}
