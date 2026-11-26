import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CHANNEL, type DeckMsg } from './hooks/useDeck';
import { useTimer } from './hooks/useTimer';
import { NotesBody, TimerBlock, IconBtn } from './components/DeckChrome';
import { scenes } from './data/content';

/** Ventana independiente para el presentador (se sincroniza con la presentación). */
export default function PresenterWindow() {
  const [index, setIndex] = useState(0);
  const timer = useTimer(600);
  const chan = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    document.title = 'Vista del presentador';
    const c = new BroadcastChannel(CHANNEL);
    chan.current = c;
    c.onmessage = (e: MessageEvent<DeckMsg>) => { if (e.data.type === 'state') setIndex(e.data.index); };
    c.postMessage({ type: 'hello' } satisfies DeckMsg);
    return () => { if (chan.current === c) chan.current = null; c.close(); };
  }, []);

  const goto = (n: number) => {
    const c = Math.min(Math.max(n, 0), scenes.length - 1);
    try { chan.current?.postMessage({ type: 'goto', index: c } satisfies DeckMsg); } catch { /* cerrado */ }
  };

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); goto(index + 1); }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); goto(index - 1); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  });

  return (
    <div className="flex h-full flex-col bg-ink p-8 text-snow">
      <div className="flex items-center gap-3">
        <div className="font-mono text-[12px] uppercase tracking-[0.2em] text-mute">Vista del presentador</div>
        <div className="ml-auto flex items-center gap-2">
          <span className="mr-2 font-mono text-[14px] tnum text-mute"><span className="text-snow">{String(index + 1).padStart(2, '0')}</span> / {scenes.length}</span>
          <IconBtn label="Anterior" onClick={() => goto(index - 1)} disabled={index === 0}><ChevronLeft size={17} /></IconBtn>
          <IconBtn label="Siguiente" onClick={() => goto(index + 1)} disabled={index === scenes.length - 1}><ChevronRight size={17} /></IconBtn>
        </div>
      </div>
      <div className="mt-2 grid min-h-0 flex-1 grid-cols-[1fr_340px] gap-8">
        <div className="flex min-h-0 flex-col"><NotesBody index={index} /></div>
        <div><TimerBlock timer={timer} /></div>
      </div>
    </div>
  );
}
