import type { ComponentType } from 'react';
import type { SceneProps } from './types';
import { S01Beginning } from './S01Beginning';
import { S02Meet } from './S02Meet';
import { S03SmartEditor } from './S03SmartEditor';
import { S04Inside } from './S04Inside';
import { S05Structure } from './S05Structure';
import { S06Customize } from './S06Customize';
import { S07Plugins } from './S07Plugins';
import { S08Hood } from './S08Hood';
import { S09FirstProject } from './S09FirstProject';
import { S10Run } from './S10Run';
import { S11Debug } from './S11Debug';
import { S12Ai } from './S12Ai';
import { S12Battle } from './S12Battle';
import { S13GoodBad } from './S13GoodBad';
import { S14Verdict } from './S14Verdict';
import { S15End } from './S15End';

/** Orden de las 16 escenas (debe coincidir con `scenes` en data/content.ts) */
export const sceneComponents: ComponentType<SceneProps>[] = [
  S01Beginning, S02Meet, S03SmartEditor, S04Inside, S05Structure,
  S06Customize, S07Plugins, S08Hood, S09FirstProject, S10Run,
  S11Debug, S12Ai, S12Battle, S13GoodBad, S14Verdict, S15End,
];
