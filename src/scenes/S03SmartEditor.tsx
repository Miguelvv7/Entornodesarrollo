import { useEffect, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Lightbulb, Sparkles, TriangleAlert, PenLine, CircleCheck } from 'lucide-react';
import { SceneShell, SimBadge, Kbd } from '../components/SceneShell';
import { Reveal } from '../components/Reveal';
import { CodeEditor, HighlightedLine } from '../components/CodeEditor';
import { usePrint } from '../lib/mode';
import type { SceneProps } from './types';

type Mode = 'complete' | 'error' | 'refactor';

const head = `public class Main {
    public static void main(String[] args) {
        String nombre = "Lucía";
        int edad = 19;
`;
const tail = `    }
}`;

const line9: Record<Mode, string> = {
  complete: '        System.out.println(nombre.t',
  error: '        System.out.println(nombre.lenght());',
  refactor: '        System.out.println(nombre.length());',
};

const suggestions: [string, string][] = [
  ['toUpperCase()', 'String'],
  ['toLowerCase()', 'String'],
  ['trim()', 'String'],
  ['toString()', 'String'],
  ['toCharArray()', 'char[]'],
];

const demos: { id: Mode; icon: ReactNode; title: string; text: string; key: ReactNode }[] = [
  { id: 'complete', icon: <Sparkles size={22} />, title: 'Autocompletado inteligente', text: 'Propone solo los métodos que existen para el tipo de la variable.', key: <><Kbd>⌃</Kbd> <Kbd>Espacio</Kbd></> },
  { id: 'error', icon: <TriangleAlert size={22} />, title: 'Detección de errores', text: 'Subraya el fallo mientras escribes, antes de compilar, y sugiere cómo arreglarlo.', key: <><Kbd>⌥</Kbd> <Kbd>↩</Kbd></> },
  { id: 'refactor', icon: <PenLine size={22} />, title: 'Refactorización', text: 'Renombra una variable en todas sus apariciones a la vez, sin romper el código.', key: <><Kbd>⇧</Kbd> <Kbd>F6</Kbd></> },
];

/** Editor con la demostración seleccionada */
function SmartEditor({ mode, fontSize, compact = false }: { mode: Mode; fontSize: number; compact?: boolean }) {
  const print = usePrint();
  const [fixed, setFixed] = useState(false);
  const [sel, setSel] = useState(0);
  const [name, setName] = useState('nombre');

  useEffect(() => { setFixed(false); setSel(0); setName('nombre'); }, [mode]);

  // autocompletado: la selección recorre la lista
  useEffect(() => {
    if (mode !== 'complete' || print) return;
    const t = setInterval(() => setSel((s) => (s + 1) % suggestions.length), 1300);
    return () => clearInterval(t);
  }, [mode, print]);

  // refactorización: "escribe" el nuevo nombre en todas las apariciones
  useEffect(() => {
    if (mode !== 'refactor') return;
    const target = 'alumno';
    if (print) { setName(target); return; }
    let i = 0;
    let t = 0;
    const start = window.setTimeout(() => {
      setName('');
      t = window.setInterval(() => {
        i++;
        setName(target.slice(0, i));
        if (i >= target.length) clearInterval(t);
      }, 110);
    }, 700);
    return () => { clearTimeout(start); clearInterval(t); };
  }, [mode, print]);

  const code = head + (mode === 'error' && fixed ? line9.refactor : line9[mode]) + '\n' + tail;

  const decorate = (n: number, text: string) => {
    if (mode === 'refactor' && text.includes('nombre')) {
      const parts = text.split('nombre');
      return (
        <>
          {parts.map((p, i) => (
            <span key={i}>
              <HighlightedLine text={p} />
              {i < parts.length - 1 && (
                <span className={`rounded-[4px] px-[1px] ${n === 3 ? 'bg-[#2E436E] outline outline-1 outline-sky/70' : 'bg-[#3B3F48]'} text-snow`}>
                  {name}
                  {n === 3 && !print && <span className="caret ml-[1px] inline-block h-[1em] w-[2px] translate-y-[0.15em] bg-snow" />}
                </span>
              )}
            </span>
          ))}
        </>
      );
    }
    if (mode === 'error' && n === 5 && !fixed) {
      const [a, b] = text.split('lenght');
      return (<><HighlightedLine text={a} /><span className="squiggle text-err">lenght</span><HighlightedLine text={b} /></>);
    }
    if (mode === 'complete' && n === 5) {
      return (<><HighlightedLine text={text} />{!print && <span className="caret ml-[1px] inline-block h-[1em] w-[2px] translate-y-[0.15em] bg-snow" />}</>);
    }
    return null;
  };

  const lh = Math.round(fontSize * 1.62);
  const top = 20 + 5 * lh; // padding + 5 líneas
  const col = (chars: number) => `calc(3.4em + ${chars}ch)`;

  return (
    <CodeEditor
      code={code}
      fontSize={fontSize}
      decorate={decorate}
      className="h-full"
      toolbar={
        <span className={`flex items-center gap-2 font-mono text-[15px] ${mode === 'error' && !fixed ? 'text-err' : 'text-ok'}`}>
          {mode === 'error' && !fixed ? <><TriangleAlert size={16} /> 1 error</> : <><CircleCheck size={16} /> Sin errores</>}
        </span>
      }
      overlay={
        <AnimatePresence>
          {mode === 'complete' && (
            <motion.div
              key="popup"
              className="absolute z-10 overflow-hidden rounded-xl border border-line2 bg-[#2B2D30] shadow-2xl"
              style={{ top, left: col(compact ? 14 : 35), minWidth: compact ? '24ch' : '30ch' }}
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            >
              {suggestions.slice(0, compact ? 3 : 5).map(([m, t], i) => (
                <div key={m} className={`flex items-center gap-4 px-3 py-[0.18em] ${i === sel ? 'bg-[#2E436E]' : ''}`}>
                  <span className="grid h-[1.1em] w-[1.1em] place-items-center rounded-full bg-[#C77DBB]/80 text-[0.55em] font-bold text-ink">m</span>
                  <span className="text-snow/90"><span className="font-semibold text-sky">t</span>{m.slice(1)}</span>
                  <span className="ml-auto pl-6 text-mute">{t}</span>
                </div>
              ))}
            </motion.div>
          )}
          {mode === 'error' && !fixed && (
            <motion.div
              key="tip"
              className="absolute z-10 max-w-[30ch] rounded-xl border border-line2 bg-[#2B2D30] p-3 shadow-2xl"
              style={{ top: top + 6, left: col(compact ? 8 : 33) }}
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            >
              <div className="text-[0.82em] text-snow/90">Cannot resolve method 'lenght' in 'String'</div>
              {print ? (
                <div className="mt-2 flex items-center gap-2 text-[0.78em] text-sky"><Lightbulb size={14} className="text-[#E5B567]" /> Rename reference → length()</div>
              ) : (
                <button onClick={() => setFixed(true)} className="mt-2 flex items-center gap-2 rounded-lg bg-[#2E436E] px-2.5 py-1 text-[0.78em] text-snow hover:bg-[#35508a]">
                  <Lightbulb size={14} className="text-[#E5B567]" /> Rename reference → length()
                </button>
              )}
            </motion.div>
          )}
          {mode === 'refactor' && !compact && (
            <motion.div
              key="rename"
              className="absolute bottom-6 right-6 z-10 rounded-xl border border-line2 bg-[#2B2D30] px-4 py-2 text-[0.72em] text-mute shadow-2xl"

              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
              Rename · <span className="text-snow">2 apariciones</span> de la variable
            </motion.div>
          )}
        </AnimatePresence>
      }
    />
  );
}

