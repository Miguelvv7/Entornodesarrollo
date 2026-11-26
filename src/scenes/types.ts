export interface SceneProps {
  index: number;
  onNext?: () => void;
  /** sub-paso dentro de la escena (1 = vídeo) */
  sub?: number;
}
