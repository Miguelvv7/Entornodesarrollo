import { useState } from 'react';
import { motion } from 'framer-motion';
import { SceneShell } from '../components/SceneShell';
import { Reveal } from '../components/Reveal';
import { usePrint } from '../lib/mode';
import type { SceneProps } from './types';

type IdeId = 'idea' | 'eclipse' | 'netbeans';

const ides: { id: IdeId; name: string; by: string; accent: string }[] = [
  { id: 'idea', name: 'IntelliJ IDEA', by: 'JetBrains', accent: 'from-violet to-sky' },
  { id: 'eclipse', name: 'Eclipse IDE', by: 'Eclipse Foundation', accent: 'from-[#7C6BC4] to-[#4B4E8E]' },
  { id: 'netbeans', name: 'Apache NetBeans', by: 'Apache Software Foundation', accent: 'from-[#3E8FD8] to-[#2A5D8F]' },
];

/** Información descriptiva y contrastada; sin puntuaciones ni rankings. */
const rows: { label: string; v: Record<IdeId, string> }[] = [
  { label: 'Licencia', v: {
    idea: 'Núcleo gratuito y abierto (Apache 2.0) + suscripción Ultimate. Gratis para estudiantes.',
    eclipse: 'Libre y gratuito (Eclipse Public License 2.0).',
    netbeans: 'Libre y gratuito (Apache License 2.0).' } },
  { label: 'Primeros pasos', v: {
    idea: 'Asistente de proyecto guiado y ayudas contextuales constantes.',
    eclipse: 'Pide elegir un workspace; interfaz organizada en perspectivas.',
    netbeans: 'Funciona para Java estándar con muy poca configuración.' } },
  { label: 'Lo más destacado', v: {
    idea: 'Análisis del código en tiempo real y refactorizaciones avanzadas.',
    eclipse: 'Compilador incremental propio y gran flexibilidad.',
    netbeans: 'Editor visual de interfaces Swing y Maven, Gradle y Ant integrados.' } },
  { label: 'Plugins', v: {
    idea: 'JetBrains Marketplace, integrado en el IDE.',
    eclipse: 'Eclipse Marketplace, un catálogo muy amplio.',
    netbeans: 'Portal de plugins con un catálogo más reducido.' } },
  { label: 'Personalización', v: {
    idea: 'Temas, keymaps (incluido el de Eclipse) y sincronización de ajustes.',
    eclipse: 'Muy configurable con perspectivas, vistas y plugins.',
    netbeans: 'Temas y atajos configurables, con menos opciones.' } },
  { label: 'Desarrollo Java', v: {
    idea: 'Java y Kotlin son su prioridad; integra Maven, Gradle y JUnit.',
    eclipse: 'Muy maduro. Es el que usamos en la Actividad 2.1.',
    netbeans: 'Proyecto de Apache que sigue de cerca las nuevas versiones de Java.' } },
  { label: 'Posibles limitaciones', v: {
    idea: 'Más consumo de memoria; parte de las funciones avanzadas son de pago.',
    eclipse: 'Interfaz más recargada; combinar muchos plugins puede complicarse.',
    netbeans: 'Comunidad y ecosistema de plugins más pequeños.' } },
];

export function S12Battle({ index }: SceneProps) {
  const print = usePrint();
  const [sel, setSel] = useState<IdeId>('idea');
  const dim = (id: IdeId) => (sel === id ? 'opacity-100' : 'opacity-40');

  return (
    <SceneShell index={index} glow="tr" title={<>IntelliJ frente a <span className="text-lilac">sus rivales</span>.</>}>
      <div className="grid h-full grid-cols-[250px_1fr_1fr_1fr] grid-rows-[auto_1fr] gap-x-6">
        <div />
        {ides.map((ide, i) => (
          <Reveal key={ide.id} delay={0.1 + i * 0.06}>
            <button
              onClick={() => setSel(ide.id)}
              disabled={print}
              aria-pressed={sel === ide.id}
              className={`relative w-full overflow-hidden rounded-[20px] border p-5 text-left transition ${
                sel === ide.id ? 'border-lilac/50 bg-violet/[0.10]' : 'border-line bg-surface/60 hover:border-line2'
              }`}
            >
              <div className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${ide.accent} ${sel === ide.id ? '' : 'opacity-40'}`} />
              <div className="text-[30px] font-semibold tracking-tight">{ide.name}</div>
              <div className="mt-1 text-[17px] text-mute">{ide.by}</div>
            </button>
          </Reveal>
        ))}

        <div className="col-span-4 mt-4 grid min-h-0 grid-cols-[250px_1fr_1fr_1fr] gap-x-6" style={{ gridTemplateRows: `repeat(${rows.length}, 1fr)` }}>
          {rows.map((r, ri) => (
            <Reveal key={r.label} delay={0.25 + ri * 0.04} className="col-span-4 grid grid-cols-[250px_1fr_1fr_1fr] gap-x-6 border-t border-line">
              <div className="flex items-center font-mono text-[15px] uppercase tracking-[0.14em] text-mute">{r.label}</div>
              {ides.map((ide) => (
                <motion.div key={ide.id} className={`flex items-center py-2 text-[18px] leading-snug text-snow/90 transition-opacity duration-300 ${print ? '' : dim(ide.id)}`}>
                  {r.v[ide.id]}
                </motion.div>
              ))}
            </Reveal>
          ))}
        </div>
      </div>
    </SceneShell>
  );
}
