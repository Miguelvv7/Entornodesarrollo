import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { meta } from '../data/content';
import { usePrint } from '../lib/mode';
import { useImageStatus } from '../components/Screenshot';
import type { SceneProps } from './types';

const LOGO = `${import.meta.env.BASE_URL}brand/intellij-idea.svg`;
const ease = [0.22, 1, 0.36, 1] as const;

function Word({ text, delay, letterClass = '' }: { text: string; delay: number; letterClass?: string }) {
  const print = usePrint();
  return (
    <span className="inline-flex overflow-hidden pb-[0.08em]" aria-label={text}>
      {text.split('').map((ch, i) =>
        print ? (
          <span key={i} aria-hidden className={letterClass ? 'text-lilac' : ''}>{ch === ' ' ? ' ' : ch}</span>
        ) : (
          <motion.span
            key={i}
            aria-hidden
            initial={{ y: '105%' }}
            animate={{ y: '0%' }}
            transition={{ duration: 0.9, delay: delay + i * 0.035, ease }}
            className={`inline-block ${letterClass}`}
          >
            {ch === ' ' ? ' ' : ch}
          </motion.span>
        ),
      )}
    </span>
  );
}

export function S01Beginning({ onNext }: SceneProps) {
  const print = usePrint();
  const logo = useImageStatus(LOGO);
  const fade = (delay: number) =>
    print ? {} : { initial: { opacity: 0.001, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay, ease } };

  return (
    <section className="absolute inset-0 overflow-hidden">
      {/* luz ambiental */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-[38%] h-[900px] w-[1500px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: 'radial-gradient(closest-side, rgba(139,92,246,0.32), rgba(56,189,248,0.10) 55%, transparent 75%)' }}
        {...(print ? {} : { initial: { opacity: 0, scale: 0.85 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 1.6, ease } })}
      />
      <div className="pointer-events-none absolute inset-0 grid-fade opacity-80" />
      {!print && (
        <motion.div
          className="pointer-events-none absolute top-[49%] h-px w-[700px] bg-gradient-to-r from-transparent via-lilac/70 to-transparent"
          initial={{ left: '-40%', opacity: 0 }}
          animate={{ left: '120%', opacity: [0, 1, 0] }}
          transition={{ duration: 2.2, delay: 0.5, ease: 'easeInOut' }}
        />
      )}

      <div className="relative flex h-full flex-col items-center justify-center px-[120px] text-center">
        {logo === 'ok' && (
          <motion.img src={LOGO} alt="Logotipo de IntelliJ IDEA" className="mb-10 h-[120px] w-[120px]" {...fade(0.1)} />
        )}

        <motion.div className="mb-8 font-mono text-[20px] uppercase tracking-[0.42em] text-mute" {...fade(0.15)}>
          {meta.activity.split(' · ')[0]} · {meta.course.split(' · ')[1]}
        </motion.div>

        <h1 className="text-[208px] font-semibold leading-[0.9] tracking-tightest text-snow">
          <Word text="IntelliJ" delay={0.2} />
          <span className="inline-block w-[0.22em]" />
          <Word text="IDEA" delay={0.45} letterClass="bg-gradient-to-b from-snow to-lilac bg-clip-text text-transparent" />
          <span className={`ml-3 inline-block h-[0.72em] w-[0.09em] translate-y-[0.04em] bg-sky align-baseline ${print ? '' : 'caret'}`} />
        </h1>

        <motion.div className="mt-8 font-mono text-[34px] uppercase tracking-[0.62em] text-lilac" {...fade(0.9)}>
          Beyond the code
        </motion.div>

        <motion.p className="mt-10 max-w-[900px] text-balance text-[30px] leading-snug text-mute" {...fade(1.05)}>
          {meta.subtitle}
        </motion.p>

        {!print && (
          <motion.button
            onClick={onNext}
            className="group mt-14 inline-flex items-center gap-4 rounded-full border border-lilac/40 bg-violet/[0.12] py-5 pl-9 pr-7 text-[24px] font-medium text-snow shadow-[0_0_60px_-10px_rgba(139,92,246,0.6)] transition hover:border-lilac/80 hover:bg-violet/25"
            {...fade(1.25)}
            whileTap={{ scale: 0.98 }}
          >
            Comenzar experiencia
            <span className="grid h-10 w-10 place-items-center rounded-full bg-snow text-ink transition-transform group-hover:translate-x-1">
              <ArrowRight size={20} />
            </span>
          </motion.button>
        )}
      </div>

      <motion.div className="absolute inset-x-[120px] bottom-[64px] flex items-end justify-between font-mono text-[18px] text-mute" {...fade(1.4)}>
        <div className="text-left">
          <div className="mb-2 text-[14px] uppercase tracking-[0.2em] text-mute/60">Presentan</div>
          <div className="text-snow/85">{meta.authors.join('  ·  ')}</div>
        </div>
        <div className="text-right">
          <div className="text-snow/85">{meta.school}</div>
          <div>{meta.year}</div>
        </div>
      </motion.div>
    </section>
  );
}
