import { useCallback, useEffect, useRef, useState } from 'react';
import { scenes } from '../data/content';

export const CHANNEL = 'intellij-beyond-the-code';
export type DeckMsg = { type: 'goto'; index: number } | { type: 'state'; index: number } | { type: 'hello' };

const fromHash = () => {
  const m = location.hash.match(/^#escena-(\d+)$/);
  const n = m ? parseInt(m[1], 10) - 1 : 0;
  return Math.min(Math.max(n, 0), scenes.length - 1);
};

export type Panel = 'sections' | 'notes' | null;

export function useDeck() {
  const [index, setIndex] = useState(fromHash);
  const [sub, setSub] = useState(0);
  const [dir, setDir] = useState(1);
  const subRef = useRef(0);
  subRef.current = sub;
  const [panel, setPanel] = useState<Panel>(null);
  const chan = useRef<BroadcastChannel | null>(null);
  const indexRef = useRef(index);
  indexRef.current = index;

  const steps = (i: number) => (scenes[i]?.video ? 2 : 1);
  const go = useCallback((n: number, s = 0) => {
    const c = Math.min(Math.max(n, 0), scenes.length - 1);
    if (c === indexRef.current && s === subRef.current) return;
    setDir(c > indexRef.current || (c === indexRef.current && s > subRef.current) ? 1 : -1);
    setIndex(c);
    setSub(s);
  }, []);
  const next = useCallback(() => {
    const i = indexRef.current;
    if (subRef.current < steps(i) - 1) go(i, subRef.current + 1);
    else go(i + 1, 0);
  }, [go]);
  const prev = useCallback(() => {
    const i = indexRef.current;
    if (subRef.current > 0) go(i, subRef.current - 1);
    else if (i > 0) go(i - 1, steps(i - 1) - 1);
  }, [go]);

  // hash + sincronización con la ventana del presentador
  useEffect(() => {
    try { history.replaceState(null, '', `#escena-${index + 1}`); } catch { /* sin acceso al historial */ }
    try { chan.current?.postMessage({ type: 'state', index } satisfies DeckMsg); } catch { /* canal cerrado */ }
  }, [index]);

  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return;
    const c = new BroadcastChannel(CHANNEL);
    chan.current = c;
    c.onmessage = (e: MessageEvent<DeckMsg>) => {
      if (e.data.type === 'goto') go(e.data.index);
      if (e.data.type === 'hello') { try { c.postMessage({ type: 'state', index: indexRef.current } satisfies DeckMsg); } catch { /* cerrado */ } }
    };
    return () => { if (chan.current === c) chan.current = null; c.close(); };
  }, [go]);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else document.documentElement.requestFullscreen?.().catch(() => {});
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName))) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      switch (e.key) {
        case 'ArrowRight': case 'PageDown': case ' ':
          // la barra espaciadora sobre un botón lo activa: no avanzar también
          if (e.key === ' ' && t?.tagName === 'BUTTON') return;
          e.preventDefault(); next(); break;
        case 'ArrowLeft': case 'PageUp': e.preventDefault(); prev(); break;
        case 'Home': go(0); break;
        case 'End': go(scenes.length - 1); break;
        case 'f': case 'F': toggleFullscreen(); break;
        case 's': case 'S': setPanel((p) => (p === 'sections' ? null : 'sections')); break;
        case 'n': case 'N': setPanel((p) => (p === 'notes' ? null : 'notes')); break;
        case 'Escape': setPanel(null); break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, go, toggleFullscreen]);

  return { index, sub, dir, go, next, prev, panel, setPanel, toggleFullscreen };
}
