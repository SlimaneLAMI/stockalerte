'use client';

import { useEffect } from 'react';

// Pings /api/ping every 14 min 30 s (870 000 ms) to prevent
// Render.com free-tier servers from spinning down after 15 min of inactivity.
const INTERVAL_MS = 14 * 60 * 1000 + 30 * 1000; // 870 000 ms

export default function PingKeepAlive() {
  useEffect(() => {
    async function ping() {
      try {
        await fetch('/api/ping', { method: 'GET', cache: 'no-store' });
      } catch {
        // silently ignore — network errors don't matter here
      }
    }

    // First ping after 1 minute (let the app fully boot first)
    const firstTimeout = setTimeout(ping, 60_000);
    // Then every 14 min 30 s
    const interval = setInterval(ping, INTERVAL_MS);

    return () => {
      clearTimeout(firstTimeout);
      clearInterval(interval);
    };
  }, []);

  return null; // renders nothing
}
