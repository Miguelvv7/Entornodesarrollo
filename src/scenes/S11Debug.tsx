import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bug, StepForward, RotateCcw, CircleDot, Wrench, FlaskConical, BookText, Play } from 'lucide-react';
import { SceneShell, Panel, Label, SimBadge, Kbd } from '../components/SceneShell';
import { Reveal } from '../components/Reveal';
import { CodeEditor, HighlightedLine } from '../components/CodeEditor';
import { Screenshot } from '../components/Screenshot';
import { NextVideoHint } from '../components/VideoPlayer';
import { usePrint } from '../lib/mode';
import { runProgram } from './S10Run';
import type { SceneProps } from './types';

const BP = 10;

interface Step { line?: number; c?: number; s?: number; changed?: 'c' | 's'; out: string[]; msg: string }

/** Traza real del programa de la escena 10 con un breakpoint en la línea 10 y "Step Over" */
const trace: Step[] = [
  { out: [], msg: 'Breakpoint en la línea 10. Pulsa "Iniciar depuración".' },
  { line: 10, c: 1, s: 0, out: ['Vuelta 1'], msg: 'Se para en el breakpoint. La línea 9 ya ha impreso "Vuelta 1".' },
  { line: 11, c: 1, s: 1, changed: 's', out: ['Vuelta 1'], msg: 'suma += contador: suma pasa de 0 a 1.' },
  { line: 12, c: 2, s: 1, changed: 'c', out: ['Vuelta 1'], msg: 'contador++: contador vale 2. Toca comprobar el while.' },
  { line: 9, c: 2, s: 1, out: ['Vuelta 1'], msg: '2 <= 3 es verdadero: el do-while da otra vuelta.' },
  { line: 10, c: 2, s: 1, out: ['Vuelta 1', 'Vuelta 2'], msg: 'Imprime "Vuelta 2" y vuelve a pararse en el breakpoint.' },
  { line: 11, c: 2, s: 3, changed: 's', out: ['Vuelta 1', 'Vuelta 2'], msg: 'suma pasa de 1 a 3.' },
  { line: 12, c: 3, s: 3, changed: 'c', out: ['Vuelta 1', 'Vuelta 2'], msg: 'contador vale 3.' },
  { line: 9, c: 3, s: 3, out: ['Vuelta 1', 'Vuelta 2'], msg: '3 <= 3 sigue siendo verdadero: tercera vuelta.' },
  { line: 10, c: 3, s: 3, out: ['Vuelta 1', 'Vuelta 2', 'Vuelta 3'], msg: 'Imprime "Vuelta 3" y se para otra vez.' },
  { line: 11, c: 3, s: 6, changed: 's', out: ['Vuelta 1', 'Vuelta 2', 'Vuelta 3'], msg: 'suma pasa de 3 a 6.' },
  { line: 12, c: 4, s: 6, changed: 'c', out: ['Vuelta 1', 'Vuelta 2', 'Vuelta 3'], msg: 'contador vale 4.' },
  { line: 14, c: 4, s: 6, out: ['Vuelta 1', 'Vuelta 2', 'Vuelta 3'], msg: '4 <= 3 es falso: sale del bucle.' },
  { c: 4, s: 6, out: ['Vuelta 1', 'Vuelta 2', 'Vuelta 3', 'suma = 6', '', 'Process finished with exit code 0'], msg: 'Fin de la ejecución.' },
];

const PRINT_STEP = 5;

