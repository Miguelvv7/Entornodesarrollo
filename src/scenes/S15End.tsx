import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, ChevronDown, ExternalLink } from 'lucide-react';
import { meta, sources, authorsText } from '../data/content';
import { usePrint } from '../lib/mode';
import { Reveal } from '../components/Reveal';
import type { SceneProps } from './types';

function SourceList({ cols, size }: { cols: number; size: 'sm' | 'md' }) {
  return (
    <ol className="grid gap-x-12 gap-y-3" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
      {sources.map((s, i) => (
        <li key={s.url} className="flex min-w-0 gap-3">
          <span className={`shrink-0 font-mono text-lilac ${size === 'sm' ? 'text-[14px]' : 'text-[15px]'}`}>{String(i + 1).padStart(2, '0')}</span>
          <div className="min-w-0">
            <div className={`${size === 'sm' ? 'text-[17px]' : 'text-[18px]'} leading-tight text-snow`}>{s.title} <span className="text-mute">· {s.publisher}</span></div>
            <a href={s.url} target="_blank" rel="noreferrer" className={`break-all font-mono text-sky/90 hover:text-sky ${size === 'sm' ? 'text-[13px]' : 'text-[14px]'}`}>{s.url}</a>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function S15End({ index }: SceneProps) {
  const print = usePrint();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.stopImmediatePropagation(); setOpen(false); } };
    window.addEventListener('keydown', h, true);
    return () => window.removeEventListener('keydown', h, true);
  }, [open]);

  const glow = (
    <>
      <div className="pointer-events-none absolute left-1/2 top-[40%] h-[900px] w-[1600px] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: 'radial-gradient(closest-side, rgba(139,92,246,0.26), rgba(56,189,248,0.08) 60%, transparent 78%)' }} />
      <div className="pointer-events-none absolute inset-0 grid-fade opacity-70" />
    </>
  );

  if (print) {
    return (
      <section className="absolute inset-0 overflow-hidden">
        {glow}
        <div className="relative flex h-full flex-col px-[120px] pb-[90px] pt-[80px]">
          <h2 className="text-[92px] font-semibold leading-[0.95] tracking-tightest">Good code deserves <span className="text-lilac">good tools.</span></h2>
          <div className="mt-5 text-[28px] text-mute">Gracias por vuestra atención. — {authorsText()}</div>
          <div className="mt-12 flex items-center gap-3 font-mono text-[16px] uppercase tracking-[0.2em] text-mute"><BookOpen size={18} className="text-lilac" /> Webgrafía</div>
          <div className="mt-6"><SourceList cols={2} size="md" /></div>
          <div className="mt-auto font-mono text-[14px] text-mute/70">Consultadas en noviembre de 2026.</div>
        </div>
      </section>
    );
  }

  return (
    <section className="absolute inset-0 overflow-hidden">
      {glow}
      <div className="relative flex h-full flex-col items-center justify-center px-[120px] text-center">
        <Reveal className="font-mono text-[20px] uppercase tracking-[0.42em] text-mute">{String(index + 1).padStart(2, '0')} — The End</Reveal>
        <h2 className="mt-10 text-[150px] font-semibold leading-[0.92] tracking-tightest">
          {['Good code', 'deserves', 'good tools.'].map((w, i) => (
            <span key={w} className="block overflow-hidden pb-[0.06em]">
              <motion.span
                className={`block ${i === 2 ? 'bg-gradient-to-r from-lilac via-violet to-sky bg-clip-text text-transparent' : ''}`}
                initial={{ y: '100%' }} animate={{ y: '0%' }} transition={{ duration: 0.9, delay: 0.15 + i * 0.14, ease: [0.22, 1, 0.36, 1] }}
              >
                {w}
              </motion.span>
            </span>
          ))}
        </h2>
        <Reveal delay={0.7} className="mt-10 text-[32px] text-mute">Gracias por vuestra atención.</Reveal>
        <Reveal delay={0.85} className="mt-12">
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-3 rounded-full border border-line2 bg-surface/70 px-7 py-3.5 text-[20px] text-snow/90 transition hover:border-lilac/50"
            aria-expanded={open}
          >
            <BookOpen size={20} className="text-lilac" /> Webgrafía <ChevronDown size={18} className="text-mute" />
          </button>
        </Reveal>
        <Reveal delay={1} className="absolute bottom-[64px] font-mono text-[18px] text-mute">{meta.authors.join('  ·  ')}  ·  {meta.course}</Reveal>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div className="absolute inset-0 bg-ink/70 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <motion.div
              className="absolute inset-x-[120px] bottom-0 flex max-h-[78%] flex-col rounded-t-[28px] border border-b-0 border-line2 bg-surface p-10"
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              role="dialog" aria-label="Webgrafía"
            >
              <div className="mb-8 flex items-center gap-3">
                <BookOpen size={22} className="text-lilac" />
                <span className="font-mono text-[17px] uppercase tracking-[0.2em] text-mute">Webgrafía · {sources.length} fuentes</span>
                <button onClick={() => setOpen(false)} className="ml-auto flex items-center gap-2 rounded-xl border border-line2 px-4 py-2 text-[16px] text-mute hover:text-snow">Cerrar <span className="font-mono text-[13px]">Esc</span></button>
              </div>
              <div className="scroll-thin min-h-0 overflow-y-auto pr-2"><SourceList cols={2} size="md" /></div>
              <div className="mt-6 flex items-center gap-2 text-[15px] text-mute"><ExternalLink size={14} /> Los enlaces se abren en una pestaña nueva.</div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
