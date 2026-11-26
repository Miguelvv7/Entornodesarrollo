import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Download, Puzzle, RefreshCw, Search, Trash2 } from 'lucide-react';
import { SceneShell, Panel, Label, SimBadge } from '../components/SceneShell';
import { Reveal } from '../components/Reveal';
import { Screenshot } from '../components/Screenshot';
import { usePrint } from '../lib/mode';
import type { SceneProps } from './types';

type State = 'idle' | 'installing' | 'installed';

const plugins = [
  { id: 'sonar', name: 'SonarQube for IDE', tag: 'Calidad', desc: 'Detecta bugs y problemas de seguridad mientras programas.', color: 'from-sky to-violet' },
  { id: 'kpx', name: 'Key Promoter X', tag: 'Productividad', desc: 'Te enseña el atajo cada vez que usas el ratón para una acción.', color: 'from-lilac to-sky' },
  { id: 'checkstyle', name: 'CheckStyle-IDEA', tag: 'Estilo', desc: 'Comprueba que el código sigue unas normas de estilo.', color: 'from-[#E5B567] to-kw' },
  { id: 'gtb', name: 'GitToolBox', tag: 'Git', desc: 'Muestra el autor y el estado de cada línea del repositorio.', color: 'from-ok to-sky' },
  { id: 'strman', name: 'String Manipulation', tag: 'Editor', desc: 'Cambia mayúsculas, formatos y orden de textos seleccionados.', color: 'from-violet to-[#C77DBB]' },
];

export function S07Plugins({ index }: SceneProps) {
  const print = usePrint();
  const [state, setState] = useState<Record<string, State>>({ kpx: 'installed' });
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const act = (id: string) => {
    const s = state[id] ?? 'idle';
    if (s === 'installing') return;
    if (s === 'installed') { setState((x) => ({ ...x, [id]: 'idle' })); return; }
    setState((x) => ({ ...x, [id]: 'installing' }));
    timers.current.push(window.setTimeout(() => setState((x) => ({ ...x, [id]: 'installed' })), 1500));
  };

  return (
    <SceneShell
      index={index}
      glow="bl"
      title={<>Más potencia con <span className="text-lilac">plugins</span>.</>}
      lead="El JetBrains Marketplace está integrado en el IDE: se busca, se instala y se actualiza sin salir de él."
    >
      <div className="grid h-full grid-cols-[1fr_620px] gap-10">
        <Reveal delay={0.12} className="min-h-0">
          <Panel className="flex h-full flex-col p-6">
            <div className="flex items-center gap-4">
              <div className="flex rounded-xl border border-line bg-ink/60 p-1 text-[16px]">
                <span className="rounded-lg bg-white/[0.09] px-4 py-1.5 text-snow">Marketplace</span>
                <span className="px-4 py-1.5 text-mute">Installed</span>
              </div>
              <div className="flex flex-1 items-center gap-2 rounded-xl border border-line bg-ink/60 px-4 py-2 text-[16px] text-mute"><Search size={16} /> Buscar plugins</div>
              {!print && <SimBadge>Simulación</SimBadge>}
            </div>
            <div className="mt-4 grid min-h-0 flex-1 content-start gap-2.5">
              {plugins.map((p) => {
                const s = state[p.id] ?? 'idle';
                return (
                  <div key={p.id} className="flex items-center gap-5 rounded-2xl border border-line bg-raised/40 px-5 py-3">
                    <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${p.color} text-ink`}><Puzzle size={26} /></div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3"><span className="text-[22px] font-medium">{p.name}</span><span className="rounded-md border border-line2 px-2 py-0.5 font-mono text-[12px] uppercase tracking-wider text-mute">{p.tag}</span></div>
                      <div className="truncate text-[18px] text-mute">{p.desc}</div>
                      {s === 'installing' && (
                        <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                          <motion.div className="h-full bg-gradient-to-r from-violet to-sky" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 1.4, ease: 'easeInOut' }} />
                        </div>
                      )}
                    </div>
                    {print ? (
                      <span className="font-mono text-[14px] text-mute">{s === 'installed' ? 'Installed' : 'Install'}</span>
                    ) : (
                      <button
                        onClick={() => act(p.id)}
                        className={`group flex w-[170px] shrink-0 items-center justify-center gap-2 rounded-xl border py-2.5 text-[17px] transition ${
                          s === 'installed' ? 'border-ok/40 text-ok hover:border-err/50 hover:text-err' : s === 'installing' ? 'border-line text-mute' : 'border-lilac/50 bg-violet/15 text-snow hover:bg-violet/25'
                        }`}
                      >
                        {s === 'installed' ? (
                          <><Check size={17} className="group-hover:hidden" /><Trash2 size={17} className="hidden group-hover:block" /><span className="group-hover:hidden">Instalado</span><span className="hidden group-hover:inline">Desinstalar</span></>
                        ) : s === 'installing' ? (
                          <><RefreshCw size={17} className="animate-spin" /> Instalando</>
                        ) : (
                          <><Download size={17} /> Instalar</>
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-4 font-mono text-[15px] text-mute">Settings (⌘,) → Plugins · pestañas Marketplace e Installed</div>
          </Panel>
        </Reveal>

        <div className="flex min-h-0 flex-col gap-5">
          <Reveal delay={0.2}>
            <Panel className="p-6">
              <div className="flex items-center gap-3"><RefreshCw size={20} className="text-lilac" /><Label>Actualizaciones</Label></div>
              <p className="mt-3 text-[19px] leading-relaxed text-snow/85">El IDE avisa solo cuando hay versiones nuevas: en nuestra instalación ya aparecía <span className="text-snow">"Update 6 Plugins…"</span> en el menú ⚙. Se configura en <span className="font-mono text-[16px]">Settings → Appearance &amp; Behavior → System Settings → Updates</span>, o con la Toolbox App de JetBrains.</p>
            </Panel>
          </Reveal>
          <div className="grid min-h-0 flex-1 grid-cols-2 gap-5">
            <Reveal delay={0.26} className="min-h-0"><Screenshot id="CAPTURA_REAL_PLUGINS" className="h-full" compact /></Reveal>
            <Reveal delay={0.32} className="min-h-0"><Screenshot id="CAPTURA_REAL_ACTUALIZACIONES" className="h-full" compact /></Reveal>
          </div>
        </div>
      </div>
    </SceneShell>
  );
}
