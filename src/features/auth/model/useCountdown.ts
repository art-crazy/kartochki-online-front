"use client";

import { useEffect, useMemo, useState } from "react";

export function useCountdown(targetTimestamp: number | null) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!targetTimestamp) {
      return;
    }

    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(timer);
  }, [targetTimestamp]);

  return useMemo(() => {
    if (!targetTimestamp) {
      return 0;
    }

    return Math.max(0, Math.ceil((targetTimestamp - now) / 1000));
  }, [now, targetTimestamp]);
}
