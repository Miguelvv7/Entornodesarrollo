import { SceneShell } from '../components/SceneShell';
import { Reveal } from '../components/Reveal';
import { Screenshot } from '../components/Screenshot';
import { NextVideoHint } from '../components/VideoPlayer';
import { usePrint } from '../lib/mode';
import type { ScreenshotId } from '../data/screenshots';
import type { SceneProps } from './types';

const steps: { n: string; t: string; d: string; path: string; shot: ScreenshotId }[] = [
  { n: '01', t: 'Nuevo proyecto', d: 'Desde la pantalla de bienvenida (New → Project…) abrimos el asistente y elegimos Java.', path: 'New → Project…', shot: 'CAPTURA_REAL_NUEVO_PROYECTO' },
  { n: '02', t: 'Nombre y JDK', d: 'Lo llamamos PrimerProyecto, dejamos el build system de IntelliJ y elegimos el JDK 21.', path: 'Name · Build system · JDK', shot: 'CAPTURA_REAL_CONFIGURACION_PROYECTO' },
  { n: '03', t: 'Paquete y clase', d: 'Sobre src creamos el paquete y dentro la clase Main.', path: 'src → New → Package · Java Class', shot: 'CAPTURA_REAL_MAIN' },
];

export function S09FirstProject({ index, onNext }: SceneProps) {
  const print = usePrint();
  return (
    <SceneShell index={index} glow="tl" title={<>Nuestro primer proyecto, en <span className="text-lilac">tres pasos</span>.</>}>
      {!print && <div className="absolute -top-[104px] right-0"><NextVideoHint onClick={onNext} /></div>}
      <div className="relative grid h-full grid-cols-3 gap-8">
        {steps.map((s, i) => (
          <Reveal key={s.n} delay={0.15 + i * 0.12} className="flex min-h-0 flex-col">
            <div className="relative flex items-center gap-4">
              <span className="grid h-[60px] w-[60px] place-items-center rounded-full border border-lilac/50 bg-ink font-mono text-[22px] text-lilac">{s.n}</span>
              <span className="text-[34px] font-semibold tracking-tight">{s.t}</span>
            </div>
            <p className="mt-5 min-h-[64px] text-[21px] leading-snug text-mute">{s.d}</p>
            <div className="mt-3 inline-flex w-fit rounded-lg border border-line bg-surface px-3 py-1.5 font-mono text-[16px] text-snow/85">{s.path}</div>
            <Screenshot id={s.shot} className="mt-6 min-h-0 flex-1" />
          </Reveal>
        ))}
      </div>
    </SceneShell>
  );
}
