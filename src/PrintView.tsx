import { useEffect } from 'react';
import { MotionConfig } from 'framer-motion';
import { PrintContext } from './lib/mode';
import { sceneComponents } from './scenes';
import { meta, scenes } from './data/content';

declare global { interface Window { __PRINT_READY__?: boolean } }

/** Vista estática para el PDF: 15 páginas 1920×1080, sin controles ni notas. */
export default function PrintView() {
  useEffect(() => {
    document.title = `${meta.title} — ${meta.tagline} (PDF)`;
    const imgs = () => Array.from(document.querySelectorAll<HTMLElement>('[data-shot]'));
    const check = async () => {
      await document.fonts.ready;
      // espera a que todas las capturas sepan si existen o no
      for (let i = 0; i < 100 && imgs().some((el) => el.dataset.status === 'loading'); i++) await new Promise((r) => setTimeout(r, 100));
      await Promise.all(Array.from(document.images).map((im) => (im.complete ? null : new Promise((r) => { im.onload = im.onerror = r; }))));
      window.__PRINT_READY__ = true;
    };
    check();
  }, []);

  return (
    <PrintContext.Provider value={true}>
      <MotionConfig reducedMotion="always">
        <div className="bg-ink">
          {sceneComponents.map((Scene, i) => (
            <div key={i} className="print-page">
              <Scene index={i} />
              <div className="absolute inset-x-[120px] bottom-[34px] flex items-center font-mono text-[15px] text-mute/70">
                <span>{meta.authors.join(' · ')}</span>
                <span className="mx-3 text-mute/30">|</span>
                <span>{meta.activity}</span>
                <span className="ml-auto tnum">{String(i + 1).padStart(2, '0')} / {scenes.length}</span>
              </div>
            </div>
          ))}
        </div>
      </MotionConfig>
    </PrintContext.Provider>
  );
}
