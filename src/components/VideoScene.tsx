import { useRef, useState } from 'react';
import { Clapperboard } from 'lucide-react';
import { SceneShell, Panel, Label } from './SceneShell';
import { Reveal } from './Reveal';
import { VideoPlayer, type VideoHandle } from './VideoPlayer';
import { scenes } from '../data/content';

/** Segunda pantalla de una escena: nuestra grabación real con capítulos clicables. */
export function VideoScene({ index }: { index: number }) {
  const v = scenes[index].video!;
  const player = useRef<VideoHandle>(null);
  const [t, setT] = useState(0);
  const current = v.chapters.reduce((acc, c, i) => (t >= c.t ? i : acc), 0);

  return (
    <SceneShell index={index} glow="tr" title={<>{v.title} <span className="text-err">●</span></>}>
      <div className="flex h-full gap-8">
        <Reveal delay={0.08} className="flex min-w-0 flex-1">
          <VideoPlayer ref={player} file={v.file} className="h-full w-full" onTime={setT} autoPlay label={`Grabación real${v.speed ? ` · ${v.speed}` : ''}`} />
        </Reveal>
        <Reveal delay={0.16} className="w-[440px] shrink-0">
          <Panel className="flex h-full flex-col p-6">
            <div className="mb-4 flex items-center gap-2"><Clapperboard size={18} className="text-lilac" /><Label>Pulsa para saltar a ese momento</Label></div>
            <ol className="grid gap-1.5">
              {v.chapters.map((c, i) => (
                <li key={c.t}>
                  <button
                    onClick={() => player.current?.seek(c.t)}
                    className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition ${i === current ? 'bg-violet/15 ring-1 ring-lilac/50' : 'hover:bg-white/[0.04]'}`}
                  >
                    <span className={`mt-0.5 shrink-0 rounded-md px-1.5 font-mono text-[13px] tnum ${i === current ? 'bg-lilac text-ink' : 'bg-white/[0.07] text-lilac'}`}>0:{String(Math.floor(c.t)).padStart(2, '0')}</span>
                    <span className="text-[18px] leading-snug text-snow/90">{c.label}</span>
                  </button>
                </li>
              ))}
            </ol>
            <p className="mt-auto pt-4 text-[15px] leading-snug text-mute">Grabación de nuestra pantalla en IntelliJ IDEA, recortada{v.speed ? ` y acelerada ${v.speed}` : ''}. Sin sonido: lo explicamos en directo.</p>
          </Panel>
        </Reveal>
      </div>
    </SceneShell>
  );
}
