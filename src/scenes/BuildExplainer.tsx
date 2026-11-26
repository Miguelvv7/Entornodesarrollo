import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ListChecks, Download, Cog, Package, Zap, MousePointerClick, Hand, Play, GraduationCap, Users, Smartphone } from 'lucide-react';

export type ToolId = 'maven' | 'gradle' | 'idea';

interface Step { icon: ReactNode; text: ReactNode }
interface Tool {
  name: string; tint: string; ring: string; is: string;
  steps: Step[]; like: string; when: string;
}

const tools: Record<ToolId, Tool> = {
  maven: {
    name: 'Maven', tint: 'text-[#E06C9F]', ring: 'border-[#E06C9F]/50 bg-[#E06C9F]/[0.07]',
    is: 'Un ayudante que monta el proyecto por nosotros.',
    steps: [
      { icon: <ListChecks size={22} />, text: <>Escribimos en una <b>lista</b> lo que necesita el proyecto <span className="font-mono text-[0.85em] text-mute">(pom.xml)</span></> },
      { icon: <Download size={22} />, text: <><b>Lo descarga solo</b> de internet. No buscamos nada a mano</> },
      { icon: <Cog size={22} />, text: <>Compila y <b>comprueba</b> que todo funciona</> },
      { icon: <Package size={22} />, text: <>Nos da el <b>programa listo</b> para usar <span className="font-mono text-[0.85em] text-mute">(.jar)</span></> },
    ],
    like: 'Como hacer la compra con una lista: apuntas lo que te falta y te lo traen a casa.',
    when: 'Proyectos en equipo: funciona igual en el ordenador de todos.',
  },
  gradle: {
    name: 'Gradle', tint: 'text-[#4FB6A8]', ring: 'border-[#4FB6A8]/50 bg-[#4FB6A8]/[0.07]',
    is: 'Otro ayudante: igual que Maven, pero más moderno.',
    steps: [
      { icon: <ListChecks size={22} />, text: <>También una <b>lista</b>, pero más corta <span className="font-mono text-[0.85em] text-mute">(build.gradle)</span></> },
      { icon: <Download size={22} />, text: <>Descarga las librerías <b>del mismo sitio</b> que Maven</> },
      { icon: <Package size={22} />, text: <>Compila y nos da el <b>programa listo</b></> },
      { icon: <Zap size={22} />, text: <>La 2.ª vez <b>solo rehace lo que cambia</b>: más rápido</> },
    ],
    like: 'Como un cocinero con memoria: si la salsa ya está hecha, no la vuelve a hacer.',
    when: 'Proyectos grandes y apps de Android.',
  },
  idea: {
    name: 'IntelliJ', tint: 'text-lilac', ring: 'border-lilac/50 bg-violet/[0.08]',
    is: 'Sin ayudante: compila el propio IntelliJ.',
    steps: [
      { icon: <MousePointerClick size={22} />, text: <>Pulsamos el <b>botón de compilar</b>, como siempre en clase</> },
      { icon: <Cog size={22} />, text: <>IntelliJ <b>compila</b> nuestro código</> },
      { icon: <Hand size={22} />, text: <>Si falta una librería, <b>la añadimos a mano</b></> },
      { icon: <Package size={22} />, text: <>Solo funciona bien <b>dentro de IntelliJ</b></> },
    ],
    like: 'Como cocinar solo con lo que hay en casa: para algo sencillo sobra.',
    when: 'Ejercicios de clase como los nuestros, que no usan librerías de fuera.',
  },
};

const order: ToolId[] = ['maven', 'gradle', 'idea'];

const picks: { id: ToolId; icon: ReactNode; label: string }[] = [
  { id: 'idea', icon: <GraduationCap size={20} />, label: 'Un ejercicio de clase' },
  { id: 'maven', icon: <Users size={20} />, label: 'Un proyecto en equipo' },
  { id: 'gradle', icon: <Smartphone size={20} />, label: 'Una app Android' },
];

