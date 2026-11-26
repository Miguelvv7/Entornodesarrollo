import { Quote } from 'lucide-react';
import { SceneShell } from '../components/SceneShell';
import { Reveal } from '../components/Reveal';
import { verdict, authorsText } from '../data/content';
import type { SceneProps } from './types';

const blocks: { key: keyof typeof verdict; label: string; ask: string }[] = [
  { key: 'comfortable', label: 'Lo que nos ha resultado cómodo', ask: '¿Qué función nos ha ahorrado más tiempo al programar?' },
  { key: 'improve', label: 'Lo que mejoraríamos', ask: '¿Qué nos ha costado más o qué echamos en falta?' },
  { key: 'vsEclipse', label: 'Frente a Eclipse', ask: 'Después de la Actividad 2.1, ¿con cuál trabajaríamos y por qué?' },
];

function Pending() {
  return <span className="rounded-full border border-[#E5B567]/40 px-2.5 py-0.5 font-mono text-[12px] uppercase tracking-[0.14em] text-[#E5B567]">Pendiente de redactar</span>;
}

export function S14Verdict({ index }: SceneProps) {
  return (
    <SceneShell index={index} glow="c" title={<>Nuestro <span className="text-lilac">veredicto</span>.</>}>
      <div className="flex h-full flex-col gap-10">
        <div className="grid grid-cols-3 gap-8">
          {blocks.map((b, i) => {
            const text = verdict[b.key];
            return (
              <Reveal key={b.key} delay={0.12 + i * 0.08} className="flex flex-col border-t border-line2 pt-6">
                <div className="flex flex-wrap items-center gap-y-2 font-mono text-[16px] uppercase tracking-[0.16em] text-lilac"><span className="mr-3">{b.label}</span>{!text && <Pending />}</div>
                <p className={`mt-4 text-[25px] leading-relaxed ${text ? 'text-snow/90' : 'italic text-mute/70'}`}>{text || b.ask}</p>
              </Reveal>
            );
          })}
        </div>
        <Reveal delay={0.4} className="relative mt-auto rounded-[28px] border border-line bg-surface/70 p-12">
          <Quote className="absolute -top-6 left-12 rounded-xl bg-ink p-1 text-lilac" size={44} />
          {verdict.conclusion ? (
            <p className="text-balance text-[40px] font-medium leading-snug tracking-tight text-snow">{verdict.conclusion}</p>
          ) : (
            <p className="text-[34px] leading-snug text-mute/70">
              <span className="mr-4 italic">Conclusión en una o dos frases, con nuestras palabras.</span><Pending />
            </p>
          )}
          <div className="mt-6 font-mono text-[17px] text-mute">— {authorsText()}</div>
        </Reveal>
      </div>
    </SceneShell>
  );
}
