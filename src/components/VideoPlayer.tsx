import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Pause, Play, RotateCcw, X, Clapperboard } from 'lucide-react';

export const videoSrc = (file: string) => `${import.meta.env.BASE_URL}videos/${file}`;

export interface VideoHandle {
  seek: (t: number, play?: boolean) => void;
}

interface Props {
  file: string;
  className?: string;
  /** se llama con el tiempo actual (para sincronizar pasos) */
  onTime?: (t: number) => void;
  label?: string;
  autoPlay?: boolean;
}

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

/** Reproductor de las grabaciones reales (sin sonido, controlado por el presentador). */
export const VideoPlayer = forwardRef<VideoHandle, Props>(function VideoPlayer({ file, className = '', onTime, label = 'Grabación real', autoPlay = false }, ref) {
  const v = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const [d, setD] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!autoPlay) return;
    const id = window.setTimeout(() => { v.current?.play().then(() => setStarted(true)).catch(() => {}); }, 450);
    return () => clearTimeout(id);
  }, [autoPlay]);

  useImperativeHandle(ref, () => ({
    seek: (time, play = true) => {
      const el = v.current;
      if (!el) return;
      el.currentTime = time;
      setStarted(true);
      if (play) el.play().catch(() => {});
    },
  }));

  const toggle = () => {
    const el = v.current;
    if (!el) return;
    setStarted(true);
    if (el.paused) el.play().catch(() => {}); else el.pause();
  };

  return (
    <div className={`relative overflow-hidden rounded-[18px] border border-line2 bg-black ${className}`}>
      <video
        ref={v}
        src={videoSrc(file)}
        muted
        playsInline
        preload="auto"
        className="h-full w-full object-contain"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onLoadedMetadata={(e) => setD(e.currentTarget.duration)}
        onTimeUpdate={(e) => { setT(e.currentTarget.currentTime); onTime?.(e.currentTarget.currentTime); }}
        onClick={toggle}
      />
      <span className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-ink/80 px-3 py-1 font-mono text-[13px] uppercase tracking-[0.14em] text-snow/90 backdrop-blur">
        <span className={`h-2 w-2 rounded-full ${playing ? 'animate-pulse bg-err' : 'bg-mute'}`} /> {label}
      </span>
      {!started && (
        <button onClick={toggle} className="absolute inset-0 grid place-items-center bg-ink/40 transition hover:bg-ink/25" aria-label="Reproducir">
          <span className="grid h-24 w-24 place-items-center rounded-full bg-snow text-ink shadow-[0_0_60px_rgba(139,92,246,0.6)]"><Play size={40} fill="currentColor" className="ml-1" /></span>
        </button>
      )}
      <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-black/85 to-transparent px-4 pb-3 pt-8">
        <button onClick={toggle} className="grid h-10 w-10 place-items-center rounded-lg bg-white/10 text-snow hover:bg-white/20" aria-label={playing ? 'Pausar' : 'Reproducir'}>
          {playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
        </button>
        <button onClick={() => { const el = v.current; if (el) { el.currentTime = 0; el.play().catch(() => {}); setStarted(true); } }} className="grid h-10 w-10 place-items-center rounded-lg bg-white/10 text-snow hover:bg-white/20" aria-label="Volver a empezar">
          <RotateCcw size={17} />
        </button>
        <div
          className="relative h-1.5 flex-1 cursor-pointer rounded-full bg-white/15"
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            const el = v.current;
            if (el && d) { el.currentTime = ((e.clientX - r.left) / r.width) * d; setStarted(true); }
          }}
        >
          <div className="h-full rounded-full bg-gradient-to-r from-violet to-sky" style={{ width: d ? `${(t / d) * 100}%` : '0%' }} />
        </div>
        <span className="font-mono text-[14px] tnum text-snow/80">{fmt(t)} / {fmt(d)}</span>
      </div>
    </div>
  );
});

/** Botón que abre la grabación real a pantalla completa (Esc para cerrar). */
export function VideoButton({ file, title }: { file: string; title: string }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopImmediatePropagation(); setOpen(false); }
      else if (['ArrowLeft', 'ArrowRight', ' ', 'PageDown', 'PageUp'].includes(e.key)) { e.stopImmediatePropagation(); }
    };
    window.addEventListener('keydown', h, true);
    return () => window.removeEventListener('keydown', h, true);
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-3 rounded-full border border-err/40 bg-err/10 py-2.5 pl-4 pr-5 text-[18px] font-medium text-snow transition hover:bg-err/20"
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-err text-ink"><Play size={15} fill="currentColor" className="ml-0.5" /></span>
        Ver nuestra grabación
      </button>
      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div className="fixed inset-0 z-[100] flex flex-col bg-ink/92 p-6 backdrop-blur-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label={title}>
              <div className="mb-4 flex items-center gap-3 text-snow">
                <Clapperboard size={20} className="text-lilac" />
                <span className="text-[18px] font-medium">{title}</span>
                <button onClick={() => setOpen(false)} className="ml-auto flex items-center gap-2 rounded-xl border border-line2 px-4 py-2 text-[15px] text-mute hover:text-snow" aria-label="Cerrar (Esc)">
                  <X size={16} /> Cerrar · Esc
                </button>
              </div>
              <motion.div className="min-h-0 flex-1" initial={{ scale: 0.97 }} animate={{ scale: 1 }}>
                <VideoPlayer file={file} className="h-full w-full" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}

/** Aviso clicable: la siguiente pantalla es nuestra grabación */
export function NextVideoHint({ onClick }: { onClick?: () => void }) {
  return (
    <button onClick={onClick} className="inline-flex items-center gap-3 rounded-full border border-err/40 bg-err/10 py-2.5 pl-4 pr-5 text-[18px] font-medium text-snow transition hover:bg-err/20">
      <span className="grid h-8 w-8 place-items-center rounded-full bg-err text-ink"><Play size={15} fill="currentColor" className="ml-0.5" /></span>
      Siguiente: nuestra grabación →
    </button>
  );
}
