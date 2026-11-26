import { useEffect, useRef, useState } from 'react';

/** Cuenta atrás (por defecto 10 minutos) para controlar la duración de la exposición. */
export function useTimer(total = 600) {
  const [remaining, setRemaining] = useState(total);
  const [running, setRunning] = useState(false);
  const last = useRef<number | null>(null);

  useEffect(() => {
    if (!running) { last.current = null; return; }
    let raf = 0;
    const tick = (t: number) => {
      if (last.current != null) setRemaining((r) => r - (t - last.current!) / 1000);
      last.current = t;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running]);

  const fmt = (s: number) => {
    const neg = s < 0; const a = Math.abs(Math.round(s));
    return `${neg ? '-' : ''}${String(Math.floor(a / 60)).padStart(2, '0')}:${String(a % 60).padStart(2, '0')}`;
  };
  return {
    remaining, running, label: fmt(remaining), total,
    toggle: () => setRunning((r) => !r),
    reset: () => { setRunning(false); setRemaining(total); },
  };
}
