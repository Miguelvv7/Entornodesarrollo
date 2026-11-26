import { Plus, Minus, Coffee, Server, Smartphone, GraduationCap } from 'lucide-react';
import { SceneShell } from '../components/SceneShell';
import { Reveal } from '../components/Reveal';
import type { SceneProps } from './types';

const good = [
  ['Entiende el código', 'Autocompletado, detección de errores y arreglos rápidos mientras escribes.'],
  ['Refactorización segura', 'Renombrar, extraer métodos o mover clases sin romper el proyecto.'],
  ['Todo integrado', 'Maven, Gradle, Git, terminal, depurador y tests en la misma ventana.'],
  ['Gratis para estudiantes', 'La licencia educativa da acceso a las funciones Ultimate.'],
];
const bad = [
  ['Consume más recursos', 'Requiere 8 GB de RAM y tarda más en arrancar que un editor ligero.'],
  ['Funciones avanzadas de pago', 'Spring, desarrollo web y bases de datos completas necesitan Ultimate.'],
  ['Centrado en la JVM', 'Para otros lenguajes depende de plugins o de otros IDE de JetBrains.'],
  ['Muchas opciones al principio', 'La cantidad de menús y ajustes puede abrumar al empezar.'],
];
const profiles = [
  { icon: <Coffee size={22} />, t: 'Java y Kotlin', d: 'Su terreno natural' },
  { icon: <Server size={22} />, t: 'Backend', d: 'Spring requiere Ultimate' },
  { icon: <Smartphone size={22} />, t: 'Android', d: 'Android Studio se basa en IntelliJ' },
  { icon: <GraduationCap size={22} />, t: 'Estudiantes', d: 'Licencia educativa gratuita' },
];

function Col({ items, kind, delay }: { items: string[][]; kind: 'good' | 'bad'; delay: number }) {
  const good = kind === 'good';
  return (
    <div className="flex min-h-0 flex-col">
      <Reveal delay={delay} className={`flex items-center gap-3 border-b pb-4 font-mono text-[18px] uppercase tracking-[0.2em] ${good ? 'border-ok/30 text-ok' : 'border-err/30 text-err'}`}>
        {good ? <Plus size={20} /> : <Minus size={20} />} {good ? 'Ventajas' : 'Inconvenientes'}
      </Reveal>
      <div className="grid flex-1 grid-rows-4">
        {items.map(([t, d], i) => (
          <Reveal key={t} delay={delay + 0.08 + i * 0.06} className="flex flex-col justify-center border-b border-line py-3">
            <div className="text-[29px] font-medium tracking-tight">{t}</div>
            <div className="mt-1 text-[19px] leading-snug text-mute">{d}</div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export function S13GoodBad({ index }: SceneProps) {
  return (
    <SceneShell index={index} glow="bl" title={<>Lo bueno y lo <span className="text-lilac">mejorable</span>.</>}>
      <div className="flex h-full flex-col gap-8">
        <div className="grid min-h-0 flex-1 grid-cols-2 gap-20">
          <Col items={good} kind="good" delay={0.1} />
          <Col items={bad} kind="bad" delay={0.2} />
        </div>
        <Reveal delay={0.6} className="flex items-center gap-6 rounded-[22px] border border-line bg-surface/70 px-7 py-5">
          <div className="shrink-0 font-mono text-[16px] uppercase tracking-[0.18em] text-mute">Recomendado para</div>
          <div className="grid flex-1 grid-cols-4 gap-6">
            {profiles.map((p) => (
              <div key={p.t} className="flex items-center gap-3">
                <span className="text-lilac">{p.icon}</span>
                <div><div className="text-[20px] font-medium">{p.t}</div><div className="text-[15px] text-mute">{p.d}</div></div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </SceneShell>
  );
}