function Card({ id, lit, playing, chosen, onPlay, still }: { id: ToolId; lit: number; playing: boolean; chosen: boolean; onPlay: () => void; still: boolean }) {
  const t = tools[id];
  return (
    <div className={`flex min-h-0 flex-col rounded-[24px] border p-6 transition-colors duration-300 ${chosen ? t.ring : 'border-line bg-surface/70'}`}>
      <div className="flex items-baseline justify-between gap-3">
        <div className={`text-[34px] font-semibold tracking-tight ${t.tint}`}>{t.name}</div>
        {!still && (
          <button onClick={onPlay} disabled={playing}
            className="flex items-center gap-2 rounded-full border border-line2 px-4 py-1.5 text-[15px] text-snow/85 transition hover:border-lilac/50 disabled:opacity-40">
            <Play size={14} className="text-lilac" /> Ver cómo funciona
          </button>
        )}
      </div>
      <div className="mt-1 text-[20px] leading-snug text-snow/90">{t.is}</div>

      <ol className="mt-4 grid gap-2">
        {t.steps.map((s, i) => {
          const on = still || i <= lit;
          return (
            <motion.li key={i} animate={{ opacity: on ? 1 : 0.28, x: on ? 0 : 6 }} transition={{ duration: 0.3 }}
              className={`flex items-center gap-3 rounded-xl border px-3.5 py-2 text-[18px] leading-snug ${on ? 'border-line2 bg-white/[0.04]' : 'border-transparent'}`}>
              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/[0.06] ${on ? t.tint : 'text-mute'}`}>{s.icon}</span>
              <span className="text-snow/90 [&_b]:font-semibold [&_b]:text-snow">{s.text}</span>
            </motion.li>
          );
        })}
      </ol>

      <div className="mt-auto grid gap-1.5 pt-4 text-[17px] leading-snug">
        <div><span className="mr-2 font-mono text-[13px] uppercase tracking-[0.14em] text-mute">Es como…</span><span className="italic text-snow/85">{t.like}</span></div>
        <div><span className="mr-2 font-mono text-[13px] uppercase tracking-[0.14em] text-mute">Úsalo para</span><span className="text-snow/90">{t.when}</span></div>
      </div>
    </div>
  );
}

export function BuildExplainer({ still = false }: { still?: boolean }) {
  const [lit, setLit] = useState<Record<ToolId, number>>({ maven: -1, gradle: -1, idea: -1 });
  const [playing, setPlaying] = useState<ToolId | null>(null);
  const [chosen, setChosen] = useState<ToolId | null>(null);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const play = (id: ToolId) => {
    timers.current.forEach(clearTimeout); timers.current = [];
    setPlaying(id); setChosen(id);
    setLit((x) => ({ ...x, [id]: -1 }));
    tools[id].steps.forEach((_, i) => timers.current.push(window.setTimeout(() => {
      setLit((x) => ({ ...x, [id]: i }));
      if (i === tools[id].steps.length - 1) setPlaying(null);
    }, 350 + i * 750)));
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-5">
      <div className="max-w-[1320px] text-[22px] leading-snug text-snow/85">
        Una <b className="text-snow">librería</b> es código hecho por otros que usamos en nuestro programa. Maven y Gradle son <b className="text-snow">ayudantes</b> que la consiguen y montan el programa por nosotros.
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-3 gap-6">
        {order.map((id) => (
          <Card key={id} id={id} lit={lit[id]} playing={playing !== null} chosen={chosen === id} onPlay={() => play(id)} still={still} />
        ))}
      </div>
      <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface/60 px-6 py-3">
        <span className="mr-2 font-mono text-[15px] uppercase tracking-[0.16em] text-lilac">¿Cuál uso?</span>
        {picks.map((p) => {
          const on = chosen === p.id;
          return (
            <button key={p.id} onClick={() => play(p.id)} disabled={still}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-[17px] transition ${on ? tools[p.id].ring + ' text-snow' : 'border-line2 text-snow/80 hover:border-lilac/40'}`}>
              {p.icon} {p.label}
              <span className="text-mute">→</span>
              <span className={`font-semibold ${tools[p.id].tint}`}>{tools[p.id].name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