export function S11Debug({ index, onNext }: SceneProps) {
  const print = usePrint();
  const [k, setK] = useState(print ? PRINT_STEP : 0);
  const st = trace[k];
  const done = k === trace.length - 1;
  const active = st.line !== undefined || done;

  const step = useCallback(() => setK((x) => Math.min(x + 1, trace.length - 1)), []);
  const resume = useCallback(() => setK((x) => {
    for (let i = x + 1; i < trace.length; i++) if (trace[i].line === BP) return i;
    return trace.length - 1;
  }), []);

  useEffect(() => {
    if (print) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'F8') { e.preventDefault(); step(); } };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [step, print]);

  const hint = (n: number) => {
    if (st.line === undefined) return null;
    if (n === 4) return 'args: []';
    if (n === 5) return `contador: ${st.c}`;
    if (n === 6) return `suma: ${st.s}`;
    if (n === 10) return `suma: ${st.s}    contador: ${st.c}`;
    if (n === 12) return `${st.c! <= 3}`;
    return null;
  };
  const decorate = (n: number, text: string) => {
    const h = hint(n);
    if (!h) return null;
    return (<><HighlightedLine text={text} /><span className="ml-5 italic text-[#8C93A3]/80">{h}</span></>);
  };

  const vars: { name: string; value: string; key?: 'c' | 's' }[] = !active ? [] : [
    { name: 'args', value: '{String[0]}' },
    { name: 'contador', value: String(st.c), key: 'c' },
    { name: 'suma', value: String(st.s), key: 's' },
  ];

  return (
    <SceneShell index={index} glow="tl" title={<>Modo depuración: <span className="text-lilac">paso a paso</span>.</>}>
      {!print && <div className="absolute -top-[104px] right-0"><NextVideoHint onClick={onNext} /></div>}
      <div className="grid h-full grid-cols-[400px_1fr_440px] gap-7">
        {/* explicación */}
        <div className="flex min-h-0 flex-col gap-4">
          <Reveal delay={0.1}>
            <div className="flex items-center gap-3 text-[24px] font-medium"><CircleDot className="text-err" size={22} /> Breakpoint</div>
            <p className="mt-2 text-[18px] leading-snug text-mute">Un punto de ruptura: se pone con un clic en el margen y el programa se para justo ahí.</p>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="flex items-center gap-3 text-[24px] font-medium"><Bug className="text-lilac" size={22} /> Debugger</div>
            <p className="mt-2 text-[18px] leading-snug text-mute">Avanza línea a línea (<Kbd>F8</Kbd>, en el Mac <Kbd>fn F8</Kbd>) o hasta el siguiente breakpoint (<Kbd>⌥⌘R</Kbd>) mostrando cada valor.</p>
          </Reveal>
          <Reveal delay={0.22} className="mt-auto">
            <Panel className="p-5">
              <Label>Funciones de herramienta CASE</Label>
              <div className="mt-4 grid gap-3 text-[16px] leading-snug">
                <div className="flex gap-3"><Wrench size={18} className="mt-0.5 shrink-0 text-lilac" /><span><span className="text-snow">Desarrollo y análisis:</span> <span className="text-mute">generación de código, refactorización y Code → Inspect Code.</span></span></div>
                <div className="flex gap-3"><FlaskConical size={18} className="mt-0.5 shrink-0 text-sky" /><span><span className="text-snow">Pruebas:</span> <span className="text-mute">depurador, tests JUnit y Run → Manage Coverage Reports.</span></span></div>
                <div className="flex gap-3"><BookText size={18} className="mt-0.5 shrink-0 text-kw" /><span><span className="text-snow">Documentación:</span> <span className="text-mute">Javadoc (Tools → Generate JavaDoc).</span></span></div>
              </div>
            </Panel>
          </Reveal>
        </div>

        {/* editor + controles */}
        <Reveal delay={0.14} className="flex min-h-0 flex-col gap-3">
          <CodeEditor code={runProgram} fontSize={print ? 14 : 17} breakpoints={[BP]} activeLine={st.line} decorate={decorate} className="min-h-0 flex-1" toolbar={!print && <SimBadge>Simulación</SimBadge>} />
          {print ? (
            <div className="rounded-xl border border-line bg-surface/70 px-4 py-2">
              <div className="mb-1 font-mono text-[12px] uppercase tracking-[0.16em] text-mute">Traza completa con Step Over</div>
              <table className="w-full font-mono text-[13px] tnum">
                <tbody>
                  {(['Paso', 'Línea', 'contador', 'suma'] as const).map((row) => (
                    <tr key={row} className="border-t border-line first:border-0">
                      <td className="py-0.5 pr-3 text-mute">{row}</td>
                      {trace.slice(1, 13).map((t, j) => (
                        <td key={j} className={`text-center ${t.line === BP ? 'text-err' : 'text-snow/85'}`}>{row === 'Paso' ? j + 1 : row === 'Línea' ? t.line : row === 'contador' ? t.c : t.s}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {k === 0 ? (
                <button onClick={step} className="flex items-center gap-2.5 rounded-xl bg-violet/20 px-5 py-3 text-[17px] font-medium text-snow ring-1 ring-lilac/50 hover:bg-violet/30"><Bug size={18} /> Iniciar depuración</button>
              ) : (
                <>
                  <button onClick={step} disabled={done} className="flex items-center gap-2 rounded-xl bg-sky/15 px-4 py-3 text-[17px] font-medium text-sky ring-1 ring-sky/40 hover:bg-sky/25 disabled:opacity-40"><StepForward size={18} /> Step Over <Kbd>F8</Kbd></button>
                  <button onClick={resume} disabled={done} className="flex items-center gap-2 rounded-xl bg-ok/15 px-4 py-3 text-[17px] font-medium text-ok ring-1 ring-ok/40 hover:bg-ok/25 disabled:opacity-40"><Play size={16} fill="currentColor" /> Resume</button>
                </>
              )}
              <button onClick={() => setK(0)} className="flex items-center gap-2 rounded-xl border border-line px-4 py-3 text-[16px] text-mute hover:text-snow"><RotateCcw size={16} /> Reiniciar</button>
              <div className="ml-auto font-mono text-[14px] text-mute tnum">paso {k} / {trace.length - 1}</div>
            </div>
          )}
          <AnimatePresence mode="wait">
            <motion.div key={k} initial={print ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-xl border border-line bg-surface/70 px-5 py-2.5 text-[18px] text-snow/90">
              {print ? 'Segunda parada en el breakpoint: contador = 2 y suma = 1. En la consola ya salen "Vuelta 1" y "Vuelta 2".' : st.msg}
            </motion.div>
          </AnimatePresence>
        </Reveal>

        {/* variables + consola + captura */}
        <div className="flex min-h-0 flex-col gap-4">
          <Reveal delay={0.2}>
            <div className="overflow-hidden rounded-[18px] border border-line2 bg-[#1E1F22]">
              <div className="flex h-[44px] items-center gap-3 border-b border-line bg-[#2B2D30] px-4 font-mono text-[14px] text-snow/85"><Bug size={15} className="text-mute" /> Threads &amp; Variables</div>
              <div className="min-h-[118px] p-3 font-mono text-[17px]">
                {vars.length === 0 && <div className="py-8 text-center text-[15px] text-mute">Sin sesión de depuración</div>}
                {vars.map((v) => {
                  const ch = !!v.key && v.key === st.changed;
                  return (
                    <div key={v.name} className={`flex items-center gap-3 rounded-lg px-2 py-1 ${ch ? 'bg-sky/10' : ''}`}>
                      <span className="text-snow/90">{v.name}</span><span className="text-mute">=</span>
                      <motion.span key={v.value} initial={print ? false : { opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className={ch ? 'text-sky' : 'text-num'}>{v.value}</motion.span>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-line px-4 py-2 font-mono text-[13px] uppercase tracking-[0.14em] text-mute">Console</div>
              <div className="h-[118px] overflow-hidden px-4 pb-3 font-mono text-[15px] leading-[1.45]">
                {st.out.map((l, i) => <div key={i} className={`min-h-[1.45em] ${l.startsWith('Process') ? 'text-mute' : 'text-snow'}`}>{l}</div>)}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.26} className="min-h-0 flex-1"><Screenshot id="CAPTURA_REAL_DEBUG" className="h-full" compact /></Reveal>
        </div>
      </div>
    </SceneShell>
  );
}
