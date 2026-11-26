import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ImageOff, Maximize2, X, ZoomIn, ZoomOut } from 'lucide-react';
import { screenshots, screenshotSrc, type ScreenshotId } from '../data/screenshots';
import { usePrint } from '../lib/mode';

type Status = 'loading' | 'ok' | 'missing';

export function useImageStatus(src: string) {
  const [status, setStatus] = useState<Status>('loading');
  useEffect(() => {
    let alive = true;
    const img = new Image();
    img.onload = () => alive && setStatus('ok');
    img.onerror = () => alive && setStatus('missing');
    img.src = src;
    return () => { alive = false; };
  }, [src]);
  return status;
}

interface Props {
  id: ScreenshotId;
  className?: string;
  /** contenido superpuesto (p. ej. zonas interactivas) */
  children?: ReactNode;
  /** qué mostrar si la captura falta (por defecto, placeholder estándar) */
  fallback?: ReactNode;
  caption?: boolean;
  compact?: boolean;
}

/** Captura real de IntelliJ IDEA o, si aún no existe el archivo, un placeholder que lo indica. */
export function Screenshot({ id, className = '', children, fallback, caption = true, compact = false }: Props) {
  const s = screenshots[id];
  const src = screenshotSrc(id);
  const status = useImageStatus(src);
  const print = usePrint();
  const [open, setOpen] = useState(false);

  return (
    <figure className={`relative flex min-h-0 flex-col ${className}`} data-shot={id} data-status={status}>
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-[18px] border border-line2 bg-surface">
        {status === 'ok' ? (
          <>
            <img src={src} alt={s.title} className="h-full w-full object-contain object-center" />
            {!print && (
              <button
                onClick={() => setOpen(true)}
                className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-xl border border-line2 bg-ink/70 text-snow/80 backdrop-blur transition hover:text-snow"
                aria-label={`Ampliar captura: ${s.title}`}
              >
                <Maximize2 size={20} />
              </button>
            )}
          </>
        ) : status === 'missing' ? (
          fallback ?? <Placeholder id={id} compact={compact} />
        ) : (
          <div className="h-full w-full animate-pulse bg-raised/40" />
        )}
        {children}
      </div>
      {caption && (
        <figcaption className="mt-3 flex items-baseline gap-3 font-mono text-[15px] text-mute">
          <span className="text-lilac/80">fig.</span>
          <span className="truncate">{s.title}</span>
          {status === 'missing' && <span className="ml-auto shrink-0 text-[13px] uppercase tracking-[0.14em] text-[#E5B567]">Pendiente</span>}
        </figcaption>
      )}
      {!print && <Lightbox open={open} onClose={() => setOpen(false)} src={src} title={s.title} description={s.description} />}
    </figure>
  );
}

export function Placeholder({ id, compact = false }: { id: ScreenshotId; compact?: boolean }) {
  const s = screenshots[id];
  return (
    <div className={`relative flex h-full w-full flex-col items-center justify-center overflow-hidden text-center ${compact ? 'gap-2 p-4' : 'gap-4 p-8'}`}>
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{ backgroundImage: 'repeating-linear-gradient(135deg, rgba(248,250,252,0.035) 0 2px, transparent 2px 18px)' }}
      />
      <div className="relative grid h-14 w-14 place-items-center rounded-2xl border border-line2 bg-raised text-mute">
        <ImageOff size={26} />
      </div>
      <div className="relative font-mono text-[15px] uppercase tracking-[0.16em] text-[#E5B567]">Captura pendiente</div>
      <div className={`relative break-all font-mono text-snow/80 ${compact ? 'text-[13px]' : 'text-[17px]'}`}>[{s.id}]</div>
      {!compact && <p className="relative max-w-[560px] text-[18px] leading-snug text-mute">{s.description}</p>}
      <div className={`relative break-all font-mono text-mute/70 ${compact ? 'text-[12px]' : 'text-[14px]'}`}>public/screenshots/{s.file}</div>
    </div>
  );
}

export function Lightbox({ open, onClose, src, title, description }: { open: boolean; onClose: () => void; src: string; title: string; description?: string }) {
  const [zoom, setZoom] = useState(false);
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopImmediatePropagation(); onClose(); }
      else if (['ArrowLeft', 'ArrowRight', ' ', 'PageDown', 'PageUp'].includes(e.key)) { e.stopImmediatePropagation(); e.preventDefault(); }
    };
    window.addEventListener('keydown', h, true);
    return () => window.removeEventListener('keydown', h, true);
  }, [open, onClose]);
  useEffect(() => { if (!open) setZoom(false); }, [open]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col bg-ink/90 backdrop-blur-xl"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          role="dialog" aria-modal="true" aria-label={title}
        >
          <div className="flex items-center gap-4 px-6 py-4 text-snow">
            <div className="min-w-0">
              <div className="truncate text-[17px] font-medium">{title}</div>
              {description && <div className="truncate text-[14px] text-mute">{description}</div>}
            </div>
            <button onClick={() => setZoom((z) => !z)} className="ml-auto grid h-10 w-10 place-items-center rounded-xl border border-line2 hover:bg-white/5" aria-label={zoom ? 'Ajustar a pantalla' : 'Ver a tamaño real'}>
              {zoom ? <ZoomOut size={18} /> : <ZoomIn size={18} />}
            </button>
            <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-xl border border-line2 hover:bg-white/5" aria-label="Cerrar (Esc)">
              <X size={18} />
            </button>
          </div>
          <div className={`scroll-thin min-h-0 flex-1 ${zoom ? 'overflow-auto' : 'overflow-hidden'} p-6 pt-0`} onClick={(e) => e.target === e.currentTarget && onClose()}>
            <motion.img
              src={src} alt={title}
              onClick={() => setZoom((z) => !z)}
              className={`mx-auto rounded-xl border border-line2 ${zoom ? 'max-w-none cursor-zoom-out' : 'h-full w-full cursor-zoom-in object-contain'}`}
              initial={{ scale: 0.97, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
