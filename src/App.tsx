import { useEffect } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { Stage } from './components/Stage';
import { DeckChrome } from './components/DeckChrome';
import { useDeck } from './hooks/useDeck';
import { sceneComponents } from './scenes';
import { VideoScene } from './components/VideoScene';

export default function App() {
  const deck = useDeck();
  const Scene = sceneComponents[deck.index];

  useEffect(() => {
    document.body.classList.add('deck');
    return () => document.body.classList.remove('deck');
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <Stage>
        <AnimatePresence initial={false} custom={deck.dir}>
          <motion.div
            key={`${deck.index}-${deck.sub}`}
            className="absolute inset-0"
            custom={deck.dir}
            variants={{
              enter: (d: number) => ({ opacity: 0, x: d * 70, filter: 'blur(10px)' }),
              center: { opacity: 1, x: 0, filter: 'blur(0px)' },
              exit: (d: number) => ({ opacity: 0, x: d * -70, filter: 'blur(10px)' }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {deck.sub === 1 ? <VideoScene index={deck.index} /> : <Scene index={deck.index} onNext={deck.next} sub={deck.sub} />}
          </motion.div>
        </AnimatePresence>
      </Stage>
      <DeckChrome {...deck} />
    </MotionConfig>
  );
}
