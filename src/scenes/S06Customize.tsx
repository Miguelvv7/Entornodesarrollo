import { useState, type ReactNode } from 'react';
import { Moon, Sun, Save, Wand2, Keyboard } from 'lucide-react';
import { SceneShell, Panel, Label, SimBadge, Kbd } from '../components/SceneShell';
import { Reveal } from '../components/Reveal';
import { CodeEditor } from '../components/CodeEditor';
import { Screenshot } from '../components/Screenshot';
import { usePrint } from '../lib/mode';
import type { SceneProps } from './types';

const sample = `public class Modulo {
    private String nombre;
    private int nota;

    public boolean aprobado() {
        if (nota >= 5) {
            return true;
        }
        return false;
    }
}`;

function Seg<T extends string | number>({ value, options, onChange, label }: { value: T; options: { v: T; l: ReactNode }[]; onChange: (v: T) => void; label: string }) {
  return (
    <div className="grid gap-2">
      <div className="text-[17px] text-mute">{label}</div>
      <div className="flex rounded-xl border border-line bg-ink/60 p-1" role="radiogroup" aria-label={label}>
        {options.map((o) => (
          <button
            key={String(o.v)}
            role="radio"
            aria-checked={value === o.v}
            onClick={() => onChange(o.v)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-[18px] transition ${value === o.v ? 'bg-white/[0.09] text-snow' : 'text-mute hover:text-snow'}`}
          >
            {o.l}
          </button>
        ))}
      </div>
    </div>
  );
}

export function S06Customize({ index }: SceneProps) {
  const print = usePrint();
  const [light, setLight] = useState(false);
  const [size, setSize] = useState(21);
  const [nums, setNums] = useState(true);
  const [indent, setIndent] = useState<2 | 4>(4);

  const code = indent === 4 ? sample : sample.replace(/^( {4})+/gm, (m) => ' '.repeat((m.length / 4) * 2));

  return (
    <SceneShell
      index={index}
      glow="tr"
      title={<>Hazlo <span className="text-lilac">tuyo</span>.</>}
      lead="Nosotros usamos el tema Islands Dark y el keymap de macOS. Todo se cambia en Settings (⌘,). Pruébalo en directo:"
    >
      <div className="grid h-full grid-cols-[440px_1fr_430px] gap-8">
        <Reveal delay={0.12} className="min-h-0">
          <Panel className="flex h-full flex-col gap-6 p-7">
            <div className="flex items-center"><Label>Editor</Label><span className="ml-auto">{!print && <SimBadge>Demo</SimBadge>}</span></div>
            <Seg label="Tema" value={light ? 'l' : 'd'} onChange={(v) => setLight(v === 'l')} options={[{ v: 'd', l: <><Moon size={17} /> Oscuro</> }, { v: 'l', l: <><Sun size={17} /> Claro</> }]} />
            <div className="grid gap-2">
              <div className="flex text-[17px] text-mute"><label htmlFor="font-size">Tamaño de fuente</label><span className="ml-auto font-mono text-snow tnum">{size} px</span></div>
              <input id="font-size" type="range" min={15} max={27} value={size} onChange={(e) => setSize(+e.target.value)} className="w-full accent-[#8B5CF6]" />
            </div>
            <Seg label="Números de línea" value={nums ? 'on' : 'off'} onChange={(v) => setNums(v === 'on')} options={[{ v: 'on', l: 'Visibles' }, { v: 'off', l: 'Ocultos' }]} />
            <Seg label="Indentación" value={indent} onChange={setIndent} options={[{ v: 2, l: '2 espacios' }, { v: 4, l: '4 espacios' }]} />
          </Panel>
        </Reveal>

        <Reveal delay={0.18} className="flex min-h-0 flex-col gap-4">
          <CodeEditor code={code} fileName="Modulo.java" fontSize={size} lineNumbers={nums} light={light} className="min-h-0 flex-1" />
          <Screenshot id="CAPTURA_REAL_BIENVENIDA" className="h-[110px] shrink-0" compact />
        </Reveal>

        <div className="flex min-h-0 flex-col gap-4">
          {[
            { icon: <Save size={20} />, t: 'Autoguardado', d: 'Guarda los cambios solo, sin pulsar Guardar.' },
            { icon: <Wand2 size={20} />, t: 'Formato', d: <>Reformatea el código con <Kbd>⌥⌘L</Kbd>.</> },
            { icon: <Keyboard size={20} />, t: 'Atajos', d: 'Keymaps configurables, incluido uno igual que Eclipse.' },
          ].map((x, i) => (
            <Reveal key={x.t} delay={0.24 + i * 0.05}>
              <div className="flex gap-4 rounded-2xl border border-line bg-surface/60 p-4">
                <span className="mt-0.5 text-lilac">{x.icon}</span>
                <div><div className="text-[20px] font-medium">{x.t}</div><div className="text-[17px] leading-snug text-mute">{x.d}</div></div>
              </div>
            </Reveal>
          ))}
          <Reveal delay={0.4} className="min-h-0 flex-1">
            <Screenshot id="CAPTURA_REAL_CONFIGURACION" className="h-full" compact />
          </Reveal>
        </div>
      </div>
    </SceneShell>
  );
}