export function S03SmartEditor({ index }: SceneProps) {
  const print = usePrint();
  const [mode, setMode] = useState<Mode>('complete');

  return (
    <SceneShell
      index={index}
      glow="br"
      title={<>Un editor que <span className="text-lilac">entiende</span> tu código.</>}
      lead="IntelliJ IDEA analiza el programa mientras lo escribes. Estas son sus tres ayudas más visibles."
    >
      {print ? (
        <div className="grid h-full grid-cols-3 gap-6">
          {demos.map((d) => (
            <div key={d.id} className="flex min-h-0 flex-col gap-4">
              <div className="flex items-center gap-3 text-[24px] font-medium"><span className="text-lilac">{d.icon}</span>{d.title}<span className="ml-auto text-[16px]">{d.key}</span></div>
              <p className="text-[18px] leading-snug text-mute">{d.text}</p>
              <div className="min-h-0 flex-1"><SmartEditor mode={d.id} fontSize={14} compact /></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid h-full grid-cols-[560px_1fr] gap-10">
          <div className="flex flex-col gap-4">
            {demos.map((d, i) => (
              <Reveal key={d.id} delay={0.15 + i * 0.07}>
                <button
                  onClick={() => setMode(d.id)}
                  aria-pressed={mode === d.id}
                  className={`group w-full rounded-[20px] border p-6 text-left transition ${
                    mode === d.id ? 'border-lilac/50 bg-violet/[0.10] shadow-[0_0_50px_-20px_rgba(139,92,246,0.7)]' : 'border-line bg-surface/60 hover:border-line2'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={mode === d.id ? 'text-lilac' : 'text-mute'}>{d.icon}</span>
                    <span className="text-[26px] font-medium text-snow">{d.title}</span>
                    <span className="ml-auto font-mono text-[15px] text-mute">0{i + 1}</span>
                  </div>
                  <p className="mt-2 text-[20px] leading-snug text-mute">{d.text}</p>
                  <div className="mt-3 text-[16px] text-mute">Atajo: {d.key}</div>
                </button>
              </Reveal>
            ))}
            <Reveal delay={0.4} className="mt-auto"><SimBadge /></Reveal>
          </div>
          <Reveal delay={0.2} className="min-h-0">
            <SmartEditor mode={mode} fontSize={23} />
          </Reveal>
        </div>
      )}
    </SceneShell>
  );
}
