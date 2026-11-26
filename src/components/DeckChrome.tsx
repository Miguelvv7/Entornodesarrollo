import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, LayoutGrid, Maximize, Minimize, NotebookPen, X, Play, Pause, RotateCcw, ExternalLink } from 'lucide-react';
import { scenes, sections, type SectionId } from '../data/content';
import type { Panel } from '../hooks/useDeck';
import { useTimer } from '../hooks/useTimer';

interface Props {
  index: number;
  sub: number;
  go: (n: number, s?: number) => void;
  next: () => void;
  prev: () => void;
  panel: Panel;
  setPanel: (p: Panel) => void;
  toggleFullscreen: () => void;
}

const pad = (n: number) => String(n).padStart(2, '0');
const sectionOrder = Object.keys(sections) as SectionId[];

/** Controles de presentación. Viven fuera del lienzo 16:9 y nunca salen en el PDF. */
export function DeckChrome({ index, sub, go, next, prev, panel, setPanel, toggleFullscreen }: Props) {
  const [idle, setIdle] = useState(false);
  const [fs, setFs] = useState(false);
  const timer = useTimer(600);
  const t = useRef<number>();

  useEffect(() => {
    const wake = () => {
      setIdle(false);
      window.clearTimeout(t.current);
      t.current = window.setTimeout(() => setIdle(true), 2600);
    };
    wake();
    window.addEventListener('mousemove', wake);
    window.addEventListener('keydown', wake);
    window.addEventListener('touchstart', wake);
    const onFs = () => setFs(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFs);
    return () => {
      window.removeEventListener('mousemove', wake);
      window.removeEventListener('keydown', wake);
      window.removeEventListener('touchstart', wake);
      document.removeEventListener('fullscreenchange', onFs);
      window.clearTimeout(t.current);
    };
  }, []);

  const s = scenes[index];
  const visible = !idle || panel !== null;

  const openPresenterWindow = () => {
    const url = `${location.pathname}?presenter${location.hash}`;
    window.open(url, 'presenter', 'width=1100,height=720');
  };

  return (
    <>
      {/* barra de progreso */}
      <div className="fixed inset-x-0 top-0 z-40 h-[3px] bg-white/[0.04]">
        <motion.div
          className="h-full bg-gradient-to-r from-violet via-lilac to-sky"
          animate={{ width: `${((index + 1) / scenes.length) * 100}%` }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {/* barra inferior */}
      <motion.div
        className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-4 px-[max(20px,env(safe-area-inset-left))] pb-[max(14px,env(safe-area-inset-bottom))] pt-3"
        animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 8 }}
        transition={{ duration: 0.3 }}
        style={{ pointerEvents: visible ? 'auto' : 'none' }}
      >
        <div className="hidden min-w-0 items-center gap-3 font-mono text-[12px] uppercase tracking-[0.16em] text-mute md:flex">
          <span className="text-lilac">{sections[s.section]}</span>
          <span className="text-mute/40">/</span>
          <span className="truncate normal-case tracking-normal text-snow/70">{s.title}</span>
        </div>

        <nav className="mx-auto hidden items-center gap-1 rounded-full border border-line bg-surface/80 p-1 backdrop-blur lg:flex" aria-label="Secciones">
          {sectionOrder.map((sec) => {
            const first = scenes.findIndex((x) => x.section === sec);
            const active = s.section === sec;
            return (
              <button
                key={sec}
                onClick={() => go(first)}
                className={`rounded-full px-3.5 py-1.5 text-[12px] transition ${active ? 'bg-white/[0.08] text-snow' : 'text-mute hover:text-snow'}`}
              >
                {sections[sec]}
              </button>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 lg:ml-0">
          {sub === 1 && <span className="mr-1 rounded-full bg-err/15 px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider text-err">vídeo</span>}
          <span className="mr-2 font-mono text-[13px] tnum text-mute">
            <span className="text-snow">{pad(index + 1)}</span> / {pad(scenes.length)}
          </span>
          <IconBtn label="Anterior (←)" onClick={prev} disabled={index === 0}><ChevronLeft size={17} /></IconBtn>
          <IconBtn label="Siguiente (→ / espacio)" onClick={next} disabled={index === scenes.length - 1 && !(scenes[index].video && sub === 0)}><ChevronRight size={17} /></IconBtn>
          <span className="mx-1 h-5 w-px bg-line2" />
          <IconBtn label="Secciones (S)" onClick={() => setPanel(panel === 'sections' ? null : 'sections')} active={panel === 'sections'}><LayoutGrid size={16} /></IconBtn>
          <IconBtn label="Notas del presentador (N)" onClick={() => setPanel(panel === 'notes' ? null : 'notes')} active={panel === 'notes'}><NotebookPen size={16} /></IconBtn>
          <IconBtn label="Pantalla completa (F)" onClick={toggleFullscreen}>{fs ? <Minimize size={16} /> : <Maximize size={16} />}</IconBtn>
        </div>
      </motion.div>

      {/* panel de secciones */}
      <AnimatePresence>
        {panel === 'sections' && (
          <motion.div
            className="fixed inset-0 z-50 overflow-y-auto bg-ink/85 px-[max(24px,env(safe-area-inset-left))] py-12 backdrop-blur-xl"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && setPanel(null)}
          >
            <div className="mx-auto max-w-[1180px]">
              <div className="mb-8 flex items-center">
                <div className="font-mono text-[12px] uppercase tracking-[0.2em] text-mute">Índice · {scenes.length} escenas</div>
                <button onClick={() => setPanel(null)} className="ml-auto grid h-9 w-9 place-items-center rounded-xl border border-line2 text-mute hover:text-snow" aria-label="Cerrar (Esc)"><X size={16} /></button>
              </div>
              <div className="grid gap-8">
                {sectionOrder.map((sec) => (
                  <div key={sec}>
                    <div className="mb-3 text-[13px] font-medium text-lilac">{sections[sec]}</div>
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                      {scenes.map((sc, i) => sc.section !== sec ? null : (
                        <motion.button
                          key={sc.key}
                          onClick={() => { go(i); setPanel(null); }}
                          className={`group rounded-2xl border p-4 text-left transition ${i === index ? 'border-lilac/60 bg-violet/[0.08]' : 'border-line bg-surface hover:border-line2'}`}
                          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.015 }}
                        >
                          <div className="font-mono text-[11px] tracking-[0.18em] text-mute">{pad(i + 1)} · {sc.code.toUpperCase()}</div>
                          <div className="mt-2 text-[15px] text-snow">{sc.title}</div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* notas del presentador */}
      <AnimatePresence>
        {panel === 'notes' && (
          <motion.aside
            className="fixed bottom-0 right-0 top-0 z-50 flex w-[min(460px,100vw)] flex-col border-l border-line bg-surface/95 p-6 backdrop-blur-xl"
            initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 40, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            aria-label="Notas del presentador"
          >
            <div className="flex items-center">
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-mute">Notas · privado</div>
              <button onClick={() => setPanel(null)} className="ml-auto grid h-8 w-8 place-items-center rounded-lg border border-line2 text-mute hover:text-snow" aria-label="Cerrar (Esc)"><X size={15} /></button>
            </div>
            <TimerBlock timer={timer} />
            <NotesBody index={index} />
            <button onClick={openPresenterWindow} className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-line2 py-2.5 text-[13px] text-mute hover:text-snow">
              <ExternalLink size={14} /> Abrir vista del presentador en otra ventana
            </button>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

export function TimerBlock({ timer }: { timer: ReturnType<typeof useTimer> }) {
  const pct = Math.max(0, timer.remaining / timer.total);
  const late = timer.remaining < 0;
  return (
    <div className="mt-5 rounded-2xl border border-line bg-ink/60 p-4">
      <div className="flex items-center gap-3">
        <div className={`font-mono text-[34px] font-medium tnum ${late ? 'text-err' : timer.remaining < 120 ? 'text-[#E5B567]' : 'text-snow'}`}>{timer.label}</div>
        <div className="ml-auto flex gap-1.5">
          <IconBtn label={timer.running ? 'Pausar' : 'Iniciar'} onClick={timer.toggle}>{timer.running ? <Pause size={15} /> : <Play size={15} />}</IconBtn>
          <IconBtn label="Reiniciar" onClick={timer.reset}><RotateCcw size={15} /></IconBtn>
        </div>
      </div>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.06]">
        <div className="h-full bg-gradient-to-r from-violet to-sky transition-[width] duration-500" style={{ width: `${pct * 100}%` }} />
      </div>
      <div className="mt-2 text-[12px] text-mute">Objetivo: 8–10 minutos</div>
    </div>
  );
}

export function NotesBody({ index }: { index: number }) {
  const s = scenes[index];
  const nextScene = scenes[index + 1];
  const elapsed = scenes.slice(0, index).reduce((a, x) => a + x.seconds, 0);
  return (
    <div className="scroll-thin mt-5 min-h-0 flex-1 overflow-y-auto">
      <div className="font-mono text-[12px] tracking-[0.14em] text-lilac">{pad(index + 1)} · {s.code.toUpperCase()}</div>
      <div className="mt-1 text-[22px] font-medium text-snow">{s.title}</div>
      <div className="mt-1 text-[12px] text-mute">≈ {s.seconds} s · deberías ir por el minuto {Math.floor(elapsed / 60)}:{pad(elapsed % 60)}</div>
      <ul className="mt-5 grid gap-3">
        {s.notes.map((n, i) => (
          <li key={i} className="flex gap-3 text-[16px] leading-relaxed text-snow/85">
            <span className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-lilac" />
            <span>{n}</span>
          </li>
        ))}
      </ul>
      {s.video && (
        <div className="mt-4 rounded-xl border border-err/30 bg-err/[0.06] p-3 text-[14px] text-snow/85">
          Al avanzar (→) se abre nuestra grabación: <span className="text-snow">{s.video.title}</span>. Se reproduce sola y los capítulos de la derecha saltan a cada momento.
        </div>
      )}
      {s.qa && s.qa.length > 0 && (
        <div className="mt-6">
          <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[#E5B567]">Posibles preguntas · {s.qa.length}</div>
          <div className="grid gap-1.5">
            {s.qa.map((x) => (
              <details key={x.q} className="group rounded-xl border border-line bg-ink/40 px-3 py-2">
                <summary className="cursor-pointer list-none text-[14px] font-medium text-snow/90 marker:hidden">
                  <span className="mr-2 text-lilac transition group-open:rotate-90">›</span>{x.q}
                </summary>
                <p className="mt-2 text-[14px] leading-relaxed text-mute">{x.a}</p>
              </details>
            ))}
          </div>
        </div>
      )}
      {nextScene && (
        <div className="mt-6 rounded-xl border border-line p-3 text-[13px] text-mute">
          Siguiente → <span className="text-snow/80">{nextScene.title}</span>
        </div>
      )}
    </div>
  );
}

export function IconBtn({ children, label, onClick, disabled, active }: { children: ReactNode; label: string; onClick: () => void; disabled?: boolean; active?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={`grid h-9 w-9 place-items-center rounded-xl border transition disabled:opacity-30 ${
        active ? 'border-lilac/50 bg-violet/15 text-snow' : 'border-line bg-surface/80 text-mute backdrop-blur hover:border-line2 hover:text-snow'
      }`}
    >
      {children}
    </button>
  );
}
