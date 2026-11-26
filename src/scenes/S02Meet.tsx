import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Building2, Code2, KeyRound, MonitorCog } from 'lucide-react';
import { SceneShell, Panel, Label } from '../components/SceneShell';
import { Reveal } from '../components/Reveal';
import { usePrint } from '../lib/mode';
import type { SceneProps } from './types';

const licenses = [
  {
    id: 'free',
    name: 'Núcleo gratuito',
    tag: 'Gratis',
    text: 'Incluye lo necesario para Java y Kotlin: editor, Maven/Gradle, Git y depurador. Su código base es abierto (Apache 2.0).',
  },
  {
    id: 'ultimate',
    name: 'Suscripción Ultimate',
    tag: 'De pago',
    text: 'Desbloquea las herramientas avanzadas: frameworks empresariales como Spring, desarrollo web y bases de datos completas. 30 días de prueba.',
  },
  {
    id: 'edu',
    name: 'Licencia educativa',
    tag: 'La nuestra',
    text: 'Gratuita para estudiantes y uso no comercial. Da acceso a las funciones Ultimate. La obtuvimos con el GitHub Student Developer Pack.',
  },
];

export function S02Meet({ index }: SceneProps) {
  const print = usePrint();
  const [lic, setLic] = useState('edu');

  return (
    <SceneShell
      index={index}
      glow="tl"
      title={<>Un IDE creado para <span className="text-lilac">Java y Kotlin</span>.</>}
      lead="Un entorno integrado de desarrollo: editor, compilación, ejecución, depuración y control de versiones en una sola aplicación."
    >
      <div className="grid h-full grid-cols-12 grid-rows-2 gap-6">
        {/* Desarrollador */}
        <Reveal delay={0.15} className="col-span-4 row-span-1">
          <Panel className="flex h-full flex-col p-8">
            <div className="flex items-center gap-3"><Building2 className="text-lilac" size={26} /><Label>Desarrollador</Label></div>
            <div className="mt-auto">
              <div className="text-[52px] font-semibold tracking-tight">JetBrains</div>
              <p className="mt-2 text-[21px] leading-snug text-mute">Empresa fundada en 2000 en Praga. Primera versión de IntelliJ IDEA: <span className="text-snow">2001</span>. También crea Kotlin y PyCharm.</p>
            </div>
          </Panel>
        </Reveal>

        {/* Licencias */}
        <Reveal delay={0.22} className="col-span-8 row-span-1">
          <Panel className="flex h-full flex-col p-8">
            <div className="flex items-center gap-3">
              <KeyRound className="text-lilac" size={26} />
              <Label>Licencia · un único producto desde la versión 2025.3</Label>
            </div>
            {print ? (
              <div className="mt-6 grid flex-1 grid-cols-3 gap-5">
                {licenses.map((l) => (
                  <div key={l.id} className={`rounded-2xl border p-5 ${l.id === 'edu' ? 'border-lilac/50 bg-violet/[0.08]' : 'border-line'}`}>
                    <div className="flex items-center justify-between"><span className="text-[22px] font-medium">{l.name}</span><span className="font-mono text-[13px] uppercase tracking-wider text-lilac">{l.tag}</span></div>
                    <p className="mt-2 text-[17px] leading-snug text-mute">{l.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 grid flex-1 grid-cols-[340px_1fr] gap-8">
                <div className="flex flex-col gap-2" role="tablist" aria-label="Tipos de licencia">
                  {licenses.map((l) => (
                    <button
                      key={l.id}
                      role="tab"
                      aria-selected={lic === l.id}
                      onClick={() => setLic(l.id)}
                      className={`flex items-center justify-between rounded-xl border px-5 py-3.5 text-left text-[21px] transition ${
                        lic === l.id ? 'border-lilac/50 bg-violet/[0.12] text-snow' : 'border-line text-mute hover:text-snow'
                      }`}
                    >
                      {l.name}
                      <span className="font-mono text-[12px] uppercase tracking-wider text-lilac/80">{l.tag}</span>
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <AnimatePresence mode="wait">
                    {licenses.filter((l) => l.id === lic).map((l) => (
                      <motion.div key={l.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
                        <div className="text-[36px] font-semibold tracking-tight">{l.name}</div>
                        <p className="mt-3 text-[23px] leading-relaxed text-mute">{l.text}</p>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </Panel>
        </Reveal>

        {/* Lenguajes */}
        <Reveal delay={0.29} className="col-span-7 row-span-1">
          <Panel className="flex h-full flex-col p-8">
            <div className="flex items-center gap-3"><Code2 className="text-lilac" size={26} /><Label>Lenguajes</Label></div>
            <div className="mt-auto grid grid-cols-2 gap-8">
              <div>
                <div className="mb-3 text-[18px] text-mute">Integrados</div>
                <div className="flex flex-wrap gap-2.5">
                  {['Java', 'Kotlin', 'Groovy'].map((l) => (
                    <span key={l} className="rounded-xl border border-lilac/40 bg-violet/10 px-4 py-2 font-mono text-[21px] text-snow">{l}</span>
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-3 text-[18px] text-mute">Con plugins o Ultimate</div>
                <div className="flex flex-wrap gap-2.5">
                  {['Scala', 'SQL', 'JavaScript', 'TypeScript', 'Python', 'Go'].map((l) => (
                    <span key={l} className="rounded-xl border border-line2 px-3.5 py-1.5 font-mono text-[18px] text-mute">{l}</span>
                  ))}
                </div>
              </div>
            </div>
          </Panel>
        </Reveal>

        {/* Sistemas */}
        <Reveal delay={0.36} className="col-span-5 row-span-1">
          <Panel className="flex h-full flex-col p-8">
            <div className="flex items-center gap-3"><MonitorCog className="text-lilac" size={26} /><Label>Sistemas operativos</Label></div>
            <div className="mt-auto grid grid-cols-3 gap-4">
              {[['Windows', '10 y 11'], ['macOS', '26 o superior'], ['Linux', 'GNOME / KDE']].map(([os, v]) => (
                <div key={os}>
                  <div className="text-[28px] font-medium">{os}</div>
                  <div className="text-[18px] text-mute">{v}</div>
                </div>
              ))}
            </div>
            <div className="mt-5 border-t border-line pt-4 font-mono text-[16px] text-mute">Requisitos: 8 GB RAM · CPU 4 núcleos · 10 GB de disco</div>
          </Panel>
        </Reveal>
      </div>
    </SceneShell>
  );
}
