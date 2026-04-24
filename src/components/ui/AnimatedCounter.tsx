'use client';

import { useEffect, useRef, useState } from 'react';

export default function AnimatedCounter({
  from = 0,
  to,
  duration = 1200,
  suffix = '',
}: {
  from?: number;
  to: number;
  duration?: number;
  suffix?: string;
}) {
  const [value, setValue] = useState(from);
  const start = useRef<number | null>(null);

  useEffect(() => {
    const step = (timestamp: number) => {
      if (start.current === null) start.current = timestamp;
      const progress = Math.min((timestamp - start.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const next = Math.floor(from + (to - from) * eased);
      setValue(next);
      if (progress < 1) requestAnimationFrame(step);
    };
    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [from, to, duration]);

  return <span>{value.toLocaleString()}<span className="ml-1">{suffix}</span></span>;
}