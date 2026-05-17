let started = false;

export function startKeepAlive() {
  if (started || typeof window !== 'undefined' || !process.env.NEXTAUTH_URL) return;
  started = true;

  const pingUrl = `${process.env.NEXTAUTH_URL}/api/ping`;

  setInterval(async () => {
    try {
      await fetch(pingUrl);
    } catch {
      // silently ignore — server may be waking up
    }
  }, 10 * 60 * 1000);
}
