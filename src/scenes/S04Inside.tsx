import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MousePointerClick, X, Maximize2 } from 'lucide-react';
import { SceneShell, Panel, Label, Kbd } from '../components/SceneShell';
import { Reveal } from '../components/Reveal';
import { Screenshot, Lightbox } from '../components/Screenshot';
import { interfaceZones } from '../data/interfaceZones';
import { menus, menuSrc } from '../data/menus';
import { usePrint } from '../lib/mode';
import type { SceneProps } from './types';

const ASPECT = 2940 / 1846; // proporción de interfaz.png
const MENU_AREA_H = 560;

function useEscape(active: boolean, close: () => void) {
  useEffect(() => {
    if (!active) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.stopImmediatePropagation(); close(); } };
    window.addEventListener('keydown', h, true);
    return () => window.removeEventListener('keydown', h, true);
  }, [active, close]);
}

/* ---------------- Zonas sobre la captura real ---------------- */

function ZoneMap({ active, setActive, print }: { active: string | null; setActive: (id: string | null) => void; print: boolean }) {
  return (
    <div className="relative h-full max-w-full" style={{ aspectRatio: ASPECT }}>
      <Screenshot id="CAPTURA_REAL_INTERFAZ" className="h-full w-full" caption={false}>
        <div className="absolute inset-0 overflow-hidden rounded-[18px]">
          {interfaceZones.map((z, i) => {
            const on = active === z.id;
            const style = { left: `${z.rect.x}%`, top: `${z.rect.y}%`, width: `${z.rect.w}%`, height: `${z.rect.h}%` };
            const thin = z.rect.h < 6 || z.rect.w < 4;
            const marker = (
              <span
                className={`absolute grid h-8 w-8 place-items-center rounded-full font-mono text-[15px] font-semibold transition ${
                  on || print ? 'bg-lilac text-ink' : 'bg-ink/85 text-lilac ring-1 ring-lilac/70'
                } ${thin ? 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2' : 'left-3 top-3'}`}
              >
                {i + 1}
              </span>
            );
            if (print) return <div key={z.id} className="absolute rounded-md border-2 border-lilac/70" style={style}>{marker}</div>;
            return (
              <button
                key={z.id}
                onClick={() => setActive(on ? null : z.id)}
                aria-pressed={on}
                aria-label={z.title}
                className={`absolute rounded-md border-2 transition duration-300 ${
                  on ? 'z-10 border-lilac bg-violet/10 shadow-[0_0_0_9999px_rgba(8,9,13,0.6)]' : active ? 'border-transparent' : 'border-transparent hover:border-lilac/70 hover:bg-violet/[0.08]'
                }`}
                style={style}
              >
                {marker}
              </button>
            );
          })}
        </div>
      </Screenshot>
    </div>
  );
}

