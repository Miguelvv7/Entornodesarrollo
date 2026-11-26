import { useRef, useState } from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';
import { SceneShell, Panel, Label } from '../components/SceneShell';
import { Reveal } from '../components/Reveal';
import { Screenshot } from '../components/Screenshot';
import { VideoPlayer, type VideoHandle } from '../components/VideoPlayer';
import { usePrint } from '../lib/mode';
import type { SceneProps } from './types';

/** Momentos del vídeo ia.mp4 (segundos) */
const steps = [
  { t: 0, title: 'Código que no compila', text: 'En el ejercicio ej250 falta el bucle que busca la letra.' },
  { t: 2.7, title: 'Abrimos una sesión de IA', text: 'Botón New Session de la barra superior: el agente trabaja dentro del IDE.' },
  { t: 6, title: 'Lo pedimos con nuestras palabras', text: '"Hola, ¿me puedes corregir el 250? No sé cómo se hace."' },
  { t: 13, title: 'Lee el proyecto', text: 'Lista las carpetas y abre ej250.java para entender el ejercicio.' },
  { t: 19.5, title: 'Propone el cambio y lo prueba', text: 'Añade el while (líneas en verde), compila y prueba los dos casos del enunciado.' },
  { t: 22.5, title: 'Explica la solución', text: 'Qué faltaba y cómo funciona cada línea.' },
  { t: 27, title: 'Código corregido en el editor', text: 'El cambio queda en el archivo, listo para revisarlo y ejecutarlo.' },
];

export function S12Ai({ index }: SceneProps) {
  const print = usePrint();
  const player = useRef<VideoHandle>(null);
  const [t, setT] = useState(0);
  const current = steps.reduce((acc, s, i) => (t >= s.t ? i : acc), 0);

  return (
    <SceneShell index={index} glow="br" title={<>Programar con <span className="text-lilac">IA</span> dentro del IDE.</>}>
      <div className="flex h-full gap-8">
        <Reveal delay={0.1} className="flex min-w-0 flex-1 flex-col gap-3">
          {print ? (
            <div className="grid min-h-0 flex-1 grid-cols-2 gap-5">
              <Screenshot id="CAPTURA_REAL_IA_DIFF" className="h-full" />
              <Screenshot id="CAPTURA_REAL_IA_RESPUESTA" className="h-full" />
            </div>
          ) : (
            <VideoPlayer ref={player} file="ia.mp4" className="min-h-0 flex-1" onTime={setT} autoPlay label="Grabación real · acelerada" />
          )}
          <p className="text-[17px] text-mute">IntelliJ permite abrir sesiones de agentes de IA en el propio editor. En la prueba usamos Claude Code sobre nuestro proyecto bateria10.</p>
        </Reveal>

        <div className="flex w-[520px] shrink-0 flex-col gap-4">
          <Reveal delay={0.16}>
            <Panel className="p-5">
              <div className="mb-3 flex items-center gap-2"><Sparkles size={18} className="text-lilac" /><Label>{print ? 'Lo que pasa en la grabación' : 'Pulsa un paso para saltar a ese momento'}</Label></div>
              <ol className="grid gap-1">
                {steps.map((s, i) => {
                  const on = !print && i === current;
                  const Item = print ? 'div' : 'button';
                  return (
                    <li key={s.t}>
                      <Item
                        {...(print ? {} : { onClick: () => player.current?.seek(s.t) })}
                        className={`flex w-full gap-3 rounded-xl px-3 py-2 text-left transition ${on ? 'bg-violet/15 ring-1 ring-lilac/50' : print ? '' : 'hover:bg-white/[0.04]'}`}
                      >
                        <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full font-mono text-[13px] ${on ? 'bg-lilac text-ink' : 'bg-white/[0.08] text-lilac'}`}>{i + 1}</span>
                        <span>
                          <span className="block text-[18px] font-medium text-snow">{s.title}</span>
                          <span className="block text-[15px] leading-snug text-mute">{s.text}</span>
                        </span>
                      </Item>
                    </li>
                  );
                })}
              </ol>
            </Panel>
          </Reveal>
          <Reveal delay={0.22} className="mt-auto">
            <div className="flex gap-4 rounded-2xl border border-ok/30 bg-ok/[0.06] p-5">
              <ShieldCheck size={24} className="mt-0.5 shrink-0 text-ok" />
              <p className="text-[17px] leading-snug text-snow/85"><span className="font-medium text-snow">La IA propone, nosotros decidimos.</span> Hay que leer el cambio y entenderlo antes de aceptarlo: si no, no aprendemos ni sabemos si es correcto.</p>
            </div>
          </Reveal>
        </div>
      </div>
    </SceneShell>
  );
}
