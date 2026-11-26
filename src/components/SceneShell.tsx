import type { ReactNode } from 'react';
import { Reveal } from './Reveal';
import { scenes } from '../data/content';

interface Props {
  index: number;
  title: ReactNode;
  lead?: ReactNode;
  children: ReactNode;
  /** posición del halo de luz ambiental */
  glow?: 'tl' | 'tr' | 'bl' | 'br' | 'c';
  className?: string;
}

const glowPos: Record<NonNullable<Props['glow']>, string> = {
  tl: '-top-64 -left-40', tr: '-top-64 -right-40', bl: '-bottom-72 -left-40', br: '-bottom-72 -right-40', c: 'top-1/3 left-1/2 -translate-x-1/2',
};

/** Marco común de las escenas 02–14: etiqueta, título grande, entradilla y contenido. */
export function SceneShell({ index, title, lead, children, glow = 'tr', className = '' }: Props) {
  const s = scenes[index];
  return (
    <section className="absolute inset-0 overflow-hidden">
      <div className={`pointer-events-none absolute h-[760px] w-[1100px] rounded-full bg-violet/[0.13] blur-[140px] ${glowPos[glow]}`} />
      <div className="pointer-events-none absolute inset-0 grid-fade opacity-60" />
      <div className={`relative flex h-full flex-col px-[120px] pb-[96px] pt-[92px] ${className}`}>
        <Reveal className="mb-6 flex items-center gap-4 font-mono text-[19px] uppercase tracking-[0.22em] text-mute">
          <span className="text-lilac">{String(index + 1).padStart(2, '0')}</span>
          <span className="h-px w-12 bg-line2" />
          <span>{s.code}</span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="max-w-[1500px] text-balance text-[76px] font-semibold leading-[1.02] tracking-tightest text-snow">{title}</h2>
        </Reveal>
        {lead && (
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-[1080px] text-[27px] leading-[1.45] text-mute">{lead}</p>
          </Reveal>
        )}
        <div className="relative mt-12 min-h-0 flex-1">{children}</div>
      </div>
    </section>
  );
}

/** Tarjeta base con borde fino */
export function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-[22px] border border-line bg-surface/80 backdrop-blur ${className}`}>{children}</div>;
}

export function Label({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`font-mono text-[16px] uppercase tracking-[0.18em] text-mute ${className}`}>{children}</div>;
}

export function SimBadge({ children = 'Simulación interactiva' }: { children?: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-sky/30 bg-sky/[0.06] px-4 py-1.5 font-mono text-[15px] uppercase tracking-[0.14em] text-sky">
      <span className="h-1.5 w-1.5 rounded-full bg-sky" />
      {children}
    </span>
  );
}

export function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="rounded-md border border-line2 bg-raised px-2 py-0.5 font-mono text-[0.85em] text-snow/90">{children}</kbd>;
}
