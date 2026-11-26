import { motion } from 'framer-motion';
import { FileCode2, Cog, Binary, Cpu, Terminal } from 'lucide-react';
import { SceneShell, Panel } from '../components/SceneShell';
import { Reveal } from '../components/Reveal';
import { Screenshot } from '../components/Screenshot';
import { usePrint } from '../lib/mode';
import type { SceneProps } from './types';

const steps = [
  { icon: <FileCode2 size={30} />, file: 'Main.java', name: 'Código fuente', d: 'Lo que escribimos en el editor.' },
  { icon: <Cog size={30} />, file: 'javac', name: 'Compilador', d: 'Revisa el código y lo traduce.' },
  { icon: <Binary size={30} />, file: 'Main.class', name: 'Bytecode', d: 'Código intermedio, igual en cualquier sistema.' },
  { icon: <Cpu size={30} />, file: 'java', name: 'JVM', d: 'La máquina virtual que lo ejecuta.' },
  { icon: <Terminal size={30} />, file: 'Run', name: 'Ejecución', d: 'El resultado sale en la consola.' },
];

export function S08Hood({ index }: SceneProps) {
  const print = usePrint();
  return (
    <SceneShell
      index={index}
      glow="c"
      title={<>Bajo el capó: del <span className="text-lilac">código</span> a la <span className="text-sky">ejecución</span>.</>}
      lead="Al pulsar Run, IntelliJ usa el JDK del proyecto. Lo comprobamos abriendo un .class de bateria10: bytecode versión 65.0, compilado para Java 21."
    >
      <div className="flex h-full flex-col gap-10">
        {/* diagrama */}
        <div className="relative">
          <div className="absolute left-[8%] right-[8%] top-[52px] h-px bg-line2" />
          {!print && (
            <motion.div
              className="absolute top-[47px] h-[11px] w-[11px] rounded-full bg-sky shadow-[0_0_24px_6px_rgba(56,189,248,0.55)]"
              initial={{ left: '8%' }}
              animate={{ left: ['8%', '92%'] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.6, delay: 0.8 }}
            />
          )}
          <div className="relative grid grid-cols-5 gap-6">
            {steps.map((s, i) => (
              <Reveal key={s.name} delay={0.15 + i * 0.12} className="flex flex-col items-center text-center">
                <div className={`grid h-[104px] w-[104px] place-items-center rounded-[28px] border bg-surface ${i === 0 ? 'border-lilac/50 text-lilac' : i === 4 ? 'border-sky/50 text-sky' : 'border-line2 text-snow/85'}`}>
                  {s.icon}
                </div>
                <div className="mt-5 font-mono text-[20px] text-lilac">{s.file}</div>
                <div className="mt-1 text-[28px] font-medium">{s.name}</div>
                <div className="mt-1 max-w-[260px] text-[19px] leading-snug text-mute">{s.d}</div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* definiciones */}
        <div className="grid min-h-0 flex-1 grid-cols-[1fr_1fr_1fr_520px] gap-6">
          {[
            { t: 'JDK', s: 'Java Development Kit', d: 'El kit completo para programar: compilador, JVM, librerías estándar y herramientas como javadoc.' },
            { t: 'Compilador', s: 'javac', d: 'Comprueba que el código es correcto y genera el bytecode. Si hay errores, no compila.' },
            { t: 'JVM', s: 'Java Virtual Machine', d: 'Ejecuta el bytecode. Gracias a ella, el mismo programa funciona en Windows, macOS y Linux.' },
          ].map((x, i) => (
            <Reveal key={x.t} delay={0.75 + i * 0.07} className="min-h-0">
              <Panel className="h-full p-7">
                <div className="flex items-baseline gap-3"><span className="text-[34px] font-semibold">{x.t}</span><span className="font-mono text-[15px] text-mute">{x.s}</span></div>
                <p className="mt-3 text-[20px] leading-relaxed text-snow/80">{x.d}</p>
              </Panel>
            </Reveal>
          ))}
          <Reveal delay={0.95} className="min-h-0"><Screenshot id="CAPTURA_REAL_BYTECODE" className="h-full" compact /></Reveal>
        </div>
      </div>
    </SceneShell>
  );
}