function ZonePanel({ active, setActive }: { active: string | null; setActive: (id: string | null) => void }) {
  const zone = interfaceZones.find((z) => z.id === active);
  return (
    <Panel className="relative flex h-full flex-col overflow-hidden p-7">
      <AnimatePresence mode="wait">
        {zone ? (
          <motion.div key={zone.id} className="flex h-full min-h-0 flex-col" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.3 }}>
            <div className="flex items-center">
              <Label>Zona {interfaceZones.indexOf(zone) + 1} de {interfaceZones.length}</Label>
              <button onClick={() => setActive(null)} className="ml-auto grid h-9 w-9 place-items-center rounded-xl border border-line2 text-mute hover:text-snow" aria-label="Cerrar (Esc)"><X size={16} /></button>
            </div>
            <h3 className="mt-6 text-[40px] font-semibold leading-tight tracking-tight">{zone.title}</h3>
            <p className="mt-4 text-[21px] leading-relaxed text-mute">{zone.text}</p>
            {zone.detail && <Screenshot id={zone.detail} className="mt-5 min-h-0 flex-1" compact />}
            {zone.shortcut && <div className="mt-auto flex flex-wrap items-center gap-3 pt-4 text-[17px] text-mute">Atajos <Kbd>{zone.shortcut}</Kbd></div>}
          </motion.div>
        ) : (
          <motion.div key="idle" className="flex h-full flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <MousePointerClick className="text-lilac" size={32} />
            <h3 className="mt-5 text-[32px] font-semibold leading-tight tracking-tight">Pulsa una zona de nuestra ventana</h3>
            <p className="mt-3 text-[19px] leading-relaxed text-mute">Es una captura real de IntelliJ IDEA con nuestro proyecto bateria10 abierto.</p>
            <div className="mt-auto grid gap-2">
              {interfaceZones.map((z, i) => (
                <button key={z.id} onClick={() => setActive(z.id)} className="flex items-center gap-3 rounded-xl border border-line px-4 py-2.5 text-left text-[18px] text-snow/85 transition hover:border-lilac/50">
                  <span className="font-mono text-[14px] text-lilac">{i + 1}</span>{z.title}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Panel>
  );
}

/* ---------------- Barra de menús real ---------------- */

function MenuExplorer({ sel, setSel }: { sel: string; setSel: (id: string) => void }) {
  const [zoom, setZoom] = useState(false);
  const m = menus.find((x) => x.id === sel)!;
  const k = Math.min(0.62, Math.max(0.46, MENU_AREA_H / m.h));
  const btns = useRef<Record<string, HTMLButtonElement | null>>({});
  const area = useRef<HTMLDivElement>(null);
  const [left, setLeft] = useState(160);
  useLayoutEffect(() => {
    const b = btns.current[sel];
    const max = (area.current?.clientWidth ?? 1000) - m.w * k - 12;
    if (b) setLeft(Math.max(8, Math.min(b.offsetLeft - 6, max)));
  }, [sel, m.w, k]);

  return (
    <div className="flex h-full gap-8">
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-[18px] border border-line2 bg-[#1E1F22]">
        {/* barra de menús de macOS */}
        <div className="flex h-[52px] shrink-0 items-center gap-1 bg-black px-4 text-[18px]" role="tablist" aria-label="Menús de IntelliJ IDEA">
          <span className="mr-3 font-semibold text-snow">IntelliJ IDEA</span>
          {menus.map((x) => (
            <button
              key={x.id}
              ref={(el) => { btns.current[x.id] = el; }}
              role="tab"
              aria-selected={sel === x.id}
              onClick={() => setSel(x.id)}
              className={`rounded-md px-3 py-1 transition ${sel === x.id ? 'bg-white/[0.16] text-snow' : 'text-snow/80 hover:bg-white/[0.08]'}`}
            >
              {x.label}
            </button>
          ))}
          <span className="ml-auto text-snow/50">VCS&nbsp;&nbsp;Window&nbsp;&nbsp;Help</span>
        </div>
        <div ref={area} className="relative min-h-0 flex-1 overflow-hidden" style={{ backgroundImage: 'radial-gradient(circle at 30% 0%, rgba(139,92,246,0.10), transparent 60%)' }}>
          <AnimatePresence mode="wait">
            <motion.button
              key={m.id}
              onClick={() => setZoom(true)}
              className="group absolute top-3 overflow-hidden rounded-xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]"
              style={{ left, width: m.w * k, height: m.h * k }}
              initial={{ opacity: 0, y: -8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              aria-label={`Ampliar el menú ${m.label}`}
            >
              <img src={menuSrc(m.id)} alt={`Menú ${m.label} de IntelliJ IDEA`} className="h-full w-full" />
              <span className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-lg bg-ink/70 text-snow/80 opacity-0 transition group-hover:opacity-100"><Maximize2 size={15} /></span>
            </motion.button>
          </AnimatePresence>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#1E1F22] to-transparent" />
          <div className="absolute bottom-3 left-4 font-mono text-[14px] text-mute/80">Captura real · pulsa el menú para verlo completo · en gris: no disponible con un .class abierto</div>
        </div>
      </div>

      <Panel className="flex w-[470px] shrink-0 flex-col p-7">
        <Label>Menú</Label>
        <AnimatePresence mode="wait">
          <motion.div key={m.id} className="flex min-h-0 flex-1 flex-col" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>
            <h3 className="mt-3 text-[46px] font-semibold tracking-tight">{m.label}</h3>
            <p className="mt-3 text-[20px] leading-relaxed text-mute">{m.summary}</p>
            <div className="mt-6 grid gap-2.5">
              {m.highlights.map((h) => (
                <div key={h.item} className="flex items-center gap-3 border-t border-line pt-2.5 text-[18px]">
                  <span className="text-snow/90">{h.item}</span>
                  {h.key && <span className="ml-auto shrink-0"><Kbd>{h.key}</Kbd></span>}
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </Panel>
      <Lightbox open={zoom} onClose={() => setZoom(false)} src={menuSrc(m.id)} title={`Menú ${m.label}`} description={m.summary} />
    </div>
  );
}

/* ---------------- Escena ---------------- */

export function S04Inside({ index }: SceneProps) {
  const print = usePrint();
  const [tab, setTab] = useState<'zones' | 'menus'>('zones');
  const [active, setActive] = useState<string | null>(null);
  const [menu, setMenu] = useState('file');
  useEscape(!!active, () => setActive(null));

  if (print) {
    return (
      <SceneShell index={index} glow="tr" title={<>Nuestra ventana, <span className="text-lilac">zona a zona</span>.</>}>
        <div className="flex h-full gap-8">
          <ZoneMap active={null} setActive={() => {}} print />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            {interfaceZones.map((z, i) => (
              <div key={z.id} className="flex gap-3 rounded-xl border border-line bg-surface/70 px-3 py-2">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-lilac font-mono text-[13px] font-semibold text-ink">{i + 1}</span>
                <div className="min-w-0"><span className="text-[16px] font-medium">{z.title}.</span> <span className="text-[14px] leading-snug text-mute">{z.text}</span></div>
              </div>
            ))}
            <div className="mt-1 font-mono text-[12px] uppercase tracking-[0.16em] text-mute">Menús principales</div>
            <div className="grid grid-cols-3 gap-x-3 gap-y-1">
              {menus.map((m) => (
                <div key={m.id} className="truncate text-[13px] text-mute"><span className="font-medium text-snow">{m.label}</span> · {m.highlights[0].item}</div>
              ))}
            </div>
          </div>
        </div>
      </SceneShell>
    );
  }

  return (
    <SceneShell index={index} glow="tr" title={<>Nuestra ventana, <span className="text-lilac">zona a zona</span>.</>}>
      <div className="absolute -top-[108px] right-0 flex rounded-xl border border-line bg-surface/80 p-1" role="tablist" aria-label="Vista">
        {([['zones', 'Zonas'], ['menus', 'Menús']] as const).map(([id, l]) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            onClick={() => { setTab(id); setActive(null); }}
            className={`rounded-lg px-6 py-2.5 text-[19px] transition ${tab === id ? 'bg-white/[0.09] text-snow' : 'text-mute hover:text-snow'}`}
          >
            {l}
          </button>
        ))}
      </div>
      <Reveal delay={0.12} className="h-full">
        {tab === 'zones' ? (
          <div className="flex h-full gap-8">
            <ZoneMap active={active} setActive={setActive} print={false} />
            <div className="min-w-0 flex-1"><ZonePanel active={active} setActive={setActive} /></div>
          </div>
        ) : (
          <MenuExplorer sel={menu} setSel={setMenu} />
        )}
      </Reveal>
    </SceneShell>
  );
}
