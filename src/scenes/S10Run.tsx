import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Play, Square, RotateCcw, TerminalSquare } from 'lucide-react';
import { SceneShell, SimBadge, Kbd } from '../components/SceneShell';
import { Reveal } from '../components/Reveal';
import { CodeEditor } from '../components/CodeEditor';
import { Screenshot } from '../components/Screenshot';
import { NextVideoHint } from '../components/VideoPlayer';
import { usePrint } from '../lib/mode';
import type { SceneProps } from './types';

export const runProgram = `package Iesantoniogala;

public class Main {
    public static void main(String[] args) {
        int contador = 1;
        int suma = 0;

        do {
            System.out.println("Vuelta " + contador);
            suma += contador;
            contador++;
        } while (contador <= 3);

        System.out.println("suma = " + suma);
    }
}`;

/** Salida exacta del programa anterior + línea final que añade IntelliJ */
const output: { text: string; line?: number; kind?: 'cmd' | 'out' | 'end' }[] = [
  { text: '/Library/Java/JavaVirtualMachines/zulu-21.jdk/Contents/Home/bin/java -javaagent:/Applications/IntelliJ IDEA…', kind: 'cmd' },
  { text: 'Vuelta 1', line: 9 },
  { text: 'Vuelta 2', line: 9 },
  { text: 'Vuelta 3', line: 9 },
  { text: 'suma = 6', line: 14 },
  { text: '', kind: 'out' },
  { text: 'Process finished with exit code 0', kind: 'end' },
];

export function S10Run({ index, onNext }: SceneProps) {
  const print = usePrint();
  const [shown, setShown] = useState(print ? output.length : 0);
  const [running, setRunning] = useState(false);
  const timers = useRef<number[]>([]);
  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  useEffect(() => clear, []);

  const run = () => {
    clear();
    setShown(0);
    setRunning(true);
    const delays = [250, 900, 1350, 1800, 2350, 2600, 2900];
    delays.forEach((d, i) => timers.current.push(window.setTimeout(() => {
      setShown(i + 1);
      if (i === delays.length - 1) setRunning(false);
    }, d)));
  };
  const stop = () => { clear(); setRunning(false); };

  const current = output[shown - 1];
  const activeLine = running && current?.line ? current.line : undefined;
  const started = shown > 0 || running;

  return (
    <SceneShell index={index} glow="br" title={<>Escribir, pulsar <span className="text-ok">Run</span> y ver el resultado.</>}>
      {!print && <div className="absolute -top-[104px] right-0"><NextVideoHint onClick={onNext} /></div>}
      <div className="grid h-full grid-cols-[1fr_620px] gap-10">
        <Reveal delay={0.12} className="min-h-0">
          <CodeEditor
            code={runProgram}
            fontSize={21}
            activeLine={activeLine}
            className="h-full"
            toolbar={
              <>
                <span className="rounded-lg border border-line px-3 py-1 font-mono text-[15px] text-mute">Main ▾</span>
                {!print && (running ? (
                  <button onClick={stop} className="grid h-10 w-10 place-items-center rounded-lg bg-err/15 text-err hover:bg-err/25" aria-label="Detener"><Square size={16} fill="currentColor" /></button>
                ) : (
                  <motion.button
                    onClick={run}
                    className="flex h-10 items-center gap-2 rounded-lg bg-ok/15 px-4 text-[16px] font-medium text-ok hover:bg-ok/25"
                    whileTap={{ scale: 0.95 }}
                    animate={started ? {} : { boxShadow: ['0 0 0 0 rgba(95,184,101,0.5)', '0 0 0 12px rgba(95,184,101,0)'] }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                    aria-label="Ejecutar (Run)"
                  >
                    {shown === output.length ? <RotateCcw size={16} /> : <Play size={16} fill="currentColor" />} Run
                  </motion.button>
                ))}
              </>
            }
          />
        </Reveal>

        <div className="flex min-h-0 flex-col gap-5">
          <Reveal delay={0.2} className="min-h-0 flex-[1.25]">
            <div className="flex h-full flex-col overflow-hidden rounded-[20px] border border-line2 bg-[#1E1F22]">
              <div className="flex h-[52px] shrink-0 items-center gap-3 border-b border-line bg-[#2B2D30] px-5 font-mono text-[16px]">
                <TerminalSquare size={17} className="text-mute" />
                <span className="text-snow/90">Run</span>
                <span className="text-mute">Main</span>
                {running && <span className="ml-2 h-2 w-2 animate-pulse rounded-full bg-ok" />}
                <span className="ml-auto">{!print && <SimBadge>Animación</SimBadge>}</span>
              </div>
              <div className="min-h-0 flex-1 overflow-hidden p-5 font-mono text-[19px] leading-[1.7]">
                {!started && !print && (
                  <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-[18px] text-mute">
                    <Play size={28} className="text-ok/70" />
                    <span>Pulsa <span className="text-ok">Run</span> (<Kbd>⌃R</Kbd>) para ejecutar</span>
                  </div>
                )}
                <AnimatePresence>
                  {output.slice(0, shown).map((o, i) => (
                    <motion.div
                      key={i}
                      initial={print ? false : { opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25 }}
                      className={`min-h-[1.7em] truncate ${o.kind === 'cmd' ? 'text-[15px] text-mute/70' : o.kind === 'end' ? 'text-mute' : 'text-snow'}`}
                    >
                      {o.text}
                    </motion.div>
                  ))}
                </AnimatePresence>
                {running && <span className="caret inline-block h-[1.1em] w-[0.55em] bg-snow/70" />}
              </div>
            </div>
          </Reveal>
          <div className="grid min-h-0 flex-1 grid-cols-2 gap-5">
            <Reveal delay={0.28} className="min-h-0"><Screenshot id="CAPTURA_REAL_CODIGO" className="h-full" compact /></Reveal>
            <Reveal delay={0.34} className="min-h-0"><Screenshot id="CAPTURA_REAL_EJECUCION" className="h-full" compact /></Reveal>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-[42px] left-0 font-mono text-[15px] text-mute/70">
        La consola reproduce la salida real de este programa; la web no compila Java.
      </div>
    </SceneShell>
  );
}
